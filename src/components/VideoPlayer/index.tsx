import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import { Mark } from "../../types/common";
import loadVideo from "../../helpers/hls";
import { useFullScreen } from "./useFullScreen.js";
import Hls from "hls.js";
import { Quality } from "../../types/videoPlayer";
import { MEDIUM_QUALITY_IDX } from "../../helpers/constants";
import clsx from "clsx";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import VolumeController from "../VolumeController";
import useVolumeControl from "../../helpers/useVolumeControl";
import ProgressBar from "./ProgressBar";
import PlayButton from "./PlayButton";
import SettingsMenu from "./Settings";
import useIsVisible from "../../helpers/useIsVisible";
import Loader from "../Loader";
import useTime from "../../helpers/useTime";
import usePlay from "../../helpers/usePlay";
import SubtitlesButton from "./SubtitlesButton";
import Time from "./Time";
import useProgressBar from "../../helpers/useProgressBar";
import browser from "../../helpers/browser";
import useControlPanel from "../../helpers/useControlPanel";
import useMediaPlaybackRate from "../../helpers/useMediaPlaybackRate";
import TimeMarks from "./TimeMarks";
import useMark from "../../helpers/useMark";

type VideoPlayerProps = {
	videoUrl: string;
	marks: Array<Mark>;
};
function VideoPlayer({ videoUrl, marks }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const hlsRef = useRef<Hls | null>(null);
	const progressBarRef = useRef(null);
	const [availableQualities, setAvailableQualities] = useState<Array<Quality>>([]);
	const [currentQuality, setCurrentQuality] = useState(MEDIUM_QUALITY_IDX);
	const { onTogglePlay, isPlaying, onPlay } = usePlay(videoRef);
	const { changePlayedTime, formattedTime, getMediaDuration, playedTime, playedTimePercent } = useTime();
	const element = document.getElementById(browser.isIPhone ? "player" : "playerWrapper");
	const { isFullScreen, toggleFullScreen } = useFullScreen(element);
	const { onShow: onShowSettings, onHide: onHideSettings, isVisible: isSettingsVisible } = useIsVisible();
	const { isVisible: isLoaderVisible, onShow: onShowLoader, onHide: onHideLoader } = useIsVisible();
	const { onShowControlPanel, onHideControlPanel, isControlPanelVisible, handleMouseMove } =
		useControlPanel();
	const { isVolumeSliderVisible, volume, hideAudioSlider, showAudioSlider, onChangeSound, toggleSound } =
		useVolumeControl(videoRef);
	const [speedRate, changeSpeedRate] = useMediaPlaybackRate(videoRef);
	const { changeCurrentMark, mark } = useMark<Mark>(videoRef, marks);
	const {
		onDraggingProgressBar,
		isDragging,
		startDragging,
		stopDragging,
		onClickProgressBar,
		onProgress,
		uploadedMediaPercent,
	} = useProgressBar(progressBarRef, videoRef);

	function handleLoadedMetadata(event) {
		const video = event.target;
		getMediaDuration(video.duration);
	}

	const handleTimeUpdate = throttle((e) => {
		if (!isDragging) {
			changePlayedTime(e.target.currentTime ?? 0);
		}
		changeCurrentMark(e.target.currentTime ?? 0);
	}, 1000);

	const onMarkClick = async (mark: Mark) => {
		const video = videoRef.current;
		if (video) {
			video.currentTime = mark.start;
			changeCurrentMark(mark.start);
			changePlayedTime(mark.start);
			await onPlay();
		}
	};

	useEffect(() => {
		hlsRef.current = loadVideo({ videoElement: videoRef.current, url: videoUrl });
		if (hlsRef.current !== null) {
			hlsRef.current?.on(Hls.Events.MANIFEST_PARSED, () => {
				const levels: Array<Quality> = hlsRef.current?.levels.map((item, idx) => {
					return {
						quality: `${item.height}p`,
						level: idx,
					};
				});
				if (hlsRef.current instanceof Hls) {
					hlsRef.current.currentLevel = 1;
				}
				setAvailableQualities(levels);
			});
		}
		return () => {
			if (hlsRef.current instanceof Hls) {
				hlsRef.current.destroy();
			}
		};
	}, []);

	const changeQuality = (qualityIdx: number) => {
		// переключаем качество видео
		hlsRef.current!.currentLevel = qualityIdx;
		// обновляем состояние текущего качества
		setCurrentQuality(qualityIdx);
	};

	const onDoubleClickHandler = () => {
		toggleFullScreen();
	};

	const showSubtitles = () => {
		const subtitles = videoRef.current.textTracks[0];
		const currentMode = subtitles.mode;

		if (currentMode === "disabled" || currentMode === "hidden") {
			subtitles.mode = "showing";
			return;
		}
		subtitles.mode = "hidden";
	};

	if (browser.isIPhone) {
		return (
			<video
				id={"player"}
				className={style.video}
				controls
				playsInline
				onCanPlayThrough={onHideLoader}
				onWaiting={onShowLoader}
				preload={"auto"}
				onProgress={onProgress}
				onDoubleClick={onDoubleClickHandler}
				onClick={onTogglePlay}
				style={{ width: "100%", height: "100%" }}
				onLoadedMetadata={handleLoadedMetadata}
				ref={videoRef}
				onTimeUpdate={handleTimeUpdate}
			>
				<track kind="subtitles" src="../../../public/subtitles-ru.vtt" srcLang="en" label="English" default />
				Sorry, your browser doesn't support embedded videos.
			</video>
		);
	}
	return (
		<div id="playerWrapper" className={clsx(style.wrapper, { [style.videoPlayerFullScreen]: isFullScreen })}>
			<div
				onMouseLeave={isPlaying ? onHideControlPanel : undefined}
				onMouseEnter={onShowControlPanel}
				onMouseMove={handleMouseMove}
				className={clsx(style.videoPlayer, { [style.videoPlayerFullScreen]: isFullScreen })}
			>
				{isLoaderVisible && <Loader />}
				<video
					id={"player"}
					className={style.video}
					controls={false}
					playsInline
					onCanPlayThrough={onHideLoader}
					onWaiting={onShowLoader}
					preload={"auto"}
					onProgress={onProgress}
					onDoubleClick={onDoubleClickHandler}
					onClick={onTogglePlay}
					style={{ width: "100%", height: "100%" }}
					onLoadedMetadata={handleLoadedMetadata}
					ref={videoRef}
					onTimeUpdate={handleTimeUpdate}
				>
					<track
						kind="subtitles"
						src="../../../public/subtitles-ru.vtt"
						srcLang="en"
						label="English"
						default
					/>
					Sorry, your browser doesn't support embedded videos.
				</video>
				<div className={clsx(style.controlPanel, { [style.hiddenControlPanel]: !isControlPanelVisible })}>
					<div
						className={style.videoProgressBarWrapper}
						ref={progressBarRef}
						onMouseDown={startDragging}
						onMouseMove={(e) => {
							return onDraggingProgressBar({
								event: e,
								callback: (currentTime) => {
									changePlayedTime(currentTime);
								},
							});
						}}
						onMouseUp={stopDragging}
						onClick={(e) => {
							onClickProgressBar({ event: e });
						}}
					>
						<ProgressBar playedTimePercent={playedTimePercent} uploadedTimePercent={uploadedMediaPercent} />
					</div>
					<div className={style.controls}>
						<div className={style.controlsButtons}>
							<PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />
							{!browser.isIos && (
								<div className={style.soundControl} onMouseLeave={hideAudioSlider}>
									<button onMouseEnter={showAudioSlider} className={style.button} onClick={toggleSound}>
										<svg width="20px" height="20px">
											<use xlinkHref={`${icons}#sound`} />
										</svg>
									</button>
									<VolumeController
										isVisible={isVolumeSliderVisible}
										onChange={onChangeSound}
										value={volume}
									/>
									<Time time={formattedTime} />
								</div>
							)}
						</div>
						<div className={style.controlsButtons}>
							<SettingsMenu
								quality={{
									onQualityClick: changeQuality,
									options: availableQualities,
									current: availableQualities[currentQuality]?.quality,
								}}
								onCloseMenu={onHideSettings}
								speed={{ onOptionClick: changeSpeedRate, current: speedRate }}
								isShow={isSettingsVisible}
							/>
							<button className={style.button} onClick={onShowSettings}>
								<svg width="15px" height="15px">
									<use xlinkHref={`${icons}#settings`} />
								</svg>
							</button>
							<SubtitlesButton isSubtitlesVisible={true} onClick={showSubtitles} />
							<button onClick={toggleFullScreen} className={style.button}>
								<svg width="14px" height="14px">
									<use xlinkHref={`${icons}#fullScreen`} />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
			<TimeMarks onMarkClick={onMarkClick} marks={marks} currentPlayerTime={playedTime} currentMark={mark} />
			{/*<div className={"list"}>*/}
			{/*	{marks.map((item, idx) => {*/}
			{/*		const normalizedIndex = idx + 1;*/}
			{/*		return (*/}
			{/*			<button*/}
			{/*				onClick={() => {*/}
			{/*					onListItemClick(item.start);*/}
			{/*				}}*/}
			{/*				key={normalizedIndex}*/}
			{/*				className={"button"}*/}
			{/*			>{`${normalizedIndex}. ${item.text}`}</button>*/}
			{/*		);*/}
			{/*	})}*/}
			{/*</div>*/}
		</div>
	);
}

export default VideoPlayer;
