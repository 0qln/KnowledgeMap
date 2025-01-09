import { router } from "@inertiajs/react";
import { useRef, useEffect, useContext } from "react";
import { GraphContext, useGraph } from "@/Context/GraphContext";
import * as d3 from "d3";

export const Graph = function ({ dim }) {
    const ref = useRef();
    const {
        nodes,
        links,
        filters,
        displayRules,
        simulation,
        resetFn,
        removeNode,
        removeLink,
        colorMap,
        indexToId
    } = useGraph();

    function forceStrength(dim) {
        // vary the force based on the available width and height, 
        // such that the graph stretches into the available space
        // and does not remain square-ish.
        const widthScaled = dim.width / 1000;
        const heightScaled = dim.height / 1000;
        const scaleX = 1 / widthScaled;
        const scaleY = 1 / heightScaled;
        const forceX = displayRules.forceX * scaleX;
        const forceY = displayRules.forceY * scaleY;
        return { forceX, forceY }
    }
    
    function forceOffset(dim) {
        // todo: shift center point with respect to the available space.
        const centerOffsetX = 0;
        const centerOffsetY = 0;
        return { centerOffsetX, centerOffsetY }
    }

    useEffect(() => {
        const svg = d3.select(ref.current);

        const { forceX, forceY } = forceStrength(dim);
        const { centerOffsetX, centerOffsetY } = forceOffset(dim);
        simulation.current = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links))
            .force("charge", d3.forceManyBody())
            .force("x", d3.forceX(centerOffsetX).strength(forceX))
            .force("y", d3.forceY(centerOffsetY).strength(forceY))
            .on("tick", ticked);

        let link = svg.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6).selectAll();
        let node = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll();

        function restart() {

            node = node.data(nodes);
            node.exit().remove();
            node = node.enter()
                .append("circle")
                .attr("fill", d => colorMap(d))
                .attr("r", 5)
                .on("contextmenu", (e, d) => {
                    removeNode(d);
                    e.preventDefault();
                }, { passive: false /* otherwise preventDefault() doesnt work */ })
                .on("click", (e, d) => {
                    router.visit(route("dashboard.nodes.show", indexToId(d.id)));
                })
                .merge(node);

            node.append("title").text(d => d.title);

            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

            link = link.data(links.filter(l => nodes.includes(l.source) && nodes.includes(l.target)));
            link.exit().remove();
            link = link.enter()
                .append("line")
                .attr("stroke-width", d => Math.sqrt(d.value))
                .on("contextmenu", (e, d) => {
                    removeLink(d.source, d.target);
                    e.preventDefault();
                }, { passive: false /* otherwise preventDefault() doesnt work */ })
                .on("click", (e, d) => {
                    router.visit(route("dashboard.edges.show", indexToId(d.id)));
                })
                .merge(link);
            link.append("title").text(d => indexToId(d.id));

            simulation.current.nodes(nodes);
            simulation.current.force("link").links(links);
            simulation.current.alpha(1).restart();
        }

        resetFn.current = restart;
        resetFn.current();

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

        function dragstarted(event) {
            if (!event.active) simulation.current.alphaTarget(0.4).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.current.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.current.stop();
            d3.select(ref.current).selectAll("*").remove();
        };
    }, [colorMap, filters, nodes, links]);

    useEffect(() => {
        if (ref.current) {
            const { width, height } = dim;
            d3.select(ref.current).attr("viewBox", [-width / 2, -height / 2, width, height])
        }
    }, [dim, ref]);

    useEffect(() => {
        if (resetFn.current) {
            const { forceX, forceY } = forceStrength(dim);
            const { centerOffsetX, centerOffsetY } = forceOffset(dim);
            simulation.current.force("x", d3.forceX(centerOffsetX).strength(forceX))
            simulation.current.force("y", d3.forceY(centerOffsetY).strength(forceY))
            resetFn.current();
        }
    }, [displayRules, dim, resetFn]);

    return (
        <svg id="graph" ref={ref} />
    );
};