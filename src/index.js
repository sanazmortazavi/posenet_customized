import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoveNet from "./pages/MoveNet";
import PoseNet from "./pages/PoseNet";
import Layout from "./pages/Layout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="poseNet" element={<PoseNet />} />
                    <Route path="moveNet" element={<MoveNet />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);