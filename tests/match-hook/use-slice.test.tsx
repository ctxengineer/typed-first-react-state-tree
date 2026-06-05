/**
 *
 * @vitest-environment happy-dom
 *
 **/

import React from "react"
import { render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { Layer } from "@/lib/typed-first"
import { usePick, useStore, match, when } from "@/lib/typed-first/use"
import { FooBar } from "tests/base/store"
import { actionSpy } from "tests/utils"

type FC = React.FC<{ children?: React.ReactNode }>

const FooLayer = Layer.makeProvider(FooBar)

const StoreLayer = (props: {
	children: React.ReactNode
}) => <FooLayer context={{ foo: "initial value" }}>{props.children}</FooLayer>

beforeEach(() => vi.clearAllMocks())

describe("match.useSlice", () => {
	const user = userEvent.setup()
	const observed = { name: "" }

	test("Components update during slice transitions", async () => {
		const MainComponent: FC = () => {
			return match.useSlice(
				FooBar,
				when("Bar.*", () => {
					return <BarQuxComponent />
				}),
				when("Foo", () => {
					return <FooComponent />
				}),
				match.exhaustive,
			)
		}

		const FooComponent: FC = () => {
			const { action } = useStore(FooBar.slice("Foo"))
			return <button onClick={() => action.doThing("zed")} />
		}

		const BarQuxComponent: FC = () => {
			const { context$ } = useStore(FooBar.slice("Bar.Qux"))
			const ctx = usePick(context$, "name")
			observed.name = ctx.name
			return null
		}

		// assert
		const { getByRole } = render(<MainComponent />, {
			wrapper: StoreLayer,
		})

		await user.click(getByRole("button"))
		await waitFor(() => expect(observed.name).toBe("zed"))
		expect(actionSpy.when).toHaveBeenCalledTimes(1)
		expect(actionSpy.when).toHaveBeenCalledWith(
			expect.objectContaining({
				payload: "zed",
				contextPeek_foo: "initial value",
				foo: "initial value",
			}),
		)
	})

	test("returns null when no cases match and no else provided", () => {
		const Component: FC = () => {
			return match.useSlice(
				FooBar,
				when("Bar.Qux", () => <div data-testid="qux" />),
				match.else(() => null),
			)
		}

		const { queryByTestId } = render(<Component />, {
			wrapper: StoreLayer,
		})

		expect(queryByTestId("qux")).toBeNull()
	})
})
