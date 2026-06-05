type HandlerArgs = {
	action: string
	slice: string
	payload: unknown
	promise?: unknown
}

type StoreAction = {
	actionName: string
	slicePath: string
	handlerFn: (a: HandlerArgs) => Promise<any>
}

const ON_ENTRY = "onEntry" as const

export function buildActionMatcher(actions: readonly StoreAction[]) {
	const normal: Record<string, StoreAction["handlerFn"]> = Object.create(null)
	const onEntry: Record<string, StoreAction["handlerFn"]> = Object.create(null)

	for (const { actionName, slicePath, handlerFn } of actions) {
		;(actionName === ON_ENTRY ? onEntry : normal)[slicePath || actionName] =
			handlerFn
	}

	return function match(args: HandlerArgs) {
		if (args.action !== ON_ENTRY) {
			return normal[args.action]?.(args)
		}

		args.promise = args.payload
		return onEntry[args.slice]?.(args)
	}
}
