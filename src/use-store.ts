import React from "react"
import { useWatch } from "./observable.ts"
import type { _ } from "./store-model-helper.type.ts"
import type {
	SliceContext,
	WrapObservable,
	Observable,
} from "./observable.type.ts"
import type { ActionHandlerMap } from "./store-model.type.ts"
import type { UseableStore } from "./ctxlyr-store.type.ts"

type LeafPath<T extends { path: string }, P> = T extends {
	isLeaf: false
	path: `${infer Head}.*`
}
	? P extends `${Head}.${string}`
		? P
		: never
	: T["path"]

interface DefaultContextUseStore<
	Store extends UseableStore,
	Slice extends _.Slice = Store["~"]["leafSlice"],
	Layer = Store["layer"],
> {
	readonly slice$: WrapObservable<Slice["path"]>
	readonly context: SliceContext<Slice["context"]> & {
		[Observable]: Slice["context"]
	}
	readonly action: ActionHandlerMap<Slice["action"]>
	readonly layer: Layer
}

interface ContextUseStore<
	Store extends UseableStore,
	Selector,
	Selected extends _.Slice = Extract<Store["~"]["slice"], { path: Selector }>,
	Layer = Store["layer"],
> {
	readonly slice$: WrapObservable<
		LeafPath<Selected, Store["~"]["leafSlicePath"]>
	>
	readonly context: SliceContext<Selected["context"]> & {
		[Observable]: Selected["context"]
	}
	readonly action: ActionHandlerMap<Selected["action"]>
	readonly layer: Layer
}

export function useStore<T extends UseableStore>(
	usableStore: T,
): DefaultContextUseStore<T>

export function useStore<
	T extends UseableStore,
	UsePath extends T["~"]["slicePath"],
>(usableStore: T, selector: UsePath): ContextUseStore<T, UsePath>

export function useStore<T extends UseableStore>(
	usableStore: T,
	selector?: string,
) {
	const reactContextStore = React.useContext(usableStore.reactContext) as any

	if (reactContextStore === undefined)
		throw new Error(
			`'useStore' must be called from a child component of <{Store}Layer>`,
		)

	const currentPath = useWatch(reactContextStore.slice$) as string

	if (selector) {
		const starIdx = selector.lastIndexOf("*")
		const matches =
			starIdx === -1
				? currentPath === selector
				: currentPath.startsWith(selector.slice(0, starIdx))

		if (!matches)
			throw new Error(
				`Component rendered in wrong slice: '${currentPath}' does not match selected path '${selector}'`,
			)
	}

	return reactContextStore
}
