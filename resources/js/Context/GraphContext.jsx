import React, { createContext, useContext, useState, useRef, useMemo } from "react";
import * as d3 from "d3";

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);

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

    const [tags, setTags] = useState([]);
    const [nodeHasTag, setNodeHasTag] = useState({});

    const simulation = useRef(null);
    const resetFn = useRef(null);

    // Calculate the colorMap
    const colorMap = useMemo(() => {
        const tagColorMap = tags.reduce((acc, tag) => {
            acc[tag.id] = d3.rgb(
                Math.random() * 255,
                Math.sqrt(Math.random()) * 255,
                Math.random() * 255
            );
            return acc;
        }, {});

        return (idNode) => {
            const nodeTags = nodeHasTag[idNode] || [];
            if (nodeTags.length === 0) return d3.rgb(128, 128, 128);

            const avgColor = nodeTags.reduce(
                (acc, tag) => ({
                    r: acc.r + tagColorMap[tag].r,
                    g: acc.g + tagColorMap[tag].g,
                    b: acc.b + tagColorMap[tag].b,
                }),
                { r: 0, g: 0, b: 0 }
            );

            return d3.rgb(avgColor.r / nodeTags.length, avgColor.g / nodeTags.length, avgColor.b / nodeTags.length);
        };
    }, [tags, nodeHasTag]);

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
    const updateDisplayRule = (key, value) => setDisplayRules((prev) => ({ ...prev, [key]: value }));

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
                tags,
                setTags,
                nodeHasTag,
                setNodeHasTag,
                colorMap,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
};

export const useGraph = () => useContext(GraphContext);