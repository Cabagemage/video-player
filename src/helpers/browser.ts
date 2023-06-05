const isEdge = /Edge/g.test(navigator.userAgent);
const isWebKit = "WebkitAppearance" in document.documentElement.style && !/Edge/g.test(navigator.userAgent);
const isIPhone = /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
const isIos = /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

export default {
	isEdge,
	isWebKit,
	isIPhone,
	isIos,
};
