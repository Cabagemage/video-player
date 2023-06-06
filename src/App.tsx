import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import AudioPlayer from "./components/AudioPlayer";
import { AudioPlayerMark } from "./types/common";
import { useState } from "react";

type Mark = {
	start: number;
	end: number;
	text: string;
};
function App() {
	const marks: Mark[] = [
		{ start: 0, end: 7, text: "Введение" },
		{ start: 20, end: 40, text: "Демонстрация работы камеры" },
		{ end: 250, start: 150, text: "О функции GetComponent" },
	];
	const audioMarks: AudioPlayerMark[] = [
		{
			start: 0,
			end: 7,
			imageSrc: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
			label: "Введение",
		},
		{
			start: 20,
			end: 40,
			imageSrc:
				"https://www.searchenginejournal.com/wp-content/uploads/2019/07/the-essential-guide-to-using-images-legally-online.png",
			label: "Продолжение",
		},
		{
			end: 250,
			start: 150,
			imageSrc: "https://metricool.com/wp-content/uploads/jason-blackeye-364785-2.jpg",
			label: "Конец",
		},
	];
	const [currentTab, setCurrentTab] = useState(0);

	const changeTab = (tab: 1 | 0) => {
		setCurrentTab(tab);
	};
	return (
		<div>
			<div>
				<button
					onClick={() => {
						changeTab(0);
					}}
				>
					Аудиоплеер
				</button>
				<button
					onClick={() => {
						changeTab(1);
					}}
				>
					Видеоплеер
				</button>
			</div>
			<div className={"flex"}>
				{currentTab === 0 && (
					<AudioPlayer
						marks={audioMarks}
						currentAudioSrc={"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
					/>
				)}
				{currentTab === 1 && (
					<VideoPlayer
						marks={marks}
						videoUrl={
							"https://storage.yandexcloud.net/selfschool-bucket-stage/7e9b4ced-0b2c-4b54-b963-02afa8415141/master.m3u8"
						}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
