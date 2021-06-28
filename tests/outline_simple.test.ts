import { javaLanguage } from "@codemirror/lang-java";
import { Tree, TreeCursor } from "lezer";
import { outliner } from "../src/index";
//@ts-ignore
import code from "./Simple.java";

const parsed: Tree = javaLanguage.parseString(code);

//const outline = new outliner.Outline(parsed, code);

console.log(parsed);
