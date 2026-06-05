/**
 *
 * @vitest-environment happy-dom
 *
 **/

import React from "react"
import { render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test } from "vitest"
import { Action, Layer, Store, $peek, $set } from "@/lib/typed-first"
import type { $ } from "@/lib/typed-first"
import { useStore, useWatch, match, when } from "@/lib/typed-first/use"

type Theme = "light" | "dark" | "system"
type User = { id: string; name: string }
type TodoItem = { id: string; text: string; completed: boolean }

const themeOrder: Theme[] = ["system", "light", "dark"]
let nextTodoId = 0

type ForEach = $.ForEach<
	[$.Context<{ theme: Theme }>, $.Action<{ setTheme: Theme; cycleTheme: void }>]
>

type AppModel = $.Model<
	$.Store<{
		Visitor: $.Slice<
			[$.Context<{ message: string }>, $.Action<{ startSession: User }>]
		>
		Session: $.Slice<
			[
				$.Context<{ user: User; sessionStartedAt: number }>,
				$.Action<{ signOut: void }>,
			]
		>
	}>,
	"Visitor",
	[ForEach]
>

const AppStore = Store.type<AppModel>().make(
	Store.initial("Visitor"),
	Store.actions(
		Action.when({
			setTheme: ({ context$, payload }) => $set(context$.theme, payload),
			cycleTheme: ({ context$ }) => {
				const current = $peek(context$.theme)
				const next =
					themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length]
				return $set(context$.theme, next)
			},
			startSession: ({ context$, to, payload }) =>
				to.slice("Session", {
					user: payload,
					sessionStartedAt: Date.now(),
				}),
			signOut: ({ context$, to }) =>
				to.slice("Visitor", {
					message: "Pick up where you left off",
				}),
		}),
		Action.exhaustive,
	),
)

const AppLayer = Layer.makeProvider(AppStore)

type TodoModel = $.Model<
	$.Store<{
		List: $.Slice<
			[
				$.Context<{ items: TodoItem[] }>,
				$.Action<{ add: string; toggle: string; reset: void }>,
			]
		>
	}>,
	"List"
>

const TodoStore = Store.type<TodoModel>().make(
	Store.initial("List"),
	Store.actions(
		Action.when({
			add: ({ context$, payload }) => {
				const id = `todo-${++nextTodoId}`
				const current = $peek(context$.items)
				const next: TodoItem[] = [
					...current,
					{ id, text: payload, completed: false },
				]
				return $set(context$.items, next)
			},
			toggle: ({ context$, payload }) => {
				const next = $peek(context$.items).map((todo) =>
					todo.id === payload ? { ...todo, completed: !todo.completed } : todo,
				)
				return $set(context$.items, next)
			},
			reset: ({ context$ }) => $set(context$.items, []),
		}),
		Action.exhaustive,
	),
)

const TodoLayer = Layer.makeProvider(TodoStore)

const AppProviders: React.FC<{ children?: React.ReactNode }> = (props) => (
	<AppLayer
		context={{ theme: "system", message: "Sign in to sync your todos" }}
	>
		<TodoLayer context={{ items: [] }}>{props.children}</TodoLayer>
	</AppLayer>
)

const VisitorView: React.FC = () => {
	const { context$, action } = useStore(AppStore.slice("Visitor"))
	const message = useWatch(context$.message)
	return (
		<div>
			<span data-testid="visitor-message">{message}</span>
			<button
				data-testid="sign-in"
				onClick={() => action.startSession({ id: "u1", name: "Ada Lovelace" })}
			>
				Enter Session
			</button>
		</div>
	)
}

const useSessionControls = () => {
	const { context$, action } = useStore(AppStore.slice("Session"))
	const user = useWatch(context$.user)
	return {
		user,
		cycleTheme: action.cycleTheme,
		signOut: action.signOut,
	}
}

const SessionTodoList: React.FC = () => {
	const { user, cycleTheme, signOut } = useSessionControls()
	const { context$: todoContext$, action: todoAction } = useStore(
		TodoStore.slice("List"),
	)
	const todos = useWatch(todoContext$.items)
	const primary = todos[0]

	return (
		<div>
			<span data-testid="user-name">{user.name}</span>
			<span data-testid="todo-count">{todos.length}</span>
			<span data-testid="first-todo">
				{primary
					? `${primary.text}:${primary.completed ? "done" : "pending"}`
					: "none"}
			</span>
			<button
				data-testid="add-todo"
				onClick={() => todoAction.add(`Task ${todos.length + 1}`)}
			>
				Add Todo
			</button>
			<button
				data-testid="toggle-first"
				disabled={!primary}
				onClick={() => primary && todoAction.toggle(primary.id)}
			>
				Toggle First
			</button>
			<button data-testid="cycle-theme" onClick={cycleTheme}>
				Cycle Theme
			</button>
			<button
				data-testid="sign-out"
				onClick={() => {
					todoAction.reset()
					signOut()
				}}
			>
				Sign Out
			</button>
		</div>
	)
}

const SessionView: React.FC = () => {
	return match.useSlice(
		TodoStore,
		when("List", () => <SessionTodoList />),
		match.exhaustive,
	)
}

const AuthContent: React.FC = () =>
	match.useSlice(
		AppStore,
		when("Visitor", () => <VisitorView />),
		when("Session", () => <SessionView />),
		match.exhaustive,
	)

const AppView: React.FC = () => {
	const { context$ } = useStore(AppStore)
	const theme = useWatch(context$.theme)
	return (
		<div>
			<span data-testid="theme">{theme}</span>
			<AuthContent />
		</div>
	)
}

describe("Stacked store layers", () => {
	beforeEach(() => {
		nextTodoId = 0
	})

	test("coordinates state across theme, auth, and todo layers", async () => {
		const user = userEvent.setup()
		const { getByTestId } = render(<AppView />, {
			wrapper: AppProviders,
		})

		expect(getByTestId("theme").textContent).toBe("system")
		expect(getByTestId("visitor-message").textContent).toContain("Sign in")

		await user.click(getByTestId("sign-in"))

		await waitFor(() =>
			expect(getByTestId("user-name").textContent).toBe("Ada Lovelace"),
		)
		expect(getByTestId("todo-count").textContent).toBe("0")
		expect(getByTestId("first-todo").textContent).toBe("none")

		await user.click(getByTestId("add-todo"))
		await waitFor(() => expect(getByTestId("todo-count").textContent).toBe("1"))
		expect(getByTestId("first-todo").textContent).toBe("Task 1:pending")

		await user.click(getByTestId("toggle-first"))
		await waitFor(() =>
			expect(getByTestId("first-todo").textContent).toBe("Task 1:done"),
		)

		await user.click(getByTestId("cycle-theme"))
		await waitFor(() => expect(getByTestId("theme").textContent).toBe("light"))

		await user.click(getByTestId("sign-out"))
		await waitFor(() =>
			expect(getByTestId("visitor-message").textContent).toContain("Pick up"),
		)

		await user.click(getByTestId("sign-in"))
		await waitFor(() =>
			expect(getByTestId("user-name").textContent).toBe("Ada Lovelace"),
		)
		expect(getByTestId("todo-count").textContent).toBe("0")
		expect(getByTestId("first-todo").textContent).toBe("none")
		expect(getByTestId("theme").textContent).toBe("light")
	})
})
