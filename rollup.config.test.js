import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { string } from "rollup-plugin-string";
import { readdir } from "fs";
import multi from '@rollup/plugin-multi-entry';

export default new Promise((resolve, reject) => {
	readdir("tests", {}, (err, files) => {
		if (err) return reject(err);
		resolve([
			{
				input: files
					.filter(f => f.endsWith(".ts"))
					.map(f => `tests/${f}`),
				output: [
					{
						file: "tests/dist/tests.cjs",
						format: "cjs",
						sourcemap: true,
					},
				],
				inlineDynamicImports: true,
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
		]);
	});
});