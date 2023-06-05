import { useRef, useState} from "react";
import throttle from "../../helpers/throttle";
import icons from "../../assets/sprite.svg";
import style from "./style.module.css"
import {getFormattedTime} from "../../helpers/getFormattedTime";
import VolumeController from "../VolumeController";
import clsx from "clsx";
import {AudioPlayerMark} from "../../types/common";


type AudioPlayerProps = {
    currentAudioSrc: string | undefined;
    marks: Array<AudioPlayerMark>
}

const AudioPlayer = ({currentAudioSrc, marks}:AudioPlayerProps) => {
    const playerRef = useRef<HTMLMediaElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const progressBarRef = useRef<HTMLDivElement | null>(null)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(50);
    const [isVolumeVisible, setIsVolumeVisible] = useState(false)
    const [currentMark, setCurrentMark] = useState<string | null>(null);

    const findCurrentMark = (currentTime: number): undefined | AudioPlayerMark => {
        const currentSecond = Math.floor(currentTime)
        return marks.find((item) => {
            if(currentSecond >= item.start && currentSecond <= item.end){
                return item
            }
        })
    }

    const onTimeUpdate = throttle((e) => {
        setCurrentTime(e.target.currentTime);
        const mark = findCurrentMark(e.target.currentTime)
        if(mark !== undefined){
            setCurrentMark(mark.imageSrc)
            return;
        }
        setCurrentMark(null)
    }, 1000);

    const handleLoadedMetadata = (event) => {
        const song = event.target;
        setDuration(song.duration);
    }
    const onPlay = () => {
        const player = playerRef.current;
        if(player !== null){
            player.play()
            setIsPlaying(true)
        }
    }
    const onStop = () => {
        const player = playerRef.current;
        if(player !== null){
            player.pause()
            setIsPlaying(false)
        }
    }

    const showAudioSlider = () => {
        setIsVolumeVisible(true)
    }
    const hideAudioSlider = () => {
        setIsVolumeVisible(false)
    }
    const handleProgressBarClick = (event) => {
        const player = playerRef.current;
        const progressBar = progressBarRef.current;
        const { left, width } = progressBar?.getBoundingClientRect();
        const mouseX = event.clientX - left;
        const progress = mouseX / width;


        if(player){
            player.currentTime = progress * player.duration
            const mark = findCurrentMark(player?.currentTime)
            if(mark !== undefined){
                setCurrentMark(mark.imageSrc)
            }
        }
    };
    const {minutes, seconds} = getFormattedTime(duration)
    const {minutes: currentMinutes, seconds: currentSeconds} = getFormattedTime(currentTime)

    const changeSound = (volume: string) => {
        const player = playerRef.current;
        const newVolume = Number(volume);
        setVolume(newVolume)

        if(player){
            player.volume = newVolume
        }
    }

    const disableSound = () => {
        const player = playerRef.current;
        if(player){
            player.volume = 0;
            setVolume(0)
        }
    }
    const enableSound = () => {
        const player = playerRef.current;
        if(player){
            player.volume = 1;
            setVolume(1)
        }
    }
    const toggleSound = () => {
        if(volume >= 0){
            disableSound()
        }
        if(volume === 0){
            enableSound()
        }
    }

    return (
        <>
            <audio
                ref={playerRef} onLoadedMetadata={handleLoadedMetadata}
                src={currentAudioSrc ? currentAudioSrc : undefined}
                onPlay={onPlay}
                onTimeUpdate={onTimeUpdate}
            >
                Your browser does not support the <code>audio</code> element.
            </audio>
            <div className={style.audioPlayer}>
                <div className={style.imageWrapper}>
                    {currentMark !== null ? <img className={style.image} src={currentMark} /> : <canvas ref={canvasRef}></canvas>}
                </div>
                <div className={style.controls}>
                        <div className={style.leftControls}>
                            <button className={clsx(style.button)} onClick={isPlaying ? onStop : onPlay}>
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
                        <div ref={progressBarRef} onClick={handleProgressBarClick} className={style.progressBar}>
                            {marks.map((mark) => {
                                const markerProgress = duration ? mark.start / duration : 0;
                                const markerPosition = Math.round(markerProgress * 100);
                                const markWidth = ((mark.end - mark.start) / duration) * 100;
                                return <div key={mark.start} className={style.mark} style={{left: `${markerPosition}%`, width: `${markWidth}%`}}>
                                </div>
                            })}
                            <div
                                className={style.progressBarKnob}
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                    <div className={style.rightControls}>
                        <div className={style.soundControl} >
                            <button onMouseEnter={showAudioSlider} className={style.button} onClick={toggleSound}>
                                <svg width="20px" height="20px">
                                    <use xlinkHref={`${icons}#sound`} />
                                </svg>
                            </button>
                            <VolumeController onHide={hideAudioSlider} isVisible={isVolumeVisible} onChange={changeSound} value={volume} />
                        </div>
                    </div>
                    </div>
            </div>
        </>
    )
}

export default AudioPlayer