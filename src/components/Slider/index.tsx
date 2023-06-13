import { KeenSliderOptions, TrackDetails } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import clsx from "clsx";
import style from "./style.module.css";
type SliderProps = {
	children: JSX.Element | Array<JSX.Element>;
};
const Slider = ({ children }: SliderProps) => {
	const [sliderTrackInfo, setSliderTrackInfo] = useState<TrackDetails | null>(null);

	const [sliderRef, instanceRef] = useKeenSlider({
		slides: {
			perView: 5,
			spacing: 15,
		},
	});

	const nextSlide = (): void => {
		if (instanceRef.current === null) {
			return;
		}

		instanceRef.current.next();
	};
	const isDisabledNextButton = sliderTrackInfo !== null && sliderTrackInfo.abs === sliderTrackInfo.maxIdx;

	return (
		<div className="keen-slider" ref={sliderRef}>
			<div className={clsx("keen-slider__slide", style.slide)}>{children}</div>
		</div>
	);
};

export default Slider;
