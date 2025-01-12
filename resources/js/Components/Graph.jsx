import { router } from "@inertiajs/react";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { useGraph } from "@/Hooks/useGraph";
import * as d3 from "d3";
import "lodash.product";
import { range, product } from "lodash";

function nodeEq(aNode, bNodeOrId) {
    return (
        aNode.id === bNodeOrId.id ||
        aNode.id === bNodeOrId
    );
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

export const Graph = function ({ dim }) {
    const ref = useRef();
    const {
        nodes,
        links,
        filters,
        displayRules,
        simulation,
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

    const aversion = 22;

    const aversionNodes = useMemo(() =>
        displayRules.avoidRects.map((r, i) => {
            const maxX = Math.round(r.width / aversion);
            const maxY = Math.round(r.height / aversion);
            return product(
                range(maxX + 1),
                range(maxY + 1)
            ).map(([x, y]) => ({
                id: -(i * 1e8 + x * 1e4 + y) - 1,
                isAverionNode: true,
                fx: r.x + lerp(0, r.width, x / maxX),
                fy: r.y + lerp(0, r.height, y / maxY)
            }));
        }).flat(2),
        [displayRules.avoidRects]);

    const simulationNodes = useMemo(() => {
        return filteredNodes.concat(aversionNodes);
    }, [filteredNodes, aversionNodes]);

    const simulationLinks = useMemo(() => {
        return filteredLinks.filter(l =>
            simulationNodes.some(n => nodeEq(n, l.source)) &&
            simulationNodes.some(n => nodeEq(n, l.target))
        );
    }, [filteredLinks]);

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
        displayRules.centerOffsetX + dim.width / 2,
        [displayRules.centerOffsetX, dim]);

    const centerY = useMemo(() =>
        displayRules.centerOffsetY + dim.height / 2,
        [displayRules.centerOffsetY, dim]);

    // scale the force such that the graph expands when it has 
    // enough space to do so
    const forceManyBody = useCallback(n =>
        n.isAverionNode
            ? -aversion
            : -55 + -5 * dim.width * dim.height / displayRules.avoidRects.reduce(
                (acc, r) => acc + (r.width * r.height), 0
            ),
        [dim, aversion, displayRules.avoidRects]);

    const linkRef = useRef(null);
    const nodeRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        linkRef.current = svg.append("g").attr("stroke", "#888").attr("stroke-opacity", 0.6).selectAll();
        nodeRef.current = svg.append("g").attr("stroke", "#eee").attr("stroke-width", 1.5).selectAll();

        return d3.select(ref.current).selectAll("*").remove;
    }, []);

    function updateNodeRef(nodes) {
        nodeRef.current = nodeRef.current.data(nodes, d => d.id);
        nodeRef.current.exit().remove();
        nodeRef.current = nodeRef.current
            .enter()
            .append("circle")
            .attr("fill", d => d.isAverionNode ? "#fff" : colorMap(d))
            .attr("r", d => d.isAverionNode ? 0 : 5)
            .on("contextmenu", (e, d) => {
                removeNode(d);
                e.preventDefault();
            }, { passive: false /* otherwise preventDefault() doesnt work */ })
            .on("click", (e, d) => {
                router.visit(route("dashboard.nodes.show", d.id));
            })
            .merge(nodeRef.current);

        nodeRef.current
            .append("title")
            .text(d => d.title);

        nodeRef.current.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    }

    function updateLinkRef(links) {
        linkRef.current = linkRef.current.data(links, d => d.id);
        linkRef.current.exit().remove();
        linkRef.current = linkRef.current.enter()
            .append("line")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .on("contextmenu", (e, d) => {
                removeLink(d.source, d.target);
                e.preventDefault();
            }, { passive: false /* otherwise preventDefault() doesnt work */ })
            .on("click", (e, d) => {
                router.visit(route("dashboard.edges.show", d.id));
            })
            .merge(linkRef.current);

        linkRef.current
            .append("title")
            .text(d => indexToId(d.id));
    }

    useEffect(() => {
        simulation.current = d3
            .forceSimulation()
            .on("tick", ticked);

        return simulation.current.stop;
    }, []);

    function ticked() {
        linkRef.current
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodeRef.current
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

    useEffect(() => {
        if (ref.current) {
            d3.select(ref.current).attr("viewBox", [0, 0, dim.width, dim.height])
        }
    }, [dim, ref]);

    useEffect(() => {
        simulation.current.force("charge", d3.forceManyBody().strength(forceManyBody));
        simulation.current.alpha(.4).restart();
    }, [forceManyBody]);

    useEffect(() => {
        simulation.current.force("x", d3.forceX(centerX).strength(forceX));
        simulation.current.alpha(.4).restart();
    }, [forceX, centerX]);

    useEffect(() => {
        simulation.current.force("y", d3.forceY(centerY).strength(forceY));
        simulation.current.alpha(.4).restart();
    }, [forceY, centerY]);

    useEffect(() => {
        updateNodeRef(simulationNodes);
        simulation.current.nodes(simulationNodes);
        simulation.current.alpha(.4).restart();
    }, [simulationNodes]);

    useEffect(() => {
        updateLinkRef(simulationLinks);
        simulation.current.force("link", d3.forceLink(simulationLinks).id(d => d.id).strength(d => {
            const f = n => simulationLinks.filter(l => nodeEq(n, l.source) || nodeEq(n, l.target)).length;
            const x = Math.min(2, (Math.sqrt(Math.sqrt(d.value))))
            return x / Math.min(f(d.source), f(d.target));
        }));
        simulation.current.alpha(.4).restart();
    }, [simulationLinks]);

    return (
        <svg id="graph" ref={ref} />
    );
};