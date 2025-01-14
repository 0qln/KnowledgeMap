import { router } from "@inertiajs/react";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { useGraph } from "@/Hooks/useGraph";
import * as d3 from "d3";
import "lodash.product";
import { range, product } from "lodash";

export function nodeId(node) {
    return typeof node == "object" ? node.id : node;
}

export function nodeEq(a, b) {
    return nodeId(a) === nodeId(b);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function outgoing(node, links) {
    return links.filter(l => nodeEq(node, l.source));
}

function incoming(node, links) {
    return links.filter(l => nodeEq(node, l.target));
}

// expects the links source and target to be references!!
function isDangling(node, links, cache = {}, nodeStates = new Map()) {
    const states = {
        UNVISITED: 0,
        WAITING: 1,
        PROCESSED: 2,
        PROCESSING: 3
    };

    const stack = [node];
    nodeStates.set(node.id, states.UNVISITED);

    while (stack.length) {
        const node = stack.pop();
        switch (nodeStates.get(node.id)) {
            default: 
            case states.UNVISITED:
                if (node.deleted) {
                    cache[node.id] = true;
                    nodeStates.set(node.id, states.PROCESSED);
                    break;
                }

                stack.push(node);
                nodeStates.set(node.id, states.WAITING);

                incoming(node, links).forEach(l => stack.push(l.source));
                outgoing(node, links).forEach(l => stack.push(l.target));

                nodeStates.set(node.id, states.PROCESSING);
                break;

            case states.WAITING:
                // cycle detected !
                cache[node.id] = false;
                nodeStates.set(node.id, states.PROCESSED);
                break;

            case states.PROCESSING:
                const allIncomingDangling = () => incoming(node, links).every(l => cache[nodeId(l.source)] === true);
                const allOutgoingDangling = () => outgoing(node, links).every(l => cache[nodeId(l.target)] === true);
                cache[node.id] = allIncomingDangling() && allOutgoingDangling();
                nodeStates.set(node.id, states.PROCESSED);
                break;

            case states.PROCESSED:
                // done
                break;
        }
    }

    return cache[node.id];
}

function orphan(node, links) {
    return links
        .filter(l => nodeEq(node, l.source) || nodeEq(node, l.target))
        .length == 0;
}

function dragstarted(event, simulation) {
    if (!event.active) simulation.current.alphaTarget(0.4).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

function dragended(event, simulation) {
    if (!event.active) simulation.current.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

function updateNodeRef(nodeRef, nodes, danglings, colorMap, simulation) {
    console.log("update node ref")
    nodeRef.current = nodeRef.current.data(nodes, d => d.id);
    nodeRef.current.exit().remove();
    nodeRef.current = nodeRef.current
        .enter()
        .append("circle")
        .attr("fill", d => d.deleted ? "#f00" : d.isAverionNode ? "#fff" : colorMap(d))
        .attr("stroke-opacity", d => danglings[d.id] ? "0.15" : "1")
        .attr("fill-opacity", d => danglings[d.id] ? "0.15" : "1")
        .attr("r", d => d.isAverionNode ? 0 : 5)
        // .on("contextmenu", (e, d) => {
        //     removeNode(d);
        //     e.preventDefault();
        // }, { passive: false /* otherwise preventDefault() doesnt work */ })
        .on("click", (e, d) => {
            router.visit(route("dashboard.nodes.show", d.id));
        })
        .merge(nodeRef.current);

    nodeRef.current
        .append("title")
        .text(d => d.title);

    nodeRef.current.call(d3.drag()
        .on("start", e => dragstarted(e, simulation))
        .on("drag", e => dragged(e))
        .on("end", e => dragended(e, simulation)));
}

function updateLinkRef(linkRef, links, danglings) {
    console.log("update link ref")
    linkRef.current = linkRef.current.data(links, d => d.id);
    linkRef.current.exit().remove();
    linkRef.current = linkRef.current.enter()
        .append("line")
        .attr("stroke", d => d.deleted ? "#f00" : "#888")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("stroke-opacity", d => d.deleted || danglings[nodeId(d.source)] || danglings[nodeId(d.target)] ? "0.1" : "0.6")
        // .on("contextmenu", (e, d) => {
        //     removeLink(d.source, d.target);
        //     e.preventDefault();
        // }, { passive: false /* otherwise preventDefault() doesnt work */ })
        .on("click", (e, d) => {
            router.visit(route("dashboard.edges.show", d.id));
        })
        .merge(linkRef.current);

    linkRef.current
        .append("title")
        .text(d => `${d.source.title} -> ${d.target.title}`);
}

export const Graph = function ({ dim }) {
    const ref = useRef();
    const linkRef = useRef(null);
    const nodeRef = useRef(null);
    const {
        nodes,
        links,
        filters,
        displayRules,
        simulation,
        colorMap,
    } = useGraph();

    useEffect(() => {
        const svg = d3.select(ref.current);
        linkRef.current = svg.append("g").selectAll();
        nodeRef.current = svg.append("g").attr("stroke", "#eee").attr("stroke-width", 1).selectAll();

        return d3.select(ref.current).selectAll("*").remove;
    }, []);

    simulation.current = useMemo(() => {
        return d3
            .forceSimulation()
            .on("tick", ticked)
            .stop();
    }, []);

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

    const { filteredNodes, filteredLinks } = useMemo(() => {
        const query = filters.queryIsCaseSensitive ? filters.query : filters.query.toLowerCase();
        function queryMatches(node) {
            const title = filters.queryIsCaseSensitive ? node.title : node.title.toLowerCase();
            return title.includes(query);
        }

        const matchOutgoing = filters.allowedSeparationOutgoing;
        const matchIncoming = filters.allowedSeparationIncoming;
        function matches(node, depth) {
            return queryMatches(node) || depth > 0 && (
                (matchIncoming && outgoing(node, links).some(l => matches(l.target, depth - 1))) ||
                (matchOutgoing && incoming(node, links).some(l => matches(l.source, depth - 1)))
            );
        }

        const blacklistedTagIds = filters.tagBlacklist.map(t => t.id);
        function blacklisted(node) {
            return node.tags.some(t => blacklistedTagIds.includes(t.id));
        }

        const filteredNodes = nodes.filter(n => (
            true
            && (filters.showDeletedNodes || !n.deleted)
            && (filters.orphans || !orphan(n, links))
            && !blacklisted(n)
            && matches(n, filters.allowedDegreesOfSeparation)
        ));
        const filteredLinks = links.filter(l => (
            filteredNodes.some(n => nodeEq(n, l.source)) &&
            filteredNodes.some(n => nodeEq(n, l.target))
        ));
        console.log(links.length);
        console.log(filteredLinks.length);
        console.log(filteredNodes.length);
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
        simulation.current.nodes(simulationNodes);
        simulation.current.force("link", d3.forceLink(filteredLinks).id(d => d.id).strength(d => {
            const f = n => filteredLinks.filter(l => nodeEq(n, l.source) || nodeEq(n, l.target)).length;
            const x = Math.min(2, (Math.sqrt(Math.sqrt(d.value))))
            return x / Math.min(f(d.source), f(d.target));
        }));
        return filteredLinks;
    }, [filteredLinks, simulationNodes, simulation.current]);

    // scale the force such that the graph expands when it has 
    // enough space to do so
    const forceManyBody = useCallback(n =>
        n.isAverionNode
            ? -aversion
            : -55 + -5 * dim.width * dim.height / displayRules.avoidRects.reduce(
                (acc, r) => acc + (r.width * r.height), 0
            ),
        [dim, aversion, displayRules.avoidRects]);
    
    useEffect(() => {
    }, [simulationNodes, simulation.current]);

    // dangling nodes are nodes that are either deleted themselfes,
    // or have only incoming and outgoing links that are dangling.
    // for large graphs, we will likely reach a stack overflow,
    // which is why we need to settle for an iterative approach instead
    // of a recursive one.
    const danglings = useMemo(() => {
        const states = new Map();
        return filteredNodes.reduce((acc, n) => {
            isDangling(n, simulationLinks, acc, states);
            return acc;
        }, {});
    }, [simulationLinks, filteredNodes]);

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

    useEffect(() => {
        if (ref.current) {
            d3.select(ref.current).attr("viewBox", [0, 0, dim.width, dim.height])
        }
    }, [dim, ref]);

    useEffect(() => {
        simulation.current.force("charge", d3.forceManyBody().strength(forceManyBody));
    }, [simulation.current, forceManyBody]);

    useEffect(() => {
        simulation.current.force("x", d3.forceX(centerX).strength(forceX));
    }, [simulation.current, forceX, centerX]);

    useEffect(() => {
        simulation.current.force("y", d3.forceY(centerY).strength(forceY));
    }, [simulation.current, forceY, centerY]);
    
    useEffect(() => {
        updateNodeRef(nodeRef, [], [], () => "", simulation);
    }, [danglings, simulation.current, nodeRef]);
    
    useEffect(() => {
        updateLinkRef(linkRef, [], []);
    }, [danglings, simulation.current, linkRef]);

    useEffect(() => {
        updateNodeRef(nodeRef, simulationNodes, danglings, colorMap, simulation);
    }, [simulationNodes, colorMap, simulation.current]);

    useEffect(() => {
        updateLinkRef(linkRef, simulationLinks, danglings);
    }, [simulationLinks, danglings]);
    
    useEffect(() => {
        simulation.current.restart();
        return simulation.current.stop;
    }, [simulation.current]);
    
    useEffect(() => {
        simulation.current.alpha(.5).restart();
    }, [simulation.current, forceX, centerX, forceY, centerY, forceManyBody, colorMap, danglings, simulationNodes, simulationLinks]);

    return (
        <svg id="graph" ref={ref} />
    );
};