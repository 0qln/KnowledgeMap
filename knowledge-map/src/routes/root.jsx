import { Outlet } from "react-router-dom";
import Graph from "../components/graph";

export default function Root() {
    return (
        <>
            <h1>Knowledge Map</h1>
            <div id="graph">
                <Graph />                
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    )
}