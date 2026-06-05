import { STORE_SLICE_SELECTOR } from "./ctxlyr-store.constants"
import type { _ } from "./store-model-helper.type"
import type { Simplify } from "./type-utility"

export { STORE_SLICE_SELECTOR }

export type SelectableStore<T, P extends string> = T & {
	readonly [STORE_SLICE_SELECTOR]: P
}

export interface UseableStore {
	"~": {
		slice: any
		leafSlice: any
		slicePath: string
		leafSlicePath: string
		exhaustive: true
	}
	initialPath: string
	layer: any
	reactContext: any
	slice<Selector extends this["~"]["slicePath"]>(
		selector: Selector,
	): SelectableStore<this, Selector>
	readonly [STORE_SLICE_SELECTOR]?: this["~"]["slicePath"]
}

type Store<T, C, L = {}> = T extends ModelReq
	? C extends { _: never }
		? {
				store: T
				CTXLYR: 7126
		  }
		: {
				"~": {
					slice: T["slice"]
					leafSlice: T["filterSlice"]["leaf"]
					slicePath: T["slice"]["path"]
					leafSlicePath: T["filterSlice"]["leaf"]["path"]
					exhaustive: true
				}
				layer: ResolveLayer<L>
				initialPath: T["initialPath"]
				reactContext: any
				slice<Selector extends T["slice"]["path"]>(
					selector: Selector,
				): SelectableStore<
					{
						"~": {
							slice: T["slice"]
							leafSlice: T["filterSlice"]["leaf"]
							slicePath: T["slice"]["path"]
							leafSlicePath: T["filterSlice"]["leaf"]["path"]
							exhaustive: true
						}
						layer: ResolveLayer<L>
						initialPath: T["initialPath"]
						reactContext: any
						slice: any
						readonly [STORE_SLICE_SELECTOR]?:
							| T["slice"]["path"]
							| undefined
					},
					Selector
				>
				readonly [STORE_SLICE_SELECTOR]?:
					| T["slice"]["path"]
					| undefined
			}
	: []

type ModelReq = {
	model: "store"
	slice: any
	filterSlice: any
	initialPath: any
	action: any
}

interface MakePipe<Model extends ModelReq> {
	make<I = never>(
		initialSlice: Model["initialPath"],
	): Store<Model, I>

	make<Ac = never>(
		initialSlice: Model["initialPath"],
		actions: (_: Model["action"]) => Ac,
	): Store<Model, { _: Ac }>

	make<Ac = never, L = undefined>(
		initialSlice: Model["initialPath"],
		serviceLayer: (_: Model) => L,
		actions: (
			_: AddProperty<
				Model["action"],
				"layer",
				ResolveLayer<L>
			>,
		) => Ac,
	): Store<Model, { _: Ac }, ResolveLayer<L>>
}

export interface StoreMake {
	type: <T extends ModelReq>() => MakePipe<T>

	initial: <M extends ModelReq, T extends M["initialPath"]>(slice: T) => T

	layer: <A, T extends Record<string, () => any>>(
		service: T,
	) => (_: A) => { _tag: "Store.layer"; service: FnReturnMap<T> }

	actions: ActionsPipe
}

type FnReturnMap<T extends Record<PropertyKey, (...a: any) => any>> = Simplify<{
	readonly [K in keyof T]: ReturnType<T[K]>
}>

export type ResolveLayer<T> = T extends { service: infer S } ? S : T

type AddProperty<U, K extends PropertyKey, V> = U extends any
	? U & { [P in K]: V }
	: never

export interface ActionsPipe {
	<A, B, C>(f1: (_: A) => B, exhaustive: (_: B) => C): (a: A) => C
	<A, B, C, D>(
		f1: (_: A) => B,
		f2: (_: A) => C,
		exhaustive: (unhandled: B | C) => D,
	): (a: A) => D
}
