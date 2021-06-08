import { Traverser, TraverserFunction, TraverserError, syntaxError, UnexpectedNodeError } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link traverseClass}.
 */
export interface ClassTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * Modifiers of this class.
	 * @see {@link traverseModifiers}
	 */
	modifiers?: TraverserFunction<D>;
	/**
	 * Class name.
	 */
	name?: TraverserFunction<D>;
	/**
	 * Class type parameters.
	 * @see {@link traverseTypeParameters}
	 */
	typeParameters?: TraverserFunction<D>;
	/**
	 * Super-class.
	 * @see {@link traverseType}
	 */
	extends?: TraverserFunction<D>;
	/**
	 * Super-interfaces.
	 * @see {@link traverseInterfaceTypeList}
	 */
	implements?: TraverserFunction<D>;
	/**
	 * Class body.
	 * @see {@link traverseClassBody}
	 */
	body?: TraverserFunction<D>;
}
/**
 * Traverses a class declaration.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L391)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseClass: <D>(traverser: ClassTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	assert.equals(cursor.node.name, "ClassDeclaration", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();
	do {
		switch (cursor.node.name) {
			case "Modifiers":
				traverser.modifiers?.(cursor, data);
				continue;
			case "class":
				continue;
			case "Definition":
				traverser.name?.(cursor, data);
				continue;
			case "TypeParameters":
				traverser.typeParameters?.(cursor, data);
				continue;
			case "Superclass":
				cursor.lastChild();
				traverser.extends?.(cursor, data);
				cursor.parent();
				continue;
			case "SuperInterfaces":
				cursor.lastChild();
				traverser.implements?.(cursor, data);
				cursor.parent();
				continue;
			case "ClassBody":
				traverser.body?.(cursor, data);
				continue;
			default:
				if (syntaxError(traverser, cursor, data)) return;
				throw new UnexpectedNodeError(cursor.node);
		}
	} while (cursor.nextSibling());
	cursor.parent();
}

/**
 * Interface for accepting lezer-nodes when using {@link traverseClassBody}.
 */
export interface ClassBodyTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A field declaration.
	 * @see {@link traverseField}
	 */
	field?: TraverserFunction<D>;
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
	/**
	 * A nested enum declaration.
	 * @see {@link traverseEnum}
	 */
	enum?: TraverserFunction<D>;
	/**
	 * An instance initializer (called before the constructor).
	 * @see {@link traverseBlock}
	 */
	initializer?: TraverserFunction<D>;
	/**
	 * A static initializer (called when the class is loaded).
	 * @see {@link traverseBlock}
	 */
	staticInitializer?: TraverserFunction<D>;
	/**
	 * A class constructor.
	 * @see {@link traverseConstructor}
	 */
	classConstructor?: TraverserFunction<D>;
}
/**
 * Traverses a class body.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L429)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseClassBody: <D>(traverser: ClassBodyTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
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
				case "FieldDeclaration":
					traverser.field?.(cursor, data);
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
				case "EnumDeclaration":
					traverser.enum?.(cursor, data);
					continue;
				case "Block":
					traverser.initializer?.(cursor, data);
					continue;
				case "StaticInitializer":
					cursor.lastChild();
					traverser.staticInitializer?.(cursor, data);
					cursor.parent();
					continue;
				case "ConstructorDeclaration":
					traverser.classConstructor?.(cursor, data);
					continue;
				default:
					if (syntaxError(traverser, cursor, data)) return;
					throw new UnexpectedNodeError(cursor.node);
			}
		} while (cursor.nextSibling());
		assert.unreachable();
	}
	cursor.parent();
}