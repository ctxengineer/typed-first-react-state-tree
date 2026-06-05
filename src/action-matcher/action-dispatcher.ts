import { beginBatch, endBatch } from "@legendapp/state"
import { actionHandlerSet } from "./handler-set.ts"
import { transitionTo } from "./transition-to.ts"

export const buildActionDispatcher = (
	observableSlice: any,
	context$: any,
	actionMatcher: any,
	serviceLayer: any,
) => {
	return new Proxy(
		{},
		{
			get: (_target, actionName: string) => {
				return (payload: any) => {
					dispatchAction(
						observableSlice,
						context$,
						actionMatcher,
						actionName,
						payload,
						serviceLayer,
					)
				}
			},
		},
	)
}

type ServiceLayer = Record<string, any>
type ActionResult =
	| {
			_tag: "to.slice"
			nextSlice: any
			nextContext?: any
			withPromise?: { promise?: any }
	  }
	| { _tag: "$set"; observable$: any; value: any }
	| { _tag: "$setSelect"; observable$: any; value: Record<string, any> }
	| undefined

type ActionMatcher = (args: {
	slice: any
	action: string
	payload: any
	context$: any
	layer: ServiceLayer
	to: typeof transitionTo
	setContext: typeof actionHandlerSet
}) => ActionResult | Promise<ActionResult>

async function dispatchAction(
	observableSlice: any,
	context$: any,
	actionMatcher: ActionMatcher,
	actionName: string,
	payload: any,
	serviceLayer: ServiceLayer,
): Promise<void> {
	const result = await actionMatcher({
		slice: observableSlice.path.peek(),
		action: actionName,
		payload,
		context$: context$,
		layer: serviceLayer,
		to: transitionTo,
		setContext: actionHandlerSet,
	})

	if (!result) return

	switch (result._tag) {
		case "to.slice": {
			applyTransition(observableSlice.path, context$, result)

			const promise = result.withPromise?.promise || {}
			if (promise !== undefined) {
				await dispatchAction(
					observableSlice,
					context$,
					actionMatcher,
					"onEntry",
					promise,
					serviceLayer,
				)
			}
			return
		}
		case "$set": {
			result.observable$.set(result.value)
			return
		}
		case "$setSelect": {
			runInBatch(() => updateObservableRecord(result.observable$, result.value))
			return
		}
	}
}

function runInBatch(fn: () => void) {
	beginBatch()
	try {
		fn()
	} finally {
		endBatch()
	}
}

function applyTransition(path: any, context: any, transition: any) {
	runInBatch(() => {
		path.set(transition.nextSlice)
		if (transition.nextContext) {
			updateObservableRecord(context, transition.nextContext)
		}
	})
}

function updateObservableRecord(
	observable$: any,
	selection: Record<string, any>,
) {
	for (const [key, value] of Object.entries(selection)) {
		const target = observable$[key]
		if (target === undefined) continue
		if (
			isRecordObject(target) &&
			isPlainObject(value)
		) {
			updateObservableRecord(target, value)
		} else if (typeof target?.set === "function") {
			target.set(value)
		}
	}
}

function isPlainObject(value: unknown): value is Record<string, any> {
	return (
		value !== null &&
		typeof value === "object" &&
		!Array.isArray(value)
	)
}

function isRecordObject(value: unknown) {
	return (
		value !== null &&
		typeof value === "object" &&
		typeof (value as any).peek === "function" &&
		typeof (value as any).set === "function"
	)
}
