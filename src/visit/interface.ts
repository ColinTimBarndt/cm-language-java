import { Visitor, VisitorFunction, VisitError } from "./helpers";

/**
 * Interface for accepting lezer-nodes when using @link {visitInterface}.
 * @todo
 */
export interface InterfaceVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	// TODO
}
/**
 * Visits a class declaration.
 * @todo
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L501)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitInterface: <E>(visitor: InterfaceVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	// TODO
}