import { Graph } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useCallback } from "react";
import { useContainerDimensions } from "../Hooks/useContainerDimensions";
import { useGraph } from "@/Context/GraphContext";

export default function AppLayout({ childrenRight }) {
    const { nodes, links, colorMap, filters, displayRules, dynamics } = useGraph();

    const idToIndex = useCallback((x) => x - 1, []);
    const indexToId = useCallback((x) => x + 1, []);

    const [ref, dim] = useContainerDimensions();
    const [refChildrenRight, dimChildrenRight] = useContainerDimensions();

    return (
        <AuthenticatedLayout
            header={
                <h2
                    className="
                        text-xl font-semibold leading-tight 
                        text-gray-800 dark:text-gray-300
                    "
                >
                    Knowledge Map
                </h2>
            }
        >
            <div className="grid auto-cols-fr">
                {/* Graph container */}
                <div
                    ref={ref}
                    className="
                        row-start-1 col-start-1
                        w-screen flex relative max-h-screen
                        bg-gray-100 dark:bg-gray-900
                    "
                >
                    <Graph
                        pNodes={nodes}
                        pLinks={links}
                        colorMap={colorMap}
                        idToIndex={idToIndex}
                        indexToId={indexToId}
                        dim={dim}
                        displayRules={displayRules}
                        filters={filters}
                        dynamics={dynamics}
                    />
                </div>

                {/* Right-side content */}
                <div
                    ref={refChildrenRight}
                    className="
                        row-start-1 col-start-1 z-10 fixed right-0
                    "
                    children={childrenRight}
                />
            </div>
        </AuthenticatedLayout>
    );
}
