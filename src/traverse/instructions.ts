import { TreeCursor } from "lezer";
import { Traverser, TraverserFunction, TraverserError, ConsumerFunction, syntaxError, UnexpectedNodeError } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using `traverseStatements`.
 */
export interface StatementsTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A module declaration.
	 * @see {@link traverseModule}
	 */
	module?: TraverserFunction<D>;
	/**
	 * A package declaration.
	 * @see {@link traversePackage}
	 */
	package?: TraverserFunction<D>;
	/**
	 * An import declaration.
	 * @see {@link traverseImport}
	 */
	import?: TraverserFunction<D>;
	/**
	 * A class declaration.
	 * @see {@link traverseClass}
	 */
	class?: TraverserFunction<D>;
	/**
	 * An interface declaration.
	 * @see {@link traverseInterface}
	 */
	interface?: TraverserFunction<D>;
	/**
	 * An annotation type declaration.
	 * @see {@link traverseAnnotationType}
	 */
	annotationType?: TraverserFunction<D>;
	/**
	 * An enum declaration.
	 * @see {@link traverseEnum}
	 */
	enum?: TraverserFunction<D>;
	/**
	 * An expression.
	 * @see {@link traverseExpression}
	 */
	expression?: TraverserFunction<D>;
	/**
	 * A labeled statement.
	 * @see {@link traverseLabeledStatement}
	 */
	labeledStatement?: TraverserFunction<D>;
	/**
	 * An `if` expresssion.
	 * @see {@link traverseIf}
	 */
	if?: TraverserFunction<D>;
	/**
	 * A `while` loop.
	 * @see {@link traverseWhile}
	 */
	while?: TraverserFunction<D>;
	/**
	 * A `for` loop.
	 * @see {@link traverseFor}
	 * @example
	 * ```java
	 * for (int i=0; i<10; i++) {
	 *   // Code
	 * }
	 * ```
	 */
	for?: TraverserFunction<D>;
	/**
	 * An enhanced `for` loop.
	 * @example
	 * ```java
	 * int[] array = {1, 2, 3};
	 * for (int i : array) {
	 *   // Code
	 * }
	 * ```
	 * @see {@link traverseEnhancedFor}
	 */
	enhancedFor?: TraverserFunction<D>;
	/**
	 * A code block.
	 * @see {@link traverseBlock}
	 */
	block?: TraverserFunction<D>;
	/**
	 * An `assert` statement.
	 * @see {@link traverseAssert}
	 */
	assert?: TraverserFunction<D>;
	/**
	 * A `switch` statement.
	 * @see {@link traverseSwitch}
	 */
	switch?: TraverserFunction<D>;
	/**
	 * A `do .. while` loop.
	 * @see {@link traverseDoWhile}
	 */
	doWhile?: ConsumerFunction<TreeCursor | null, D>;
	/**
	 * A `break` statement. Called with the cursor set on the label node or
	 * `null`.
	 * @example
	 * ```java
	 * int i = 0;
	 * while (true) {
	 *   if (i++ >= 10) break;
	 * }
	 * ```
	 * @example
	 * ```java
	 * int i = 0;
	 * Outer: while (true) {
	 *   int j = 0;
	 *   while (true) {
	 *     if (i * j >= 10) break Outer;
	 *     j++;
	 *   }
	 *   i++;
	 * }
	 * ```
	 */
	break?: ConsumerFunction<TreeCursor | null, D>;
	/**
	 * A `continue` statement. Called with the cursor set on the label node or
	 * `null`.
	 */
	continue?: ConsumerFunction<TreeCursor | null, D>;
	/**
	 * A `return` statement. Called with the cursor set on the expression node
	 * or `null`.
	 * @see {@link traverseExpression}
	 * @example
	 * ```java
	 * return;
	 * ```
	 * @example
	 * ```java
	 * return "some " + "value";
	 * ```
	 */
	return?: ConsumerFunction<TreeCursor | null, D>;
	/**
	 * A synchronized block.
	 * @see {@link traverseSynchronized}
	 */
	synchronized?: TraverserFunction<D>;
	/**
	 * A local variable declaration.
	 * @see {@link traverseLocalVariable}
	 */
	localVariable?: TraverserFunction<D>;
	/**
	 * A `throw` statement. Called with the cursor set on the expression node or
	 * `null`.
	 * @see {@link traverseExpression}
	 */
	throw?: ConsumerFunction<TreeCursor | null, D>;
	/**
	 * A `try` statement.
	 * @see {@link traverseTry}
	 */
	try?: TraverserFunction<D>;
	/**
	 * A `try`-with-resources statement.
	 * @see {@link traverseTryWithResources}
	 * @see {@link https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html | Java Documentation}
	 */
	tryWithResources?: TraverserFunction<D>;
}
/**
 * Traverses all possible statements and declarations that may occur in a block.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L170)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseBlock: <D>(traverser: StatementsTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "Block", () => "Unexpected node: " + cursor.node.name);
	if (cursor.firstChild()) {
		do {
			switch (cursor.node.name) {
				case ";":
					continue;
				case "ModuleDeclaration":
					traverser.module?.(cursor, data);
					continue;
				case "PackageDeclaration":
					traverser.package?.(cursor, data);
					continue;
				case "ImportDeclaration":
					traverser.import?.(cursor, data);
					continue;
				case "ClassDeclaration":
					traverser.class?.(cursor, data);
					continue;
				case "InterfaceDeclaration":
					traverser.interface?.(cursor, data);
					continue;
				case "AnnotationTypeDeclaration":
					traverser.annotationType?.(cursor, data);
					continue;
				case "EnumDeclaration":
					traverser.enum?.(cursor, data);
					continue;
				case "ExpressionStatement":
					traverser.expression?.(cursor, data);
					continue;
				case "LabeledStatement":
					traverser.labeledStatement?.(cursor, data);
					continue;
				case "IfStatement":
					traverser.if?.(cursor, data);
					continue;
				case "WhileStatement":
					traverser.while?.(cursor, data);
					continue;
				case "ForStatement":
					traverser.for?.(cursor, data);
					continue;
				case "EnhancedForStatement":
					traverser.enhancedFor?.(cursor, data);
					continue;
				case "Block":
					traverser.block?.(cursor, data);
					continue;
				case "AssertStatement":
					traverser.assert?.(cursor, data);
					continue;
				case "SwitchStatement":
					traverser.switch?.(cursor, data);
					continue;
				case "DoStatement":
					traverser.doWhile?.(cursor, data);
					continue;
				case "BreakStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						traverser.break?.(null, data);
					else
						traverser.break?.(cursor, data);
					cursor.parent();
					continue;
				case "ContinueStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						traverser.continue?.(null, data);
					else
						traverser.continue?.(cursor, data);
					cursor.parent();
					continue;
				case "ReturnStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						traverser.return?.(null, data);
					else
						traverser.return?.(cursor, data);
					cursor.parent();
					continue;
				case "SynchronizedStatement":
					traverser.synchronized?.(cursor, data);
					continue;
				case "LocalVariableStatement":
					traverser.localVariable?.(cursor, data);
					continue;
				case "ThrowStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						traverser.throw?.(null, data);
					else
						traverser.throw?.(cursor, data);
					cursor.parent();
					continue;
				case "TryStatement":
					traverser.try?.(cursor, data);
					continue;
				case "TryWithResourcesStatement":
					traverser.tryWithResources?.(cursor, data);
					continue;
				default:
					if (syntaxError(traverser, cursor, data)) return;
					throw new UnexpectedNodeError(cursor.node);
					
			}
		} while (cursor.nextSibling());
		cursor.parent();
	}
}