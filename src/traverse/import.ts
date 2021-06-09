import { Traverser, TraverserFunction, TraverserError, syntaxError, UnexpectedNodeError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link traverseImport}.
 * @see {@link https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html | Java Documentation}
 */
export interface ImportTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Called if the import is static.
	 */
	static?: ConsumerFunction<void, D>;
	/**
	 * Identifier of the import.
	 * @see {@link traverseIdentifier}
	 */
	name?: TraverserFunction<D>;
	/**
	 * Called if all members of a namespace should be imported.
	 */
	wildcard?: ConsumerFunction<void, D>;
}
/**
 * Traverses an import declaration.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L371)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseInterface: <D>(traverser: ImportTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "ImportDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	do {
		switch (cursor.node.name) {
			case "import":
			case ".":
			case ";":
				continue;
			case "static":
				traverser.static?.(undefined, data);
				continue;
			case "Identifier":
			case "ScopedIdentifier":
				traverser.name?.(cursor, data);
				continue;
			case "Asterisk":
				traverser.wildcard?.(undefined, data);
				continue;
		}
	} while (cursor.nextSibling())
	cursor.parent();
}