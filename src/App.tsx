import './App.css'
import VideoPlayer from "./components";

function App() {
    return (
            <VideoPlayer marks={[{time: 330, label: "О детях и их психологии"}, {time: 100, label: "О своей биографии"}, {time: 150, label: "О родителях"}]} videoUrl={"https://storage.yandexcloud.net/selfschool-bucket-stage/7e9b4ced-0b2c-4b54-b963-02afa8415141/master.m3u8"}  />
    );
}

export default App
