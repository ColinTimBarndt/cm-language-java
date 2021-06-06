import { TreeCursor } from "lezer-tree";

// https://github.com/lezer-parser/java

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
 * @typeparam E error type
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
 * Interface for accepting lezer-nodes when using `visitDeclarations`.
 */
export interface DeclarationsVisitor<E> extends Visitor<VisitError.Unexpected | VisitError.SyntaxError, E> {
	/**
	 * Got a ModuleDeclaration
	 */
	module?: VisitorFunction<E>;
	/**
	 * Got a PackageDeclaration
	 */
	package?: VisitorFunction<E>;
	/**
	 * Got an ImportDeclaration
	 */
	import?: VisitorFunction<E>;
	/**
	 * Got a ClassDeclaration
	 */
	class?: VisitorFunction<E>;
	/**
	 * Got an InterfaceDeclaration
	 */
	interface?: VisitorFunction<E>;
	/**
	 * Got an AnnotationTypeDeclaration
	 */
	annotationType?: VisitorFunction<E>;
	/**
	 * Got an EnumDeclaration
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

/**
 * Interface for accepting lezer-nodes when using `visitClass`.
 */
export interface ClassVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * Got class modifiers
	 */
	modifiers?: VisitorFunction<E>;
	/**
	 * The class name
	 */
	name?: VisitorFunction<E>;
	/**
	 * Class type parameters
	 */
	typeParameters?: VisitorFunction<E>;
	/**
	 * Super-class
	 */
	extends?: VisitorFunction<E>;
	/**
	 * Super-interfaces
	 */
	implements?: VisitorFunction<E>;
	/**
	 * Class body
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

const validModifiers = new Set([
	"public", "protected", "private", "abstract", "static", "final",
	"strictfp", "default", "synchronized", "native", "transient", "volatile"
]);
export type ValidModifier = "public" | "protected" | "private" | "abstract" | "static" | "final" |
	"strictfp" | "default" | "synchronized" | "native" | "transient" | "volatile";
/**
 * Interface for accepting lezer-nodes when using `visitModifiers`.
 */
export interface ModifiersVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * Got a normal modifier keyword
	 */
	modifier?: ConsumerFunction<ValidModifier, E>;
	/**
	 * Got an annotation
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

/**
 * Interface for accepting lezer-nodes when using `visitAnnotation`.
 */
export interface AnnotationVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	name?: VisitorFunction<E>;
	/**
	 * Only called if the annotation is not a marker.
	 */
	arguments?: VisitorFunction<E>;
}
/**
 * Visits (marker-) annotations.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L305)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitAnnotation: <E>(visitor: AnnotationVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
	switch (cursor.node.name) {
		case "MarkerAnnotation":
			cursor.firstChild()
			visitor.name?.(cursor, errors);
			cursor.parent();
			return;
		case "Annotation":
			cursor.firstChild()
			visitor.name?.(cursor, errors);
			cursor.nextSibling();
			visitor.arguments?.(cursor, errors);
			cursor.parent();
			return;
		default:
			throw new Error("Unexpected node: " + cursor.node.name);
	}
}

/**
 * Interface for accepting lezer-nodes when using `visitStatements`.
 */
export interface StatementsVisitor<E> extends Visitor<VisitError.SyntaxError, E> {
	/**
	 * Got a ModuleDeclaration
	 */
	module?: VisitorFunction<E>;
	/**
	 * Got a PackageDeclaration
	 */
	package?: VisitorFunction<E>;
	/**
	 * Got an ImportDeclaration
	 */
	import?: VisitorFunction<E>;
	/**
	 * Got a ClassDeclaration
	 */
	class?: VisitorFunction<E>;
	/**
	 * Got an InterfaceDeclaration
	 */
	interface?: VisitorFunction<E>;
	/**
	 * Got an AnnotationTypeDeclaration
	 */
	annotationType?: VisitorFunction<E>;
	/**
	 * Got an EnumDeclaration
	 */
	enum?: VisitorFunction<E>;
	expression?: VisitorFunction<E>;
	labeledStatement?: VisitorFunction<E>;
	if?: VisitorFunction<E>;
	while?: VisitorFunction<E>;
	for?: VisitorFunction<E>;
	enhancedFor?: VisitorFunction<E>;
	block?: VisitorFunction<E>;
	assert?: VisitorFunction<E>;
	switch?: VisitorFunction<E>;
	do?: VisitorFunction<E>;
	break?: VisitorFunction<E>;
	continue?: VisitorFunction<E>;
	return?: VisitorFunction<E>;
	synchronized?: VisitorFunction<E>;
	localVariable?: VisitorFunction<E>;
	throw?: VisitorFunction<E>;
	try?: VisitorFunction<E>;
	tryWithResources?: VisitorFunction<E>;
}
/**
 * Visits all possible statements and declarations that may occur in a block.
 * @see [java.grammar](https://github.com/lezer-parser/java/blob/c0d12732696efad0d65668cf925a0aa2c61a31fa/src/java.grammar#L170)
 * @param visitor Used visitor
 * @typeparam E Error type
 * @returns A callable visitor function
 */
export const visitStatements: <E>(visitor: StatementsVisitor<E>) => VisitorFunction<E> = visitor => (cursor, errors) => {
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
				case ";":
					continue;
				case "AssertStatement":
					visitor.assert?.(cursor, errors);
					continue;
				case "SwitchStatement":
					visitor.switch?.(cursor, errors);
					continue;
				case "DoStatement":
					visitor.do?.(cursor, errors);
					continue;
				case "BreakStatement":
					visitor.break?.(cursor, errors);
					continue;
				case "ContinueStatement":
					visitor.continue?.(cursor, errors);
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