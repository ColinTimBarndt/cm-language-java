import { LanguageSupport } from "@codemirror/language";
import { javaLanguage } from "@codemirror/lang-java";

/**
 * Re-exports the Java lezer-language from `@codemirror/lang-java`.
 */
export { javaLanguage } from "@codemirror/lang-java";

/**
 * Helpers for traversing a lezer syntax tree.
 */
export * as visitor from "./visit/visitor";

/**
 * Creates a new extension for java language support.
 * @returns The Java language support extension
 */
export function java(): LanguageSupport {
	return new LanguageSupport(javaLanguage, []);
}