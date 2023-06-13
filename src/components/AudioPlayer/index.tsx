import { SyntheticEvent, useRef } from "react";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import style from "./style.module.css";
import { AudioPlayerMark, Mark } from "../../types/common";
import useVolumeControl from "../../hooks/useVolumeControl";
import usePlay from "../../hooks/usePlay";
import useProgressBar from "../../hooks/useProgressBar";
import useIsVisible from "../../hooks/useIsVisible";
import Loader from "../Loader";
import PlayButton from "../VideoPlayer/PlayButton";
import useTime from "../../hooks/useTime";
import Time from "../VideoPlayer/Time";
import useMark from "../../hooks/useMark";
import TimeMarks from "../TimeMarks";

type AudioPlayerProps = {
	currentAudioSrc: string | undefined;
	marks: Array<AudioPlayerMark>;
};

const AudioPlayer = ({ currentAudioSrc, marks }: AudioPlayerProps) => {
	const playerRef = useRef<HTMLMediaElement | null>(null);
	const progressBarRef = useRef<HTMLDivElement | null>(null);
	const { getMediaDuration, formattedTime, playedTime, changePlayedTime, playedTimePercent } = useTime();

	const { onPlay, isPlaying, onTogglePlay } = usePlay(playerRef);
	const { showAudioSlider, hideAudioSlider, toggleSound } = useVolumeControl(playerRef);

	const { onDraggingProgressBar, isDragging, startDragging, stopDragging, onClickProgressBar } =
		useProgressBar(progressBarRef, playerRef);
	const { isVisible, onShow, onHide } = useIsVisible();
	const { changeCurrentMark, mark } = useMark<AudioPlayerMark>(playerRef, marks);

	const onTimeUpdate = throttle((e) => {
		if (isDragging) {
			return;
		}
		changePlayedTime(e.target.currentTime);
		changeCurrentMark(e.target.currentTime);
	}, 1000);

	const onMetaDataLoadFinish = (event: SyntheticEvent<HTMLMediaElement>) => {
		const audio = event.currentTarget;
		getMediaDuration(audio.duration);
	};
	const onMarkReach = (currentTime: number) => {
		changeCurrentMark(currentTime);
		changePlayedTime(currentTime);
	};

	const onMarkClick = async (mark: Mark) => {
		const video = playerRef.current;
		if (video) {
			video.currentTime = mark.start;
			changeCurrentMark(mark.start);
			changePlayedTime(mark.start);
			await onPlay();
		}
	};
	return (
		<div>
			<audio
				ref={playerRef}
				onCanPlayThrough={onHide}
				onWaiting={onShow}
				onLoadedMetadata={onMetaDataLoadFinish}
				src={currentAudioSrc ? currentAudioSrc : undefined}
				onPlay={onPlay}
				onTimeUpdate={onTimeUpdate}
			>
				Your browser does not support the <code>audio</code> element.
			</audio>
			<div className={style.audioPlayer}>
				<div className={style.imageWrapper} onMouseEnter={hideAudioSlider} onClick={onTogglePlay}>
					{isVisible && <Loader />}
					<img
						alt="Image"
						className={style.image}
						src={
							mark?.imageSrc ??
							"https://cdn.wallpaperhub.app/cloudcache/b/d/7/6/4/b/bd764bb25d49a05105060185774ba14cd2c846f7.jpg"
						}
					/>
				</div>
				<div className={style.controls}>
					<div className={style.leftControls}>
						<PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />
						<Time time={formattedTime} />
					</div>
					<div
						className={style.progressBarWrapper}
						ref={progressBarRef}
						onMouseDown={startDragging}
						onMouseMove={(e) => {
							return onDraggingProgressBar({ event: e, callback: onMarkReach });
						}}
						onMouseUp={stopDragging}
						onClick={(e) => {
							return onClickProgressBar({ event: e, callback: onMarkReach });
						}}
					>
						<div className={style.progressBar}>
							<div className={style.progressBarKnob} style={{ width: `${playedTimePercent}%` }} />
						</div>
					</div>

					<div className={style.rightControls}>
						<div className={style.soundControl}>
							<button onMouseEnter={showAudioSlider} className={style.button} onClick={toggleSound}>
								<svg width="20px" height="20px">
									<use xlinkHref={`${icons}#sound`} />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
			<TimeMarks<AudioPlayerMark>
				marks={marks}
				currentPlayerTime={playedTime}
				currentMark={mark}
				onMarkClick={onMarkClick}
			/>
		</div>
	);
};

export default AudioPlayer;
