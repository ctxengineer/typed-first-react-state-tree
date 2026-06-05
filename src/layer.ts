import { observable } from "@legendapp/state"
import React from "react"
import { buildActionDispatcher } from "./action-matcher/action-dispatcher.ts"
import type { _ } from "./store-model-helper.type.ts"
import type { UseableStore } from "./ctxlyr-store.type.ts"

type PropPromise<T extends _.Slice> = T["hasPromise"] extends false
	? {}
	: { promise: T["promise"] }

type LayerProps<T extends _.Slice> = { children: React.ReactNode } & {
	context: T["context"]
} & PropPromise<T>

type Layer<Store extends _.MinUsableStore> = <
	const P extends LayerProps<InitialSlice>,
	InitialSlice extends _.Slice = Extract<
		Store["~"]["slice"],
		{ path: Store["initialPath"] }
	>,
>(
	props: P,
) => React.ReactElement

export const makeProvider = <T extends UseableStore>(
	useableStore: T,
): Layer<T> => {
	// @ts-expect-error
	return (layerProviderProps: _.StoreLayerReactContextProviderProps) => {
		const serviceLayer = Object.fromEntries(
			Object.entries(
				(useableStore.layer as _.WrappedStoreServiceLayer) ?? {},
			).map(([layerServiceName, wrappedLayerService]) => [
				layerServiceName,
				wrappedLayerService(),
			]),
		)

		const store$ = observable({
			path: useableStore.initialPath,
			context: layerProviderProps.context,
		}) as any

		const sliceRef = React.useRef<{ delete(): void } | undefined>(undefined)
		if (sliceRef.current === undefined) {
			sliceRef.current = store$
		}

		const context$Proxy = new Proxy(store$.context, {
			get: (target, key: string) => {
				switch (key) {
					case "peek":
						return target.peek
					case "get":
						return target.get
					default: {
						const strippedKey = key.slice(0, -1)
						const ctxProp$ = target[strippedKey]

						return isRecordObject(ctxProp$)
							? makeContextProxy(ctxProp$)
							: target[strippedKey]
					}
				}
			},
		})

		const providerStore = {
			slice$: store$.path,
			context: context$Proxy,
			action: buildActionDispatcher(
				store$,
				context$Proxy,
				// @ts-expect-error
				useableStore.actionMatcher,
				serviceLayer,
			),
			layer: serviceLayer,
		}

		React.useEffect(() => {
			// @ts-expect-error
			providerStore.action.onEntry(layerProviderProps.promise)
			return () => sliceRef.current?.delete()
		}, [])

		return React.createElement(
			useableStore.reactContext.Provider,
			// @ ts-expect-error
			{ value: providerStore },
			layerProviderProps.children,
		)
	}
}

function isRecordObject(value: unknown) {
	return (
		value !== null &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		typeof (value as any).peek !== "function"
	)
}

function makeContextProxy(parentObservable$: any) {
	return new Proxy(
		{},
		{
			get: (_target, key: string) => {
				const strippedKey = key.slice(0, -1)
				const ctxProp$ = parentObservable$[strippedKey]

				if (isRecordObject(ctxProp$)) {
					return makeContextProxy(parentObservable$)
				}
				return parentObservable$[strippedKey]
			},
		},
	)
}
