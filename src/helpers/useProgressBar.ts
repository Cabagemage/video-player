import { MouseEvent, MutableRefObject, SyntheticEvent, useEffect, useState } from "react";

type ProgressBarDragEvent = {
	event: MouseEvent<HTMLDivElement>;
	callback?: (currentTime: number) => void;
};
type ProgressBarClickEvent = {
	event: MouseEvent<HTMLDivElement>;
	callback?: (currentTime: number) => void;
};
const useProgressBar = (
	progressBarRef: MutableRefObject<HTMLDivElement | null>,
	mediaRef: MutableRefObject<HTMLMediaElement | null>
) => {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedMediaPercent, setUploadedMediaPercent] = useState(0);

	const onClickProgressBar = ({ event, callback }: ProgressBarClickEvent) => {
		const player = mediaRef.current;
		if (player === null) {
			return;
		}
		const progressBar = progressBarRef.current;
		const { left, width } = progressBar?.getBoundingClientRect();
		const mouseX = event.clientX - left;
		const progress = mouseX / width;
		const currentTime = progress * player.duration;
		player.currentTime = currentTime;

		if (callback) {
			callback(currentTime);
		}
	};

	// Обновляет позицию ползунка и время медиа при перемещении ползунка
	const onDraggingProgressBar = ({ event, callback }: ProgressBarDragEvent) => {
		if (isDragging) {
			const progressBarRect = progressBarRef.current?.getBoundingClientRect();
			const progress = (event.clientX - progressBarRect.left) / progressBarRect.width;
			const duration = mediaRef.current?.duration;
			if (progress >= 0) {
				const currentTime = duration * progress;

				if (callback) {
					callback(currentTime);
				}
			}
		}
	};

	const startDragging = () => {
		setIsDragging(true);
	};

	const stopDragging = () => {
		setIsDragging(false);
	};

	// Отображение загрузки медиа
	const onProgress = (e: SyntheticEvent<HTMLMediaElement>) => {
		const bufferedTimeRanges = e.currentTarget.buffered;
		if (bufferedTimeRanges.length > 0) {
			const bufferedTime = bufferedTimeRanges.end(bufferedTimeRanges.length - 1);
			const duration = e.currentTarget.duration;
			const uploadedVideoPercent = (bufferedTime / duration) * 100;
			setUploadedMediaPercent(uploadedVideoPercent);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			switch (event.code) {
				case "ArrowLeft": {
					return (mediaRef.current.currentTime -= 5);
				}
				case "ArrowRight": {
					return (mediaRef.current.currentTime += 5);
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return {
		isDragging,
		startDragging,
		stopDragging,
		onDraggingProgressBar,
		onClickProgressBar,
		onProgress,
		uploadedMediaPercent,
	};
};

export default useProgressBar;
