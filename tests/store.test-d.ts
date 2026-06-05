import { expectTypeOf, test } from "vitest"
import { Store, Action } from "@/lib/typed-first"
import type { FooBarModel } from "./base/model.ts"

test("Store.initial", () => {
	typeof Store.initial<FooBarModel, "Foo">

	Store.type<FooBarModel>().make(
		// @ts-expect-error initial path is to a leaf slice
		Store.initial("Bar.*"),
	)

	Store.type<FooBarModel>().make(
		// @ts-expect-error is string literal
		Store.initial(""),
	)
})

test("Store.actions", () => {
	const actions = Store.actions<FooBarModel["action"], unknown>

	actions(
		Action.when("doThing", ({ to }) => {
			type P = Parameters<typeof to.slice>
			expectTypeOf<P[0]>().toMatchTypeOf<"Bar.Qux" | "Bar.Rix">()
		}),
	)

	actions(
		// @ts-expect-error path is string literal
		Action.onEntry("", () => {}),
	)
})
