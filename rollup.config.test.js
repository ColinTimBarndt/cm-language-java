import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { string } from "rollup-plugin-string";
import multi from '@rollup/plugin-multi-entry';

export default [
	{
		input: "tests/**/*.test.ts",
		output: [
			{
				file: "tests/dist/tests.cjs",
				format: "cjs",
				sourcemap: true,
			},
		],
		external: [
			/node_modules/,
		],
		plugins: [
			string({
				include: ["**/*.java"]
			}),
			typescript(),
			nodeResolve(),
			multi(),
		],
	},
];