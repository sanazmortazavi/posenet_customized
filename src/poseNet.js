
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import {useRef, useState} from "react";
import {drawKeypoints, drawSkeleton} from "./utilities";


function App() {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const initialState = {
        stopRecording: true,
    };
    const [state, setState] = useState(initialState);

    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.4,
        });

        setInterval(() => {
            detect(net);
        }, 100);
    };

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Make Detections
            const pose = await net.estimateSinglePose(video);
            console.log(pose);

            drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
        }
    };
    const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose["keypoints"], 0.6, ctx);
        drawSkeleton(pose["keypoints"], 0.7, ctx);
    };
    const startExercise = () => {
        setState((prev) => ({
            stopRecording: false
        }));
        runPosenet();
    };
    const stopExercise = () => {
        setState((prev) => ({
            stopRecording: true
        }));
    };
    // runPosenet();
    return (
        <div className="App">
            <header className="App-header">
                {state.stopRecording ? (<div>
                    <button
                        onClick={() => {
                            startExercise()
                        }}
                    >
                        Start Exercise
                    </button>
                </div>) : (<div>
                    <button
                        onClick={() => {
                            stopExercise()
                        }}
                    >
                        Stop Exercise
                    </button>
                    <div>
                        <Webcam
                            ref={webcamRef}
                            style={{
                                // position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zindex: 9,
                                width: 640,
                                height: 480,
                            }}
                        />
                        <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zindex: 9,
                                width: 640,
                                height: 480,
                            }}
                        />
                    </div>
                </div>)}


            </header>
        </div>
    );
}

export default App;
