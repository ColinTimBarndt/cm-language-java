import { Traverser, TraverserFunction as TraverserFunction, TraverserError as TraverserError, syntaxError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link traverseMethod}.
 */
export interface MethodTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Modifiers of this method.
	 * @see {@link traverseModifiers}
	 */
	methodModifiers?: TraverserFunction<D>;
	/**
	 * Type parameters for this method.
	 * @see {@link traverseTypeParameters}
	 */
	typeParameters?: TraverserFunction<D>;
	/**
	 * Annotation of the return type.
	 * @see {@link traverseAnnotation}
	 */
	returnAnnotation?: TraverserFunction<D>;
	/**
	 * Return type of this function.
	 * @see {@link traverseType}
	 */
	returnType?: TraverserFunction<D>;
	/**
	 * Name of the method.
	 */
	name?: TraverserFunction<D>;
	/**
	 * Method parameters.
	 * @see {@link traverseFormalParameters}
	 */
	parameters?: TraverserFunction<D>;
	/**
	 * Return type array dimensions after the parameter list. Called for every
	 * `[]`.
	 * @see {@link traverseDimension}
	 * @example
	 * ```java
	 * int array()[] {
	 *   return new int[]{1, 2};
	 * }
	 * ```
	 */
	extraReturnDim?: TraverserFunction<D>;
	/**
	 * A `throws` declaration.
	 */
	throws?: TraverserFunction<D>;
	/**
	 * The method body.
	 * @see {@link traverseBlock}
	 */
	body?: TraverserFunction<D>;
	/**
	 * Called if there is no method body.
	 */
	noBody?: ConsumerFunction<void, D>;
}
/**
 * Traverses a method.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L621)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseMethod: <D>(traverser: MethodTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "MethodDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	if (cursor.node.name === "Modifiers") {
		traverser.methodModifiers?.(cursor, data);
		cursor.nextSibling();
	}
	TypeParams: if (cursor.node.name === "TypeParameters") {
		traverser.typeParameters?.(cursor, data);
		const hasRA = traverser.returnAnnotation !== undefined;
		while (cursor.nextSibling()) {
			switch (cursor.node.name as string) {
				case "Annotation":
				case "MarkerAnnotation":
					if (hasRA)
						traverser.returnAnnotation!(cursor, data);
					continue;
				default:
					break TypeParams;
			}
		}
	}

	if (syntaxError(traverser, cursor, data)) return;
	traverser.returnType?.(cursor, data);
	cursor.nextSibling();

	if (syntaxError(traverser, cursor, data)) return;
	traverser.name?.(cursor, data);
	cursor.nextSibling();
	
	if (syntaxError(traverser, cursor, data)) return;
	traverser.parameters?.(cursor, data);
	
	{
		const hasP = traverser.parameters !== undefined;
		while (cursor.nextSibling() && cursor.node.name === "Dimension") {
			if (hasP)
				traverser.extraReturnDim!(cursor, data);
		}
	}

	if (syntaxError(traverser, cursor, data)) return;
	if (cursor.node.name === "Throws") {
		traverser.throws?.(cursor, data);
		cursor.nextSibling();
		if (syntaxError(traverser, cursor, data)) return;
	}

	switch (cursor.node.name) {
		case ";":
			traverser.noBody?.(undefined, data);
			break;
		case "Block":
			traverser.body?.(cursor, data);
			break;
	}
	
	cursor.parent();
}