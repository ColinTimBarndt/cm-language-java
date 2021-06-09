import { Traverser, TraverserFunction, TraverserError, syntaxError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link traverseField}.
 */
export interface FieldTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Modifiers for this declaration.
	 * @see {@link traverseModifiers}
	 */
	modifiers?: TraverserFunction<D>;
	/**
	 * Type of this field. Can be called multiple times for multiple fields.
	 * @see {@link traverseUnannotatedType}
	 */
	type?: TraverserFunction<D>;
	/**
	 * Declarator for this field. Can be called multiple times for multiple fields.
	 * @see {@link traverseVariableDeclarator}
	 */
	declarator?: TraverserFunction<D>;
};
/**
 * Traverses a field.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L475)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseField: <D>(traverser: FieldTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "FieldDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	if (syntaxError(traverser, cursor, data)) return;

	if (cursor.node.name === "Modifiers") {
		traverser.modifiers?.(cursor, data);
		cursor.nextSibling();
		if (syntaxError(traverser, cursor, data)) return;
	}

	traverser.type?.(cursor, data);

	cursor.nextSibling();
	do {
		if (syntaxError(traverser, cursor, data)) return;
		traverser.declarator?.(cursor, data);
	} while (cursor.nextSibling() && cursor.node.name !== ";")

	cursor.parent();
}
export const traverseConstant = traverseField;

/**
 * Interface for accepting lezer-nodes when using {@link traverseVariableDeclarator}.
 * 
 * Note that {@link VariableDeclaratorTraverser.initializer | initializer} and
 * {@link VariableDeclaratorTraverser.noInitializer | noInitializer} can be
 * called multiple times if multiple variables are declared at once.
 * 
 * @see {@link traverseField}
 * 
 * @example
 * ```java
 * public final int[] array1, array2 = {1, 2, 3}, array3;
 * ```
 */
export interface VariableDeclaratorTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Name of this variable.
	 * @see {@link traverseModifiers}
	 */
	name?: TraverserFunction<D>;
	/**
	 * Dimensions of this variable, called for every `[]`.
	 * @see {@link traverseDimension}
	 */
	dimension?: TraverserFunction<D>;
	/**
	 * Initializer of this variable.
	 * @see {@link traverseVariableInitializer}
	 */
	initializer?: TraverserFunction<D>;
	/**
	 * Called if there is no initializer for this variable.
	 */
	noInitializer?: ConsumerFunction<void, D>;
};
/**
 * Traverses a variable declarator.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L525)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseVariableDeclarator: <D>(traverser: VariableDeclaratorTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "VariableDeclarator", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	if (syntaxError(traverser, cursor, data)) return;

	traverser.name?.(cursor, data);
	
	if (cursor.nextSibling()) {
			if (traverser.dimension)
			while (cursor.node.name === "Dimension") {
				traverser.dimension(cursor, data);
				if (!cursor.nextSibling()) break;
			}
		else while (cursor.node.name === "Dimension" && cursor.nextSibling());
		if (syntaxError(traverser, cursor, data)) return;

		if (traverser.initializer && cursor.node.name === "=") {
			cursor.nextSibling();
			if (syntaxError(traverser, cursor, data)) return;
			traverser.initializer(cursor, data);
		}
	}

	cursor.parent();
}