/**
 *
 * @vitest-environment happy-dom
 *
 **/

import React from "react"
import { render, renderHook, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { Layer, $peek } from "@/lib/typed-first"
import { useWatch, useSelect, $, useStore } from "@/lib/typed-first/hooks"
import { FooBar } from "./store"
import { actionSpy } from "../utils"

type FC = React.FC<{ children?: React.ReactNode }>

const FooLayer = Layer.makeProvider(FooBar)

const StoreLayer = (props: {
	children: React.ReactNode
}) => <FooLayer context={{ foo: "initial value" }}>{props.children}</FooLayer>

beforeEach(() => vi.clearAllMocks())

describe("Layer Initialization", () => {
	test("call onEntry action on mount", () => {
		render(<StoreLayer children={[]} />)
		expect(actionSpy.onEntry).toHaveBeenCalledTimes(1)
	})

	test("onEntry is executed twice when wrapped in <React.StrictMode>", () => {
		const Component: FC = () => {
			const { slice$ } = useStore(FooBar, "Foo")
			const currentSlice = useWatch(slice$)
			expect(currentSlice).toBe("Foo")
			return currentSlice
		}

		render(
			<React.StrictMode>
				<StoreLayer>
					<Component />
				</StoreLayer>
			</React.StrictMode>,
		)
		expect(actionSpy.onEntry).toHaveBeenCalledTimes(2)
	})
})

describe("Context.{{Store}}.useStore() hook", () => {
	const { result } = renderHook(() => useStore(FooBar), {
		wrapper: StoreLayer,
	})

	test("initial slice", () => {
		const currentSlice = $peek(result.current.slice$)
		expect(currentSlice).toBe("Foo")
	})

	test("throw when missing Layer provider", () => {
		expect(() => {
			renderHook(() => useStore(FooBar), {
				wrapper: undefined,
			})
		}).toThrow()
	})

	test("throw when observed 'slice' value doesn't match selected 'useStore()' slice path", () => {
		expect(() => {
			renderHook(() => useStore(FooBar, "Bar.Qux"), {
				wrapper: StoreLayer,
			})
		}).toThrow(
			"Component rendered in wrong slice: 'Foo' does not match selected path 'Bar.Qux'",
		)
	})
})

describe("Slice Transitions", () => {
	const user = userEvent.setup()
	const observed = { name: "" }

	test("Components update during slice transitions", async () => {
		const MainComponent: FC = () => {
			const { slice$ } = useStore(FooBar)
			const currentSlice = useWatch(slice$)

			switch (currentSlice) {
				case "Bar.Qux":
					return <BarQuxComponent />
				default:
					return <FooComponent />
			}
		}

		const FooComponent: FC = () => {
			const { action } = useStore(FooBar, "Foo")
			return <button onClick={() => action.doThing("zed")} />
		}

		const BarQuxComponent: FC = () => {
			const { context } = useStore(FooBar, "Bar.Qux")
			const ctx = useSelect(context, $("name"))
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
				contextPeek$_foo: "initial value",
				foo: "initial value",
			}),
		)
	})
})

describe("Store.context", () => {
	test("useWatch hook provides access to context data", () => {
		const { result } = renderHook(
			() => {
				const { context } = useStore(FooBar, "Foo")
				return useWatch(context.foo$)
			},
			{ wrapper: StoreLayer },
		)

		expect(result.current).toBe("initial value")
	})

	test("Action handler set.context()", async () => {
		const { result } = renderHook(() => useStore(FooBar, "Foo"), {
			wrapper: StoreLayer,
		})

		const { slice$, context, action } = result.current
		expect($peek(context.foo$)).toBe("initial value")
		action.doNextThing("jux")
		await waitFor(() => {
			expect($peek(slice$)).toBe("Foo")
			expect($peek(context.foo$)).toBe("jux")
		})
	})
})
