import style from "./style.module.css";

type TimeProps = {
	time: string;
};

const Time = ({ time }: TimeProps) => {
	return <time className={style.time}>{time}</time>;
};

export default Time;
