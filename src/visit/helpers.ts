import { TreeCursor } from "lezer";

/**
 * A function that traverses a lezer-java syntax tree.
 * Errors can be pushed onto the array.
 * @typeparam E error type
 */
export type VisitorFunction<E> = (
	/**
	 * Lezer TreeCursor to use
	 */
	cursor: TreeCursor,
	/**
	 * Array of errors that can be appended to
	 */
	errors: E[]
) => void;
/**
 * A function that consumes an input value.
 * Errors can be pushed onto the array.
 * @typeparam T Type of the input
 * @typeparam E Error type
 */
export type ConsumerFunction<T, E> = (
	/**
	 * Input to consume
	 */
	input: T,
	/**
	 * Array of errors that can be appended to
	 */
	errors: E[]
) => void;

/**
 * A function that is called with a `VisitError` if a visitor function encounters an error.
 * @typeparam ET `VisitError` encountered by the visitor
 * @typeparam E Error type
 */
export type VisitorErrorFunction<ET, E> = (
	/**
	 * Error encountered by the visitor
	 */
	err: ET,
	/**
	 * Lezer TreeCursor where the error was encountered
	 */
	cursor: TreeCursor,
	/**
	 * Array of errors that can be appended to
	 */
	errors: E[]
) => void;

/**
 * Base type of a visitor.
 * @typeparam ET `VisitError` encountered by the visitor
 * @typeparam E Error type
 */
export interface Visitor<ET, E> {
	/**
	 * Called whenever the visitor encounters an error.
	 */
	$error?: VisitorErrorFunction<ET, E>;
}

/**
 * Errors a visitor's `$error` function can be called with.
 */
export enum VisitError {
	/**
	 * Got an unexpected (but grammatically valid) lezer node type
	 */
	Unexpected,
	/**
	 * Syntax error in the source code parsed with lezer
	 */
	SyntaxError,
}

/**
 * Runs the `$error` method of the visitor if the current node is an error and
 * then calls `cursor.parent()`. Otherwise returns `false`.
 * 
 * This is a helper function for visitors.
 * @param visitor Visitor to use
 * @param cursor Lezer TreeCursor to use
 * @param errors Array of errors that can be appended to
 * @typeparam E Error type
 * @returns Whether the current node was an error
 */
export function syntaxError<E>(visitor: Visitor<VisitError.SyntaxError, E>, cursor: TreeCursor, errors: E[]): boolean {
	if (cursor.node.type.isError) {
		visitor.$error?.(VisitError.SyntaxError, cursor, errors);
		cursor.parent();
		return true;
	}
	return false;
}

/**
 * An object that has a lookup function like a `Set`.
 */
interface SetLike<T> {
	/**
	 * @param search Item to search for
	 * @returns Wether the item exists in the set
	 */
	has(search: T): boolean;
};
/**
 * Traverses the tree upwards until the node was found or the root node has
 * been reached.
 * @param cursor Lezer TreeCursor to use
 * @param node Node type to find
 * @returns Whether the node type was found
 */
export function findUpwards(cursor: TreeCursor, node: SetLike<string>): boolean {
	let found = false;
	while (!(found = node.has(cursor.node.name)) && cursor.parent());
	return found;
}