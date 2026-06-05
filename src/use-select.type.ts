import type {
	StripTrailingDollar,
	UnwrapObservable,
	ObservableRecord,
} from "./observable.type"

type RecordAnyObservable = Record<string, ObservableRecord>

type Key<T> = StripTrailingDollar<keyof T> & string

type Selected<T extends RecordAnyObservable, S extends string> = {
	[K in S]: UnwrapObservable<T[`${K}$`]>
}

export interface UseSelect {
	<T extends ObservableRecord, S extends string>(
		ctx: T,
		$: (_: T) => S,
	): Selected<T, S>
}

export interface KeySelector {
	<T, K extends Key<T>, const K1 extends K>(k1: K1): (_: T) => K1

	<T, K extends Key<T>, const K1 extends K, const K2 extends Exclude<K, K1>>(
		k1: K1,
		k2: K2,
	): (_: T) => K1 | K2

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
	): (_: T) => K1 | K2 | K3

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
	): (_: T) => K1 | K2 | K3 | K4

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
	): (_: T) => K1 | K2 | K3 | K4 | K5

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
		const K6 extends Exclude<K, K1 | K2 | K3 | K4 | K5>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
		k6: K6,
	): (_: T) => K1 | K2 | K3 | K4 | K5 | K6

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
		const K6 extends Exclude<K, K1 | K2 | K3 | K4 | K5>,
		const K7 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
		k6: K6,
		k7: K7,
	): (_: T) => K1 | K2 | K3 | K4 | K5 | K6 | K7

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
		const K6 extends Exclude<K, K1 | K2 | K3 | K4 | K5>,
		const K7 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6>,
		const K8 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
		k6: K6,
		k7: K7,
		k8: K8,
	): (_: T) => K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
		const K6 extends Exclude<K, K1 | K2 | K3 | K4 | K5>,
		const K7 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6>,
		const K8 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
		const K9 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
		k6: K6,
		k7: K7,
		k8: K8,
		k9: K9,
	): (_: T) => K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9

	<
		T,
		K extends Key<T>,
		const K1 extends K,
		const K2 extends Exclude<K, K1>,
		const K3 extends Exclude<K, K1 | K2>,
		const K4 extends Exclude<K, K1 | K2 | K3>,
		const K5 extends Exclude<K, K1 | K2 | K3 | K4>,
		const K6 extends Exclude<K, K1 | K2 | K3 | K4 | K5>,
		const K7 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6>,
		const K8 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7>,
		const K9 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8>,
		const K10 extends Exclude<K, K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9>,
	>(
		k1: K1,
		k2: K2,
		k3: K3,
		k4: K4,
		k5: K5,
		k6: K6,
		k7: K7,
		k8: K8,
		k9: K9,
		k10: K10,
	): (_: T) => K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9 | K10
}
