import { Graph, useGraphDisplayRules, useGraphFilters } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import * as d3 from "d3";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";

function useColorMap(tags, nodeHasTag) {
    const tagColorMap = useMemo(() =>
        tags.reduce((acc, tag) => ({
            ...acc,
            [tag.id]: d3.rgb(
                Math.random() * 255,
                Math.sqrt(Math.random()) * 255,
                Math.random() * 255)
        }), {}),
        [tags]);

    const nodeColorMap = useCallback(idNode => {
        const tags = nodeHasTag[idNode];
        const l = tags.length;
        const avg = tags.reduce(
            (acc, tag) => ({
                r: acc.r + tagColorMap[tag].r,
                g: acc.g + tagColorMap[tag].g,
                b: acc.b + tagColorMap[tag].b
            }),
            { r: 0, g: 0, b: 0 }
        );
        return d3.rgb(avg.r / l, avg.g / l, avg.b / l);
    }, [tagColorMap, nodeHasTag]);

    return nodeColorMap;
}

function useContainerDimensions() {
    const containerRef = useRef(null); // Ref for the container element
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions(); // Measure dimensions on mount

        // Observe resizing with ResizeObserver
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect(); // Cleanup on unmount
    }, []);

    return [containerRef, dimensions];
}

function Wrapper({ children }) {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        }
    }, [children]);

    return (
        <div
            className="relative"
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                overflow: 'hidden',
            }}
        >
            <div ref={containerRef} className="absolute">
                {children}
            </div>
        </div>
    );
}

function isInside(rect, point) {
    return (
        point.x > rect.x && point.x < rect.x + rect.width &&
        point.y > rect.y && point.y < rect.y + rect.height
    );
}

// returns a list of rects, which describe the free space 
// inside the `bounds` rect, given the list of `occupied` rects 
function freeRects(bounds, occupied) {
    const relevant = occupied.filter(rect => 
        isInside(bounds, {x: rect.x, y: rect.y}) || 
        isInside(bounds, {x: rect.x + rect.width, y: rect.y}) || 
        isInside(bounds, {x: rect.x, y: rect.y + rect.height}) || 
        isInside(bounds, {x: rect.x + rect.width, y: rect.y + rect.height})); 
    
    if (relevant.empty()) {
        return [bounds];
    }
    
    const intruder = {x: relevant[0].x, y: relevant[1].y};
    const boundsQuadrants = [
        {x: bounds.x, y: bounds.y, width: intruder.x - bounds.x, height: intruder.y - bounds.y},
        {x: intruder.x, y: bounds.y, width: bounds.x + bounds.width - intruder.x, height: intruder.y - bounds.y},
        {x: bounds.x, y: intruder.y, width: intruder.x - bounds.x, height: bounds.y + bounds.height - intruder.y},
        {x: intruder.x, y: intruder.y, width: bounds.x + bounds.width - intruder.x, height: bounds.y + bounds.height - intruder.y},
        
    ];
    
    // const freeQuads = quadrants.filter(quad => !occupied.includes(quad));
}

export default function AppLayout({ links, nodes, tags, nodeHasTag, childrenRight }) {
    // Explictly ignoring changes to keep the colorMap constant.
    const constNodeTag = useMemo(() => nodeHasTag, []);
    const constTags = useMemo(() => tags, []);
    const colorMap = useColorMap(constTags, constNodeTag);

    const idToIndex = useCallback(x => x - 1);
    const indexToId = useCallback(x => x + 1);

    const [ref, dim] = useContainerDimensions();
    const [refChildrenRight, dimChildrenRight] = useContainerDimensions();

    useEffect(() => {
        const avoidRect = dimChildrenRight;
        const totalRect = { x: 0, y: 0, ...dim };
        console.log(avoidRect);
        console.log(totalRect);
        const targetRect = {
            x: avoidRect.width,
            y: avoidRect.height,
            width: totalRect.width - avoidRect.width,
            height: totalRect.height - avoidRect.height,
        };
        console.log(targetRect);
    }, [dimChildrenRight, dim]);

    const { filters } = useGraphFilters();
    const { displayRules } = useGraphDisplayRules();

    return (
        <AuthenticatedLayout header={
            <h2 className="
                text-xl font-semibold leading-tight 
                text-gray-800 dark:text-gray-300
            ">
                Knowledge Map
            </h2>
        }>
            <div className="grid auto-cols-fr">
                <div ref={ref} className="
                    row-start-1 col-start-1
                    w-screen flex relative max-h-screen
                    bg-gray-100 dark:bg-gray-900
                ">
                    <Graph
                        pNodes={nodes}
                        pLinks={links}
                        colorMap={colorMap}
                        idToIndex={idToIndex}
                        indexToId={indexToId}
                        dim={dim}
                        displayRules={displayRules}
                        filters={filters}
                    />

                </div>
                <div
                    ref={refChildrenRight}
                    className="
                        row-start-1 col-start-1 z-10 fixed right-0
                    "
                    children={childrenRight}/>
            </div>

        </AuthenticatedLayout>
    )
}