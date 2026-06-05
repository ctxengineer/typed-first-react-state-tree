import React from "react"
import { useWatch } from "./observable.ts"
import { useStore } from "./use-store.ts"
import type { UseableStore } from "./ctxlyr-store.type.ts"
import type {
	ElseClause,
	MatchExhaustive,
	UseSlice,
	WhenClause,
} from "./match.type.ts"

type Render = () => React.ReactNode

const matchesSelector = (currentSlice: string, selector: string) => {
	const starIdx = selector.lastIndexOf("*")
	return starIdx === -1
		? currentSlice === selector
		: currentSlice.startsWith(selector.slice(0, starIdx))
}

function resolveElse(handlers: any) {
	const last = handlers.at(-1)
	if (last && last.kind === "else") {
		return {
			cases: handlers.slice(0, -1),
			elseCase: last,
		}
	}
	return { cases: handlers, elseCase: undefined }
}

function _when(selector: string, render: Render) {
	return { kind: "when", selector, render }
}

export const when = _when as unknown as WhenClause

const matchElse = (render: Render) =>
	({
		kind: "else" as const,
		render,
	}) as unknown as ElseClause

function useSlice(store: UseableStore, ...handlers: any) {
	const { slice$ } = useStore(store)
	const currentSlice = useWatch(slice$)
	const { cases, elseCase } = resolveElse(handlers)

	for (const clause of cases) {
		if (matchesSelector(currentSlice, clause.selector)) {
			return clause.render()
		}
	}

	if (elseCase) return elseCase.render()

	return null
}
const useSliceV2 = useSlice as UseSlice

const _exhaustive = (_: any) => _
const exhaustive = _exhaustive as MatchExhaustive

export const match = Object.assign(useSliceV2, {
	useSlice: useSliceV2,
	else: matchElse,
	exhaustive,
})

export { matchElse as else }
