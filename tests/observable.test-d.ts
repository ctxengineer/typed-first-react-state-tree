import { describe, test } from "vitest"
import type {
	expandable,
	Observable,
	WrapObservable,
} from "@/observable.type.ts"

type Extends<A, B> = [A] extends [B] ? true : false

const assertType = <T extends true>() => undefined

describe("type WrapObservable – primitives", () => {
	test("string", () => {
		type Actual = WrapObservable<string>
		type Expected = { [Observable]: string }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("number", () => {
		type Actual = WrapObservable<number>
		type Expected = { [Observable]: number }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("boolean", () => {
		type Actual = WrapObservable<boolean>
		type Expected = { [Observable]: boolean }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("bigint", () => {
		type Actual = WrapObservable<bigint>
		type Expected = { [Observable]: bigint }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("symbol", () => {
		type Actual = WrapObservable<symbol>
		type Expected = { [Observable]: symbol }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("null", () => {
		type Actual = WrapObservable<null>
		type Expected = { [Observable]: null }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("undefined", () => {
		type Actual = WrapObservable<undefined>
		type Expected = { [Observable]: undefined }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – array", () => {
	test("string primitive", () => {
		type Actual = WrapObservable<Array<string>>
		type Expected = ReadonlyArray<{
			[Observable]: string
		}> & { [Observable]: Array<string> }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("boolean primitive", () => {
		type Actual = WrapObservable<Array<boolean>>
		type Expected = ReadonlyArray<{
			[Observable]: boolean
		}> & { [Observable]: Array<boolean> }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – unions (non-distributive)", () => {
	test("primitive union (number | string)", () => {
		type Actual = WrapObservable<number | string>
		type Expected = { [Observable]: number | string }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("Array<number | string>", () => {
		type Actual = WrapObservable<Array<number | string>>
		type Expected = readonly {
			[Observable]: string | number
		}[] & {
			[Observable]: (string | number)[]
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – intersections", () => {
	test("{a:number} & {b:string}", () => {
		type OriginalRecord = { a: number } & { b: string }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a: {
				[Observable]: number
			}
			readonly b: {
				[Observable]: string
			}
		} & {
			[Observable]: OriginalRecord
			[expandable]: true
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – Record", () => {
	test("basic", () => {
		type OriginalRecord = { a: number }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a: {
				[Observable]: number
			}
		} & {
			[Observable]: OriginalRecord
			[expandable]: true
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – [expandable]", () => {
	test("2 levels nested Record", () => {
		type OriginalRecord = { a1: { a2: boolean } }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a1: WrapObservable<{ a2: boolean }>
		} & {
			[Observable]: OriginalRecord
			[expandable]: true
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("5-level nested Record", () => {
		type OriginalRecord = { a1: { a2: { a3: { a4: { a5: boolean } } } } }
		type Actual = WrapObservable<OriginalRecord>

			type Expected = {
				readonly a1: WrapObservable<{
					a2: {
						a3: {
							a4: {
								a5: boolean
							}
						}
					}
				}>
			} & {
				[Observable]: OriginalRecord
				[expandable]: true
			}
	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("nested Record with Array", () => {
		type OriginalRecord = { a1: Array<{ a2: boolean }> }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a1: WrapObservable<Array<{ a2: boolean }>>
		} & {
			[Observable]: OriginalRecord
			[expandable]: true
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – array", () => {
	test("make readonly", () => {
		type Actual = WrapObservable<Array<string>>
		type Expected = ReadonlyArray<{ [Observable]: string }> & {
			[Observable]: Array<string>
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("readonly string[]", () => {
		type Actual = WrapObservable<readonly string[]>
		type Expected = readonly { [Observable]: string }[] & {
			[Observable]: readonly string[]
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("nested arrays", () => {
		type Actual = WrapObservable<Array<Array<boolean>>>
		type Expected = ReadonlyArray<WrapObservable<Array<boolean>>> & {
			[Observable]: Array<Array<boolean>>
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – tuples", () => {
	test("[number, string]", () => {
		type Actual = WrapObservable<[number, string]>
		type Expected = readonly [
			{ [Observable]: number },
			{ [Observable]: string },
		] & {
			[Observable]: [number, string]
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("[{ a1: { a2: boolean } }]", () => {
		type Actual = WrapObservable<Array<{ a1: { a2: boolean } }>>
		type Expected = ReadonlyArray<
			WrapObservable<{ a1: { a2: boolean } }>
		> & { [Observable]: Array<{ a1: { a2: boolean } }> }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("[{a: boolean}]", () => {
		type Actual = WrapObservable<Array<{ a: boolean }>>
		type Expected = ReadonlyArray<WrapObservable<{ a: boolean }>> & {
			[Observable]: Array<{ a: boolean }>
		}

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})

describe("type WrapObservable – any / unknown / never", () => {
	test("any", () => {
		type Actual = WrapObservable<any>
		type Expected = { [Observable]: any }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})

	test("unknown", () => {
		type Actual = WrapObservable<unknown>
		type Expected = {} & {
			[Observable]: unknown
		}

	assertType<Extends<Actual, Expected>>()
	})

	test("never", () => {
		type Actual = WrapObservable<never>
		type Expected = { [Observable]: never }

	assertType<Extends<Actual, Expected>>()
	assertType<Extends<Expected, Actual>>()
	})
})
