type IsWidening<Old, New> = [Old] extends [New] ? true : false

type OptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>

type IncompatibleKeys<From, To> = {
	[K in keyof From & keyof To]: IsWidening<From[K], To[K]> extends true
		? never
		: K
}[keyof From & keyof To]

type ReqKeys<From, To> =
	| Exclude<RequiredKeys<To>, keyof From>
	| (RequiredKeys<To> & OptionalKeys<From>)
	| IncompatibleKeys<From, To>

type OptKeys<From, To> = Exclude<keyof To, ReqKeys<From, To>>

type ReqGroup<From, To> = Pick<To, ReqKeys<From, To>>
type OptGroup<From, To> = Partial<Pick<To, OptKeys<From, To>>>

type _Result<R, O> = keyof R extends never
	? keyof O extends never
		? { required: undefined; optional: undefined }
		: { required: undefined; optional: O }
	: keyof O extends never
		? { required: R; optional: undefined }
		: { required: R; optional: O }

export type TransitionContext<From, To> = _Result<
	ReqGroup<From, To>,
	OptGroup<From, To>
>
