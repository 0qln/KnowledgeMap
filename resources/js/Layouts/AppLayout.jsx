import { Graph } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useContainerDimensions } from "../Hooks/useContainerDimensions";
import GraphFilterLayout from "./GraphFilterLayout";
import TextInput from "@/Components/TextInput";
import { useGraph } from "@/Context/GraphContext";
import { router } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";

export default function AppLayout({ childrenRight }) {
    const [refGraphContainer, dimGraphContainer] = useContainerDimensions();
    const [refChildrenRight, dimChildrenRight] = useContainerDimensions();
    const [refChildrenLeft, dimChildrenLeft] = useContainerDimensions();

    const { updateFilter } = useGraph();

    const searchFieldChanged = (name, value) => {
        updateFilter(name, value);
    };

    const childrenLeft = (
        <GraphFilterLayout>
            <div className="flex flex-col space-y-2">
                <TextInput 
                    placeholder="Search" 
                    onChange={e => searchFieldChanged("query", e.target.value)} 
                />
                <div className="text-white">
                    Allowed degrees of separation
                    <div className="ml-4">
                        <TextInput 
                            placeholder="Allowed degrees of seperation" 
                            onChange={e => searchFieldChanged("allowedDegreesOfSeparation", e.target.value)} 
                            type="number"
                        />
                        <div className="flex flex-row space-x-2 items-center">
                            <InputLabel value="Incoming" />
                            <Checkbox onChange={e => searchFieldChanged("allowedSeparationIncoming", e.target.checked)} />
                        </div>
                        <div className="flex flex-row space-x-2 items-center">
                            <InputLabel value="Outgoing" />
                            <Checkbox onChange={e => searchFieldChanged("allowedSeparationOutgoing", e.target.checked)} />
                        </div>
                    </div>
                </div>
            </div>
        </GraphFilterLayout>
    )

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
                        w-screen flex relative max-h-screen
                        bg-gray-100 dark:bg-gray-900
                    "
                >
                    <Graph dim={dimGraphContainer} />
                </div>

                {/* Right-side content */}
                <div
                    ref={refChildrenRight}
                    className="
                        row-start-1 col-start-1 z-10 fixed right-0
                    "
                    children={childrenRight}
                />

                {/* Left-sdie content */}
                <div
                    ref={refChildrenLeft}
                    className="
                        row-start-1 col-start-1 z-20 fixed left-0
                    "
                    children={childrenLeft}
                />
            </div>
        </AuthenticatedLayout>
    );
}
