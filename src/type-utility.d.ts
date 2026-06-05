/**
 * https://github.com/sindresorhus/type-fest
 */

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

export type EmptyObject = {}

export type RecordAny = Record<string, any>
