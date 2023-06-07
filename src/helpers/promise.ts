/**
 * Silence a Promise-like object.
 * This is useful for avoiding non-harmful, but potentially confusing "uncaught
 * play promise" rejection error messages.
 * @param  {Object} value An object that may or may not be `Promise`-like.
 */
const instanceOf = (input, constructor) => Boolean(input && constructor && input instanceof constructor);
const isFunction = (input) => typeof input === "function";
const isPromise = (input) => instanceOf(input, Promise) && isFunction(input.then);
export function silencePromise(value) {
	if (isPromise(value)) {
		value.then(null, () => {});
	}
}

export default { silencePromise };
