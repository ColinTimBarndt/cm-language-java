import { Traverser, TraverserFunction, TraverserError, syntaxError, ConsumerFunction, InlineTraverserFunction, syntaxErrorInline, UnexpectedNodeError } from "./helpers";
import * as assert from "../assert";

/**
 * All primitive types supported by Java.
 */
export type PrimitiveType = "byte" | "short" | "int" | "long" | "char"
	| "float" | "double" | "boolean";

/**
 * Interface for accepting lezer-nodes when using {@link traverseType}.
 */
export interface TypeTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A type annotation.
	 * @see {@link traverseAnnotation}
	 */
	annotation?: TraverserFunction<D>;
	/**
	 * The type.
	 * @see {@link traverseUnannotatedType}
	 */
	type?: InlineTraverserFunction<D>;
}
/**
 * Traverses a type.
 * @remarks Processes a node inline without stepping into a child node.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L542)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseType: <D>(traverser: TypeTraverser<D>) => InlineTraverserFunction<D> = traverser => (cursor, data) => {
	if (traverser.annotation)
		while (cursor.node.name === "AnnotatedType") {
			traverser.annotation(cursor, data);
			cursor.nextSibling();
		}
	else while (cursor.node.name === "AnnotatedType")
		cursor.nextSibling();
	return syntaxErrorInline(traverser, cursor, data)
		|| traverseUnannotatedType(traverser)(cursor, data);
};

/**
 * Interface for accepting lezer-nodes when using {@link traverseUnannotatedType}.
 */
export interface UnannotatedTypeTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	primitive?: ConsumerFunction<PrimitiveType, D>;
	void?: ConsumerFunction<void, D>;
	typeName?: TraverserFunction<D>;
	scopedTypeName?: TraverserFunction<D>;
	genericType?: TraverserFunction<D>;
	arrayType?: TraverserFunction<D>;
}
/**
 * Traverses an unannotated type.
 * @remarks Processes a node inline without stepping into a child node.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L547)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseUnannotatedType: <D>(traverser: UnannotatedTypeTraverser<D>) => InlineTraverserFunction<D> = traverser => (cursor, data) => {
	switch (cursor.node.name) {
		case "void":
			traverser.void?.(undefined, data);
			break;
		case "byte":
		case "short":
		case "int":
		case "long":
		case "char":
		case "float":
		case "double":
		case "boolean":
			traverser.primitive?.(cursor.node.name, data);
			break;
		case "TypeName":
			traverser.typeName?.(cursor, data);
			break;
		case "ScopedTypeName":
			traverser.scopedTypeName?.(cursor, data);
			break;
		case "GenericType":
			traverser.genericType?.(cursor, data);
			break;
		case "ArrayType":
			traverser.arrayType?.(cursor, data);
			break;
		default:
			if (syntaxErrorInline(traverser, cursor, data)) return true;
			throw new UnexpectedNodeError(cursor.node);
	}
	return false;
};

/**
 * Interface for accepting lezer-nodes when using {@link traverseTypeList}.
 */
export interface TypeListTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A type.
	 * @see {@link traverseType}
	 */
	type: InlineTraverserFunction<D>;
}
/**
 * Traverses a list of types.
 * @remarks Processes multiple nodes inline without stepping into a child node.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L425)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseTypeList: <D>(traverser: TypeListTraverser<D>) => InlineTraverserFunction<D> = traverser => (cursor, data) => {
	do {
		if (
			syntaxErrorInline(traverser, cursor, data)
			|| traverser.type(cursor, data)
		) return true;
	} while (cursor.nextSibling());
	return false;
};