import Hls from "hls.js";

function loadVideo(url: string, videoElement: HTMLVideoElement) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const player = new Plyr(videoElement);
            player.play();
        });
    } else {
        videoElement.src = url;
    }
}

export default loadVideo