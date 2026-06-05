import { useSelector as legendUseSelector } from "@legendapp/state/react"

import type {
	UnwrapObservable,
	ExpandObservableRecord,
	AnyObservable,
	ObservableRecord,
	ObservableNumber,
} from "./observable.type"
import type { UsePick } from "./use-select.type"

export const $peek = <T extends AnyObservable>(
	observable$: T,
): UnwrapObservable<T> => {
	// @ts-expect-error
	return observable$.peek()
}

export const $watch = <T extends AnyObservable>(
	observable$: T,
): UnwrapObservable<T> => {
	// @ts-expect-error
	return observable$.get()
}

export const $set = <T extends AnyObservable>(
	observable$: T,
	value: UnwrapObservable<T>,
): {
	CTXLYR: 7107
} => {
	return { _tag: "$set", observable$, value } as any
}

export const $setIncrement = <T extends ObservableNumber>(
	observable$: T,
	value?: number,
): {
	CTXLYR: 7107
} => {
	return {
		_tag: "$set",
		observable$,
		value: $peek(observable$) + (value || 1),
	} as any
}

export const $setDecrement = <T extends ObservableNumber>(
	observable$: T,
	value?: number,
): {
	CTXLYR: 7107
} => {
	return {
		_tag: "$set",
		observable$,
		value: $peek(observable$) - (value || 1),
	} as any
}

export const $setSelect = <T extends ObservableRecord>(
	observable$: T,
	value: Partial<UnwrapObservable<T>>,
): {
	CTXLYR: 7107
} => {
	return { _tag: "$setSelect", observable$, value } as any
}

export const $expand = <T extends ObservableRecord>(
	observable: T,
): ExpandObservableRecord<T> => observable as any

export const $setImmediate = <T extends AnyObservable>(
	observable$: T,
	value: UnwrapObservable<T>,
): void => {
	// @ts-expect-error
	observable$.set(value)
}

export const useWatch = <T>(observable: T): UnwrapObservable<T> => {
	// @ts-expect-error
	return legendUseSelector(observable)
}

const _usePick = (record: {}, ...keys: any[]) => {
	const selection: string[] =
		keys.length === 1 && Array.isArray(keys[0]) ? keys[0] : keys

	return legendUseSelector(() => {
		const out = {}

		for (const key of selection) {
			// @ts-expect-error
			out[key] = record[key]?.get() as any
		}

		return out as any
	})
}

export const usePick = _usePick as any as UsePick
