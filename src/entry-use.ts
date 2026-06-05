function throwNotResolved(): never {
	throw new TypeError(
		'[CTXLYR: 5000] "@/lib/typed-first/hooks" not resolved at runtime',
	)
}

export const useStore = throwNotResolved as unknown as [CTXLYR: 7000]
