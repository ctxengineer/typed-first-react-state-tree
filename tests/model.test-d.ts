import type { SimplifyDeep } from "type-fest"
import { describe, expectTypeOf, test } from "vitest"
import type { $ } from "@/lib/typed-first"

describe("$.Model", () => {
	type Store = $.Store<{
		Foo: $.Slice<[$.Context<{ foo: string }>, $.Action<{ doe: number }>]>
		Bar: $.Slice<[$.Context<{ tib: string }>, $.Action<{ rux: Date }>]>
	}>
	type ForEach = $.ForEach<
		[$.Context<{ tol: boolean }>, $.Action<{ lit: void }>]
	>
	type StoreModel = $.Model<Store, "Foo", [ForEach]>
	type Result = SimplifyDeep<StoreModel>

	test("initialPath", () => {
		type Actual = Result["initialPath"]
		type Expected = "Foo"
		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("slice", () => {
		type Actual = Result["slice"]
		type Expected =
			| {
					path: "Foo"
					isLeaf: true
					hasOnEntry: false
					hasPromise: false
					promise: {}
					context: {
						foo: string
						tol: boolean
					}
					action: {
						doe: number
						lit: void
					}
			  }
			| {
					path: "Bar"
					isLeaf: true
					hasOnEntry: false
					hasPromise: false
					promise: {}
					context: {
						tib: string
						tol: boolean
					}
					action: {
						rux: Date
						lit: void
					}
			  }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})
