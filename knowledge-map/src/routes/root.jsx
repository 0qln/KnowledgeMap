import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <>
            <h1>Knowledge Map</h1>
            <div id="detail">
                <Outlet />
            </div>
        </>
    )
}