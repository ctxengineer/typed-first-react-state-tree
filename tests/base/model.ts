import type { $ } from "@/lib/typed-first"

export type FooBarModel = $.Model<Store, "Foo">

type Store = $.Store<{
	Foo: $.Slice<
		[
			$.OnEntry,
			$.Context<{ foo: "initial value" | "jux" }>,
			$.Action<{ doThing: string; doNextThing: "jux" }>,
		]
	>
	Bar: $.Slice<
		[
			$.Context<{ name: string }>,
			$.Action<{ pauseThing: Date }>,
			$.SubSlice<{
				Qux: $.Slice<[$.Context<{ items: string[] }>]>
				Rix: $.Slice<[$.Context<{ items: string | boolean[] }>]>
			}>,
		]
	>
}>
