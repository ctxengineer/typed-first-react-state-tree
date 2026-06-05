export declare const Observable: unique symbol
export declare const Context: unique symbol
export declare const expandable: unique symbol

type Primitive = string | number | boolean | bigint | symbol | null | undefined

type ObservableLeaf<T> = { [Observable]: T }

type ArrayWrap<T extends readonly any[]> = Readonly<{
	[K in keyof T]: WrapObservable<T[K]>
}> &
	ObservableLeaf<T>

type RecordWrap<T extends Record<string | number | symbol, any>> = Readonly<{
	[K in keyof T]: WrapObservable<T[K]>
}> &
	ObservableLeaf<T> &
	([keyof T] extends [never] ? {} : { [expandable]: true })

export type WrapObservable<T> = //
	[T] extends [Primitive]
		? ObservableLeaf<T>
		: T extends readonly any[]
			? ArrayWrap<T>
			: T extends { [k: string]: any }
				? RecordWrap<T>
				: ObservableLeaf<T>

export type SliceContext<T> = WrapObservable<T>

type UnwrapRecord<T> = {
	[K in keyof T]: UnwrapObservable<T[K]>
}

export type UnwrapObservable<T> = //
	T extends { [Observable]: infer O }
		? O
		: T extends ReadonlyArray<infer Arr>
			? ReadonlyArray<UnwrapObservable<Arr>>
			: T extends Record<string | number | symbol, any>
				? UnwrapRecord<T>
				: never

export type ExpandObservableArray<T> = T extends ReadonlyArray<{
	[Observable]: infer Arr
}>
	? ReadonlyArray<WrapObservable<Arr>>
	: never

export type ExpandObservableRecord<T> = T extends {
	[Observable]: infer O
}
	? WrapObservable<O>
	: never

export type AnyObservable = { [Observable]: any }
export type ObservableNumber = { [Observable]: number }
export type ObservableRecord = {
	readonly [key: string]: AnyObservable
	[Observable]: Record<string, any>
}
export type AnyObservableArray = ReadonlyArray<{ [Observable]: any }>
