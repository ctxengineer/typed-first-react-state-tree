import type { $ } from "@/lib/typed-first"

export type FooPromiseModel = $.Model<Store, "Foo">

type Store = $.Store<{
	Foo: $.Slice<
		[
			$.OnEntry,
			$.Promise<{ profile: Promise<string> }>,
			$.Context<{ foo: "initial value" | "jux" }>,
		]
	>
	Bar: $.Slice<
		[
			$.OnEntry,
			$.Promise<{ list: Promise<string> }>,
			$.Context<{ name: string }>,
		]
	>
	Rizz: $.Slice<
		[
			$.OnEntry,
			$.Promise<{ hux: Promise<string> }>,
			$.Context<{ name: string }>,
		]
	>
}>
