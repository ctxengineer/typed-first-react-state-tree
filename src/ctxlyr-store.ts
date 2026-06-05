import React from "react"
import { buildActionMatcher } from "./action-matcher/matcher.ts"

import { STORE_SLICE_SELECTOR } from "./ctxlyr-store.constants.ts"
import type { StoreMake } from "./ctxlyr-store.type.ts"
import type { _ } from "./store-model-helper.type.ts"

export const Store = {
	type: () => {
		return {
			make: (...args: []): _.UsableStore => {
				const config = Object.assign({}, ...args)

				const actionMatcher = buildActionMatcher(config["Store.actions"])

				const store = {
					reactContext: React.createContext(undefined),
					initialPath: config["Store.initial"],
					actionMatcher,
					layer: config["Store.layer"],
					exhaustive: false,
					"~": {},
				} as any

				const makeSliceHandle = (selector: string) => {
					return Object.assign({}, store, {
						[STORE_SLICE_SELECTOR]: selector,
						slice: store.slice,
					})
				}

				store.slice = (selector: string) => {
					return makeSliceHandle(selector)
				}

				return store
			},
		}
	},
	initial: (slicePath: string) => {
		return { "Store.initial": slicePath }
	},
	layer: (layer: Record<string, () => any>) => {
		return { "Store.layer": layer }
	},
	actions: (...args: []) => {
		return { "Store.actions": args }
	},
} as unknown as StoreMake
