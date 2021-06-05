import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.js",
				format: "es"
			},
			{
				file: "dist/index.cjs",
				format: "cjs"
			}
		],
		external: [
			/node_modules/
		],
		plugins: [
			typescript(),
			nodeResolve()
		]
	},
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.d.ts",
				format: "es"
			}
		],
		plugins: [
			dts()
		]
	}
]