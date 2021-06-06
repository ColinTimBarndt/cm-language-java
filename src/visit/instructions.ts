import { TreeCursor } from "lezer";
import { Visitor, VisitorFunction, VisitError, ConsumerFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using `visitStatements`.
 */
export interface StatementsVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * A module declaration.
	 * @see {@link visitModule}
	 */
	module?: VisitorFunction<E>;
	/**
	 * A package declaration.
	 * @see {@link visitPackage}
	 */
	package?: VisitorFunction<E>;
	/**
	 * An import declaration.
	 * @see {@link visitImport}
	 */
	import?: VisitorFunction<E>;
	/**
	 * A class declaration.
	 * @see {@link visitClass}
	 */
	class?: VisitorFunction<E>;
	/**
	 * An interface declaration.
	 * @see {@link visitInterface}
	 */
	interface?: VisitorFunction<E>;
	/**
	 * An annotation type declaration.
	 * @see {@link visitAnnotationType}
	 */
	annotationType?: VisitorFunction<E>;
	/**
	 * An enum declaration.
	 * @see {@link visitEnum}
	 */
	enum?: VisitorFunction<E>;
	/**
	 * An expression.
	 * @see {@link visitExpression}
	 */
	expression?: VisitorFunction<E>;
	/**
	 * A labeled statement.
	 * @see {@link visitLabeledStatement}
	 */
	labeledStatement?: VisitorFunction<E>;
	/**
	 * An `if` expresssion.
	 * @see {@link visitIf}
	 */
	if?: VisitorFunction<E>;
	/**
	 * A `while` loop.
	 * @see {@link visitWhile}
	 */
	while?: VisitorFunction<E>;
	/**
	 * A `for` loop.
	 * @see {@link visitFor}
	 */
	for?: VisitorFunction<E>;
	/**
	 * An enhanced `for` loop.
	 * @example
	 * ```java
	 * for (declaration : expression) {
	 *   // Code
	 * }
	 * ```
	 * @see {@link visitEnhancedFor}
	 */
	enhancedFor?: VisitorFunction<E>;
	/**
	 * A code block.
	 * @see {@link visitBlock}
	 */
	block?: VisitorFunction<E>;
	/**
	 * An `assert` statement.
	 * @see {@link visitAssert}
	 */
	assert?: VisitorFunction<E>;
	/**
	 * A `switch` statement.
	 * @see {@link visitSwitch}
	 */
	switch?: VisitorFunction<E>;
	/**
	 * A `do .. while` loop.
	 * @see {@link visitDoWhile}
	 */
	doWhile?: ConsumerFunction<TreeCursor | null, E>;
	/**
	 * A `break` statement. Called with the cursor
	 * set on the label node or `null`.
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
	break?: ConsumerFunction<TreeCursor | null, E>;
	/**
	 * A `continue` statement. Called with the cursor
	 * set on the label node or `null`.
	 * @see {@link visitEnum}
	 */
	continue?: ConsumerFunction<TreeCursor | null, E>;
	/**
	 * A `return` statement.
	 * @see {@link visitReturn}
	 */
	return?: VisitorFunction<E>;
	/**
	 * A synchronized block.
	 * @see {@link visitSynchronized}
	 */
	synchronized?: VisitorFunction<E>;
	/**
	 * A local variable declaration.
	 * @see {@link visitLocalVariable}
	 */
	localVariable?: VisitorFunction<E>;
	/**
	 * A `throw` statement.
	 * @see {@link visitThrow}
	 */
	throw?: VisitorFunction<E>;
	/**
	 * A `try` statement.
	 * @see {@link visitTry}
	 */
	try?: VisitorFunction<E>;
	/**
	 * A `try`-with-resources statement.
	 * @see {@link visitTryWithResources}
	 * @see {@link https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html | Java Documentation}
	 */
	tryWithResources?: VisitorFunction<E>;
}
/**
 * Visits all possible statements and declarations that may occur in a block.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L170)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitBlock: <E>(visitor: StatementsVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	assert.equals(cursor.node.name, "Block", () => "Unexpected node: " + cursor.node.name);
	if (cursor.firstChild()) {
		do {
			switch (cursor.node.name) {
				case ";":
					continue;
				case "ModuleDeclaration":
					visitor.module?.(cursor, errors);
					continue;
				case "PackageDeclaration":
					visitor.package?.(cursor, errors);
					continue;
				case "ImportDeclaration":
					visitor.import?.(cursor, errors);
					continue;
				case "ClassDeclaration":
					visitor.class?.(cursor, errors);
					continue;
				case "InterfaceDeclaration":
					visitor.interface?.(cursor, errors);
					continue;
				case "AnnotationTypeDeclaration":
					visitor.annotationType?.(cursor, errors);
					continue;
				case "EnumDeclaration":
					visitor.enum?.(cursor, errors);
					continue;
				case "ExpressionStatement":
					visitor.expression?.(cursor, errors);
					continue;
				case "LabeledStatement":
					visitor.labeledStatement?.(cursor, errors);
					continue;
				case "IfStatement":
					visitor.if?.(cursor, errors);
					continue;
				case "WhileStatement":
					visitor.while?.(cursor, errors);
					continue;
				case "ForStatement":
					visitor.for?.(cursor, errors);
					continue;
				case "EnhancedForStatement":
					visitor.enhancedFor?.(cursor, errors);
					continue;
				case "Block":
					visitor.block?.(cursor, errors);
					continue;
				case "AssertStatement":
					visitor.assert?.(cursor, errors);
					continue;
				case "SwitchStatement":
					visitor.switch?.(cursor, errors);
					continue;
				case "DoStatement":
					visitor.doWhile?.(cursor, errors);
					continue;
				case "BreakStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						visitor.break?.(null, errors);
					else
						visitor.break?.(cursor, errors);
					cursor.parent();
					continue;
				case "ContinueStatement":
					cursor.firstChild();
					cursor.nextSibling();
					if (cursor.name === ";")
						visitor.continue?.(null, errors);
					else
						visitor.continue?.(cursor, errors);
					cursor.parent();
					continue;
				case "ReturnStatement":
					visitor.return?.(cursor, errors);
					continue;
				case "SynchronizedStatement":
					visitor.synchronized?.(cursor, errors);
					continue;
				case "LocalVariableStatement":
					visitor.localVariable?.(cursor, errors);
					continue;
				case "ThrowStatement":
					visitor.throw?.(cursor, errors);
					continue;
				case "TryStatement":
					visitor.try?.(cursor, errors);
					continue;
				case "TryWithResourcesStatement":
					visitor.tryWithResources?.(cursor, errors);
					continue;
				default:
					if (cursor.node.type.isError)
						visitor.$error?.(VisitError.SyntaxError, cursor, errors);
					else
						throw new Error("Unexpected node: " + cursor.node.name);
					continue;
					
			}
		} while (cursor.nextSibling());
		cursor.parent();
	}
}