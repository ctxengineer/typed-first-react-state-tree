import {
	type When,
	type ActionExhaustive,
	type OnEntry,
	actionOnEntry,
	actionWhen,
	actionExhaustive,
} from "./action-facet.ts"

export const Action = {
	onEntry: actionOnEntry,
	when: actionWhen,
	exhaustive: actionExhaustive,
} as any as {
	onEntry: OnEntry
	when: When
	exhaustive: ActionExhaustive
}
