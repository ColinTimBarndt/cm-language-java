import { TreeCursor } from "lezer-tree";
import * as traverser from "../traverse/traverser";

export interface AutocompleteResult {
	type:
	| "class" | "interface" | "enum" | "annotation"
	| "local" | "field" | "text";
	priority: number;
	value: string;
}

type Data = {
	at: number;
	result: AutocompleteResult[];
};

export const autocomplete = (cursor: TreeCursor, result: AutocompleteResult[]) => {
	const data = {
		at: cursor.from,
		result: [],
	};
	do {
		switch (cursor.node.name) {
			case "Block":
				scanBlockScope(cursor, data);
				return;
			case "Program":
				scanProgramScope(cursor, data);
				return;
		}
	} while (cursor.parent())
};

const scanBlockScope = traverser.traverseBlock<Data>({
	// TODO
	// localVariable: traverser.traverseLocalVariable
});

const scanProgramScope = traverser.traverseDeclarations<Data>({});