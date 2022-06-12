import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/poseNet">PoseNet Pose Detection</Link>
                    </li>
                    <li>
                        <Link to="/moveNet">MoveNet Pose Detection</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;