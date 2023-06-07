import icons from "../../../assets/sprite.svg";
import style from "./style.module.css";

type PlayButtonProps = {
	isPlaying: boolean;
	onClick: () => void;
};

const PlayButton = ({ isPlaying, onClick }: PlayButtonProps) => {
	return (
		<button className={style.button} onClick={onClick}>
			{isPlaying ? (
				<svg width="14px" height="14px">
					<use xlinkHref={`${icons}#stop`} />
				</svg>
			) : (
				<svg width="14px" height="14px">
					<use xlinkHref={`${icons}#play`} />
				</svg>
			)}
		</button>
	);
};

export default PlayButton;
