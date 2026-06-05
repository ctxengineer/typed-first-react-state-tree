import React from "react"
import { buildActionMatcher } from "./action-matcher/matcher.ts"

import type { StoreMake } from "./ctxlyr-store.type.ts"
import type { _ } from "./store-model-helper.type.ts"

export const Store = {
	type: () => {
		return {
			make: (...args: []): _.UsableStore => {
				const config = Object.assign({}, ...args)

				const actionMatcher = buildActionMatcher(config["Store.actions"])

				return {
					reactContext: React.createContext(undefined),
					initialPath: config["Store.initial"],
					actionMatcher,
					layer: config["Store.layer"],
					exhaustive: false,
					// @ts-expect-error
					"~": {},
				}
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
