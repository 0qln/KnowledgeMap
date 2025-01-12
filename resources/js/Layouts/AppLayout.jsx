import { Graph } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useContainerDimensions } from "../Hooks/useContainerDimensions";
import { useGraph } from "@/Hooks/useGraph";
import { useEffect } from "react";
import { GraphFilters } from "../Components/GraphFilters/GraphFilters";

export default function AppLayout({ childrenRight }) {
    const [refGraphContainer, dimGraphContainer] = useContainerDimensions();
    const [refChildrenRight, dimChildrenRight] = useContainerDimensions();
    const [refChildrenLeft, dimChildrenLeft] = useContainerDimensions();
    const { filters, updateFilter, updateDisplayRule, tags } = useGraph();

    useEffect(() => {
        updateDisplayRule("avoidRects", [
            dimChildrenLeft,
            dimChildrenRight,
        ].filter(r => r.width && r.height));
    }, [dimChildrenLeft, dimChildrenRight])

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
                    ref={refGraphContainer}
                    className="
                        row-start-1 col-start-1
                        w-screen flex relative max-h-screen overflow-hidden
                        bg-gray-100 dark:bg-gray-900
                    "
                >
                    <Graph dim={dimGraphContainer} />
                </div>

                {/* Right-side content */}
                <div
                    ref={refChildrenRight}
                    className="row-start-1 col-start-1 z-10 fixed right-0"
                    children={childrenRight}
                />

                {/* Left-side content */}
                <div
                    ref={refChildrenLeft}
                    className="row-start-1 col-start-1 z-20 fixed left-0"
                >
                    <GraphFilters filters={filters} updateFilter={updateFilter} tags={tags} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
