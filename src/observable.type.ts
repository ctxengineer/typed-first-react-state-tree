export declare const Observable: unique symbol
export declare const Context: unique symbol
export declare const expandable: unique symbol

type Primitive = string | number | boolean | bigint | symbol | null | undefined

type ShallowWrap<T> = [T] extends [Primitive]
	? { [Observable]: T }
	: { [expandable]: true; [Observable]: T }

type KValueWrap<T> = //
	[T] extends [Primitive]
		? { [Observable]: T }
		: T extends readonly any[]
			? ArrayWrap<T>
			: T extends { [k: string]: any }
				? {
						readonly [K in keyof T as `${Extract<K, string>}$`]: ShallowWrap<
							T[K]
						>
					} & { [Observable]: T }
				: {}

type ArrayWrap<T> = //
	Readonly<{
		[K in keyof T]: { [Observable]: T[K] }
	}> & { [Observable]: T } // s

type RecordWrap<T> = {
	readonly [K in keyof T as `${Extract<K, string>}$`]: KValueWrap<T[K]>
} & {
	[Observable]: T
}

export type WrapObservable<T> = //
	[T] extends [Primitive]
		? { [Observable]: T }
		: T extends readonly any[]
			? ArrayWrap<T>
			: RecordWrap<T>

export type SliceContext<T> = {
	readonly [K in keyof T as `${Extract<K, string>}$`]: WrapObservable<T[K]>
}

export type StripTrailingDollar<S> = S extends `${infer R}$` ? R : S

type UnwrapObservableDollarKeys<T> = {
	[K in keyof T as StripTrailingDollar<K & string>]: UnwrapObservable<T[K]>
}

export type RemoveDollarFromRecord<T> = {
	[K in keyof T as StripTrailingDollar<K & string>]: T[K]
}
export type UnwrapObservable<T> = //
	T extends { [Observable]: infer O } ? O : UnwrapObservableDollarKeys<T>

export type ___UnwrapObservable<T> = //
	T extends readonly any[]
		? {
				-readonly [K in keyof T]: T[K] extends { [Observable]: infer O }
					? O
					: never
			}
		: T extends { [Observable]: infer O }
			? O
			: T extends { [Context]: any }
				? [CTXLYR: 7217] | undefined
				: keyof T extends `${string}$`
					? {
							[K in keyof T as StripTrailingDollar<K & string>]: T[K] extends {
								[Observable]: infer O
							}
								? O
								: never
						}
					: [CTXLYR: 7117, keyof T] | undefined

export type ExpandObservableArray<T> = T extends ReadonlyArray<{
	[Observable]: infer Arr
}>
	? ReadonlyArray<WrapObservable<Arr>>
	: never

export type ExpandObservableRecord<T> = T extends {
	[Observable]: { [k: string]: infer O }
}
	? WrapObservable<O>
	: never

export type AnyObservable = { [Observable]: any }
export type ObservableNumber = { [Observable]: number }
export type ObservableRecord = { [Observable]: { [observable$: string]: any } }
export type AnyObservableArray = ReadonlyArray<{ [Observable]: any }>
