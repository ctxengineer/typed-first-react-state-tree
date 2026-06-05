import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		index: "src/entry.ts",
		use: "src/entry-use.ts",
	},
})
