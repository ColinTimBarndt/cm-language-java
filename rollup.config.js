import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/index.js",
				format: "es",
			},
			{
				file: "dist/index.cjs",
				format: "cjs",
			},
		],
		external: [
			/node_modules/,
		],
		plugins: [
			typescript(),
			nodeResolve(),
			terser(),
		],
	},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.d.ts",
			format: "es"
		},
		plugins: [
			dts(),
		],
	},
]