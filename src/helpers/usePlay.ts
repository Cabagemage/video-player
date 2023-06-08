import { MutableRefObject, useEffect, useState } from "react";

const usePlay = (media: MutableRefObject<HTMLMediaElement | null>) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const onPlay = async () => {
		const player = media.current;
		if (player !== null) {
			await player.play();
			setIsPlaying(true);
		}
	};

	const onStop = async () => {
		const player = media.current;
		if (player !== null) {
			await player.pause();
			setIsPlaying(false);
		}
	};
	const onTogglePlay = isPlaying ? onStop : onPlay;

	useEffect(() => {
		const handleKeyDown = async (event) => {
			if (event.code === "Space") {
				await onTogglePlay();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isPlaying]);

	return {
		isPlaying,
		onPlay,
		onStop,
		onTogglePlay,
	};
};

export default usePlay;
