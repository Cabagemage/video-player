import { useRef, useState } from "react";
import { useOnClickOutside } from "../useOnClickOutside";
import { Settings } from "../../../types/common";
import clsx from "clsx";
import style from "./style.module.css";

type SettingsMenuProps = {
	isShow: boolean;
	onCloseMenu: () => void;
	quality: Settings["quality"];
	speed: Settings["speed"];
};

const speedRates = [0.5, 0.75, 1, 1.5, 2];

const SettingsMenu = ({ isShow, onCloseMenu, quality, speed }: SettingsMenuProps) => {
	const menuRef = useRef<HTMLDivElement | null>(null);

	const [isQualityIsShowing, setIsQualityIsShowing] = useState(false);
	const [isSpeedControlShowing, setIsSpeedControlShowing] = useState(false);

	useOnClickOutside(menuRef, () => {
		setIsQualityIsShowing(false);
		setIsSpeedControlShowing(false);
		onCloseMenu();
	});

	const closeQualityOptions = () => {
		setIsQualityIsShowing(false);
	};
	const onQualityClick = () => {
		setIsQualityIsShowing(true);
	};

	const onQualityOptionClick = (qualityIdx: number) => {
		quality.onQualityClick(qualityIdx);
		setIsQualityIsShowing(false);
	};
	const onSpeedOptionClick = (speedOption: number) => {
		speed.onOptionClick(speedOption);
		setIsSpeedControlShowing(true);
		onCloseMenu();
	};
	const onSpeedRateSettingsClick = () => {
		setIsSpeedControlShowing(true);
	};
	const closeSpeedRateMenu = () => {
		setIsSpeedControlShowing(false);
	};
	const isSubMenuShowing = isQualityIsShowing || isSpeedControlShowing;
	return (
		<div
			ref={menuRef}
			className={clsx(style.settings, { [style.settingsShow]: isShow, [style.settingsHidden]: !isShow })}
			role="menu"
		>
			{!isSubMenuShowing ? (
				<div>
					<button onClick={onQualityClick} className={style.menuItem}>
						<span>Качество</span> &nbsp; <span>{quality?.current ?? "авто"}</span>
					</button>
					<button onClick={onSpeedRateSettingsClick} className={style.menuItem}>
						<span>Скорость</span> &nbsp; <span>{speed.current}x</span>
					</button>
				</div>
			) : null}
			{isQualityIsShowing ? (
				<div
					className={clsx(style.settings, { [style.submenuShow]: isShow, [style.submenuHidden]: !isShow })}
					role="menu"
				>
					<button className={style.menuItem} onClick={closeQualityOptions}>
						Вернуться
					</button>
					{quality?.options.map((option) => {
						return (
							<button
								className={style.menuItem}
								onClick={() => {
									return onQualityOptionClick(option.level);
								}}
							>
								{option.quality}
							</button>
						);
					})}
				</div>
			) : null}
			{isSpeedControlShowing && (
				<div
					className={clsx(style.settings, { [style.submenuShow]: isShow, [style.submenuHidden]: !isShow })}
					role="menu"
				>
					<button className={style.menuItem} onClick={closeSpeedRateMenu}>
						Вернуться
					</button>
					{speedRates.map((option) => {
						return (
							<button
								className={style.menuItem}
								onClick={() => {
									return onSpeedOptionClick(option);
								}}
							>
								{option}x
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default SettingsMenu;
