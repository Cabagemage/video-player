import { useRef, useState } from "react";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import style from "./style.module.css";
import { getFormattedTime } from "../../helpers/getFormattedTime";
import VolumeController from "../VolumeController";
import clsx from "clsx";
import { AudioPlayerMark } from "../../types/common";
import useVolumeControl from "../../helpers/useVolumeControl";
import usePlay from "../../helpers/usePlay";
import useProgressBar from "../../helpers/useProgressBar";

type AudioPlayerProps = {
	currentAudioSrc: string | undefined;
	marks: Array<AudioPlayerMark>;
};

const AudioPlayer = ({ currentAudioSrc, marks }: AudioPlayerProps) => {
	const playerRef = useRef<HTMLMediaElement | null>(null);
	const progressBarRef = useRef<HTMLDivElement | null>(null);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const { onPlay, isPlaying, onStop, onTogglePlay } = usePlay(playerRef);
	const { showAudioSlider, isVolumeSliderVisible, volume, hideAudioSlider, toggleSound, onChangeSound } =
		useVolumeControl(playerRef);
	const [currentMark, setCurrentMark] = useState<string | null>(marks[0].imageSrc);
	const { onDraggingProgressBar, isDragging, startDragging, stopDragging, onClickProgressBar } =
		useProgressBar(progressBarRef, playerRef);

	const findCurrentMark = (currentTime: number): undefined | AudioPlayerMark => {
		const currentSecond = Math.floor(currentTime);
		return marks.find((item) => {
			if (currentSecond >= item.start && currentSecond <= item.end) {
				return item;
			}
		});
	};

	const onTimeUpdate = throttle((e) => {
		if (isDragging) {
			return;
		}
		setCurrentTime(e.target.currentTime);
		const mark = findCurrentMark(e.target.currentTime);
		if (mark !== undefined) {
			setCurrentMark(mark.imageSrc);
			return;
		}
		setCurrentMark(null);
	}, 1000);

	const handleLoadedMetadata = (event) => {
		const song = event.target;
		setDuration(song.duration);
	};

	const onMarkReach = (currentTime: number) => {
		const mark = findCurrentMark(currentTime);

		if (mark !== undefined) {
			setCurrentMark(mark.imageSrc);
		}
		setCurrentTime(currentTime);
	};

	const { minutes, seconds } = getFormattedTime(duration);
	const { minutes: currentMinutes, seconds: currentSeconds } = getFormattedTime(currentTime);

	const onListItemClick = (duration: number) => {
		const player = playerRef.current;
		if (player) {
			player.currentTime = duration;
			onPlay();
		}
	};

	return (
		<div>
			<audio
				ref={playerRef}
				onLoadedMetadata={handleLoadedMetadata}
				src={currentAudioSrc ? currentAudioSrc : undefined}
				onPlay={onPlay}
				onTimeUpdate={onTimeUpdate}
			>
				Your browser does not support the <code>audio</code> element.
			</audio>
			<div className={style.audioPlayer}>
				<div className={style.imageWrapper} onMouseEnter={hideAudioSlider} onClick={onTogglePlay}>
					<img
						alt="Image"
						className={style.image}
						src={
							currentMark ??
							"https://cdn.wallpaperhub.app/cloudcache/b/d/7/6/4/b/bd764bb25d49a05105060185774ba14cd2c846f7.jpg"
						}
					/>
				</div>
				<div className={style.controls}>
					<div className={style.leftControls}>
						<button className={clsx(style.button)} onClick={isPlaying ? onStop : onPlay}>
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
						<time className={style.time}>
							{`${currentMinutes}:${currentSeconds}`}/{`${minutes}:${seconds}`}
						</time>
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
							{marks.map((mark) => {
								const markerProgress = duration ? mark.start / duration : 0;
								const markerPosition = Math.round(markerProgress * 100);
								const markWidth = ((mark.end - mark.start) / duration) * 100;
								return (
									<div
										key={mark.start}
										className={style.mark}
										style={{ left: `${markerPosition}%`, width: `${markWidth}%` }}
									/>
								);
							})}
							<div
								className={style.progressBarKnob}
								style={{ width: `${(currentTime / duration) * 100}%` }}
							/>
						</div>
					</div>

					<div className={style.rightControls}>
						<div className={style.soundControl}>
							<button onMouseEnter={showAudioSlider} className={style.button} onClick={toggleSound}>
								<svg width="20px" height="20px">
									<use xlinkHref={`${icons}#sound`} />
								</svg>
							</button>
							<VolumeController isVisible={isVolumeSliderVisible} onChange={onChangeSound} value={volume} />
						</div>
					</div>
				</div>
			</div>
			<div className={style.list}>
				{marks.map((item) => {
					return (
						<button
							onClick={() => {
								return onListItemClick(item.start);
							}}
							className={style.button}
						>
							{item.label}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default AudioPlayer;
