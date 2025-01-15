import { Graph } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useContainerDimensions } from "../Hooks/useContainerDimensions";
import { useGraph } from "@/Hooks/useGraph";
import { useEffect } from "react";
import { GraphFilters } from "../Components/GraphFilters/GraphFilters";
import { Link } from "@inertiajs/react";
import GraphDetailsLayout from "./GraphDetailsLayout";
import Dropdown from "@/Components/Dropdown";

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
                    className="row-start-1 col-start-1 z-10 fixed right-0 flex flex-row-reverse"
                >
                    {childrenRight || (
                        <GraphDetailsLayout overflow={true}>
                            <div className="flex flex-col">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="stroke-white"/>
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('dashboard.nodes.create')}
                                            className="text-white rounded-md p-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 flex flex-row w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" className="stroke=white" />
                                            </svg>
                                            Node
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('dashboard.edges.create')}
                                            className="text-white rounded-md p-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 flex flex-row w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" className="stroke=white" />
                                            </svg>
                                            Edge
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </GraphDetailsLayout>
                    )}
                </div>

                {/* Left-side content */}
                <div
                    ref={refChildrenLeft}
                    className="row-start-1 col-start-1 z-20 fixed left-0"
                >
                    <GraphFilters filters={filters} updateFilter={updateFilter} tags={tags} />
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
