import { Action, Store, $peek, $set } from "@/lib/typed-first"
import type { FooBarModel } from "./model.ts"
import { actionSpy } from "../utils.ts"

export const FooBar = Store.type<FooBarModel>().make(
	Store.initial("Foo"),
	Store.actions(
		Action.onEntry("Foo", () => {
			actionSpy.onEntry()
		}),
		Action.when("pauseThing", () => {}),
		Action.when("doNextThing", ({ context, payload }) => {
			return $set(context.foo$, payload)
		}),
		Action.when("doThing", ({ to, payload, context }) => {
			const contextPeek$ = $peek(context)
			const foo = $peek(context.foo$)
			actionSpy.when({
				payload,
				contextPeek$_foo: contextPeek$.foo,
				foo,
			})

			return to.slice("Bar.Qux", { items: [foo], name: payload })
		}),
		Action.exhaustive,
	),
)
