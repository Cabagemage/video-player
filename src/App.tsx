import {useRef, useState} from 'react'

import './App.css'
import VideoPlayer from "./components";

function App() {



    return (
        <div>
            <VideoPlayer videoUrl={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}  />
        </div>
    );
}

export default App
