import { Tree, TreeCursor } from "lezer";
import * as traverser from "../traverse/traverser";
import { TraverserFunction } from "../traverse/helpers";

const reuseFields: Field[] = [];

/**
 * A Java type.
 */
type Type = "class" | "enum" | "interface" | "annotation";
/**
 * Visibility of a field, method or type.
 */
type Visibility = "public" | "package" | "protected" | "private";

interface Substring {
	substring(from: number, to: number): string;
}

/**
 * Outline of a Java Type.
 */
export class Outline {
	public type!: Type;
	public name!: string | null;
	/**
	 * Static fields of this type.
	 */
	public staticFields: {
		[name: string]: Field;
	} = {};
	/**
	 * Instance fields of this type.
	 */
	public fields: {
		[name: string]: Field;
	} = {};
	public visibility: Visibility = "package";
	public static_!: boolean;
	public final_!: boolean;
	public deprecated!: boolean;
	
	/**
	 * @param cursor Lezer tree to derive from
	 * @param src Source to get names from
	 */
	public constructor(cursor: TreeCursor, src: Substring) {
		this.update(cursor, src);
	}

	/**
	 * Updates the outline from a syntax tree.
	 * @param cursor Lezer tree to use
	 * @param src Source to get names from
	 */
	public update(cursor: TreeCursor, src: Substring) {
		let type: Type | null = null;
		this.name = null;
		this.visibility = "package";
		this.final_ = false;
		this.static_ = false;
		this.deprecated = false;
		let fieldIdx = 0;

		const traverseVModifiers = (mod: traverser.ValidModifier) => {
			switch (mod) {
				case "public":
				case "protected":
				case "private":
					this.visibility = mod;
					return;
				case "final":
					this.final_ = true;
					return;
				case "static":
					this.static_ = true;
					return;
			}
		};
		const traverseTypeBody: (type: Type) => TraverserFunction<void> = ctype => {
			let fieldVisibility: Visibility = "package";
			let fieldStatic: boolean = false;
			let fieldFinal: boolean = false;

			switch (ctype) {
				case "class":
					return traverser.traverseClassBody({
						field: traverser.traverseField({
							modifiers: traverser.traverseModifiers({
								modifier: (mod) => {
									switch (mod) {
										case "public":
										case "protected":
										case "private":
											fieldVisibility = mod;
											return;
										case "final":
											fieldFinal = true;
											return;
										case "static":
											fieldStatic = true;
											return;
									}
								},
							}),
							// TODO: type
							//declarator: traverser.traverse
						}),
						// TODO: method
					});
				case "enum":
					return cursor => {};
				case "interface":
					return cursor => {};
				case "annotation":
					return cursor => {};
			};
		};
		const traverseType: (type: Type) => TraverserFunction<void> = ctype => cursor => {
			// 2 types in a file, abort!
			if (type) throw 0;
			type = ctype;

			switch (type) {
				case "class":
					traverser.traverseClass<void>({
						modifiers: traverser.traverseModifiers({
							modifier: traverseVModifiers
						}),
						name: ({ from, to }) => {
							this.name = src.substring(from, to);
						},
						body: traverseTypeBody("class"),
					})(cursor);
					return;
				case "enum":
					// TODO
					return;
				case "interface":
					// TODO
					return;
				case "annotation":
					// TODO
					return;
			}
		};
		
		traverser.traverseDeclarations<void>({
			class: traverseType("class"),
			enum: traverseType("enum"),
			interface: traverseType("interface"),
			annotationType: traverseType("annotation"),
		})(cursor);

		this.type = type || "class";
	}
}

type FieldType = "";

export interface Field {
	name: string;
	visibility: Visibility;
	final: boolean;
	static: boolean;
	deprecated: boolean;
}