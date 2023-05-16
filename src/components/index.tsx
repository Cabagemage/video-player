import {useRef, useState} from "react";


type VideoPlayerProps = {
    videoUrl: string;
    marks: Array<{
        time: string;
        label: string;
    }>
}
function VideoPlayer({videoUrl}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressBarRef = useRef(null);
    const [time, setTime] = useState<null | string>(null);
    const [percent, setPercent] = useState(0);
    const handleMouseMove = (event) => {
        const video = videoRef.current;
        console.log(video?.duration)
        const progressBar = event.target;
        const { left, width } = progressBar.getBoundingClientRect();
        const mouseX = event.clientX - left;
        const progress = mouseX / width;
        const currentTime = progress * video?.duration;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setTime(formattedTime);
    };

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
        const video = videoRef.current;
        const percent = (video?.currentTime / video?.duration) * 100;
        setPercent(percent);
    };

    return (
        <div>
            <video ref={videoRef} src={videoUrl} onTimeUpdate={handleTimeUpdate} >
                Sorry, your browser doesn't support embedded videos.
            </video>
            <div ref={progressBarRef} onClick={handleProgressBarClick}>
                <div style={{ width: `${percent}%`, height: 50, backgroundColor: "#000" }} />
            </div>
            <div onMouseMove={handleMouseMove}>

                    <span>{time}</span>

            </div>
        </div>

    );
}

export default VideoPlayer;