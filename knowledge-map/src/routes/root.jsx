import { Outlet } from "react-router-dom";
import Graph from "../components/graph";

export default function Root() {
    return (
        <>
            <h1 className="text-center text-2xl">Knowledge Map</h1>
            <div id="graph">
                <Graph width={800} height={600} showGroup={[5, 4, 2]} />                
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    )
}