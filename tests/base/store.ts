import { Action, Store, $peek, $set } from "@/lib/typed-first"
import type { FooBarModel } from "tests/base/model.ts"
import { actionSpy } from "tests/utils"

export const FooBar = Store.type<FooBarModel>().make(
	Store.initial("Foo"),
	Store.actions(
		Action.onEntry({
			Foo: () => {
				actionSpy.onEntry()
			},
		}),
		Action.when({
			doNextThing: ({ context$, payload }) => {
				return $set(context$.foo, payload)
			},
			doThing: ({ to, payload, context$ }) => {
				const contextPeek = $peek(context$)
				const foo = $peek(context$.foo)
				actionSpy.when({
					payload,
					contextPeek_foo: contextPeek.foo,
					foo,
				})

				return to.slice("Bar.Qux", { items: [foo], name: payload })
			},
			pauseThing: () => {},
		}),
		Action.exhaustive,
	),
)
