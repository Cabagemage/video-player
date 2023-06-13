import { SyntheticEvent, useEffect, useRef } from "react";
import style from "./style.module.css";
import { Mark } from "../../types/common";
import { useFullScreen } from "./useFullScreen.js";
import clsx from "clsx";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import VolumeController from "../VolumeController";
import useVolumeControl from "../../hooks/useVolumeControl";
import ProgressBar from "./ProgressBar";
import PlayButton from "./PlayButton";
import SettingsMenu from "./Settings";
import useIsVisible from "../../hooks/useIsVisible";
import Loader from "../Loader";
import useTime from "../../hooks/useTime";
import usePlay from "../../hooks/usePlay";
import SubtitlesButton from "./SubtitlesButton";
import Time from "./Time";
import useProgressBar from "../../hooks/useProgressBar";
import browser from "../../helpers/browser";
import useControlPanel from "../../hooks/useControlPanel";
import useMediaPlaybackRate from "../../hooks/useMediaPlaybackRate";
import TimeMarks from "../TimeMarks";
import useMark from "../../hooks/useMark";
import useHls from "../../hooks/useHls";

type VideoPlayerProps = {
	videoUrl: string;
	marks: Array<Mark>;
	shouldPlayOnVideoChange?: boolean;
};
function VideoPlayer({ videoUrl, marks, shouldPlayOnVideoChange }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const progressBarRef = useRef<HTMLDivElement | null>(null);
	const { onTogglePlay, isPlaying, play } = usePlay(videoRef);
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

	const { availableQualities, currentQuality, changeVideoQuality } = useHls({ videoRef: videoRef, videoUrl });
	const {
		onDraggingProgressBar,
		isDragging,
		startDragging,
		stopDragging,
		onClickProgressBar,
		onProgress,
		uploadedMediaPercent,
	} = useProgressBar(progressBarRef, videoRef);

	const onMetaDataLoadFinish = (event: SyntheticEvent<HTMLMediaElement>) => {
		const video = event.currentTarget;
		getMediaDuration(video.duration);
	};

	const handleTimeUpdate = throttle((e: SyntheticEvent<HTMLMediaElement>) => {
		if (!isDragging) {
			changePlayedTime(e.currentTarget.currentTime ?? 0);
		}
		changeCurrentMark(e.currentTarget.currentTime ?? 0);
	}, 1000);

	const onMarkClick = async (mark: Mark) => {
		const video = videoRef.current;
		if (video) {
			video.currentTime = mark.start;
			changeCurrentMark(mark.start);
			changePlayedTime(mark.start);
			await play();
		}
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

	useEffect(() => {
		if (shouldPlayOnVideoChange) {
			play();
		}
	}, [videoUrl]);

	return (
		<div id="playerWrapper" className={clsx(style.wrapper, { [style.videoPlayerFullScreen]: isFullScreen })}>
			<div
				onMouseLeave={isPlaying ? onHideControlPanel : undefined}
				onMouseEnter={onShowControlPanel}
				onMouseMove={handleMouseMove}
				className={clsx(style.videoPlayer, { [style.videoPlayerFullScreen]: isFullScreen })}
			>
				{isLoaderVisible && <Loader />}
				{browser.isIPhone ? (
					<video
						id={"player"}
						className={style.video}
						playsInline
						controls
						src={videoUrl}
						onCanPlayThrough={onHideLoader}
						onWaiting={onShowLoader}
						preload={"auto"}
						onProgress={onProgress}
						onDoubleClick={onDoubleClickHandler}
						onClick={onTogglePlay}
						style={{ width: "100%", height: "100%" }}
						onLoadedMetadata={onMetaDataLoadFinish}
						ref={videoRef}
						onTimeUpdate={handleTimeUpdate}
					></video>
				) : (
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
						onLoadedMetadata={onMetaDataLoadFinish}
						ref={videoRef}
						onTimeUpdate={handleTimeUpdate}
					></video>
				)}
				<div
					className={clsx(style.controlPanel, {
						[style.hiddenControlPanel]: !isControlPanelVisible && browser.isIPhone,
					})}
				>
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
									onQualityClick: changeVideoQuality,
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
			<TimeMarks<Mark>
				onMarkClick={onMarkClick}
				marks={marks}
				currentPlayerTime={playedTime}
				currentMark={mark}
			/>
		</div>
	);
}

export default VideoPlayer;
