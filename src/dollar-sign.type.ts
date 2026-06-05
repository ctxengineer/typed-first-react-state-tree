import type { ResolveSliceFacet, _ } from "./store-model-helper.type"
import type { StoreModel } from "./store-model.type"

export namespace $ {
	export type Slice<T extends FacetList> = {
		sliceFacets: T
	}
	export type Context<T extends Record<string, any> = {}> = {
		_tag: "facet"
		context: T
	}

	export type Action<T extends Record<string, any> = {}> = {
		_tag: "facet"
		action: T
	}

	export type SubSlice<T extends Record<string, Slice<any>> = {}> = {
		_tag: "facet"
		subSlice: T
	}

	export type OnEntry = {
		_tag: "facet"
		hasOnEntry: true
	}

	export type Promise<T extends SliceOnEntryPromise> = {
		_tag: "facet"
		hasPromise: true
		promise: T
	}

	export type Store<T extends Record<string, any>> = { store: T }

	export type Model<
		T extends { store: Record<string, any> },
		InitialPath extends S["filterSlice"]["leaf"]["path"],
		ForEach extends FacetList | [] = [],
		S extends _.LeafModel = StoreModel<T["store"], ForEach>,
	> = S & { initialPath: InitialPath }

	/**
	 * Utility that folds a list of slice facets into a single facet entry suitable
	 * for use in a `$.Model` `ForEach` tuple.
	 */
	export type ForEach<T extends FacetList> = ResolveSliceFacet<T>
}

type FacetTag = {
	_tag: "facet"
}

type SliceOnEntryPromise = Record<string, Promise<any>>

type Default =
	| [FacetTag]
	| [FacetTag, FacetTag]
	| [FacetTag, FacetTag, FacetTag]
	| [FacetTag, FacetTag, FacetTag, FacetTag]

export type FacetList = Default
