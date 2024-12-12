import { useLoaderData } from "react-router-dom";

export async function loader({params}) {
    const miserables = await import("/public/miserables.json");
    const node = miserables.nodes.find(n => n.id === params.id);
    return { node };
}

export default function ViewNode() {
    const { node } = useLoaderData();

    return (
        <div className="float-right bg-gray-800">
            <h1 className="text-left text-slate-200">Id: {node.id}</h1>            
            <span className="text-left text-slate-300">Group: {node.group}</span>            
        </div>
    )
}