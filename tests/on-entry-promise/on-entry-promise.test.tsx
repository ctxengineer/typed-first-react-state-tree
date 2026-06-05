/**
 *
 * @vitest-environment happy-dom
 *
 */

import { render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { actionSpy } from "../utils"
import { Action, Layer, Store } from "@/lib/typed-first"
import type { FooPromiseModel } from "./model.ts"

const FooPromise = Store.type<FooPromiseModel>().make(
	Store.initial("Foo"),
	Store.actions(
		Action.onEntry("Foo", async ({ to, slice, promise }) => {
			await promise.profile
			actionSpy.onEntry({ slice })
			return to.slice(
				"Bar",
				{ name: "bar" },
				to.withPromise({ list: mockAsync() }),
			)
		}),
		Action.onEntry("Bar", async ({ to, slice, promise }) => {
			const resolved = await promise.list
			actionSpy.onEntry({ slice, resolved })
			return to.slice("Rizz", to.withPromise({ hux: mockAsync() }))
		}),

		Action.onEntry("Rizz", async ({ slice, promise }) => {
			const resolved = await promise.hux
			actionSpy.onEntry({ slice, resolved })
		}),
		Action.exhaustive,
	),
)

const FooPromiseLayer = Layer.makeProvider(FooPromise)

beforeEach(() => vi.clearAllMocks())

const mockAsync = async () => {
	return "a string"
}

describe("Promise", () => {
	test("1", async () => {
		render(
			<FooPromiseLayer
				context={{ foo: "initial value" }}
				promise={{
					profile: mockAsync(),
				}}
				children={[]}
			/>,
		)

		await waitFor(() =>
			expect(actionSpy.onEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					slice: "Foo",
				}),
			),
		)
	})

	test("2", async () => {
		render(
			<FooPromiseLayer
				context={{ foo: "initial value" }}
				promise={{
					profile: mockAsync(),
				}}
				children={[]}
			/>,
		)

		await waitFor(() =>
			expect(actionSpy.onEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					slice: "Bar",
					resolved: "a string",
				}),
			),
		)
	})
})
