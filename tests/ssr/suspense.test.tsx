/**
 * @vitest-environment happy-dom
 */

import { Suspense } from "react"
import { render } from "@testing-library/react"
import { beforeEach, describe, expect, test } from "vitest"

const STORAGE_KEY = "ctxlyr:ssr:local-storage"

const readLocalStorage = (() => {
	let pending: Promise<void> | null = null

	return () => {
		const storedValue = window.localStorage.getItem(STORAGE_KEY)
		if (storedValue) return storedValue

		if (!pending) {
			pending = Promise.resolve().then(() => {
				window.localStorage.setItem(STORAGE_KEY, "hydrated")
			})
		}

		throw pending
	}
})()

const LocalStorageSuspense = () => {
	const value = readLocalStorage()
	return <span>{value}</span>
}

describe("SSR Suspense localStorage access (happy-dom)", () => {
	beforeEach(() => {
		window.localStorage.clear()
	})

	test("React.Suspense can await localStorage-backed resource", async () => {
		const { findByText } = render(
			<Suspense fallback={<span>loading</span>}>
				<LocalStorageSuspense />
			</Suspense>,
		)

		await findByText("hydrated")
		expect(window.localStorage.getItem(STORAGE_KEY)).toBe("hydrated")
		expect(window.localStorage).toBeDefined()
	})
})
