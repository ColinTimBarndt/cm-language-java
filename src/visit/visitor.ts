import { ConsumerFunction, VisitError, Visitor, VisitorFunction } from "./helpers";

export * from "./helpers";
export * from "./class";
export * from "./interface";
export * from "./annotation";
export * from "./method";
export * from "./instructions";

// https://github.com/lezer-parser/java

/**
 * Interface for accepting lezer-nodes when using `visitDeclarations`.
 */
export interface DeclarationsVisitor<E> extends Visitor<VisitError.Unexpected | VisitError.SyntaxError, E> {
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
}
/**
 * Visits only top-level declarations that may occur in a `.java` file.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L336)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitDeclarations: <E>(visitor: DeclarationsVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	if (cursor.firstChild()) {
		do {
			switch (cursor.node.name) {
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
				default:
					if (cursor.node.type.isError)
						visitor.$error?.(VisitError.SyntaxError, cursor, errors);
					else
						visitor.$error?.(VisitError.Unexpected, cursor, errors);
					continue;
			}
		} while (cursor.nextSibling());
		cursor.parent();
	}
};

const validModifiers = new Set([
	"public", "protected", "private", "abstract", "static", "final",
	"strictfp", "default", "synchronized", "native", "transient", "volatile"
]);
/**
 * All possible modifiers in Java.
 */
export type ValidModifier = "public" | "protected" | "private" | "abstract"
	| "static" | "final" | "strictfp" | "default" | "synchronized" | "native"
	| "transient" | "volatile";
/**
 * Interface for accepting lezer-nodes when using `visitModifiers`.
 */
export interface ModifiersVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * A Java modifier.
	 */
	modifier?: ConsumerFunction<ValidModifier, E>;
	/**
	 * An annotation.
	 * @see {@link AnnotationVisitor}
	 */
	annotation?: VisitorFunction<E>;
}
/**
 * Visits modifiers of a definition / method / etc.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L395)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitModifiers: <E>(visitor: ModifiersVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	if (cursor.firstChild()) {
		do {
			const name = cursor.node.name;
			if (validModifiers.has(name)) {
				visitor.modifier?.(name as ValidModifier, errors);
					continue;
			}
			switch (name) {
				case "Annotation":
				case "MarkerAnnotation":
					visitor.annotation?.(cursor, errors);
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
