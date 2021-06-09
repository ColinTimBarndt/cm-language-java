import { Traverser, TraverserFunction, TraverserError, syntaxError, UnexpectedNodeError, InlineTraverserFunction } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link traverseInterface}.
 */
export interface InterfaceTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Modifiers of this interface.
	 * @see {@link traverseModifiers}
	 */
	modifiers?: TraverserFunction<D>;
	/**
	 * Interface name.
	 */
	name?: TraverserFunction<D>;
	/**
	 * Interface type parameters.
	 * @see {@link traverseTypeParameters}
	 */
	typeParameters?: TraverserFunction<D>;
	/**
	 * Which interfaces are extended.
	 * @see {@link traverseTypeList}
	 */
	extends?: InlineTraverserFunction<D>;
	/**
	 * Interface body.
	 * @see {@link traverseInterfaceBody}
	 */
	body: TraverserFunction<D>;
}
/**
 * Traverses an interface declaration.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L501)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseInterface: <D>(traverser: InterfaceTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "ClassDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild()
	do {
		switch (cursor.node.name) {
			case "Modifiers":
				traverser.modifiers?.(cursor, data);
				continue;
			case "interface":
				continue;
			case "Definition":
				traverser.name?.(cursor, data);
				continue;
			case "TypeParameters":
				traverser.typeParameters?.(cursor, data);
				continue;
			case "ExtendsInterfaces":
				if (traverser.extends) {
					cursor.lastChild(); // Enter ExtendsInterfaces
					cursor.firstChild(); // Enter InterfaceTypeList
					const err = traverser.extends(cursor, data);
					cursor.parent();
					cursor.parent();
					if (err) return;
				}
				continue;
			case "InterfaceBody":
				traverser.body?.(cursor, data);
				continue;
			default:
				if (syntaxError(traverser, cursor, data)) return;
				throw new UnexpectedNodeError(cursor.node);
		}
	} while (cursor.nextSibling());
	cursor.parent();
};

/**
 * Interface for accepting lezer-nodes when using {@link traverseInterfaceBody}.
 */
export interface InterfaceBodyTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A constant declaration.
	 * @see {@link traverseConstant}
	 */
	constant?: TraverserFunction<D>;
	/**
	 * A nested enum declaration.
	 * @see {@link traverseEnum}
	 */
	enum?: TraverserFunction<D>;
	/**
	 * A method declaration.
	 * @see {@link traverseMethod}
	 */
	method?: TraverserFunction<D>;
	/**
	 * A nested class declaration.
	 * @see {@link traverseClass}
	 */
	class?: TraverserFunction<D>;
	/**
	 * A nested interface declaration.
	 * @see {@link traverseInterface}
	 */
	interface?: TraverserFunction<D>;
	/**
	 * A nested annotation type declaration.
	 * @see {@link traverseAnnotationType}
	 */
	annotationType?: TraverserFunction<D>;
}
/**
 * Traverses a class body.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L429)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseInterfaceBody: <D>(traverser: InterfaceBodyTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "ClassBody", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();

	if (syntaxError(traverser, cursor, data)) return;
	assert.equals(cursor.node.name, "{", () => "Unexpected node: " + cursor.node.name);
	cursor.nextSibling();
	Loop: {
		do {
			switch (cursor.node.name) {
				case ";": continue;
				case "}": break Loop;
				case "ConstantDeclaration":
					traverser.constant?.(cursor, data);
					continue;
				case "EnumDeclaration":
					traverser.enum?.(cursor, data);
					continue;
				case "MethodDeclaration":
					traverser.method?.(cursor, data);
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
				default:
					if (syntaxError(traverser, cursor, data)) return;
					throw new UnexpectedNodeError(cursor.node);
			}
		} while (cursor.nextSibling());
		assert.unreachable();
	}
	cursor.parent();
};