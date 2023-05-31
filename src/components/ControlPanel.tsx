import {forwardRef, MouseEvent, useState} from "react";
import "./style.css"
import PlayButton from "./PlayButton";
import {getVideoTime} from "../helpers/getVideoTime";

type ControlPanelProps = {
onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
onProgressBarClick: (event: MouseEvent<HTMLDivElement>) => void;
widthOfVideoLength: number;
uploadedProgress: number;
uploadedProgressPosition: number
time: number;
isPlaying: boolean;
onVideoPlayClick: () => void;
videoDuration: number;
marks: Array<{
    time: number;
    label: string;
}>;
hoveredTime: number;
}

const ControlPanel = forwardRef<HTMLDivElement, ControlPanelProps>(({hoveredTime, marks, videoDuration, onVideoPlayClick, isPlaying, onProgressBarClick, uploadedProgressPosition, uploadedProgress, widthOfVideoLength, time, onMouseMove}, ref) => {
    const {minutes, seconds} = getVideoTime(videoDuration)
    const {minutes: currentMinutes, seconds: currentSeconds} = getVideoTime(time)
    const [currentMark, setCurrentMark] = useState<{position: number, label: string} | null>(null);

    const onHover = (mark: {position: number, label: string} | null) => {
        setCurrentMark(mark)
    }

    return (
        <div className={"controlPanel"}>
            <div onMouseMove={onMouseMove} className={"videoProgressBar"} ref={ref} onClick={onProgressBarClick}>
                {marks.map((mark) => {
                    const markerProgress = videoDuration ? mark.time / videoDuration : 0;
                    const markerPosition = Math.round(markerProgress * 100);
                    return <div onMouseEnter={() => {
                    return onHover({label: mark.label, position: markerPosition})}
                    } onMouseLeave={() => {return onHover(null)}} key={mark.time} className={"mark"} style={{left: `${markerPosition}%`}}>
                    </div>
                })}
                {currentMark !== null ? <div className={"mark-hover"} style={{left: `${currentMark.position}%`}}>{currentMark.label}</div> : null}
                <div className={"carriage"} style={{ width: `${widthOfVideoLength}%`}} />
            </div>
            <div className={"controls"}>
                <div>
                    <PlayButton onPlayClick={onVideoPlayClick} isPlaying={isPlaying} />
                    <time className={"time"}>
                        {`${currentMinutes}:${currentSeconds}`}/{`${minutes}:${seconds}`}
                    </time>
                </div>
               <div>
                   <button className={"button"}>
                       <svg height="14px" version="1.1" viewBox="0 0 14 14" width="14px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1"><g fill="#ffffff" id="Core" transform="translate(-215.000000, -257.000000)"><g id="fullscreen" transform="translate(215.000000, 257.000000)"><path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z" id="Shape"/></g></g></g></svg>
                   </button>
               </div>
            </div>
        </div>

    )
})

export default ControlPanel