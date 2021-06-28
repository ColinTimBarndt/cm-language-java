import { javaLanguage } from "@codemirror/lang-java";
import { Tree, TreeCursor } from "lezer";
import { traverser as traverser } from "../src/index";
import code from "./Simple.java";

const parsed: Tree = javaLanguage.parseString(code);

const logVisit = (prefix: string) => (cursor: TreeCursor) =>
	console.log(prefix + ": " + cursor.node + "");
const logValue = (prefix: string) => (cursor: TreeCursor) =>
	console.log(prefix + ": " + code.substring(cursor.from, cursor.to));


traverser.traverseDeclarations<void>({
	package: logVisit("package"),
	import: traverser.traverseImport({
		name: traverser.traverseName({
			identifier: logValue("import.identifier"),
			path: logValue("import.path"),
		}),
	}),
	class: traverser.traverseClass({
		modifiers: traverser.traverseModifiers({
			modifier: (m) => console.log("modifier:", m),
			annotation: traverser.traverseAnnotation({
				name: logValue("annotation name"),
				arguments: logVisit("annotation args"),
			}),
		}),
		name: logValue("name"),
		body: traverser.traverseClassBody({
			field: logVisit("field"),
			method: traverser.traverseMethod({
				methodModifiers: traverser.traverseModifiers({
					modifier: (m) => console.log("modifier:", m),
					annotation: traverser.traverseAnnotation({
						name: logValue("method annotation name"),
						arguments: logVisit("method annotation args"),
					}),
				}),
				name: logValue("method name"),
				returnType: logValue("returns"),
			}),
			classConstructor: logValue("constructor"),
		}),
	}),
	$error: (err) => console.log("error:", err),
})(parsed.cursor(0));
