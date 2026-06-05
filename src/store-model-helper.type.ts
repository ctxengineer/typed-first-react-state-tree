import type { RecordAny, EmptyObject } from "./type-utility"

export type ResolveSliceFacet<T> =
	// 4-item tuple
	T extends [infer A1, infer A2, infer A3, infer A4]
		? MakeSlice<A1 & A2 & A3 & A4>
		: // 3-item tuple
			T extends [infer A1, infer A2, infer A3]
			? MakeSlice<A1 & A2 & A3>
			: // 2-item tuple
				T extends [infer A1, infer A2]
				? MakeSlice<A1 & A2>
				: // 1-item tuple
					T extends [infer A1]
					? MakeSlice<A1>
					: _.ResolvedEmptySliceFacet

type Fa = {
	hasOnEntry?: any
	hasPromise?: any
	promise?: any
	context?: any
	action?: any
	subSlice?: any
}

type MakeSlice<
	T,
	// @ts-expect-error
	F extends Fa = T,
> = {
	_tag: "facet"
	hasOnEntry: F["hasOnEntry"] extends true ? true : false
	hasPromise: F["hasPromise"] extends true ? true : false
	promise: F["promise"] extends { [x: string]: any } ? F["promise"] : {}
	context: F["context"] extends { [x: string]: any } ? F["context"] : {}
	action: F["action"] extends { [x: string]: any } ? F["action"] : {}
	subSlice: F["subSlice"] extends { [x: string]: any }
		? F["subSlice"]
		: undefined
}

export namespace _ {
	export type ResolvedSliceFacet = {
		_tag: "facet"
		context: Record<string, unknown> | EmptyObject
		action: Record<string, unknown> | EmptyObject
		subSlice: ModelSpec | undefined
		hasOnEntry: boolean
		hasPromise: boolean
		promise: Record<string, unknown> | EmptyObject
	}

	export type ResolvedEmptySliceFacet = {
		_tag: "facet"
		context: EmptyObject
		action: EmptyObject
		subSlice: undefined
		hasOnEntry: false
		hasPromise: false
		promise: EmptyObject
	}

	export type ModelSpec = Record<string, { sliceFacets: any[] }>

	export type OperationTag = {
		_tag: "operation"
	}
	export type OperationList = [OperationTag]

	export type Inherited = {
		context: {}
		action: {}
	}

	export type StoreModel = {
		model: "store"
		spec: ModelSpec
		slice: {
			path: string
			selector: string
			isLeaf: boolean
			hasOnEntry: boolean
			context: {}
			action: {}
			hasPromise: boolean
			promise: {}
		}
		filterSlice: {
			leaf: {
				path: string
				selector: string
				isLeaf: true
				hasOnEntry: boolean
				context: {}
				action: {}
				hasPromise: boolean
				promise: {}
			}
			notLeaf: {
				path: string
				selector: string
				isLeaf: false
				hasOnEntry: boolean
				context: {}
				action: {}
				hasPromise: boolean
				promise: {}
			}
		}
		action: {
			slice: string
			action: string
			payload: any
			context: {}
			layer: {}
			promise: {}
		}
	}

	export interface UsableStore {
		"~": {
			model: StoreModel
			exhaustive: true
		}
		layer: {}
		initialPath: string
		actionMatcher: (arg: any) => Promise<any>
	}

	export type MinUsableStore = {
		"~": {
			slice: Slice
			leafSlice: LeafSlice
			slicePath: string
			leafSlicePath: string
		}
		initialPath: string
		layer: {} | undefined
	}

	export type StoreLayerReactContextProviderProps = {
		context?: RecordAny
		promise?: OnEntryPromise
		children: []
	}

	export type Slice = {
		path: any
		selector: any
		isLeaf: any
		hasOnEntry: any
		context: any
		action: any
		hasPromise: any
		promise: any
	}

	export type OnEntryAction = { action: "onEntry" } & Action

	export type Action = {
		slice: any
		action: any
		payload: any
		context: any
		layer: any
		hasPromise: any
		promise: any
		transitionTo: any
	}

	export type LeafModel = { filterSlice: { leaf: { path: string } } }
	export type LeafSlice = StoreModel["filterSlice"]["leaf"]
	export type OnEntryPromise = Record<string, Promise<any>>
	export type StoreServiceLayer = RecordAny
	export type WrappedStoreServiceLayer = Record<string, () => any>
	export type ActionPromise = { promise: {} }
	export type Ctx = { context: {} }
}
