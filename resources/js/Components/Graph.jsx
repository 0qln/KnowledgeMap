import { router } from "@inertiajs/react";
import { useRef, useEffect, useContext, useMemo, useCallback } from "react";
import { GraphContext } from "@/Context/GraphContext";
import { useGraph } from "@/Hooks/useGraph";
import * as d3 from "d3";
import "lodash.product";
import { range, product, filter } from "lodash";

export function nodeEq(aNode, bNodeOrId) {
    return (
        aNode.id === bNodeOrId.id ||
        aNode.id === bNodeOrId
    );
}

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

    const { filteredNodes, filteredLinks } = useMemo(() => {
        function outgoing(node) {
            return links.filter(l => nodeEq(node, l.source));
        }

        function incoming(node) {
            return links.filter(l => nodeEq(node, l.target));
        }

        const query = filters.queryIsCaseSensitive ? filters.query : filters.query.toLowerCase();
        function queryMatches(node) {
            const title = filters.queryIsCaseSensitive ? node.title : node.title.toLowerCase();
            return title.includes(query);
        }

        const matchOutgoing = filters.allowedSeparationOutgoing;
        const matchIncoming = filters.allowedSeparationIncoming;
        function matches(node, depth) {
            return queryMatches(node) || depth > 0 && (
                (matchIncoming && outgoing(node).some(l => matches(l.target, depth - 1))) ||
                (matchOutgoing && incoming(node).some(l => matches(l.source, depth - 1)))
            );
        }

        function orphan(node) {
            return links
                .filter(l => nodeEq(node, l.source) || nodeEq(node, l.target))
                .length == 0;
        }

        const blacklistedTagIds = filters.tagBlacklist.map(t => t.id);
        function blacklisted(node) {
            return node.tags.some(t => blacklistedTagIds.includes(t.id));
        }

        const filteredNodes = nodes.filter(n => (
            true
            && (filters.orphans || !orphan(n))
            && !blacklisted(n)
            && matches(n, filters.allowedDegreesOfSeparation)
        ));
        const filteredLinks = links.filter(l => (
            filteredNodes.some(n => nodeEq(n, l.source)) &&
            filteredNodes.some(n => nodeEq(n, l.target))
        ));
        return { filteredNodes, filteredLinks };
    }, [filters, nodes, links]);

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    const aversion = 22;

    const aversionNodes = useMemo(() => {
        const toSimulationX = x => x - dim.width / 2;
        const toSimulationY = y => y - dim.height / 2;
        return displayRules.avoidRects.map((r, i) => {
            const maxX = Math.round(r.width / aversion);
            const maxY = Math.round(r.height / aversion);
            const ret = product(
                range(maxX + 1),
                range(maxY + 1)
            ).map(([x, y]) => ({
                isAverionNode: true,
                fx: toSimulationX(r.x + lerp(0, r.width, x / maxX)),
                fy: toSimulationY(r.y + lerp(0, r.height, y / maxY))
            }));
            return ret;
        }).flat(2);
    }, [displayRules.avoidRects, dim]);
    
    console.log(aversionNodes);

    const simulationNodes = useMemo(() => {
        return filteredNodes.concat(aversionNodes);
    }, [filteredNodes, aversionNodes]);

    // vary the force based on the available width and height, 
    // such that the graph stretches into the available space
    // and does not remain square-ish.
    //
    const forceX = useMemo(() => {
        const w = dim.width / 1000;
        const scale = 1 / w;
        return displayRules.forceX * scale;
    }, [displayRules.forceX, dim]);
    //
    const forceY = useMemo(() => {
        const h = dim.height / 1000;
        const scale = 1 / h;
        return displayRules.forceY * scale;
    }, [displayRules.forceY, dim]);

    const centerX = useMemo(() =>
        displayRules.centerOffsetX
        , [displayRules.centerOffsetX]);

    const centerY = useMemo(() =>
        displayRules.centerOffsetY,
        [displayRules.centerOffsetY]);

    const forceManyBody = useCallback((node) => {
        return ((node) => node.isAverionNode)(node) ? -aversion : -dim.width * dim.height / 20000;
    }, [dim, aversion]);

    useEffect(() => {
        const svg = d3.select(ref.current);

        console.log("effect");

        simulation.current = d3.forceSimulation(simulationNodes)
            .force("x", d3.forceX(centerX).strength(forceX))
            .force("y", d3.forceY(centerY).strength(forceY))
            .force("charge", d3.forceManyBody().strength(forceManyBody))
            .on("tick", ticked);
        
            console.log(filteredLinks)

        let link = svg.append("g").attr("stroke", "#888").attr("stroke-opacity", 0.6).selectAll();
        let node = svg.append("g").attr("stroke", "#eee").attr("stroke-width", 1.5).selectAll();

        function restart() {

            node = node.data(simulationNodes);
            node.exit().remove();
            node = node.enter()
                .append("circle")
                .attr("fill", d => ((node) => node.isAverionNode)(d) ? "#fff" : colorMap(d))
                .attr("r", d => ((node) => node.isAverionNode)(d) ? 0 : 5)
                .on("contextmenu", (e, d) => {
                    removeNode(d);
                    e.preventDefault();
                }, { passive: false /* otherwise preventDefault() doesnt work */ })
                .on("click", (e, d) => {
                    router.visit(route("dashboard.nodes.show", d.id));
                })
                .merge(node);

            node.append("title").text(d => d.title);

            node.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

            link = link.data(filteredLinks.filter(l => simulationNodes.includes(l.source) && simulationNodes.includes(l.target)));
            link.exit().remove();
            link = link.enter()
                .append("line")
                .attr("stroke-width", d => Math.sqrt(d.value))
                .on("contextmenu", (e, d) => {
                    removeLink(d.source, d.target);
                    e.preventDefault();
                }, { passive: false /* otherwise preventDefault() doesnt work */ })
                .on("click", (e, d) => {
                    router.visit(route("dashboard.edges.show", d.id));
                })
                .merge(link);
            link.append("title").text(d => indexToId(d.id));

            const count = (node) => {
                return filteredLinks.filter(l => l.source === node || l.target === node).length;
            }
            simulation.current.nodes(simulationNodes);
            simulation.current.force("link", d3.forceLink(filteredLinks).id(d => d.id).strength(d => {
                const x = Math.min(1.5, (Math.sqrt(Math.sqrt(d.value))))
                return x / Math.min(count(d.source), count(d.target));
            }));
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
    }, [simulationNodes, filteredLinks]);

    useEffect(() => {
        if (ref.current) {
            const { width: w, height: h } = dim;
            d3.select(ref.current).attr("viewBox", [-w / 2, -h / 2, w, h])
        }
    }, [dim, ref]);

    useEffect(() => {
        simulation.current.force("x", d3.forceX(centerX).strength(forceX))
        simulation.current.force("y", d3.forceY(centerY).strength(forceY))
        simulation.current.force("charge", d3.forceManyBody().strength(forceManyBody));
    }, [centerX, centerY, forceX, forceY, forceManyBody]);

    useEffect(() => {
        if (resetFn.current) resetFn.current();
    }, [resetFn, simulationNodes, filteredLinks]);

    return (
        <svg id="graph" ref={ref} />
    );
};