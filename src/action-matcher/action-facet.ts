import type { SliceContext } from "../observable.type.ts"
import type { ActionSet } from "./handler-set.ts"
import type { _ } from "../store-model-helper.type.ts"
import type { TransitionTo } from "./transition-to.ts"

export const actionOnEntry = (onEntryMap: Record<string, () => unknown>) => {
	return {
		_tag: "onEntry",
		onEntryMap,
	}
}

export const actionWhen = (whenMap: Record<string, () => unknown>) => {
	return {
		_tag: "when",
		whenMap,
	}
}

export const actionExhaustive = (_: any) => _

export type ActionFn<A extends _.Action> = (args: {
	readonly slice: A["slice"]
	readonly context$: SliceContext<A["context"]>
	readonly payload: A["payload"]
	readonly layer: A["layer"]
	readonly to: TransitionTo<A>
	readonly setContext: ActionSet<A>
}) => void | { CTXLYR: 7107 }

export type OnEntryActionFn<A extends _.Action> = (args: {
	readonly slice: A["slice"]
	readonly context$: SliceContext<A["context"]>
	readonly layer: A["layer"]
	readonly to: TransitionTo<A>
	readonly setContext: ActionSet<A>
	readonly promise: Readonly<A["promise"]>
}) => void | { CTXLYR: 7107 } | Promise<void | { CTXLYR: 7107 }>

type ActionReq = { slice: string; action: string }

export type When = <
	M extends ActionReq,
	const K extends Available["action"],
	const Available extends ActionReq = Exclude<M, { action: "onEntry" }>,
>(
	action: {
		// @ts-expect-error
		[P in K]: ActionFn<Extract<Available, { action: P }>>
	},
) => (_: M) => Exclude<Available["action"], K>

type OnEntryReq = { slice: string; action: "onEntry" }

export type OnEntry = <
	M,
	K extends OnEntry["slice"],
	OnEntry extends OnEntryReq = Extract<M, OnEntryReq>,
>(
	slice: {
		// @ts-expect-error
		[P in K]: OnEntryActionFn<Extract<OnEntry, { slice: P }>>
	},
) => (_: M) => Exclude<OnEntry["slice"], K>

type HandleExhaustive<T> = [T] extends [never] ? T : [CTXLYR: 7030, T]

export type ActionExhaustive = <M>(
	StoreActions: HandleExhaustive<M>,
) => undefined
