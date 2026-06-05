import type { ReactNode } from "react"
import { expectTypeOf, test } from "vitest"
import { Store, Action } from "@/lib/typed-first"
import { match, when } from "@/lib/typed-first/use"
import { FooBar } from "tests/base/store"
import type { FooBarModel } from "tests/base/model.ts"

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

test("Store.slice()", () => {
	FooBar.slice("Foo")
	FooBar.slice("Bar.Qux")
	// @ts-expect-error invalid slice selection
	FooBar.slice("Nope")
})

test("match.useSlice()", () => {
	expectTypeOf(
		match.useSlice(
			FooBar,
			when("Foo", () => 1),
			match.else(() => "fallback"),
		),
	).toEqualTypeOf<ReactNode>()

	match.useSlice(
		FooBar,
		// @ts-expect-error invalid slice selector
		when("Nope", () => null),
		match.else(() => "fallback"),
	)

	match.useSlice(
		FooBar,
		when("Foo", () => 1),
		// @ts-expect-error duplicate slice handlers are not allowed
		when("Foo", () => 2),
	)
})

test("Store.actions", () => {
	const actions = Store.actions<FooBarModel["action"], unknown, unknown>

	actions(
		Action.when({
			doThing: ({ to }) => {
				type P = Parameters<typeof to.slice>
				expectTypeOf<P[0]>().toExtend<"Bar.Qux" | "Bar.Rix">()
			},
		}),
		// @ts-expect-error: TODO
		Action.exhaustive,
	)

	actions(
		// @ts-expect-error path is string literal
		Action.onEntry("", () => {}),

		// @ts-expect-error: TODO
		Action.exhaustive,
	)
})
