import '../App.css';
import * as poseDetection from '@tensorflow-models/pose-detection';
import Webcam from "react-webcam";
import {useRef, useState} from "react";
import {drawKeypoints, drawSkeleton} from "../utilities";

function MoveNet() {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const initialState = {
        stopRecording: true,
    };
    const [state, setState] = useState(initialState);

    const runMovenet = async () => {
        console.log("loading movenet ...")
        const model = poseDetection.SupportedModels.MoveNet;
        // Create a detector.
        console.log("loading movenet DONE")
        const detector = await poseDetection.createDetector(model);
        setInterval(() => {
            detect(detector);
        }, 100);
    };

    const detect = async (detector) => {
        console.log("Detecting start")
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
            const poses = await detector.estimatePoses(video);
            // console.log(poses[0]);

            drawCanvas(poses[0], video, videoWidth, videoHeight, canvasRef);
        }
    };

    const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
        console.log("Drawing start")
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        const modelType = "Movenet"
        drawKeypoints(pose.keypoints, 0.6, ctx, 1, modelType);
        // drawSkeleton(pose.keypoints, 0.7, ctx, 1, modelType);
    };

    const startExercise = () => {
        setState((prev) => ({
            stopRecording: false
        }));
        runMovenet();
    };
    const stopExercise = () => {
        setState((prev) => ({
            stopRecording: true
        }));
    };
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

export default MoveNet;