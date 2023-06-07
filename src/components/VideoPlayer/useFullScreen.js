import { useCallback, useEffect, useState } from "react";

export function isFullScreenElement(el) {
	const d = document;
	if (el) {
		return Boolean(
			d.fullscreenElement === el ||
				d.mozFullScreenElement === el ||
				d.webkitFullscreenElement === el ||
				d.msFullscreenElement === el
		);
	}

	return Boolean(
		d.fullscreenElement ||
			d.mozFullScreenElement ||
			d.webkitFullscreenElement ||
			d.msFullscreenElement ||
			d.fullscreen ||
			d.mozFullScreen ||
			d.webkitIsFullScreen ||
			d.fullScreenMode
	);
}

export const useFullScreen = (element) => {
	const fsEl = element;

	const initialState = window ? false : isFullScreenElement(fsEl);
	const [isFullScreen, setFullScreen] = useState(initialState);

	const openFullScreen = () => {
		const el = fsEl || document.documentElement;
		const requestFullscreen =
			el.webkitRequestFullScreen ||
			el.requestFullscreen ||
			el.mozRequestFullScreen ||
			el.msRequestFullscreen ||
			el.webkitEnterFullscreen;

		return requestFullscreen.call(el);
	};

	const closeFullScreen = () => {
		const exitFullScreen =
			document.webkitExitFullscreen ||
			document.exitFullscreen ||
			document.mozCancelFullScreen ||
			document.msExitFullscreen;

		return exitFullScreen.call(document);
	};

	const handleChange = useCallback(() => {
		setFullScreen(isFullScreenElement(fsEl));
	}, [fsEl]);

	useEffect(() => {
		document.addEventListener("webkitfullscreenchange", handleChange, false);
		document.addEventListener("mozfullscreenchange", handleChange, false);
		document.addEventListener("msfullscreenchange", handleChange, false);
		document.addEventListener("MSFullscreenChange", handleChange, false);
		document.addEventListener("fullscreenchange", handleChange, false);

		return () => {
			document.removeEventListener("webkitfullscreenchange", handleChange);
			document.removeEventListener("mozfullscreenchange", handleChange);
			document.removeEventListener("msfullscreenchange", handleChange);
			document.removeEventListener("MSFullscreenChange", handleChange);
			document.removeEventListener("fullscreenchange", handleChange);
		};
	}, [element, handleChange]);

	return {
		isFullScreen,
		open: openFullScreen,
		close: closeFullScreen,
		toggleFullScreen: isFullScreen ? closeFullScreen : openFullScreen,
	};
};
