/**
 * Asserts that `a === b` and throws an {@link AssertionError} if it fails.
 * @internal
 * @param a Left side
 * @param b Right side
 * @param err Builds an error message
 */
export function equals<A, B>(a: A | B, b: B, err: () => string): asserts a is B {
	isTrue(a === b, err);
}
/**
 * Asserts that `a === true` and throws an {@link AssertionError} if it fails.
 * @internal
 * @param a Condition
 * @param err Builds an error message
 */
export function isTrue(a: any, err: () => string): asserts a is true {
	if (a !== true)
		throw new AssertionError(err());
}
/**
 * Asserts that this function is never executed.
 * @param msg Error message
 */
export function unreachable(msg?: string): never {
	throw new AssertionError(msg ? `Unreachable code: ${msg}` : "Unreachable code");
}
/**
 * An assertion failed. This error is only thrown in tests because assertions
 * are stripped from release builds.
 * @internal
 */
export class AssertionError extends Error {
	constructor(msg: string) {
		super(`Assertion failed: ${msg}`);
	}
}