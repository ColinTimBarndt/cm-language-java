import { LanguageSupport } from "@codemirror/language";
import { javaLanguage } from "@codemirror/lang-java";

export function java(): LanguageSupport {
	return new LanguageSupport(javaLanguage, []);
}