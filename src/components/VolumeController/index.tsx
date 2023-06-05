import { ChangeEvent } from "react";
import style from "./style.module.css";

type VolumeControllerProps = {
	value: number;
	onChange: (value: string) => void;
	isVisible: boolean;
	onHide: () => void;
};

const VolumeController = ({ onChange, value = 0, isVisible, onHide }: VolumeControllerProps) => {
	const onVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value);
		onChange(e.target.value);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div className={style.rangeWrapper} onMouseLeave={onHide}>
			<input
				className={style.volumeRange}
				type="range"
				min="0"
				max="1"
				step="0.1"
				value={value}
				onChange={onVolumeChange}
			/>
		</div>
	);
};

export default VolumeController;
