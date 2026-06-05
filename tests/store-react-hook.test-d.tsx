import { describe, test, expectTypeOf } from "vitest"
import { useStore } from "@/lib/typed-first/hooks"
import { FooBar } from "./base/store"
import type {
	Observable,
	WrapObservable,
	SliceContext,
} from "../src/observable.type"

describe("useStore", () => {
	test("slice path selector", () => {
		const { slice$ } = useStore(FooBar)

		type ExpectedSlice = WrapObservable<"Foo" | "Bar.Qux" | "Bar.Rix">

		expectTypeOf<typeof slice$>().toEqualTypeOf<ExpectedSlice>()
	})

	test("super-slice A.*", () => {
		const { slice$, context, action } = useStore(FooBar, "Bar.*")

		type ExpectedSlice = WrapObservable<"Bar.Qux" | "Bar.Rix">
		type ExpectedContext = SliceContext<{ name: string }> & {
			[Observable]: { name: string }
		}
		type ExpectedAction = { readonly pauseThing: (payload: Date) => void }

		expectTypeOf(slice$).toEqualTypeOf<ExpectedSlice>()
		expectTypeOf(context).toEqualTypeOf<ExpectedContext>()
		expectTypeOf(action).toEqualTypeOf<ExpectedAction>()
	})

	test("sub-slice A.A", () => {
		const { slice$, context, action } = useStore(FooBar, "Bar.Qux")

		type ExpectedSlice = WrapObservable<"Bar.Qux">
		type ExpectedContext = SliceContext<{ name: string; items: string[] }>
		type ExpectedAction = { readonly pauseThing: (payload: Date) => void }

		expectTypeOf(slice$).toEqualTypeOf<ExpectedSlice>()
		expectTypeOf(context).toExtend<ExpectedContext>()
		expectTypeOf(action).toEqualTypeOf<ExpectedAction>()
	})

	test("sub-slice A.B", () => {
		const { slice$, context, action } = useStore(FooBar, "Bar.Rix")

		type ExpectedSlice = WrapObservable<"Bar.Rix">
		type ExpectedContext = SliceContext<{
			name: string
			items: string | boolean[]
		}>
		type ExpectedAction = { readonly pauseThing: (payload: Date) => void }

		expectTypeOf(slice$).toEqualTypeOf<ExpectedSlice>()
		expectTypeOf(context).toExtend<ExpectedContext>()
		expectTypeOf(action).toEqualTypeOf<ExpectedAction>()
	})
})
