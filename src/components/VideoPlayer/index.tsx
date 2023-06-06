import { MouseEventHandler, useEffect, useRef, useState } from "react";
import ControlPanel from "./ControlPanel";
import style from "./style.module.css";
import { Mark } from "../../types/common";
import loadVideo from "../../helpers/hls";
import { useFullScreen } from "./useFullScreen.js";
import Hls from "hls.js";
import { Quality } from "../../types/videoPlayer";
import { MEDIUM_QUALITY_IDX } from "../../helpers/constants";
import browser from "../../helpers/browser";
import clsx from "clsx";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import VolumeController from "../VolumeController";
import useVolumeControl from "../../helpers/useVolumeControl";

type VideoPlayerProps = {
	videoUrl: string;
	marks: Array<Mark>;
};
function VideoPlayer({ videoUrl, marks }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const hlsRef = useRef<Hls | null>(null);
	const progressBarRef = useRef(null);
	const [playedTime, setPlayedTime] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [percent, setPercent] = useState(0);
	const [uploadedProgress, setUploadedProgress] = useState(0);
	const [uploadedProgressPosition, setUploadedProgressPosition] = useState(0);
	const [duration, setDuration] = useState(0);
	const [hoveredTime, setHoveredTime] = useState(0);
	const { toggleFullScreen, isFullScreen } = useFullScreen();
	const [availableQualities, setAvailableQualities] = useState<Array<Quality>>([]);
	const [currentQuality, setCurrentQuality] = useState(MEDIUM_QUALITY_IDX);
	const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
	const { isVolumeSliderVisible, volume, hideAudioSlider, showAudioSlider, onChangeSound, toggleSound } =
		useVolumeControl(videoRef);
	const handleMouseMove = (event) => {
		const video = videoRef.current;
		const progressBar = event.target;
		const { left, width } = progressBar.getBoundingClientRect();
		const mouseX = event.clientX - left;
		const progress = mouseX / width;
		const currentTime = progress * video?.duration;
		setHoveredTime(Math.round(currentTime));
	};

	function handleLoadedMetadata(event) {
		const video = event.target;
		setDuration(video.duration);
	}

	const handleProgressBarClick = (event) => {
		const video = videoRef.current;
		const progressBar = progressBarRef.current;
		const { left, width } = progressBar.getBoundingClientRect();
		const mouseX = event.clientX - left;
		const progress = mouseX / width;
		if (video) {
			video.currentTime = progress * video.duration;
		}
	};

	const handleTimeUpdate = throttle((e) => {
		const percent = (e.target.currentTime / e.target.duration) * 100;
		setPlayedTime(e.target.currentTime ?? 0);
		setPercent(percent);
	}, 1000);

	const playVideo = async () => {
		setIsPlaying(!isPlaying);
		if (isPlaying) {
			await videoRef.current?.pause();
			return;
		}
		await videoRef.current?.play();
	};
	const onListItemClick = (duration: number) => {
		const video = videoRef.current;
		if (video) {
			video.currentTime = duration;
			video.play();
			setIsPlaying(true);
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
		if (browser.isIPhone) {
			return;
		}
		toggleFullScreen();
	};

	const onVideoHover: MouseEventHandler<HTMLDivElement> = (e) => {
		setIsControlPanelVisible(true);
	};
	const onVideoLeave = () => {
		if (isPlaying) {
			setIsControlPanelVisible(false);
		}
	};
	return (
		<div className={clsx(style.wrapper, { [style.videoPlayerFullScreen]: isFullScreen })}>
			<div
				onMouseLeave={onVideoLeave}
				onMouseEnter={onVideoHover}
				className={clsx(style.videoPlayer, { [style.videoPlayerFullScreen]: isFullScreen })}
			>
				<video
					controls={false}
					playsInline
					webkitplaysinline
					preload={"auto"}
					onDoubleClick={onDoubleClickHandler}
					onClick={playVideo}
					style={{ width: "100%", height: "100%" }}
					onLoadedMetadata={handleLoadedMetadata}
					ref={videoRef}
					onTimeUpdate={handleTimeUpdate}
				>
					Sorry, your browser doesn't support embedded videos.
				</video>
				<ControlPanel
					isControlPanelVisible={isControlPanelVisible}
					settings={{
						quality: {
							onQualityClick: changeQuality,
							options: availableQualities,
							current: availableQualities[currentQuality]?.quality,
						},
					}}
					soundControl={
						<div className={style.soundControl} onMouseLeave={hideAudioSlider}>
							<button onMouseEnter={showAudioSlider} className={style.button} onClick={toggleSound}>
								<svg width="20px" height="20px">
									<use xlinkHref={`${icons}#sound`} />
								</svg>
							</button>
							<VolumeController isVisible={isVolumeSliderVisible} onChange={onChangeSound} value={volume} />
						</div>
					}
					onFullScreenEnter={toggleFullScreen}
					hoveredTime={hoveredTime}
					marks={marks}
					videoDuration={duration}
					onVideoPlayClick={playVideo}
					isPlaying={isPlaying}
					uploadedProgressPosition={uploadedProgressPosition}
					uploadedProgress={uploadedProgress}
					onMouseMove={handleMouseMove}
					onProgressBarClick={handleProgressBarClick}
					widthOfVideoLength={percent}
					time={playedTime}
					ref={progressBarRef}
				/>
			</div>
			<div className={"list"}>
				{marks.map((item, idx) => {
					const normalizedIndex = idx + 1;
					return (
						<button
							onClick={() => {
								onListItemClick(item.start);
							}}
							key={normalizedIndex}
							className={"button"}
						>{`${normalizedIndex}. ${item.text}`}</button>
					);
				})}
			</div>
		</div>
	);
}

export default VideoPlayer;
