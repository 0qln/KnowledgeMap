import { Outlet } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import Graph from "../components/graph";

export async function loader() {
    const data = await import("/public/miserables.json");
    return { miserables: data.miserables }
}

export default function Root() {
    const { miserables } = useLoaderData();
    return (
        <>
            <h1 className="text-center text-2xl">Knowledge Map</h1>
            <div className="absolute right-0 left-0 top-0 bottom-0" id="graph">
                <Graph data={miserables} width={800} height={600} showGroups={[5, 4, 2]} />                
            </div>
            <div className="flex" id="detail">
                <Outlet />
            </div>
        </>
    )
}