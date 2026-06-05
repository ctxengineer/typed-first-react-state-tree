import type { ResolveSliceFacet, _ } from "./store-model-helper.type"
import type { Simplify } from "./type-utility"

type BaseMeta<
	P extends string,
	LF extends boolean,
	RF extends _.ResolvedSliceFacet,
	Inherited extends _.Inherited,
> = {
	path: LF extends true ? P : `${P}.*`
	isLeaf: LF
	selector: LF extends true
		? P | Inherited["selector"]
		: `${P}.*` | Inherited["selector"]
	hasOnEntry: RF["hasOnEntry"]
	hasPromise: RF["hasPromise"]
	promise: RF["promise"]
	context: RF["context"] & Inherited["context"]
	action: RF["hasOnEntry"] extends true
		? RF["action"] & Inherited["action"] & { onEntry: true }
		: RF["action"] & Inherited["action"]
}

export type SliceMeta<
	CurrentPath extends string,
	T extends _.ModelSpec[string]["sliceFacets"],
	Inherited extends _.Inherited,
	RF extends _.ResolvedSliceFacet = ResolveSliceFacet<T>,
	SubSlice = RF["subSlice"],
> = SubSlice extends {}
	?
			| BaseMeta<CurrentPath, false, RF, Inherited>
			| MakeSliceMeta<
					SubSlice,
					CurrentPath,
					{
						context: RF["context"] & Inherited["context"]
						action: RF["action"] & Inherited["action"]
						selector: `${CurrentPath}.*` | Inherited["selector"]
					}
			  >
	: BaseMeta<CurrentPath, true, RF, Inherited>

export type MakeSliceMeta<
	Root extends _.ModelSpec,
	Path extends string | undefined,
	Inherited extends _.Inherited,
	PathPrefix extends string = Path extends undefined ? "" : `${Path}.`,
> = {
	[SliceKey in keyof Root & string]: SliceMeta<
		`${PathPrefix}${SliceKey}`,
		Root[SliceKey]["sliceFacets"],
		Inherited
	>
}[keyof Root & string]

type __Inherited = {
	context: {}
	action: {}
	selector: never
}

export type StoreModel<
	Root extends _.ModelSpec,
	St extends { isLeaf: boolean } = MakeSliceMeta<Root, undefined, __Inherited>,
	FilterSl extends { leaf: any } = FilterSliceNode<St>,
> = {
	model: "store"
	spec: Root
	slice: St
	filterSlice: FilterSl
	action: ActionBySlice<FilterSl["leaf"]>
}

export type ResolvedModel<Root extends _.ModelSpec> = {
	model: "store"
	spec: Root
	slice: StoreModel<Root>
}

export type LeafSlice<T extends _.StoreModel["slice"]> = T extends {
	isLeaf: true
}
	? T
	: never

export type FilterSliceNode<T extends { isLeaf: boolean }> = {
	leaf: Extract<T, { isLeaf: true }>
	hasOnEntryLeaf: Extract<T, { isLeaf: true; hasOnEntry: true }>
	notLeaf: Extract<T, { isLeaf: false }>
}

export type ActionDescriptor<T extends LeafSlice<_.StoreModel["slice"]>> =
	ActionBySlice<T>

type ActionBySlice<T extends _.StoreModel["slice"]> = {
	[CurrentSlice in T as CurrentSlice["path"]]: {
		[E in keyof CurrentSlice["action"]]: {
			slice: CurrentSlice["path"]
			context: CurrentSlice["context"]
			action: E
			payload: CurrentSlice["action"][E]
			hasPromise: CurrentSlice["hasPromise"]
			promise: CurrentSlice["promise"]
			transitionTo: T
		}
	}[keyof CurrentSlice["action"]]
}[T["path"]]

export type StoreLayer = { layer?: Record<string, any> }

export type TransitionTo = {
	nextSlice: string
	nextContext?: Record<string, any>
} & {
	__brand: "TransitionTo"
}

export type ActionHandlerMap<T extends Record<string, unknown>> = Simplify<
	Omit<
		{
			readonly [K in keyof T]: T[K] extends void
				? () => void
				: (payload: T[K]) => void
		},
		"onEntry"
	>
>

export type EventActionHandlerMap<T extends Record<string, unknown>> = {
	[K in keyof T]: T[K] extends void
		? () => () => void
		: (payload: T[K]) => () => void
}
