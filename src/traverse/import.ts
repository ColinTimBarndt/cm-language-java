import { Traverser, TraverserFunction, TraverserError, syntaxError, UnexpectedNodeError, ConsumerFunction, syntaxErrorInline } from "./helpers";
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
	 * @see {@link traverseName}
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
export const traverseImport: <D>(traverser: ImportTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
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
			default:
				if (syntaxError(traverser, cursor, data)) return;
				throw new UnexpectedNodeError(cursor.node);
		}
	} while (cursor.nextSibling())
	cursor.parent();
};

/**
 * Interface for accepting lezer-nodes when using {@link traverseName}.
 * @see {@link https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html | Java Documentation}
 */
export interface NameTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Called for every item of the name's path.
	 * @example
	 * ```java
	 * // Called for: "java", "lang"
	 * import java.lang.String;
	 * ```
	 */
	path?: TraverserFunction<D>;
	/**
	 * Called for the last identifier of the path.
	 */
	identifier: TraverserFunction<D>;
}
/**
 * Traverses an import declaration.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L466)
 * @todo Unit tests
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseName: <D>(traverser: NameTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	if (cursor.node.name === "Identifier") {
		traverser.identifier(cursor, data);
		return;
	}
	if (traverser.path) {
		cursor.firstChild();
		if (syntaxError(traverser, cursor, data)) return;
		let depth = 0;
		while (cursor.node.name !== "Identifier") {
			assert.equals(cursor.node.name, "ScopedIdentifier", () => "Unexpected node: " + cursor.node.name);
			cursor.firstChild();
			depth++;
			if (syntaxErrorInline(traverser, cursor, data)) break;
		}
		while (depth--) {
			traverser.path!(cursor, data);
			cursor.nextSibling(); // "."
			Error: {
				if (syntaxErrorInline(traverser, cursor, data)) break Error;
				cursor.nextSibling();
				if (syntaxErrorInline(traverser, cursor, data)) break Error;
				traverser.path!(cursor, data);
			}
			cursor.parent();
		}
		cursor.nextSibling(); // "."
		if (syntaxError(traverser, cursor, data)) return;
		cursor.nextSibling();
		if (syntaxError(traverser, cursor, data)) return;
		traverser.identifier(cursor, data);
		cursor.parent();
	} else {
		// Shortcut
		assert.equals(cursor.node.name, "ScopedIdentifier", () => "Unexpected node: " + cursor.node.name);
		cursor.lastChild();
		traverser.identifier(cursor, data);
		cursor.parent();
	}
};