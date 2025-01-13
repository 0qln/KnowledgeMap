import { router } from "@inertiajs/react";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { useGraph } from "@/Hooks/useGraph";
import * as d3 from "d3";
import "lodash.product";
import { range, product } from "lodash";

export function nodeEq(a, b) {
    const aId = typeof a == "object" ? a.id : a;
    const bId = typeof b == "object" ? b.id : b;
    return aId === bId;
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

function isDangling(node, links, cache) {
    const states = {
        UNVISITED: 0,  // Node has not been processed yet
        PROCESSING: 1, // Node is currently being processed
        PROCESSED: 2   // Node's dangling status is confirmed
    };
    
    const nodeState = {};
    const stack = [{ id: node.id, state: states.UNVISITED }];

    while (stack.length) {
        const { id, state } = stack.pop();

        if (cache[id] !== undefined) continue;

        switch (state) {
            case states.UNVISITED:
                if (node.deleted) {
                    cache[id] = true;
                    nodeState[id] = states.PROCESSED;
                    continue;
                }

                if (nodeState[id] === states.PROCESSING) {
                    // cycle detected !
                    cache[id] = false;
                    continue;
                }

                nodeState[id] = states.PROCESSING;

                stack.push({ id, state: states.PROCESSED });

                incoming(node, links)
                    .forEach(l => {
                        if (nodeState[l.source.id] !== states.PROCESSED) {
                            stack.push({ id: l.source.id, state: states.UNVISITED });
                        }
                    });

                outgoing(node, links)
                    .forEach(l => {
                        if (nodeState[l.target.id] !== states.PROCESSED) {
                            stack.push({ node: l.target.id, state: states.UNVISITED });
                        }
                    });
                break;

            case states.PROCESSED:
                const allIncomingDangling = incoming(id, links).every(l => cache[l.source.id] === true);
                const allOutgoingDangling = outgoing(id, links).every(l => cache[l.target.id] === true);
                cache[id] = allIncomingDangling && allOutgoingDangling;
                nodeState[id] = states.PROCESSED;
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

function dragended(simulation, event) {
    if (!event.active) simulation.current.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

function updateNodeRef(nodeRef, nodes, danglings, colorMap) {
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
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("stroke-opacity", d => d.deleted || danglings[d.source.id] || danglings[d.target.id] ? "0.1" : "0.6")
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
        linkRef.current = svg.append("g").attr("stroke", "#888").selectAll();
        nodeRef.current = svg.append("g").attr("stroke", "#eee").attr("stroke-width", 1).selectAll();

        return d3.select(ref.current).selectAll("*").remove;
    }, []);

    // dangling nodes are nodes that are either deleted themselfes,
    // or have only incoming and outgoing links that are dangling.
    // for large graphs, we will likely reach a stack overflow,
    // which is why we need to settle for an iterative approach instead
    // of a recursive one.
    // const danglings = useMemo(() => {
    //     console.log("Computing dangling nodes...");
    //     const ret = filteredNodes.reduce((acc, n) => {
    //         isDangling(n, filteredLinks, acc);
    //         return acc;
    //     }, {});
    //     console.log(Object.values(ret).filter(x => x).length)
    //     return ret;
    // }, [filteredNodes, filteredLinks])

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
        console.log("udpate with force")
        // console.log(simulationNodes);
        // console.log(simulationLinks);
        const danglings = filteredNodes.reduce((acc, n) => {
            (isDangling(n, filteredLinks, acc));
            return acc;
        }, {});
        console.log(danglings)
        updateNodeRef(nodeRef, [], [], () => "#fff");
        updateLinkRef(linkRef, [], []);
        updateNodeRef(nodeRef, simulationNodes, danglings, colorMap);
        updateLinkRef(linkRef, simulationLinks, danglings);
        simulation.current.nodes(simulationNodes);
        simulation.current.force("link", d3.forceLink(simulationLinks).id(d => d.id).strength(d => {
            const f = n => simulationLinks.filter(l => nodeEq(n, l.source) || nodeEq(n, l.target)).length;
            const x = Math.min(2, (Math.sqrt(Math.sqrt(d.value))))
            return x / Math.min(f(d.source), f(d.target));
        }));
        simulation.current.alpha(.4).restart();
    }, [simulationNodes, simulationLinks/* , danglings */, colorMap]);
    //
    // useEffect(() => {
    //     updateLinkRef(simulationLinks);
    //     simulation.current.force("link", d3.forceLink(simulationLinks).id(d => d.id).strength(d => {
    //         const f = n => simulationLinks.filter(l => nodeEq(n, l.source) || nodeEq(n, l.target)).length;
    //         const x = Math.min(2, (Math.sqrt(Math.sqrt(d.value))))
    //         return x / Math.min(f(d.source), f(d.target));
    //     }));
    //     simulation.current.alpha(.4).restart();
    // }, [simulationLinks]);

    // useEffect(() => {
    //     console.log(Object.values(danglings).filter(x => x).length)
    //     if (!danglings) return;
    //     updateNodeRef([]);
    //     updateLinkRef([]);
    //     updateNodeRef(simulationNodes);
    //     updateLinkRef(simulationLinks);
    // }, [danglings]);

    return (
        <svg id="graph" ref={ref} />
    );
};