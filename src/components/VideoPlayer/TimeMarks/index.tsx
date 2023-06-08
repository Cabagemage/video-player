import { Mark } from "../../../types/common";
import style from "./style.module.css";
import { getFormattedTime } from "../../../helpers/getFormattedTime";
import clsx from "clsx";

type TimeMarksProps = {
	marks: Array<Mark>;
	currentPlayerTime: number;
	mediaDuration: number;
	currentMark: Mark;
	onMarkClick: (currentMark: Mark) => void;
};

const TimeMarks = ({ marks, currentMark, currentPlayerTime, onMarkClick }: TimeMarksProps) => {
	return (
		<div className={style.marks}>
			{marks.map((item) => {
				const { minutes: currentMinutes, seconds: currentSeconds } = getFormattedTime(item.start);
				const markerDuration = item.end - item.start;
				const markerWidth = 194;
				const isActive = currentMark?.start === item.start;
				const progress = (currentPlayerTime - item.start) / markerDuration;
				console.log(markerDuration, progress);
				return (
					<button
						className={style.markWrapper}
						onClick={() => {
							return onMarkClick(item);
						}}
					>
						<div className={style.time}>
							<div
								className={clsx({ [style.activeTime]: isActive })}
								style={{ width: `${markerWidth * progress}px` }}
							/>
							<div
								className={clsx(style.timeStartLabel, { [style.timeStartLabelActive]: isActive })}
							>{`${currentMinutes}:${currentSeconds}`}</div>
						</div>
						<p className={clsx(style.text, { [style.activeText]: isActive })}>{item.text}</p>
					</button>
				);
			})}
		</div>
	);
};

export default TimeMarks;
