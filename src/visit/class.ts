import { Visitor, VisitorFunction, VisitError, syntaxError } from "./helpers";
import * as assert from "../assert";

/**
 * Interface for accepting lezer-nodes when using {@link visitClass}.
 */
export interface ClassVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * Class modifiers.
	 * @see {@link visitModifiers}
	 */
	modifiers?: VisitorFunction<E>;
	/**
	 * Class name.
	 */
	name?: VisitorFunction<E>;
	/**
	 * Class type parameters.
	 * @see {@link visitTypeParameters}
	 */
	typeParameters?: VisitorFunction<E>;
	/**
	 * Super-class.
	 */
	extends?: VisitorFunction<E>;
	/**
	 * Super-interfaces.
	 */
	implements?: VisitorFunction<E>;
	/**
	 * Class body.
	 * @see {@link visitClassBody}
	 */
	body?: VisitorFunction<E>;
}
/**
 * Visits a class declaration.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L391)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitClass: <E>(visitor: ClassVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	assert.equals(cursor.node.name, "ClassDeclaration", () => "Unexpected node: " + cursor.node.name);
	if (cursor.firstChild()) {
		do {
			switch (cursor.node.name) {
				case "Modifiers":
					visitor.modifiers?.(cursor, errors);
					continue;
				case "class":
					continue;
				case "Definition":
					visitor.name?.(cursor, errors);
					continue;
				case "TypeParameters":
					visitor.typeParameters?.(cursor, errors);
					continue;
				case "Superclass":
					visitor.extends?.(cursor, errors);
					continue;
				case "SuperInterfaces":
					visitor.implements?.(cursor, errors);
					continue;
				case "ClassBody":
					visitor.body?.(cursor, errors);
					continue;
				default:
					assert.isTrue(cursor.type.isError, () => "Unexpected node: " + cursor.node.name);
					if (cursor.node.type.isError)
						visitor.$error?.(VisitError.SyntaxError, cursor, errors);
					continue;
			}
		} while (cursor.nextSibling());
		cursor.parent();
	}
}

/**
 * Interface for accepting lezer-nodes when using {@link visitClassBody}.
 */
export interface ClassBodyVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * A field declaration.
	 * @see {@link visitField}
	 */
	field?: VisitorFunction<E>;
	/**
	 * A method declaration.
	 * @see {@link visitMethod}
	 */
	method?: VisitorFunction<E>;
	/**
	 * A nested class declaration.
	 * @see {@link visitClass}
	 */
	class?: VisitorFunction<E>;
	/**
	 * A nested interface declaration.
	 * @see {@link visitInterface}
	 */
	interface?: VisitorFunction<E>;
	/**
	 * A nested annotation type declaration.
	 * @see {@link visitAnnotationType}
	 */
	annotationType?: VisitorFunction<E>;
	/**
	 * A nested enum declaration.
	 * @see {@link visitEnum}
	 */
	enum?: VisitorFunction<E>;
	/**
	 * An instance initializer (called before the constructor).
	 * @see {@link visitInitializer}
	 */
	initializer?: VisitorFunction<E>;
	/**
	 * A static initializer (called when the class is loaded).
	 * @see {@link visitBlock}
	 */
	staticInitializer?: VisitorFunction<E>;
	/**
	 * A class constructor.
	 * @see {@link visitConstructor}
	 */
	classConstructor?: VisitorFunction<E>;
}
/**
 * Visits a class body.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L429)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitClassBody: <E>(visitor: ClassBodyVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	assert.equals(cursor.node.name, "ClassBody", () => "Unexpected node: " + cursor.node.name);
	cursor.firstChild();

	if (syntaxError(visitor, cursor, errors)) return;
	assert.equals(cursor.node.name, "{", () => "Unexpected node: " + cursor.node.name);
	cursor.nextSibling();
	Loop: {
		do {
			switch (cursor.node.name) {
				case ";": continue;
				case "}": break Loop;
				case "FieldDeclaration":
					visitor.field?.(cursor, errors);
					continue;
				case "MethodDeclaration":
					visitor.method?.(cursor, errors);
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
				case "Block":
					visitor.initializer?.(cursor, errors);
					continue;
				case "StaticInitializer":
					cursor.lastChild();
					visitor.staticInitializer?.(cursor, errors);
					cursor.parent();
					continue;
				case "ConstructorDeclaration":
					visitor.constructor?.(cursor, errors);
					continue;
				default:
					if (syntaxError(visitor, cursor, errors)) return;
					throw new Error("Unexpected node: " + cursor.node.name);
			}
		} while (cursor.nextSibling());
		assert.equals(cursor.node.name, "}", () => "Unexpected node: " + cursor.node.name);
	}
	cursor.parent();
}