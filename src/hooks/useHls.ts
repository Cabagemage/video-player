import Hls from "hls.js";
import { MutableRefObject, useEffect, useRef } from "react";
import { Quality } from "../types/videoPlayer";
import useQuality from "./useQuality";
import browser from "../helpers/browser";

type UseHlsParams = {
	videoRef: MutableRefObject<HTMLMediaElement | null>;
	videoUrl: string;
};
const useHls = ({ videoRef, videoUrl }: UseHlsParams) => {
	let hlsRef = useRef<null | Hls>(null);
	const { availableQualities, getAvailableQualities, currentQuality, changeQuality } = useQuality();
	const video = videoRef.current;
	const initHls = (videoUrl: string) => {
		if (Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(videoUrl);
			hls.attachMedia(video);
			return hls;
		} else {
			video.src = videoUrl;
			return null;
		}
	};
	const getQualityList = () => {
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
			getAvailableQualities(levels);
		});
	};
	const destroyHls = () => {
		if (hlsRef.current instanceof Hls) {
			hlsRef.current.destroy();
		}
	};

	const changeVideoQuality = (qualityIdx: number) => {
		// переключаем качество видео
		hlsRef.current.currentLevel = qualityIdx;
		// обновляем состояние текущего качества
		changeQuality(qualityIdx);
	};

	useEffect(() => {
		if (!browser.isIPhone) {
			hlsRef.current = initHls(videoUrl);
		}
		return () => {
			destroyHls();
		};
	}, [video, videoUrl]);

	useEffect(() => {
		getQualityList();
	}, [hlsRef.current]);

	return {
		availableQualities,
		currentQuality,
		changeVideoQuality,
	};
};

export default useHls;
