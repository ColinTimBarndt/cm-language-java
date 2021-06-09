import { Traverser, TraverserFunction, TraverserError, UnexpectedNodeError } from "./helpers";

/**
 * Interface for accepting lezer-nodes when using `traverseAnnotation`.
 */
export interface AnnotationTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * The annotation name.
	 * @see {@link traverseName}
	 */
	name?: TraverserFunction<D>;
	/**
	 * Only called if the annotation is not a marker.
	 * @see {@link traverseAnnotationArguments}
	 */
	arguments?: TraverserFunction<D>;
}
/**
 * Traverses (marker-) annotations.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L305)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseAnnotation: <D>(traverser: AnnotationTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	switch (cursor.node.name) {
		case "MarkerAnnotation":
			cursor.firstChild();
			traverser.name?.(cursor, data);
			break;
		case "Annotation":
			cursor.firstChild();
			traverser.name?.(cursor, data);
			cursor.nextSibling();
			traverser.arguments?.(cursor, data);
			break;
		default:
			if (cursor.node.type.isError) {
				traverser.$error?.(TraverserError.SyntaxError, cursor, data);
				break;
			}
			throw new UnexpectedNodeError(cursor.node);
	}
	cursor.parent();
}