import type { SliceContext, Observable } from "../observable.type.ts"
import type { ActionSet } from "./handler-set.ts"
import type { _ } from "../store-model-helper.type.ts"
import type { TransitionTo } from "./transition-to.ts"

export const actionOnEntry = (slicePath: string, handlerFn: any) => {
	return {
		actionName: "onEntry",
		slicePath,
		handlerFn,
	}
}

export const actionWhen = (actionName: string, handlerFn: any) => {
	return {
		actionName,
		handlerFn,
	}
}

export const actionWhenSlice = (
	actionName: string,
	slicePath: string,
	handlerFn: any,
) => {
	return {
		actionName,
		slicePath,
		handlerFn,
	}
}

export const actionExhaustive = (_: any) => _

export type ActionFn<A extends _.Action> = (args: {
	readonly slice: A["slice"]
	readonly context: SliceContext<A["context"]> & {
		[Observable]: A["context"]
	}
	readonly payload: A["payload"]
	readonly layer: A["layer"]
	readonly to: TransitionTo<A>
	readonly setContext: ActionSet<A>
}) => void | { CTXLYR: 7107 }

export type OnEntryActionFn<A extends _.Action> = (args: {
	readonly slice: A["slice"]
	readonly context: SliceContext<A["context"]> & {
		[Observable]: A["context"]
	}
	readonly layer: A["layer"]
	readonly to: TransitionTo<A>
	readonly setContext: ActionSet<A>
	readonly promise: Readonly<A["promise"]>
}) => void | { CTXLYR: 7107 } | Promise<void | { CTXLYR: 7107 }>

type ActionReq = { slice: string; action: string }

export type When = <
	M extends ActionReq,
	const Act extends Available["action"],
	const Available extends ActionReq = Exclude<M, { action: "onEntry" }>,
>(
	action: Act,
	// @ts-expect-error
	fn: ActionFn<Extract<Available, { action: Act }>>,
) => (_: M) => Act extends never ? M : Exclude<M, { action: Act }>

type OnEntryReq = { slice: string; action: "onEntry" }

export type OnEntry = <
	M,
	const S extends OnEntry["slice"],
	OnEntry extends OnEntryReq = Extract<M, OnEntryReq>,
>(
	slice: S,
	// @ts-expect-error
	fn: OnEntryActionFn<Extract<OnEntry, { slice: S }>>,
) => (_: M) => S extends never ? M : Exclude<M, { action: "onEntry"; slice: S }>

type HandleExhaustive<T extends ActionReq> = [T] extends [never]
	? T
	: [CTXLYR: 7030, T["action"]]

export type ActionExhaustive = <M extends ActionReq>(
	_: HandleExhaustive<M>,
) => true
