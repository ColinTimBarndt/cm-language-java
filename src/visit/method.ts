import { Visitor, VisitorFunction, VisitError, syntaxError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link visitMethod}.
 */
export interface MethodVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * Modifiers of this method.
	 * @see {@link visitModifiers}
	 */
	methodModifiers?: VisitorFunction<E>;
	/**
	 * Type parameters for this method.
	 * @see {@link visitTypeParameters}
	 */
	typeParameters?: VisitorFunction<E>;
	/**
	 * Annotation of the return type.
	 * @see {@link visitAnnotation}
	 */
	returnAnnotation?: VisitorFunction<E>;
	/**
	 * Return type of this function.
	 * @see {@link visitType}
	 */
	returnType?: VisitorFunction<E>;
	/**
	 * Name of the method.
	 */
	name?: VisitorFunction<E>;
	/**
	 * Method parameters.
	 * @see {@link visitFormalParameters}
	 */
	parameters?: VisitorFunction<E>;
	/**
	 * Return type array dimensions after the parameter list.
	 * @example
	 * ```java
	 * int array()[] {
	 *   return new int[]{1, 2};
	 * }
	 * ```
	 */
	extraReturnDim?: VisitorFunction<E>;
	/**
	 * A `throws` declaration.
	 */
	throws?: VisitorFunction<E>;
	/**
	 * The method body.
	 * @see {@link visitBlock}
	 */
	body?: VisitorFunction<E>;
	/**
	 * Called if there is no method body.
	 */
	noBody?: ConsumerFunction<void, E>;
}
/**
 * Visits a method.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L621)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitMethod: <E>(visitor: MethodVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	assert.equals(cursor.node.name, "MethodDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	if (cursor.node.name === "Modifiers") {
		visitor.methodModifiers?.(cursor, errors);
		cursor.nextSibling();
	}
	TypeParams: if (cursor.node.name === "TypeParameters") {
		visitor.typeParameters?.(cursor, errors);
		const hasRA = visitor.returnAnnotation !== undefined;
		while (cursor.nextSibling()) {
			switch (cursor.node.name as string) {
				case "Annotation":
				case "MarkerAnnotation":
					if (hasRA)
						visitor.returnAnnotation!(cursor, errors);
					continue;
				default:
					break TypeParams;
			}
		}
	}

	if (syntaxError(visitor, cursor, errors)) return;
	visitor.returnType?.(cursor, errors);
	cursor.nextSibling();

	if (syntaxError(visitor, cursor, errors)) return;
	visitor.name?.(cursor, errors);
	cursor.nextSibling();
	
	if (syntaxError(visitor, cursor, errors)) return;
	visitor.parameters?.(cursor, errors);
	
	{
		const hasP = visitor.parameters !== undefined;
		while (cursor.nextSibling() && cursor.node.name === "Dimension") {
			if (hasP)
				visitor.extraReturnDim!(cursor, errors);
		}
	}

	if (syntaxError(visitor, cursor, errors)) return;
	if (cursor.node.name === "Throws") {
		visitor.throws?.(cursor, errors);
		cursor.nextSibling();
		if (syntaxError(visitor, cursor, errors)) return;
	}

	switch (cursor.node.name) {
		case ";":
			visitor.noBody?.(undefined, errors);
			break;
		case "Block":
			visitor.body?.(cursor, errors);
			break;
	}
	
	cursor.parent();
}