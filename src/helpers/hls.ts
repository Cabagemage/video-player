import Hls from "hls.js";
type LoadVideo = {
	url: string;
	videoElement: HTMLVideoElement | null;
};
function loadVideo({ videoElement, url }: LoadVideo) {
	if (videoElement !== null) {
		if (Hls.isSupported() && videoElement) {
			const hls = new Hls();
			hls.loadSource(url);
			hls.attachMedia(videoElement);

			return hls;
		} else {
			videoElement.src = url;
			return null;
		}
	}
}

export default loadVideo;
