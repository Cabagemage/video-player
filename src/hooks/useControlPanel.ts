import useIsVisible from "./useIsVisible";
import { useEffect, useRef } from "react";

const useControlPanel = () => {
	const {
		onShow: onShowControlPanel,
		onHide: onHideControlPanel,
		isVisible: isControlPanelVisible,
	} = useIsVisible(true);

	const timeoutRef = useRef<null | number>(null);

	const startTimeout = () => {
		timeoutRef.current = +setTimeout(() => {
			onHideControlPanel();
		}, 5000);
	};

	const resetTimeout = () => {
		clearTimeout(timeoutRef.current);
		onShowControlPanel();
		startTimeout();
	};

	const handleMouseMove = () => {
		if (!isControlPanelVisible) {
			resetTimeout();
		}
	};

	// Start the timeout when the component mounts
	useEffect(() => {
		startTimeout();
		// Clear the timeout when the component unmounts
		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, []);

	return {
		handleMouseMove,
		onShowControlPanel,
		onHideControlPanel,
		isControlPanelVisible,
	};
};

export default useControlPanel;
