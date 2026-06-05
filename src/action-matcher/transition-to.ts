import type { _ } from "../store-model-helper.type"
import type { Simplify } from "../type-utility"
import type { TransitionContext } from "./transition-context"

type Required<Ctx, Prm> = //
	[Ctx] extends [{}]
		? Prm extends undefined
			? [requiredContext: Ctx]
			: [requiredContext: Ctx, requiredPromise: { "to.withPromise": Prm }]
		: Prm extends {}
			? [requiredPromise: { "to.withPromise": Prm }]
			: []

type ToSliceReturn<T> = //
	T extends { optional: any }
		? {
				CTXLYR: 7107
				withOptional: (context: Simplify<T["optional"]>) => {
					CTXLYR: 7107
				}
			}
		: {
				CTXLYR: 7107
			}

type HasPromise<T> = //
	T extends { hasPromise: true; promise: any } ? T["promise"] : undefined

export interface TransitionTo<
	Ca extends _.Action,
	Rest extends _.Slice = Exclude<Ca["transitionTo"], { path: Ca["slice"] }>,
> {
	slice<
		NextSliceSelector extends Rest["path"],
		NextSlice extends { context: any } = Extract<
			Rest,
			{ path: NextSliceSelector }
		>,
		NextCtx extends { required: any } = TransitionContext<
			Ca["context"],
			NextSlice["context"]
		>,
	>(
		nextSlice: NextSliceSelector,
		...required: Required<NextCtx["required"], HasPromise<NextSlice>>
	): ToSliceReturn<NextCtx>

	withPromise<T>(promise: T): { "to.withPromise": T }
}

export const transitionTo = {
	slice: (nextSlice: string, requiredContext = {}, withPromise = {}) => {
		return {
			_tag: "to.slice",
			nextSlice,
			nextContext: requiredContext,
			withPromise,
			withOptional: (optionalContext = {}) => {
				return {
					_tag: "to.slice",
					nextSlice,
					nextContext: {
						...requiredContext,
						...optionalContext,
					},
					withPromise,
				}
			},
		}
	},
	withPromise: (promise: any) => {
		return {
			_tag: "to.withPromise",
			promise,
		}
	},
}
