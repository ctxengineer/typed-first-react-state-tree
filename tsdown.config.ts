import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		index: "src/entry.ts",
		use: "src/entry-use.ts",
		hooks: "src/entry-hooks.ts",
	},
})
