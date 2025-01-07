import React, { createContext, useContext, useState, useRef, useMemo, useCallback, useEffect } from "react";
import * as d3 from "d3";
import axios from "axios";

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        blacklist: [],
        whitelist: [],
        tagsAsNodes: false,
        orphans: false,
        whiteListEnabled: false,
        blacklistEnabled: false,
    });

    const [displayRules, setDisplayRules] = useState({
        forceX: 0.06,
        forceY: 0.06,
        centerOffsetX: 0,
        centerOffsetY: 0,
    });

    const simulation = useRef(null);
    const resetFn = useRef(null);

    const idToIndex = useCallback((x) => x - 1, []);
    const indexToId = useCallback((x) => x + 1, []);

    const colorMap = useMemo(() => {
        console.log(tags);
        const tagColorMap = tags.map(_ =>
            d3.rgb(
                Math.random() * 255,
                Math.sqrt(Math.random()) * 255,
                Math.random() * 255
            ));

        console.log(tagColorMap);

        return (node) => {
            if (node.tags.length === 0) return d3.rgb(128, 128, 128);

            const avgColor = node.tags.reduce(
                (acc, tag) => {
                    const id = idToIndex(tag.id);
                    const color = tagColorMap[id];
                    return {
                        r: acc.r + color.r,
                        g: acc.g + color.g,
                        b: acc.b + color.b,
                    }
                },
                { r: 0, g: 0, b: 0 }
            );

            const len = node.tags.length;
            return d3.rgb(avgColor.r / len, avgColor.g / len, avgColor.b / len);
        };
    }, [tags]);

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
    const updateDisplayRule = (key, value) => setDisplayRules((prev) => ({ ...prev, [key]: value }));

    // todo: state update needed?
    const removeNode = (id) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        setLinks((prevLinks) => prevLinks.filter((link) => link.source !== id && link.target !== id));
    };

    const removeLink = (idSource, idTarget) => {
        setLinks((prevLinks) =>
            prevLinks.filter(
                (link) =>
                    !(link.source === idSource && link.target === idTarget) &&
                    !(link.source === idTarget && link.target === idSource)
            )
        );
    };

    // Fetch initial graph data.
    // We either have to send the graph data for every route
    // or we have to fetch it once in the first render. Fetching 
    // the data as json is not supported by inertia: 
    // https://github.com/inertiajs/inertia/discussions/568
    // We will have to use axios to fetch the data.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nodesRes, linksRes, tagsRes] = await Promise.all([
                    axios.get(route("dashboard.nodes")),
                    axios.get(route("dashboard.edges")),
                    axios.get(route("dashboard.tags")),
                ]);
                setNodes(nodesRes.data.map(d => ({
                    id: idToIndex(d.id),
                    index: indexToId(d.id),
                    title: d.title,
                    tags: d.tags,
                })));
                setLinks(linksRes.data.map(d => ({
                    id: idToIndex(d.id),
                    index: indexToId(d.id),
                    source: idToIndex(d.id_origin),
                    target: idToIndex(d.id_target),
                    value: d.weight
                })));
                setTags(tagsRes.data);
            } catch (err) {
                console.error("Failed to fetch graph data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <GraphContext.Provider
            value={{
                nodes,
                setNodes,
                links,
                setLinks,
                filters,
                updateFilter,
                displayRules,
                updateDisplayRule,
                simulation,
                resetFn,
                removeNode,
                removeLink,
                tags,
                setTags,
                colorMap,
                idToIndex,
                indexToId,
                loading
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};

export const useGraph = () => useContext(GraphContext);