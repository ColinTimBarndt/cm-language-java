import { LanguageSupport } from "@codemirror/language";
import { javaLanguage } from "@codemirror/lang-java";

/**
 * Re-exports the Java lezer-language from `@codemirror/lang-java`.
 */
export { javaLanguage } from "@codemirror/lang-java";

/**
 * Traversers are an approach of traversing a syntax tree. The functions provided
 * by this namespace can be used to scan a java-lezer tree.
 * 
 * @example
 * ```java
 * @TestAnnotation
 * public class Test {
 *   //
 * }
 * ```
 * 
 * ```ts
 * // Traverses all modifiers of a class in a `.java` file.
 * 
 * traverser.traverseDeclarations<void>({
 *   class: traverser.traverseClass(
 *     modifiers: traverser.traverseModifiers({
 *       modifier: mod => console.log("Modifier: " + mod),
 *       annotation: traverser.traverseAnnotation({
 *         name: ({from, to}) => {
 *           console.log("Annotation: " + code.substring(from, to));
 *         },
 *       }),
 *     }),
 *   ),
 * })(code);
 * ```
 */
export * as traverser from "./traverse/traverser";

/**
 * Functionality for outlining a Java file.
 */
export * as outliner from "./outline/outliner";

export * as linter from "./linter/linter";

/**
 * Creates a new extension for java language support.
 * @returns The Java language support extension
 */
export function java(): LanguageSupport {
	return new LanguageSupport(javaLanguage, []);
}