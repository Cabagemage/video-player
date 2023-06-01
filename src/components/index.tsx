import {useEffect, useRef, useState} from "react";
import ControlPanel from "./ControlPanel";
import "./style.css"
import loadVideo from "../helpers/hls";

type VideoPlayerProps = {
    videoUrl: string;
    marks: Array<{
        time: number;
        label: string;
    }>
}
function VideoPlayer({videoUrl, marks}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressBarRef = useRef(null);
    const [playedTime, setPlayedTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [percent, setPercent] = useState(0);
    const [uploadedProgress, setUploadedProgress] = useState(0)
    const [uploadedProgressPosition, setUploadedProgressPosition] = useState(0);
    const [duration, setDuration] = useState(0)
    const [hoveredTime, setHoveredTime] = useState(0);
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
    useEffect(() => {
        if (videoRef.current) {
            loadVideo(videoUrl, videoRef.current);
        }
    }, [videoUrl]);
    const handleProgressBarClick = (event) => {
        const video = videoRef.current;
        const progressBar = progressBarRef.current;
        const { left, width } = progressBar.getBoundingClientRect();
        const mouseX = event.clientX - left;
        const progress = mouseX / width;
        if(video){
            video.currentTime = progress * video.duration
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef?.current;
        const percent = (video?.currentTime / video?.duration) * 100;
        setPlayedTime(video?.currentTime ?? 0)
        setPercent(percent);
    };

    const playVideo = () => {
        setIsPlaying(!isPlaying)

        if(isPlaying){
            videoRef.current?.pause()
            return;
        }
        videoRef.current?.play()
    }

    const onListItemClick = (duration: number) => {
        const video = videoRef.current;
        if(video){
            video.currentTime = duration
        }


    }
    return (
        <div className={"wrapper"}>
            <div className={"videoPlayer"}>
                <video  style={{width: "100%", height: "100%"}} onLoadedMetadata={handleLoadedMetadata}  ref={videoRef} onTimeUpdate={handleTimeUpdate} >
                    Sorry, your browser doesn't support embedded videos.

                </video>
                <ControlPanel hoveredTime={hoveredTime} marks={marks} videoDuration={duration} onVideoPlayClick={playVideo} isPlaying={isPlaying} uploadedProgressPosition={uploadedProgressPosition} uploadedProgress={uploadedProgress} onMouseMove={handleMouseMove} onProgressBarClick={handleProgressBarClick} widthOfVideoLength={percent} time={playedTime} ref={progressBarRef} />
            </div>
            <div className={"list"}>
                {marks.map((item,idx) => {
                    const normalizedIndex = idx + 1;
                    return (
                        <button onClick={() => {onListItemClick(item.time)}} key={normalizedIndex} className={"button"}>{`${normalizedIndex}. ${item.label}`}</button>
                    )
                })}
            </div>
        </div>


    );
}

export default VideoPlayer;