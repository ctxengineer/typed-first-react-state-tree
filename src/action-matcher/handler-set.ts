import type { _ } from "../store-model-helper.type"

export type ActionSet<Ca extends _.Ctx, Ctx = Ca["context"]> = (
	context: Partial<Ctx>,
) => {
	CTXLYR: 7107
}

const setContext = (context: any) => {
	return { _tag: "set.context", context }
}

export const actionHandlerSet = setContext
