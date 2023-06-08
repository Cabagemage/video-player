import { Quality } from "./videoPlayer";

export type Mark = {
	start: number;
	end: number;
	text: string;
};
export type AudioPlayerMark = {
	start: number;
	end: number;
	imageSrc: string;
	label: string;
};
type QualitySettingsProps = {
	options: Array<Quality>;
	onQualityClick: (qualityId: number) => void;
	current?: string;
};
type Speed = {
	current?: number;
	onOptionClick: (speedRate: number) => void;
};
export type Settings = {
	quality: QualitySettingsProps;
	speed: Speed;
};
