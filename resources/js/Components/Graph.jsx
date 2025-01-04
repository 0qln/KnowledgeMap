import { router } from "@inertiajs/react";
import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

export function useGraphFilters() {
    const [filters, setFilters] = useState({
        blacklist: [],
        whitelist: [],
        tagsAsNodes: false,
        orphans: false,
        whiteListEnabled: false,
        blacklistEnabled: false,
    });

    const setFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return {
        filters,
        setFilter
    };
}

export function useGraphDisplayRules() {
    const [displayRules, setDisplayRules] = useState({
        forceX: .06,
        forceY: .06,
        centerOffsetX: 0,
        centerOffsetY: 0,
    });

    const setDisplayRule = (key, value) => {
        setDisplayRules((prev) => ({ ...prev, [key]: value }));
    };

    return {
        displayRules,
        setDisplayRule
    }
}

export function useGraphData(initNodes = null, initLinks = null) {
    const { nodes, setNodes } = useState(initNodes);
    const { links, setLinks } = useState(initLinks);

}

export const Graph = function ({ pNodes, pLinks, colorMap, idToIndex, indexToId, dim, displayRules, filters }) {
    const ref = useRef();

    console.log("render");

    // const [ forceX, setForceX ] = useRef(displayRules.forceX);
    // const [ forceY, setForceY ] = useRef(displayRules.forceY);
    
    const simulation = useRef(null);
    const resetFn = useRef(null);
    // console.log(resetFn);
    // const fn = () => console.log("reset");
    // console.log(fn);
    // fn();
    // setResetFn(() => fn);
    // console.log(resetFn);
    // resetFn();

    useEffect(() => {
        const nodes = pNodes.map(d => ({
            id: idToIndex(d.id),
            title: d.title
        }));
        const links = pLinks.map(d => ({
            id: idToIndex(d.id),
            source: idToIndex(d.id_origin),
            target: idToIndex(d.id_target),
            value: d.weight
        }));

        const svg = d3.select(ref.current);

        simulation.current = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links))
            .force("charge", d3.forceManyBody())
            // .force("center", d3.forceCenter().strength(.1))
            .on("tick", ticked);

        let link = svg.append("g")
            // .attr("width", width)
            // .attr("height", height)
            .attr("stroke", "#999").attr("stroke-opacity", 0.6).selectAll();
        let node = svg.append("g")
            // .attr("width", width)
            // .attr("height", height)
            .attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll();

        // restart();

        // todo can be hooks
        function removeLink(links, idSource, idTarget) {
            const index = links.findIndex(d =>
                d.source === idSource && d.target === idTarget ||
                d.source === idTarget && d.target === idSource);
            links.splice(index, 1);
            restart();
        }

        function removeNode(nodes, id) {
            const index = nodes.findIndex(d => d.id === id);
            nodes.splice(index, 1);
            restart();
        }

        function restart() {

            // Apply the general update pattern to the nodes.
            node = node.data(nodes);
            node.exit().remove();
            node = node.enter()
                .append("circle")
                .attr("fill", d => colorMap(indexToId(d.id)))
                .attr("r", 5)
                .on("mousedown", (event, d) => {
                    // todo: this doesnt prevent default
                    event.preventDefault();
                    switch (event.button) {
                        case 0:
                            console.log("left");
                            router.visit(route("dashboard.nodes.show", [d.id]));
                            break;
                        case 2:
                            console.log("right");
                            removeNode(nodes, d.id);
                            break;
                    }
                })
                .merge(node);

            node.append("title")
                .text(d => d.title);

            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

            // Apply the general update pattern to the links.
            link = link.data(links.filter(l => nodes.includes(l.source) && nodes.includes(l.target)));
            link.exit().remove();
            link = link.enter()
                .append("line")
                .attr("stroke-width", d => Math.sqrt(d.value))
                .on("click", (event, d) => removeLink(links, d.source, d.target))
                .merge(link);

            // Update and restart the simulation.
            simulation.current.nodes(nodes);
            simulation.current.force("link").links(links);
            simulation.current.alpha(1).restart();
        }
        resetFn.current = restart;

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
            if (!event.active) simulation.current.alphaTarget(0.3).restart();
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
            if (!event.active) simulation.current.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => d3.select(ref.current).selectAll("*").remove();
    }, [colorMap, filters, displayRules]);

    useEffect(() => {
        if (ref.current) {
            const { width, height } = dim;
            d3.select(ref.current)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
        }
    }, [dim]);
    
    useEffect(() => {
        if (resetFn.current) {
            // vary the force based on the available width and height.
            const forceX = (displayRules.forceX * 0.0011 * dim.height);
            const forceY = (displayRules.forceY * 0.0011 * dim.width);
            // todo: shift center point with respect to the available space.
            const x = displayRules.centerOffsetX;
            const y = displayRules.centerOffsetY;
            simulation.current.force("x", d3.forceX(x).strength(forceX))
            simulation.current.force("y", d3.forceY(y).strength(forceY))
            resetFn.current();
        }
    }, [displayRules.forceX, displayRules.forceY, dim, resetFn]);

    return (
        <>
            <svg id="graph" ref={ref} />
        </>

    );
};