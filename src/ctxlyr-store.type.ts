import type { _ } from "./store-model-helper.type"
import type { Simplify } from "./type-utility"

export type UseableStore = {
	"~": {
		slice: any
		leafSlice: any
		slicePath: string
		leafSlicePath: string
		exhaustive: true
	}
	initialPath: string
	layer: {} | undefined
	reactContext: any
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
				layer: L
				initialPath: T["initialPath"]
				reactContext: any
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
	): Store<Model, I, { _: never }>

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
				// @ts-expect-error
				L["service"]
			>,
		) => Ac,
	): Store<Model, { _: Ac }, L>
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

type AddProperty<U, K extends PropertyKey, V> = U extends any
	? U & { [P in K]: V }
	: never

export interface ActionsPipe {
	<A, B>(f1: (_: A) => B): (a: A) => B

	<A, B, C>(f1: (_: A) => B, f2: (_: B) => C): (a: A) => C

	<A, B, C, D>(f1: (_: A) => B, f2: (_: B) => C, f3: (_: C) => D): (a: A) => D

	<A, B, C, D, E>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
	): (a: A) => E

	<A, B, C, D, E, F>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
	): (a: A) => F

	<A, B, C, D, E, F, G>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
	): (a: A) => G

	<A, B, C, D, E, F, G, H>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
	): (a: A) => H

	<A, B, C, D, E, F, G, H, I>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
	): (a: A) => I

	<A, B, C, D, E, F, G, H, I, J>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
	): (a: A) => J

	<A, B, C, D, E, F, G, H, I, J, K>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
	): (a: A) => K

	<A, B, C, D, E, F, G, H, I, J, K, L>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
	): (a: A) => L

	<A, B, C, D, E, F, G, H, I, J, K, L, M>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
	): (a: A) => M

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
	): (a: A) => N

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
	): (a: A) => O

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
	): (a: A) => P

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
	): (a: A) => Q

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
		f17: (_: Q) => R,
	): (a: A) => R

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
		f17: (_: Q) => R,
		f18: (_: R) => S,
	): (a: A) => S

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
		f17: (_: Q) => R,
		f18: (_: R) => S,
		f19: (_: S) => T,
	): (a: A) => T

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
		f17: (_: Q) => R,
		f18: (_: R) => S,
		f19: (_: S) => T,
		f20: (_: T) => U,
	): (a: A) => U

	<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(
		f1: (_: A) => B,
		f2: (_: B) => C,
		f3: (_: C) => D,
		f4: (_: D) => E,
		f5: (_: E) => F,
		f6: (_: F) => G,
		f7: (_: G) => H,
		f8: (_: H) => I,
		f9: (_: I) => J,
		f10: (_: J) => K,
		f11: (_: K) => L,
		f12: (_: L) => M,
		f13: (_: M) => N,
		f14: (_: N) => O,
		f15: (_: O) => P,
		f16: (_: P) => Q,
		f17: (_: Q) => R,
		f18: (_: R) => S,
		f19: (_: S) => T,
		f20: (_: T) => U,
		f21: (_: U) => V,
	): (a: A) => V
}
