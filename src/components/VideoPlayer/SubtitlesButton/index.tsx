import icons from "../../../assets/sprite.svg";
import style from "./style.module.css";

type PlayButtonProps = {
	isSubtitlesVisible: boolean;
	onClick: () => void;
};

const SubtitlesButton = ({ onClick, isSubtitlesVisible }: PlayButtonProps) => {
	return (
		<button className={style.button} onClick={onClick}>
			{isSubtitlesVisible ? (
				<svg width="14px" height="14px">
					<use xlinkHref={`${icons}#subtitles`} />
				</svg>
			) : (
				<svg width="14px" height="14px">
					<use xlinkHref={`${icons}#subtitles`} />
				</svg>
			)}
		</button>
	);
};

export default SubtitlesButton;
