import { javaLanguage } from "@codemirror/lang-java";
import { Tree, TreeCursor } from "lezer";
import * as visitor from "../src/visit/visitor";
//@ts-ignore
import code from "./Simple.java";

const parsed: Tree = javaLanguage.parseString(code);

const logVisit = (prefix: string) => (cursor: TreeCursor) =>
	console.log(prefix + ": " + cursor.node + "");
const logValue = (prefix: string) => (cursor: TreeCursor) =>
	console.log(prefix + ": " + code.substring(cursor.from, cursor.to));


let errs: string[] = [];
visitor.visitDeclarations<string>({
	package: logVisit("package"),
	class: visitor.visitClass({
		modifiers: visitor.visitModifiers({
			modifier: (m) => console.log("modifier:", m),
			annotation: visitor.visitAnnotation({
				name: logValue("annotation name"),
				arguments: logVisit("annotation args"),
			}),
		}),
		name: logValue("name"),
		body: visitor.visitClassBody({
			field: logVisit("field"),
			method: visitor.visitMethod({
				methodModifiers: visitor.visitModifiers({
					modifier: (m) => console.log("modifier:", m),
					annotation: visitor.visitAnnotation({
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
})(parsed.cursor(0), errs);
