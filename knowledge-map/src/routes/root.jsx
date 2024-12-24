import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Root() {
    return (
        <>
            <h1 className="text-center text-2xl">Knowledge Map</h1>
            <div className="absolute right-0 left-0 top-0 bottom-0" id="graph">
                <GraphLoader showGroups={[5, 4]} />                
            </div>
            <div className="flex justify-end m-5 " id="detail">
                <div className="w-[30%] bg-slate-300 rounded-md">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

const GraphLoader = function({ showGroups }) {
    const [nodes, setNodes] = useState(null);
    const [links, setLinks] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            const { miserables } = await import("/public/miserables.json");

            const l_nodes = miserables.nodes.filter(n => showGroups.includes(n.group));
            const l_links = miserables.links.filter(l => 
                showGroups.includes(miserables.nodes.find(n => n.id === l.source).group) &&
                showGroups.includes(miserables.nodes.find(n => n.id === l.target).group)
            );

            setNodes(l_nodes);
            setLinks(l_links);
        }
        
        fetchData();
    }, [ showGroups ]);
    
    if (!nodes || !links) {
        return <div>Loading...</div>;
    }

    return <Graph nodes={ nodes } links={ links } />
}

export const Graph = function(params) {
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const nodes = params.nodes.map(d => ({ ...d }));
        const links = params.links.map(d => ({ ...d }));

        // Specify the color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const width = 800;
        const height = 600;

        // Create a simulation with several forces.
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        // Create the SVG container.
        const svg = d3.select(ref.current)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: 100%;");

        // Add a line for each link, and a circle for each node.
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll()
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", d => color(d.group))
            .on("click", (event, d) => navigate(`/nodes/${d.id}`));

        node.append("title")
            .text(d => d.id);

        // Add a drag behavior.
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Set the position attributes of links and nodes each time the simulation ticks.
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        // Reheat the simulation when drag starts, and fix the subject position.
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        // Update the subject (dragged node) position during drag.
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        // Restore the target alpha so the simulation cools after dragging ends.
        // Unfix the subject position now that it’s no longer being dragged.
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => d3.select(ref.current).selectAll("*").remove();
    }, [ params.nodes, params.links ]);

    return <svg ref={ref} />;
};