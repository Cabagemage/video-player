import type { RefObject } from "react";
import { useEffect } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: Handler
): void {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent): void => {
			if (
				ref.current === null ||
				(event.target instanceof HTMLElement && ref.current.contains(event.target))
			) {
				return;
			}
			handler(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
}
