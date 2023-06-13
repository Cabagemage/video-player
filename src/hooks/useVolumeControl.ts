import { MutableRefObject, useState } from "react";

const useVolumeControl = (mediaRef: MutableRefObject<HTMLMediaElement | null>) => {
	const [volume, setVolume] = useState(0.3);
	const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);

	const showAudioSlider = () => {
		setIsVolumeSliderVisible(true);
	};
	const hideAudioSlider = () => {
		setIsVolumeSliderVisible(false);
	};

	const onChangeSound = (volume: string) => {
		const player = mediaRef.current;
		const newVolume = Number(volume);
		setVolume(newVolume);

		if (player) {
			player.volume = newVolume;
		}
	};

	const onDisableSound = () => {
		const player = mediaRef.current;
		if (player) {
			player.volume = 0;
			setVolume(0);
		}
	};

	const onEnableSound = () => {
		const player = mediaRef.current;
		if (player) {
			player.volume = 1;
			setVolume(1);
		}
	};

	const toggleSound = () => {
		if (volume >= 0) {
			onDisableSound();
		}
		if (volume === 0) {
			onEnableSound();
		}
	};

	return {
		onChangeSound,
		toggleSound,
		volume,
		showAudioSlider,
		hideAudioSlider,
		isVolumeSliderVisible,
	};
};

export default useVolumeControl;
