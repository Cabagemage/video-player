import { MutableRefObject, useState } from "react";
import { AudioPlayerMark } from "../types/common";

type BaseMark = {
	start: number;
	end: number;
};
const findCurrentMark = <T extends BaseMark>(marks: Array<T>, currentTime: number): undefined | T => {
	const currentSecond = Math.floor(currentTime);
	return marks.find((item) => {
		if (currentSecond >= item.start && currentSecond <= item.end) {
			return item;
		}
	});
};
const useMark = <T extends BaseMark>(mediaRef: MutableRefObject<HTMLMediaElement>, marks: Array<T>) => {
	const [mark, setMark] = useState<T | null>();
	const changeCurrentMark = (currentTime: number) => {
		const mark = findCurrentMark(marks, currentTime);
		if (mark !== undefined) {
			setMark(mark);
			return;
		}
		setMark(null);
	};
	return {
		changeCurrentMark,
		mark,
	};
};

export default useMark;
