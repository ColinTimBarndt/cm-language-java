import { Traverser, TraverserFunction, TraverserError, syntaxError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

export type PrimitiveType = "byte" | "short" | "int" | "long" | "char"
	| "float" | "double" | "boolean";

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
 * Traverses a field.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L475)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseUnannotatedType: <D>(traverse: UnannotatedTypeTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	switch (cursor.node.name) {
		case "void":
			traverser.void?.(undefined, data);
			return;
		case "byte":
		case "short":
		case "int":
		case "long":
		case "char":
		case "float":
		case "double":
		case "boolean":
			traverser.primitive?.(cursor.node.name, data);
			return;
		case "TypeName":
			traverser.typeName?.(cursor, data);
			return;
		case "ScopedTypeName":
			traverser.scopedTypeName?.(cursor, data);
			return;
		case "GenericType":
			traverser.genericType?.(cursor, data);
			return;
		case "ArrayType":
			traverser.arrayType?.(cursor, data);
			return;
	}
};