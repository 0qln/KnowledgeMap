import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewNode() {
    const { id } = useParams();
    const [nodeData, setNodeData] = useState(null);
    
    useEffect(() => {
        async function fetchNodeData() {
            const { miserables } = await import("/public/miserables.json");
            const node = miserables.nodes.find(n => n.id === id);
            setNodeData(node);
        }
        
        fetchNodeData();
    }, [id]);
    
    if (!nodeData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="m-5">
            <h1 className="text-left text-slate-900 text-3xl">{nodeData.id}</h1>            
            <div className="text-left text-slate-800">Id: {nodeData.id}</div>            
            <div className="text-left text-slate-800">Group: {nodeData.group}</div>            
        </div>
    )
}