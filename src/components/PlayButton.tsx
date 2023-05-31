

type PlayButtonProps = {
    onPlayClick: () => void;
    isPlaying: boolean
}
const PlayButton = ({onPlayClick, isPlaying}: PlayButtonProps) => {
    return (
        <button className={"button play"} onClick={onPlayClick}>
            {!isPlaying ?        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.7314 15.9551C0.6324 16.0311 0.4914 16.0131 0.4154 15.9131C0.3774 15.8621 0.3604 15.7991 0.3704 15.7381V0.265058C0.3484 0.143058 0.4314 0.0250581 0.5524 0.00305814C0.6164 -0.00594186 0.6804 0.0100581 0.7284 0.0480581L15.4794 7.81106C15.6774 7.91706 15.6774 8.08606 15.4794 8.19106L0.7314 15.9551Z" fill="white"/>
            </svg> :   <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.0039 16.5021C5.0199 16.7611 4.8229 16.9831 4.5609 17.0041H4.5019H1.5019C1.2429 17.0201 1.0199 16.8231 0.9999 16.5611V16.5021V1.50205C0.9839 1.24305 1.1809 1.02005 1.4429 1.00005H1.5019H4.5019C4.7609 0.984055 4.9839 1.18105 5.0039 1.44305V1.50205V16.5021ZM13.0039 1.50605C13.0199 1.24705 12.8229 1.02305 12.5609 1.00405H12.5019H9.5019C9.2429 0.988055 9.0199 1.18505 8.9999 1.44705V1.50605V16.5061C8.9839 16.7651 9.1799 16.9871 9.4429 17.0081H9.5019H12.5019C12.7599 17.0231 12.9839 16.8271 13.0039 16.5641V16.5061V1.50605Z" fill="white"/>
            </svg>}
        </button>
    )
}

export default PlayButton