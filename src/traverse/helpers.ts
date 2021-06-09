import { SyntaxNode, TreeCursor } from "lezer";

/**
 * A function that traverses a lezer-java syntax tree node.
 * @typeparam D Data type
 */
export type TraverserFunction<D> = (
	/**
	 * Lezer TreeCursor to use
	 */
	cursor: TreeCursor,
	/**
	 * Data that can be manipulated by traverse functions
	 */
	data: D
) => void;
/**
 * A function that consumes an input value.
 * @typeparam T Type of the input
 * @typeparam D Data type
 */
export type ConsumerFunction<T, D> = (
	/**
	 * Input to consume
	 */
	input: T,
	/**
	 * Data that can be manipulated by traverse functions
	 */
	data: D
) => void;

/**
 * A function that traverses a lezer-java syntax tree node **inline**.
 * @remarks
 * If this traverser may parse multiple nodes (eg. a list), it must always move
 * the cursor by the same number of nodes for the same input, whether the
 * traverser object has a function set to handle the node or not.
 * The traverser function must end with the cursor set on the last node that was
 * traversed by it.
 * @typeparam D Data type
 * @returns `true` if a syntax error was encountered
 */
export type InlineTraverserFunction<D> = (
	/**
	 * Lezer TreeCursor to use
	 */
	cursor: TreeCursor,
	/**
	 * Data that can be manipulated by traverse functions
	 */
	data: D
) => boolean;

/**
 * A function that is called with a `VisitError` if a traverser function
 * encounters an error.
 * @typeparam E `VisitError` encountered by the traverser
 * @typeparam D Data type
 */
export type TraverserErrorFunction<E, D> = (
	/**
	 * Error encountered by the traverser
	 */
	err: E,
	/**
	 * Lezer TreeCursor where the error was encountered
	 */
	cursor: TreeCursor,
	/**
	 * Data that can be manipulated by traverse functions
	 */
	data: D
) => void;

/**
 * Base type of a traverser.
 * @typeparam E `VisitError` encountered by the traverser
 * @typeparam D Data type
 */
export interface Traverser<E, D> {
	/**
	 * Called whenever the traverser encounters a syntax error node.
	 */
	$error?: TraverserErrorFunction<E, D>;
}

/**
 * Errors a traverser's `$error` function can be called with.
 */
export enum TraverserError {
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
 * Runs the `$error` method of the traverser if the current node is an error and
 * then calls `cursor.parent()`. Otherwise returns `false`.
 * 
 * This is a helper function for traversers.
 * @param traverser Traverser to use
 * @param cursor Lezer TreeCursor to use
 * @param data Data that can be manipulated by traverse functions
 * @typeparam D Data type
 * @returns Whether the current node was an error
 */
export const syntaxError = <D>(traverser: Traverser<TraverserError.SyntaxError, D>, cursor: TreeCursor, data: D) => {
	if (cursor.node.type.isError) {
		traverser.$error?.(TraverserError.SyntaxError, cursor, data);
		cursor.parent();
		return true;
	}
	return false;
}

/**
 * Runs the `$error` method of the traverser if the current node is an error.
 * Otherwise returns `false`.
 * 
 * This is a helper function for traversers.
 * @param traverser Traverser to use
 * @param cursor Lezer TreeCursor to use
 * @param data Data that can be manipulated by traverse functions
 * @typeparam D Data type
 * @returns Whether the current node was an error
 */
export const syntaxErrorInline = <D>(traverser: Traverser<TraverserError.SyntaxError, D>, cursor: TreeCursor, data: D) => {
	if (cursor.node.type.isError) {
		traverser.$error?.(TraverserError.SyntaxError, cursor, data);
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

/**
 * A traverser function has traversed a node it did not expect.
 */
export class UnexpectedNodeError extends Error {
	constructor(
		/**
		 * The unexpected node
		 */
		public readonly node: SyntaxNode,
	) {
		super(`Unexpected node "${node.name}" at ${node.from}-${node.to}`);
	}
}