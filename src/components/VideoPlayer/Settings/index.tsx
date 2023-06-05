import { useRef, useState } from "react";
import { useOnClickOutside } from "../useOnClickOutside";
import { Settings } from "../../../types/common";
import clsx from "clsx";
import style from "./style.module.css";

type SettingsMenuProps = {
	isShow: boolean;
	onCloseMenu: () => void;
	quality: Settings["quality"];
};

const SettingsMenu = ({ isShow, onCloseMenu, quality }: SettingsMenuProps) => {
	const menuRef = useRef<HTMLDivElement | null>(null);

	const [isQualityIsShowing, setIsQualityIsShowing] = useState(false);
	useOnClickOutside(menuRef, (e) => {
		setIsQualityIsShowing(false);
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
	return (
		<div
			ref={menuRef}
			className={clsx(style.settings, { [style.settingsShow]: isShow, [style.settingsHidden]: !isShow })}
			role="menu"
		>
			{!isQualityIsShowing ? (
				<button onClick={onQualityClick} className={"menuItem"}>
					<span>Качество</span> &nbsp; <span>{quality?.current ?? "авто"}</span>
				</button>
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
		</div>
	);
};

export default SettingsMenu;
