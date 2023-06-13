import { MutableRefObject, useEffect, useState } from "react";

const usePlay = (media: MutableRefObject<HTMLMediaElement | null>) => {
	const [isPlaying, setIsPlaying] = useState(false);

	const play = async () => {
		const player = media.current;
		if (player !== null) {
			await player.play();
			setIsPlaying(true);
		}
	};

	const stop = async () => {
		const player = media.current;
		if (player !== null) {
			await player.pause();
			setIsPlaying(false);
		}
	};

	const changeIsPlayingMode = (status: boolean) => {
		setIsPlaying(status);
	};

	const onTogglePlay = isPlaying ? stop : play;

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
		play,
		stop,
		onTogglePlay,
		changeIsPlayingMode,
	};
};

export default usePlay;
