import './App.css'
import VideoPlayer from "./components";

function App() {
    return (
            <VideoPlayer marks={[{time: 330, label: "О детях и их психологии"}, {time: 100, label: "О своей биографии"}, {time: 150, label: "О родителях"}]} videoUrl={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}  />
    );
}

export default App
