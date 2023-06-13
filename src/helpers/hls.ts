import Hls from "hls.js";
import { MutableRefObject } from "react";
type LoadVideo = {
	url: string;
	videoElement: MutableRefObject<HTMLMediaElement> | null;
};
function loadVideo({ videoElement, url }: LoadVideo) {
	if (videoElement.current !== null) {
		if (Hls.isSupported() && videoElement.current) {
			const hls = new Hls();
			hls.loadSource(url);
			hls.attachMedia(videoElement.current);
			return hls;
		} else {
			videoElement.current.src = url;
			return null;
		}
	}
}

export default loadVideo;
