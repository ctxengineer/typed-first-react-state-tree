# Typed First React State Tree

Proof-of-concept React state tree for type-driven UI state modeling, optimistic transitions, and strongly typed recovery paths.

<!-- toc:start -->
<div align="center">

[Usage Examples](#-usage)

</div>
<!-- toc:end -->

This repository is a public proof of concept. It is not intended to be installed from npm.

## Features

- Auto-generate hooks `useStore(Chat)`

- Path-based selectors return slice specific scoped context & action handlers  
  `const { context$, action } = useStore(Chat.slice("Generate.Stream"))`

- Fine-grain reactivity with observables  
  `usePick(context$, "newMessage", "list")`

- Exhaustive action reducers  
  `Action.when({ retry: ({ to }) => to.slice("Generate.Stream") })`

- Strongly-typed context-aware transitions  
  `to.slice("Generate.Error", {...contextTransitionDelta})`

- DX: Your type declarations flow into each component
  `import { Chat, useStore } from "@/lib/typed-first/use"`

- Built-in dependency injection through auto-generated `Layer` providers

## Describe UI Behavior in a Compact, Readable Structure

Example of defining app behavior using utility `type $`

```ts
import type { $ } from "@/lib/typed-first"

type Store = $.Store<{
  Compose: $.Slice<
    [
      $.Context<{ list: Array<Message> draft: string }>,
      $.Action<{ updateDraft: string sendMessage: void }>,
    ]
  >
  Generate: $.Slice<
    [
      $.Context<{
        list: Array<Message>
        newMessage: Message
        responseBuffer: string
      }>,
      $.SubSlice<{
        Stream: $.Slice<[$.OnEntry]>
        Error: $.Slice<[$.Action<{ retry: void }>]>
      }>,
    ]
  >
}>
```

Instead of piecing together state and behavior from scattered files, you get a comprehensive understanding of your application's flow without overloading your context window.

Each slice defines:

1. The guaranteed shape of `context$` data
2. When an `action` can mutate state

Less cognitive load → Architect new features without drowning in implementation details

## ✨ Every Component Binds to an Explicitly Typed Contract

Change how the UI flows & your IDE pinpoints the exact files that must be updated.

Because the entire UI is wired through these path-scoped contracts, any change in the model instantly ripples through your editor.

> Path-based selectors return slice specific scoped context & action handlers

```tsx
const { context$, action } = useStore(Chat.slice("Generate.Stream"))
/*    └─────┬─────────────────────────────────────────────┘
            │
            └─ context$  : { list: Message[] newMessage: Message responseBuffer: string }
               action    : {}  // "Stream" slice has no actions
*/
```

```tsx
const { context$, action } = useStore(Chat.slice("Generate.Error"))
/*    └──────┬─────────────────────────────────────────────┘
             │
             └─ context$: { list: Message[] newMessage: Message responseBuffer: string }
                action  : { retry(): void }
*/
```

By splitting app state into tagged slices, you enable bullet-proof runtime confidence and next-level dev ergonomics.

## ⚡Observable Fine-grain Reactivity

Under the hood, this proof of concept leverages the incredibly fast [Legend-State](https://github.com/LegendApp/legend).

This means you get the maintainability benefits global state through `React.useContext` without the downsides of wasteful re-renders on each state update.

## 📖 Usage

## `$` Type Utilities

The `$` namespace provides type utilities for defining your store.

```ts
import type { $ } from "@/lib/typed-first"
```

| $ Type Utility  | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| `$.Model<T, U>` | Resolved store model, optimized to flow all declared types into React components |
| `$.Store<T>`    | Structure for naming each slice & defining the state tree                        |
| `$.Slice<T>`    | Single store slice containing context, actions, and optional sub-slices          |
| `$.Context<T>`  | Shape of data available within a slice                                           |
| `$.Action<T>`   | Actions that can be dispatched from a slice                                      |
| `$.SubSlice<T>` | Nested slices that recursively inherit context & actions from parent             |
| `$.OnEntry`     | Marker indicating a slice executes logic when entered                            |
| `$.Promise<T>`  | Promises accessible via `Action.onEntry` handler                                 |
| `$.ForEach<T>`  | Shared facets applied across every slice in a model                              |

## Store Builder

Runtime utilities for creating and configuring a store.

```ts
import { Store } from "@/lib/typed-first"
```

| Store Method                                      | Description                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| `type<Model>()`                                   | Provides TypeScript inference for the store model                   |
| `type<T>().make(initial, layerService?, actions)` | Builds a useable store for generating React hooks                   |
| `initial(slicePath)`                              | Sets the initial slice that the store starts in                     |
| `layer(serviceMap)`                               | Provide services into components through the store hook             |
| `actions(...handlers)`                            | Exhaustively, builds the action reducer for each defined `$.Action` |

## Action Reducer

Utilities for building exhaustive action handlers that respond to user interactions and slice transitions.

```ts
import { Action } from "@/lib/typed-first"
```

| Action Builder                           | Description                                         |
| ---------------------------------------- | --------------------------------------------------- |
| `Action.when({ [action]: handler })`     | Handle specific actions using an object map         |
| `Action.onEntry({ [slice]: handler })`   | Execute side effects when entering slices           |
| `Action.exhaustive`                      | Required marker ensuring all actions are handled    |

### Action Handler Function

| Fn Param  | Description                                                |
| --------- | ---------------------------------------------------------- |
| `to`      | Builder for transitioning to other slices                  |
| `context$` | Observable context for the current slice                   |
| `payload` | Data passed from the component when dispatching the action |
| `slice`   | String value of current slice path                         |
| `layer`   | Object map of provided services                            |

```ts
Action.when({
  sendMessage: ({ to, payload }) => {
    return to.slice("Generate.Stream", { newMessage: payload })
  }
})
```

| onEntry Fn Param   | Description                                     |
| ------------------ | ----------------------------------------------- |
| ...                | Includes all standard params                    |
| `promise`          | Object map of promises                          |
| `async` (modifier) | Can await a promise created in a previous slice |

```ts
Action.onEntry({
  "DocumentUpload.Optimistic": async ({ to, promise }) => {
    const doc = await promise.processDocument
    return to.slice("DocumentUpload.Confirmed", { doc })
  }
})
```

#### Transition with `to.slice`

The `to` parameter provides strongly-typed utilities for transitioning between slices while maintaining context inheritance and type safety.

```ts
// ✅ Valid: newMessage is required for Generate.Stream
to.slice("Generate.Stream", { newMessage: "Hello", responseBuffer: "" })

// ❌ TypeScript Error: missing required newMessage property
to.slice("Generate.Stream", { responseBuffer: "" })
```

> [!caution] > `to.slice` Must be returned in order to be applied.

##### Context Transition Rules

When transitioning between slices, TypeScript automatically determines which context properties are required, optional, or inherited based on the type differences between source and destination slices.

| **Transition Type**     | **Source Context**          | **Target Context**              | **Required in `to.slice()`** |
| ----------------------- | --------------------------- | ------------------------------- | ---------------------------- |
| **Type Change**         | `{ foo: number }`           | `{ foo: string }`               | `{ foo: string }`            |
| **Property Added**      | `{ foo: number }`           | `{ foo: number bar: boolean }` | `{ bar: boolean }`           |
| **Required → Optional** | `{ foo: number }`           | `{ foo?: number }`              | Nothing required             |
| **Optional → Required** | `{ foo?: number }`          | `{ foo: number }`               | `{ foo: number }`            |
| **Type Narrowing**      | `{ foo: string \| number }` | `{ foo: string }`               | `{ foo: string }`            |
| **Type Widening**       | `{ foo: string }`           | `{ foo: string \| number }`     | Nothing required             |

##### Optional Context Properties

When transitioning to a slice where inherited properties become optional, you can explicitly override them using `withOptional`.

```tsx
// Current slice has { abc: string }
// Target slice has { abc?: string, xyz: boolean }

to.slice("TargetSlice", { xyz: true })
  // Optionally override inherited value
  .withOptional({ abc: "override" })
```

##### Fine-grain Optimistic UI

When transitioning to a slice defined to expect a promise using `$.Promise`, use `to.withPromise` to pass async operations that the target slice will await.

```ts
// Target slice expects: $.Promise<{ uploadResult: Promise<Document> }>

to.slice(
  "Upload.Optimistic",
  { uploadedAt: new Date() }, // if context required
  to.withPromise({
    uploadResult: api.upload(file),
  }),
)
```

The promise becomes available in the target slice's `onEntry` handler.

#### Dispatched Action Payload

Actions receive typed payloads from components based on your `$.Action` declarations.

```ts
/*    
  $.Action<{
    send: { text: string attachments?: File[] }
  }>
*/

Action.when({
  send: ({ payload }) => {
    // payload: { text: string attachments?: File[] }
    const newMessage = createMessage(payload.text, payload.attachments)
  }
})
```

#### Update Slice Context

Use `$set` within action handlers to update the current slice's context without transitioning to a different slice.

```ts
Action.when({
  updateDraft: ({ context$, payload }) =>
    $set(context$.draft, payload)
})
```

> [!caution] > `$set` Must be returned in order to be applied.

#### Access Layer Service Dependencies

Inject services through `Store.layer` to access them in any action handler via the `layer` parameter.

```ts
/*    
  Store.layer({
    analytics: new Analytics(),
  })
*/

Action.when({
  send: ({ layer }) => {
    // Access services in action handlers
    layer.analytics.track("message_sent")
  }
})
```

#### Async State Resolution

When an `onEntry` handler is marked async, it can await promises created during slice transitions, enabling powerful async state coordination.

```ts
/*    
  $.Promise<{
    chargeCard: ReturnType<typeof chargeCard>
  }>
*/

Action.onEntry({
  "Payment.Processing": async ({ promise }) => {
    const result = await promise.chargeCard
  }
})
```

## Usage in React

### Export Stores

The `Store.type().make` & `Layer.makeProvider` functions transforms your strongly-typed store definitions into a complete React integration layer.

```ts app/state-tree.ts
export { Chat, ChatLayer } from "./chat/store"
export { Auth, AuthLayer } from "./auth/store"
```

### Context Layer Provider

Every store automatically generates a corresponding `Layer` provider component that initializes the store context and manages the state lifecycle for its component tree.

```tsx
<ChatLayer context={{ list: [], draft: "" }}>
  <ThreadView />
</ChatLayer>
```

The `Layer` provider serves as the dependency injection boundary for your store, ensuring that all child components have access to the typed context and actions defined in your model.

#### Store Layer Props

The `Layer` component accepts props based on your store's type definitions, with TypeScript ensuring you provide all required initial values & promises.

| Layer Prop | Description                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `context`  | Initial values for the store's context. Optional properties can be omitted or explicitly set.                                                                                                    |
| `promise`  | When your store includes `$.Promise` declarations. Accepts an object mapping promise keys to actual Promise instances that will be available in `onEntry` handlers for async state coordination. |

### `useStore` Hook

The `useStore` hook is your primary interface for accessing typed context and actions within components. This auto-generated hook provides slice-specific context access with compile-time guarantees about what data and actions are available.

```tsx
// Access any slice
const { slice$, context$, action, layer } = useStore(Chat)

// Scope to a specific slice path
const { context$, action } = useStore(Chat.slice("Generate.Stream"))

// Scope to any sub slice path
const { context$, action } = useStore(Chat.slice("Generate.*"))
```

#### Returned Properties

| Property  | Description                        |
| --------- | ---------------------------------- |
| `slice$`  | Current slice path as observable   |
| `context$` | Slice-specific data as observables |
| `action`  | Available actions for the slice    |
| `layer`   | Injected service dependencies      |

#### Runtime Slice Validation

The hook includes runtime validation to ensure components are rendered within the correct slice. This catches routing errors early in development:

```tsx
// If current slice is "Compose" but component expects "Generate.Stream"
const StreamView: React.FC = () => {
  const { context$ } = useStore(Chat.slice("Generate.Stream"))
  // 🚨 Throws: Component rendered in wrong slice: 'Compose' does not match selected path 'Generate.Stream'
}
```

### `match.useSlice` Helper

For complex view trees that render different components based on the active slice, `match.useSlice` provides a declarative alternative to `switch` statements while preserving type safety for slice selectors.

```tsx
import { match, when } from "@/lib/typed-first/use"

const ThreadView: React.FC = () => {
  return match.useSlice(
    Chat,
    when("Generate.Stream", () => <StreamView />),
    when("Generate.Error", () => <ErrorView />),
    match.else(() => <ComposeView />),
  )
}
```

Each `when()` clause is checked against the store's valid slice paths at compile time. `match.else()` is optional and renders only when no previous clause matches. If you omit `match.else()` and no case matches, `match.useSlice` returns `null`.

### `useWatch` Hook

The `useWatch` hook bridges the gap between observable state and React's rendering lifecycle. When you pass an observable to `useWatch`, it automatically subscribes to changes and triggers component re-renders only when that specific value updates.

```tsx
import { useWatch } from "@/lib/typed-first/use"
```

#### Observable Syntax

The `context$` object contains observable handles for each context property.

```tsx
const { slice$, context$ } = useStore(Chat)

const currentSlice = useWatch(slice$)
const draftMessage = useWatch(context$.draft)
```

### `usePick` vs `useWatch`

Both `usePick` and `useWatch` enable fine-grained reactivity, but they serve different ergonomic needs when building components. Understanding when to use each pattern will help you write cleaner, more maintainable React components.

#### **The `usePick` Advantage: Bulk Property Access**

When your component needs multiple context properties, `usePick` dramatically reduces boilerplate by unwrapping all selected observables in a single declaration.

```tsx
// ❌ Before: Verbose useWatch for each property
const { context$ } = useStore(Chat.slice("Generate.Error"))

const errorMsg = useWatch(context$.errorMsg)
const responseBuffer = useWatch(context$.responseBuffer)
const retryCount = useWatch(context$.retryCount)
const lastAttempt = useWatch(context$.lastAttempt)
const errorCode = useWatch(context$.errorCode)
const errorStack = useWatch(context$.errorStack)
const userMessage = useWatch(context$.userMessage)
const debugInfo = useWatch(context$.debugInfo)
const timestamp = useWatch(context$.timestamp)
const sessionId = useWatch(context$.sessionId)

// ✅ After: Clean, maintainable with usePick
const { context$ } = useStore(Chat.slice("Generate.Error"))

const ctx = usePick(
  context$,
  "errorMsg",
  "responseBuffer",
  "retryCount",
  "lastAttempt",
  "errorCode",
  "errorStack",
  "userMessage",
  "debugInfo",
  "timestamp",
  "sessionId",
)

// All selected properties available on ctx object
return (
  <ErrorReport>
    <h2>
      Error {ctx.errorCode}: {ctx.errorMsg}
    </h2>
    <p>
      Attempt {ctx.retryCount} at {ctx.lastAttempt}
    </p>
    <details>
      <summary>Debug Info (Session: {ctx.sessionId})</summary>
      <pre>{ctx.errorStack}</pre>
      <code>{JSON.stringify(ctx.debugInfo, null, 2)}</code>
    </details>
    <output>{ctx.responseBuffer}</output>
  </ErrorReport>
)
```

`usePick` makes it easy to extend and refactor components.

#### **When to Use `useWatch`: Nested Property Access**

While `usePick` excels at bulk property selection, `useWatch` shines when you just need to access one property or want to declare as it's own variable.

```tsx
const name = useWatch(context$.profile.firstName)
```
