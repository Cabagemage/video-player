import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import AudioPlayer from "./components/AudioPlayer";
import { AudioPlayerMark } from "./types/common";
import { useState } from "react";
import firstVideoThumb from "./assets/thumbsExamples/0.png";
import secondVideoThumb from "./assets/thumbsExamples/1.png";
import thirdVideoThumb from "./assets/thumbsExamples/2.png";
import fourVideoThumb from "./assets/thumbsExamples/3.png";

type Mark = {
	start: number;
	end: number;
	text: string;
	imageSrc: string;
};
function App() {
	const marks: Mark[] = [
		{ start: 0, end: 7, text: "Введение", imageSrc: firstVideoThumb },
		{ start: 8, end: 19, text: "Второй текст", imageSrc: secondVideoThumb },
		{ start: 20, end: 40, text: "Демонстрация работы камеры", imageSrc: thirdVideoThumb },
		{ start: 41, end: 100, text: "Демонстрация работы камеры", imageSrc: thirdVideoThumb },
		{ end: 150, start: 101, text: "О функции GetComponent", imageSrc: fourVideoThumb },
		{ start: 151, end: 270, text: "Введение", imageSrc: firstVideoThumb },
		{ start: 271, end: 280, text: "Второй текст", imageSrc: secondVideoThumb },
		{ start: 290, end: 300, text: "Демонстрация работы камеры", imageSrc: thirdVideoThumb },
	];
	const audioMarks: AudioPlayerMark[] = [
		{
			start: 0,
			end: 7,
			imageSrc: "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
			text: "Введение",
		},
		{
			start: 20,
			end: 40,
			imageSrc:
				"https://www.searchenginejournal.com/wp-content/uploads/2019/07/the-essential-guide-to-using-images-legally-online.png",
			text: "Продолжение",
		},
		{
			end: 250,
			start: 150,
			imageSrc: "https://metricool.com/wp-content/uploads/jason-blackeye-364785-2.jpg",
			text: "Конец",
		},
	];
	const [playList, setPlayList] = useState([
		{
			label: "Видео 1",
			url: "https://storage.yandexcloud.net/selfschool-bucket-stage/de4bca43-e09d-4cd1-844c-54e0b58306ae/master.m3u8",
		},
		{
			label: "Видео 2",
			url: "https://storage.yandexcloud.net/selfschool-bucket-stage/7e9b4ced-0b2c-4b54-b963-02afa8415141/master.m3u8",
		},
	]);
	const [currentTab, setCurrentTab] = useState(1);
	const [currentVideoUrl, setCurrentVideoUrl] = useState(playList[0].url);

	const changeTab = (tab: 1 | 0) => {
		setCurrentTab(tab);
	};

	const changeCurrentVideo = (url: string) => {
		setCurrentVideoUrl(url);
	};
	return (
		<div>
			<h1>Демоверсия видео и аудио плееров</h1>
			<span>* Данные версии в данный момент в процессе разработки и не являются финальными</span>
			<div>
				<button
					onClick={() => {
						changeTab(1);
					}}
				>
					Видео
				</button>
				<button
					onClick={() => {
						changeTab(0);
					}}
				>
					Аудио
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
					<div className={"flex-row"}>
						<VideoPlayer marks={marks} videoUrl={currentVideoUrl} shouldPlayOnVideoChange={false} />
						<div>
							{playList.map((item) => {
								return (
									<button
										key={item.url}
										onClick={() => {
											return changeCurrentVideo(item.url);
										}}
										className={"playListButton"}
									>
										{item.label}
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
