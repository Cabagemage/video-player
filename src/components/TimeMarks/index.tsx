import { Mark } from "../../types/common";
import style from "./style.module.css";
import { getFormattedTime } from "../../helpers/getFormattedTime";
import TimeMark from "./TimeMark";
import Slider from "../Slider";

type BaseTimeMark = {
	text: string;
	start: number;
	end: number;
};
type TimeMarksProps<T extends BaseTimeMark> = {
	marks: Array<T>;
	currentPlayerTime: number;
	currentMark: T;
	onMarkClick: (currentMark: Mark) => void;
};

const TimeMarks = <T,>({ marks, currentMark, currentPlayerTime, onMarkClick }: TimeMarksProps<T>) => {
	return (
		<div>
			<div className={style.header}>
				<h2>Временные метки</h2>
				<button>Показать еще</button>
			</div>

			<div className={style.marks}>
				{marks.map((item) => {
					const { minutes: currentMinutes, seconds: currentSeconds } = getFormattedTime(item.start);
					const markerDuration = item.end - item.start;
					const markerWidth = 219;
					const isActive = currentMark?.start === item.start;
					const progress = (currentPlayerTime - item.start) / markerDuration;
					const markWidth = markerWidth * progress;
					return (
						<TimeMark
							key={item.start}
							onMarkClick={onMarkClick}
							markWidthPx={markWidth}
							mark={item}
							imageSrc={item.imageSrc}
							isActive={isActive}
							label={item.text}
							time={`${currentMinutes}:${currentSeconds}`}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default TimeMarks;
