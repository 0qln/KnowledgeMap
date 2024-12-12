import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";

// todo: 
// this has route navigation logic and is only really used once,
// inline this component in the root component.
export default function Graph({ data, showGroups }) {
    const ref = useRef();
    const navigate = useNavigate();

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const nodes = data.nodes
        .filter(d => showGroups.includes(d.group))
        .map(d => ({ ...d }));

    const links = data.links
        .filter(d =>
            showGroups.includes(data.nodes.find(n => n.id === d.source).group) &&
            showGroups.includes(data.nodes.find(n => n.id === d.target).group))
        .map(d => ({ ...d }));

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;

    useEffect(() => {

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
    }, [data, width, height, showGroups])

    return <svg ref={ref} />;
}