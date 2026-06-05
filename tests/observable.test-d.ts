import { describe, expectTypeOf, test } from "vitest"
import type {
	expandable,
	Observable,
	WrapObservable,
} from "../src/observable.type.ts"

describe("type WrapObservable – primitives", () => {
	test("string", () => {
		type Actual = WrapObservable<string>
		type Expected = { [Observable]: string }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("number", () => {
		type Actual = WrapObservable<number>
		type Expected = { [Observable]: number }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("boolean", () => {
		type Actual = WrapObservable<boolean>
		type Expected = { [Observable]: boolean }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("bigint", () => {
		type Actual = WrapObservable<bigint>
		type Expected = { [Observable]: bigint }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("symbol", () => {
		type Actual = WrapObservable<symbol>
		type Expected = { [Observable]: symbol }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("null", () => {
		type Actual = WrapObservable<null>
		type Expected = { [Observable]: null }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("undefined", () => {
		type Actual = WrapObservable<undefined>
		type Expected = { [Observable]: undefined }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – array", () => {
	test("string primitive", () => {
		type Actual = WrapObservable<Array<string>>
		type Expected = ReadonlyArray<{
			[Observable]: string
		}> & { [Observable]: Array<string> }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("boolean primitive", () => {
		type Actual = WrapObservable<Array<boolean>>
		type Expected = ReadonlyArray<{
			[Observable]: boolean
		}> & { [Observable]: Array<boolean> }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – unions (non-distributive)", () => {
	test("primitive union (number | string)", () => {
		type Actual = WrapObservable<number | string>
		type Expected = { [Observable]: number | string }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("Array<number | string>", () => {
		type Actual = WrapObservable<Array<number | string>>
		type Expected = readonly {
			[Observable]: string | number
		}[] & {
			[Observable]: (string | number)[]
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – intersections", () => {
	test("{a:number} & {b:string}", () => {
		type OriginalRecord = { a: number } & { b: string }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a$: {
				[Observable]: number
			}
			readonly b$: {
				[Observable]: string
			}
		} & {
			[Observable]: OriginalRecord
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – Record", () => {
	test("basic", () => {
		type OriginalRecord = { a: number }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a$: {
				[Observable]: number
			}
		} & {
			[Observable]: OriginalRecord
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – [expandable]", () => {
	test("2 levels nested Record", () => {
		type OriginalRecord = { a1: { a2: boolean } }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a1$: {
				readonly a2$: {
					[Observable]: boolean
				}
			} & {
				[Observable]: { a2: boolean }
			}
		} & {
			[Observable]: OriginalRecord
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("5-level nested Record", () => {
		type OriginalRecord = { a1: { a2: { a3: { a4: { a5: boolean } } } } }
		type Actual = WrapObservable<OriginalRecord>

		type Expected = {
			readonly a1$: {
				readonly a2$: {
					[expandable]: true
					[Observable]: {
						a3: {
							a4: {
								a5: boolean
							}
						}
					}
				}
			} & {
				[Observable]: {
					a2: {
						a3: {
							a4: {
								a5: boolean
							}
						}
					}
				}
			}
		} & {
			[Observable]: OriginalRecord
		}
		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("nested Record with Array", () => {
		type OriginalRecord = { a1: Array<{ a2: boolean }> }
		type Actual = WrapObservable<OriginalRecord>
		type Expected = {
			readonly a1$: ReadonlyArray<{
				[Observable]: { a2: boolean }
			}> & {
				[Observable]: Array<{ a2: boolean }>
			}
		} & {
			[Observable]: OriginalRecord
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – array", () => {
	test("make readonly", () => {
		type Actual = WrapObservable<Array<string>>
		type Expected = ReadonlyArray<{ [Observable]: string }> & {
			[Observable]: Array<string>
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("readonly string[]", () => {
		type Actual = WrapObservable<readonly string[]>
		type Expected = readonly { [Observable]: string }[] & {
			[Observable]: readonly string[]
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("nested arrays", () => {
		type Actual = WrapObservable<Array<Array<boolean>>>
		type Expected = readonly {
			[Observable]: boolean[]
		}[] & {
			[Observable]: boolean[][]
		}

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
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

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("[{ a1: { a2: boolean } }]", () => {
		type Actual = WrapObservable<Array<{ a1: { a2: boolean } }>>
		type Expected = ReadonlyArray<{
			[Observable]: { a1: { a2: boolean } }
		}> & { [Observable]: Array<{ a1: { a2: boolean } }> }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("[{a: boolean}]", () => {
		type Actual = WrapObservable<Array<{ a: boolean }>>
		type Expected = ReadonlyArray<{
			[Observable]: { a: boolean }
		}> & { [Observable]: Array<{ a: boolean }> }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})

describe("type WrapObservable – any / unknown / never", () => {
	test("any", () => {
		type Actual = WrapObservable<any>
		type Expected = { [Observable]: any }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})

	test("unknown", () => {
		type Actual = WrapObservable<unknown>
		type Expected = {} & {
			[Observable]: unknown
		}

		expectTypeOf<Actual>().toExtend<Expected>()
	})

	test("never", () => {
		type Actual = WrapObservable<never>
		type Expected = { [Observable]: never }

		expectTypeOf<Actual>().toEqualTypeOf<Expected>()
	})
})
