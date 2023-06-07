import { getFormattedTime } from "./getFormattedTime";
import { useState } from "react";

const useTime = () => {
	const [duration, setDuration] = useState(0);
	const [playedTime, setPlayedTime] = useState(0);
	const { minutes, seconds } = getFormattedTime(duration);
	const { minutes: currentMinutes, seconds: currentSeconds } = getFormattedTime(playedTime);
	const formattedTime = `${currentMinutes}:${currentSeconds}/${minutes}:${seconds}`;
	const playedTimePercent = (playedTime / duration) * 100;
	const getMediaDuration = (duration: number) => {
		setDuration(duration);
	};

	const changePlayedTime = (time: number) => {
		setPlayedTime(time);
	};

	return {
		getMediaDuration,
		duration,
		playedTime,
		changePlayedTime,
		formattedTime,
		playedTimePercent,
	};
};

export default useTime;
