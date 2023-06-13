import clsx from "clsx";
import { Mark } from "../../../types/common";
import style from "./style.module.css";

type TimeMarkProps<T extends Mark> = {
	onMarkClick: (mark: T) => void;
	markWidthPx: number;
	mark: T;
	imageSrc: string;
	isActive: boolean;
	label: string;
	time: string;
};

const TimeMark = <T,>({
	markWidthPx,
	onMarkClick,
	imageSrc,
	isActive,
	time,
	mark,
	label,
}: TimeMarkProps<T>) => {
	return (
		<button
			className={style.markWrapper}
			onClick={() => {
				return onMarkClick(mark);
			}}
		>
			<div className={style.timeWrapper}>
				<div className={clsx({ [style.activeTime]: isActive })} style={{ width: `${markWidthPx}px` }} />
				<div className={clsx(style.timeStartLabel, { [style.timeStartLabelActive]: isActive })}>
					<time className={clsx(style.currentTime)}>{`${time}`}</time>
				</div>
			</div>
			<div className={style.imageWrapper}>
				<img alt={label} className={clsx(style.image, { [style.activeImage]: isActive })} src={imageSrc} />
			</div>

			<p className={clsx(style.text, { [style.activeText]: isActive })}>{label}</p>
		</button>
	);
};

export default TimeMark;
