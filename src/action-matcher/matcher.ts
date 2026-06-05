type HandlerArgs = {
	action: string
	slice: string
	payload: unknown
	promise?: unknown
}

type Handler = (args: HandlerArgs) => Promise<any>

type OnEntryActionMap = {
	_tag: "onEntry"
	onEntryMap: Record<string, Handler>
}

type WhenActionMap = {
	_tag: "when"
	whenMap: Record<string, Handler>
}

type StoreActionMap = OnEntryActionMap | WhenActionMap

const ON_ENTRY = "onEntry" as const

export function buildActionMatcher(storeActionMaps: readonly StoreActionMap[]) {
	const onEntryMap = storeActionMaps.find(
		(map): map is OnEntryActionMap => map._tag === "onEntry",
	)?.onEntryMap

	const whenMap = storeActionMaps.find(
		(map): map is WhenActionMap => map._tag === "when",
	)?.whenMap

	return function match(args: HandlerArgs) {
		try {
			if (args.action !== ON_ENTRY) {
				if (!whenMap) {
					console.error(
						`[ActionMatcher] No 'when' action map found for action: ${args.action}`,
					)
					return
				}

				const handler = whenMap[args.action]
				if (!handler) {
					console.error(
						`[ActionMatcher] No handler found for action: ${args.action}`,
					)
					return
				}

				return handler(args)
			}

			// Handle onEntry actions
			if (!onEntryMap) {
				console.error(
					`[ActionMatcher] No 'onEntry' action map found for slice: ${args.slice}`,
				)
				return
			}

			args.promise = args.payload
			const handler = onEntryMap[args.slice]
			if (!handler) {
				console.error(
					`[ActionMatcher] No handler found for slice: ${args.slice}`,
				)
				return
			}

			return handler(args)
		} catch (error) {
			console.error(
				`[ActionMatcher] Error executing handler for action: ${args.action}, slice: ${args.slice}`,
				error,
			)
			throw error
		}
	}
}
