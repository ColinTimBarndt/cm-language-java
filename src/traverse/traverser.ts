import { ConsumerFunction, TraverserError, Traverser, TraverserFunction, UnexpectedNodeError, syntaxError } from "./helpers";

export * from "./helpers";
export * from "./class";
export * from "./interface";
export * from "./annotation";
export * from "./method";
export * from "./instructions";
export * from "./variable";
export * from "./type";

// https://github.com/lezer-parser/java

/**
 * Interface for accepting lezer-nodes when using `traverseDeclarations`.
 */
export interface DeclarationsTraverser<D> extends Traverser<TraverserError.Unexpected | TraverserError.SyntaxError, D> {
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
}
/**
 * Traverses only top-level declarations that may occur in a `.java` file.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L336)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseDeclarations: <D>(traverser: DeclarationsTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	if (cursor.firstChild()) {
		do {
			switch (cursor.node.name) {
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
				default:
					if (cursor.node.type.isError)
						traverser.$error?.(TraverserError.SyntaxError, cursor, data);
					else
						traverser.$error?.(TraverserError.Unexpected, cursor, data);
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
 * Interface for accepting lezer-nodes when using `traverseModifiers`.
 */
export interface ModifiersTraverser<D> extends Traverser<TraverserError.SyntaxError, D> {
	/**
	 * A Java modifier.
	 */
	modifier?: ConsumerFunction<ValidModifier, D>;
	/**
	 * An annotation.
	 * @see {@link AnnotationTraverser}
	 */
	annotation?: TraverserFunction<D>;
}
/**
 * Traverses modifiers of a definition / method / etc.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L395)
 * @param traverser Used traverser
 * @typeparam D Data type
 * @returns A callable traverser function
 */
export const traverseModifiers: <D>(traverser: ModifiersTraverser<D>) => TraverserFunction<D> = traverser => (cursor, data) => {
	if (cursor.firstChild()) {
		do {
			const name = cursor.node.name;
			if (validModifiers.has(name)) {
				traverser.modifier?.(name as ValidModifier, data);
					continue;
			}
			switch (name) {
				case "Annotation":
				case "MarkerAnnotation":
					traverser.annotation?.(cursor, data);
					continue;
				default:
					if (syntaxError(traverser, cursor, data)) return;
					throw new UnexpectedNodeError(cursor.node);
			}
		} while (cursor.nextSibling());
		cursor.parent();
	}
}
