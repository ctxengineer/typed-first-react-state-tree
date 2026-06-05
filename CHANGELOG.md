# Changelog

## 0.2.0

This release repositions the project as a public proof of concept under `ctxengineer/typed-first-react-state-tree`. It is not intended to be published to npm.

### Changed

- Renamed the package metadata to `typed-first-react-state-tree`.
- Updated repository, issue, and homepage links to `https://github.com/ctxengineer/typed-first-react-state-tree`.
- Replaced public documentation imports from the previous npm package name with local proof-of-concept imports from `@/lib/typed-first` and `@/lib/typed-first/use`.
- Replaced `useStore(Store, "Slice.Path")` usage with `useStore(Store.slice("Slice.Path"))`.
- Replaced `context` return examples with `context$`, using direct observable keys such as `context$.draft`.
- Replaced `useSelect(context, $("a", "b"))` with `usePick(context$, "a", "b")`.
- Replaced individual action declarations with mapped action declarations, such as `Action.when({ submit: handler })` and `Action.onEntry({ Draft: handler })`.
- Added `match.useSlice`, `when`, `match.else`, and `match.exhaustive` examples for slice-driven rendering.
- Documented `$.ForEach` support for shared slice facets across a model.

### Removed

- Removed npm install guidance from the README.
- Removed the stale external demo link.
- Removed publish-oriented npm metadata and scripts.
