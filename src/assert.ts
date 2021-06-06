export function equals<A, B>(a: A, b: A | B, err: () => string): asserts b is A {
	if (a !== b)
		throw new Error("Assertion failed: " + err());
}
export function isTrue(a: any, err: () => string): asserts a is true {
	if (a !== true)
		throw new Error("Assertion failed: " + err());
}