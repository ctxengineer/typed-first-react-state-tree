/**
 *
 * @vitest-environment happy-dom
 *
 **/

import React from "react"
import { render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"
import { Action, Layer, Store, $peek } from "@/lib/typed-first"
import type { $ } from "@/lib/typed-first"
import { match, useStore, useWatch, when } from "@/lib/typed-first/use"

type Submission = { name: string; email: string }

type FormModel = $.Model<
	$.Store<{
		Draft: $.Slice<
			[$.Context<{ submissions: Submission[] }>, $.Action<{ submit: void }>]
		>
		Success: $.Slice<
			[
				$.Context<{ submissions: Submission[]; confirmation: string }>,
				$.Action<{ addAnother: void }>,
			]
		>
	}>,
	"Draft"
>

const formServices = {
	formRef: () => React.createRef<HTMLFormElement>(),
}

const FormStore = Store.type<FormModel>().make(
	Store.initial("Draft"),
	Store.layer(formServices),
	Store.actions(
		Action.when({
			submit: ({ context$, to, layer }) => {
				const formEl = layer.formRef.current
				if (!formEl) return

				const formData = new FormData(formEl)
				const name = String(formData.get("name") ?? "").trim()
				const email = String(formData.get("email") ?? "").trim()

				if (!name || !email) return

				const next = [...$peek(context$.submissions), { name, email }]
				layer.formRef.current?.reset()

				return to
					.slice("Success", {
						confirmation: `Thanks ${name}!`,
					})
					.withOptional({ submissions: next })
			},
			addAnother: ({ to, context$ }) => {
				return to
					.slice("Draft")
					.withOptional({ submissions: $peek(context$.submissions) })
			},
		}),
		Action.exhaustive,
	),
)

const FormLayer = Layer.makeProvider(FormStore)

const FormProviders: React.FC<{ children?: React.ReactNode }> = (props) => (
	<FormLayer context={{ submissions: [] }}>{props.children}</FormLayer>
)

const SignUpForm: React.FC = () => {
	const draftStore = useStore(FormStore.slice("Draft"))
	const { context$, action, layer } = draftStore
	const submissionCount = useWatch(context$.submissions).length
	const formRef = layer.formRef

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		action.submit()
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			<span data-testid="submission-count">{submissionCount}</span>
			<label>
				Name
				<input name="name" data-testid="name" defaultValue="" />
			</label>
			<label>
				Email
				<input name="email" data-testid="email" defaultValue="" />
			</label>
			<button data-testid="submit" type="submit">
				Join
			</button>
		</form>
	)
}

const SuccessView: React.FC = () => {
	const { context$, action } = useStore(FormStore.slice("Success"))
	const confirmation = useWatch(context$.confirmation)
	const submissions = useWatch(context$.submissions)

	return (
		<div>
			<span data-testid="confirmation">{confirmation}</span>
			<ul data-testid="submission-list">
				{submissions.map((entry) => (
					<li key={entry.email}>{`${entry.name} <${entry.email}>`}</li>
				))}
			</ul>
			<button data-testid="add-another" onClick={() => action.addAnother()}>
				Add another
			</button>
		</div>
	)
}

const FormView: React.FC = () =>
	match.useSlice(
		FormStore,
		when("Draft", () => <SignUpForm />),
		match.else(() => <SuccessView />),
	)

describe("uncontrolled form via useRef", () => {
	test("submits data from uncontrolled inputs and resets the form", async () => {
		const user = userEvent.setup()
		const { getByTestId, queryByTestId } = render(<FormView />, {
			wrapper: FormProviders,
		})

		expect(getByTestId("submission-count").textContent).toBe("0")

		await user.type(getByTestId("name"), "Ada Lovelace")
		await user.type(getByTestId("email"), "ada@example.com")

		await user.click(getByTestId("submit"))

		await waitFor(() =>
			expect(getByTestId("confirmation").textContent).toContain("Ada"),
		)

		const saved = Array.from(
			getByTestId("submission-list").querySelectorAll("li"),
		).map((item) => item.textContent)
		expect(saved).toEqual(["Ada Lovelace <ada@example.com>"])

		await user.click(getByTestId("add-another"))

		await waitFor(() =>
			expect(getByTestId("submission-count").textContent).toBe("1"),
		)
		expect(queryByTestId("confirmation")).toBeNull()
		expect((getByTestId("name") as HTMLInputElement).value).toBe("")
		expect((getByTestId("email") as HTMLInputElement).value).toBe("")
	})
})
