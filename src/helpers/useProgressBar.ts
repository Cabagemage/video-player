import { MouseEvent, MutableRefObject, useState } from "react";

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
	// Начинает перемещение ползунка
	const startDragging = () => {
		setIsDragging(true);
	};

	// Останавливает перемещение ползунка
	const stopDragging = () => {
		setIsDragging(false);
	};

	return {
		isDragging,
		startDragging,
		stopDragging,
		onDraggingProgressBar,
		onClickProgressBar,
	};
};

export default useProgressBar;
