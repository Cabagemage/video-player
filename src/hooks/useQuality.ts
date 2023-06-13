import { useState } from "react";
import { Quality } from "../types/videoPlayer";
import { MEDIUM_QUALITY_IDX } from "../helpers/constants";

const useQuality = () => {
	const [availableQualities, setAvailableQualities] = useState<Array<Quality>>([]);
	const [currentQuality, setCurrentQuality] = useState(MEDIUM_QUALITY_IDX);

	const changeQuality = (qualityIdx: number) => {
		setCurrentQuality(qualityIdx);
	};
	const getAvailableQualities = (qualities: Array<Quality>) => {
		setAvailableQualities(qualities);
	};

	return {
		availableQualities,
		currentQuality,
		changeQuality,
		getAvailableQualities,
	};
};

export default useQuality;
