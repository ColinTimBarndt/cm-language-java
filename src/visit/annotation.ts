import { Visitor, VisitorFunction, VisitError } from "./helpers";

/**
 * Interface for accepting lezer-nodes when using `visitAnnotation`.
 */
export interface AnnotationVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * The annotation name.
	 */
	name?: VisitorFunction<E>;
	/**
	 * Only called if the annotation is not a marker.
	 * @see {@link visitAnnotationArguments}
	 */
	arguments?: VisitorFunction<E>;
}
/**
 * Visits (marker-) annotations.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L305)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitAnnotation: <E>(visitor: AnnotationVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	switch (cursor.node.name) {
		case "MarkerAnnotation":
			cursor.firstChild()
			visitor.name?.(cursor, errors);
			break;
		case "Annotation":
			cursor.firstChild()
			visitor.name?.(cursor, errors);
			cursor.nextSibling();
			visitor.arguments?.(cursor, errors);
			break;
		default:
			if (cursor.node.type.isError) {
				visitor.$error?.(VisitError.SyntaxError, cursor, errors);
				break;
			}
			throw new Error("Unexpected node: " + cursor.node.name);
	}
	cursor.parent();
}