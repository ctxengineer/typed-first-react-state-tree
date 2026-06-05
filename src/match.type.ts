import type { UseableStore } from "./ctxlyr-store.type.ts"

type ExpandSelector<S> = S extends `${infer Prefix}.*`
	? Prefix | `${Prefix}.${string}`
	: S

export type ExcludeSelectorPath<T, S> = Exclude<T, ExpandSelector<S>>

export type WhenClause = <Sp>(selector: Sp, handler: any) => Sp

export type ElseClause = (handler: any) => never

type HandleExhaustive<T> = [T] extends [never] ? T : [CTXLYR: 7030, T]
export type MatchExhaustive = <M>(StoreActions: M) => HandleExhaustive<M>

export interface UseSlice {
	// One clause
	<
		T extends UseableStore,
		const W1 extends Sp,
		const E extends Exclude<Sp, W1>,
		Sp = T["~"]["slicePath"],
	>(
		store: T,
		w1: W1,
		e: (_: E) => never,
	): React.ReactNode

	// Two clauses
	<
		T extends UseableStore,
		const W1 extends Sp,
		const W2 extends ExcludeSelectorPath<Sp, W1>,
		const E extends ExcludeSelectorPath<Sp, W1 | W2>,
		Sp = T["~"]["slicePath"],
	>(
		store: T,
		w1: W1,
		w2: W2,
		e: (_: E) => never,
	): React.ReactNode

	// Three clauses
	<
		T extends UseableStore,
		const W1 extends Sp,
		const W2 extends ExcludeSelectorPath<Sp, W1>,
		const W3 extends ExcludeSelectorPath<Sp, W1 | W2>,
		const E extends ExcludeSelectorPath<Sp, W1 | W2 | W3>,
		Sp = T["~"]["slicePath"],
	>(
		store: T,
		w1: W1,
		w2: W2,
		w3: W3,
		e: (_: E) => never,
	): React.ReactNode

	// Four clauses
	<
		T extends UseableStore,
		const W1 extends Sp,
		const W2 extends ExcludeSelectorPath<Sp, W1>,
		const W3 extends ExcludeSelectorPath<Sp, W1 | W2>,
		const W4 extends ExcludeSelectorPath<Sp, W1 | W2 | W3>,
		const E extends ExcludeSelectorPath<Sp, W1 | W2 | W3 | W4>,
		Sp = T["~"]["slicePath"],
	>(
		store: T,
		w1: W1,
		w2: W2,
		w3: W3,
		w4: W4,
		e: (_: E) => never,
	): React.ReactNode

	// Five clauses
	<
		T extends UseableStore,
		const W1 extends Sp,
		const W2 extends ExcludeSelectorPath<Sp, W1>,
		const W3 extends ExcludeSelectorPath<Sp, W1 | W2>,
		const W4 extends ExcludeSelectorPath<Sp, W1 | W2 | W3>,
		const W5 extends ExcludeSelectorPath<Sp, W1 | W2 | W3 | W4>,
		const E extends ExcludeSelectorPath<Sp, W1 | W2 | W3 | W4 | W5>,
		Sp = T["~"]["slicePath"],
	>(
		store: T,
		w1: W1,
		w2: W2,
		w3: W3,
		w4: W4,
		w5: W5,
		e: (_: E) => never,
	): React.ReactNode
}
