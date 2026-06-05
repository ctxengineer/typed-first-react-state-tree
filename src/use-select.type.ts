import type {
	AnyObservable,
	UnwrapObservable,
	ObservableRecord,
} from "./observable.type"

type ObservableKeys<T extends ObservableRecord> = {
	[K in keyof T]: T[K] extends AnyObservable ? (K extends string ? K : never) : never
}[keyof T]

type ContextSelection<T extends ObservableRecord> = {
	[K in ObservableKeys<T>]: UnwrapObservable<T[K]>
}

type Key<T extends ObservableRecord> = keyof ContextSelection<T>

type Selected<
	T extends ObservableRecord,
	K extends ReadonlyArray<Key<T>>,
> = Pick<ContextSelection<T>, Extract<K[number], keyof ContextSelection<T>>>

export interface UsePick {
	<T extends ObservableRecord, const Keys extends ReadonlyArray<Key<T>>>(
		ctx: T,
		...keys: Keys
	): Selected<T, Keys>
	<T extends ObservableRecord, const Keys extends ReadonlyArray<Key<T>>>(
		ctx: T,
		keys: Keys,
	): Selected<T, Keys>
}
