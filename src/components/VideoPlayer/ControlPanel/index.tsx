import {forwardRef, MouseEvent, useState} from "react";
import {getFormattedTime} from "../../../helpers/getFormattedTime";
import {Mark, Settings} from "../../../types/common";
import icons from '../../../assets/sprite.svg';
import SettingsMenu from "../Settings";
import browser from "../../../helpers/browser";
import style from "./style.module.css"
import clsx from "clsx";

type ControlPanelProps = {
onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
onProgressBarClick: (event: MouseEvent<HTMLDivElement>) => void;
onFullScreenEnter: () => void;
widthOfVideoLength: number;
uploadedProgress: number;
uploadedProgressPosition: number
time: number;
isPlaying: boolean;
onVideoPlayClick: () => void;
videoDuration: number;
marks: Array<Mark>;
hoveredTime: number;
settings: Settings;
    isControlPanelVisible: boolean
}

const ControlPanel = forwardRef<HTMLDivElement, ControlPanelProps>(({settings, isControlPanelVisible, onFullScreenEnter, hoveredTime, marks, videoDuration, onVideoPlayClick, isPlaying, onProgressBarClick, uploadedProgressPosition, uploadedProgress, widthOfVideoLength, time, onMouseMove}, ref) => {
    const {minutes, seconds} = getFormattedTime(videoDuration)
    const {minutes: currentMinutes, seconds: currentSeconds} = getFormattedTime(time)
    const [currentMark, setCurrentMark] = useState<{position: number, label: string} | null>(null);
    const [isSettingsShow, setIsSettingsShow] = useState(false);
    const onHover = (mark: {position: number, label: string} | null) => {
        setCurrentMark(mark)
    }

    const onSettingsClick = () => {
        setIsSettingsShow(true)
    }

    const onCloseSettings = () => {
        setIsSettingsShow(false)
    }

    return (
        <div className={clsx(style.controlPanel, {[style.hiddenControlPanel]: !isControlPanelVisible})}>
            <div onMouseMove={onMouseMove} className={style.videoProgressBar} ref={ref} onClick={onProgressBarClick}>
                {marks.map((mark) => {
                    const markerProgress = videoDuration ? mark.start / videoDuration : 0;
                    const markerPosition = Math.round(markerProgress * 100);
                    const markWidth = ((mark.end - mark.start) / videoDuration) * 100;
                    return <div onMouseEnter={() => {
                    return onHover({label: mark.text, position: markerPosition})}
                    } onMouseLeave={() => {return onHover(null)}} key={mark.start} className={style.mark} style={{left: `${markerPosition}%`, width: `${markWidth}%`}}>
                    </div>
                })}
                {currentMark !== null ? <div className={style.markHover} style={{left: `${currentMark.position}%`}}>{currentMark.label}</div> : null}
                <div className={style.carriage} style={{ width: `${widthOfVideoLength}%`}} />
            </div>
            <div className={style.controls}>
                <div>
                    <button className={style.button} onClick={onVideoPlayClick}>
                        {isPlaying ?  <svg width="14px" height="14px">
                            <use xlinkHref={`${icons}#stop`} />
                        </svg> :  <svg width="14px" height="14px">
                            <use xlinkHref={`${icons}#play`} />
                        </svg>}
                    </button>
                    <time className={style.time}>
                        {`${currentMinutes}:${currentSeconds}`}/{`${minutes}:${seconds}`}
                    </time>
                </div>
               <div>
                   <SettingsMenu quality={settings.quality} onCloseMenu={onCloseSettings} isShow={isSettingsShow}  />
                   <button className={style.button} onClick={onSettingsClick}>
                       <svg width="15px" height="15px">
                           <use xlinkHref={`${icons}#settings`} />
                       </svg>
                   </button>
                   {!browser.isIPhone && <button onClick={onFullScreenEnter}  className={style.button}>
                       <svg width="14px" height="14px">
                           <use xlinkHref={`${icons}#fullScreen`} />
                       </svg>
                   </button>
                   }

               </div>
            </div>
        </div>

    )
})

export default ControlPanel