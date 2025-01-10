import { Graph } from "@/Components/Graph";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useContainerDimensions } from "../Hooks/useContainerDimensions";
import GraphFilterLayout from "./GraphFilterLayout";
import TextInput from "@/Components/TextInput";
import { useGraph } from "@/Context/GraphContext";
import { router } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import { useMemo, useState } from "react";
import fuzzysort from "fuzzysort";
import { Button } from "@headlessui/react";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AppLayout({ childrenRight }) {
    const [refGraphContainer, dimGraphContainer] = useContainerDimensions();
    const [refChildrenRight, dimChildrenRight] = useContainerDimensions();
    const [refChildrenLeft, dimChildrenLeft] = useContainerDimensions();

    const { filters, updateFilter, tags } = useGraph();

    const searchFieldChanged = (name, value) => {
        updateFilter(name, value);
    };

    const [tagQueryLimit, setTagQueryLimit] = useState(10);
    const [tagsQuery, setTagsQuery] = useState("");
    const sortedTags = useMemo(() => {
        return fuzzysort.go(tagsQuery, tags, {
            limit: tagQueryLimit,
            key: 'name'
        }).map(r => r.obj);
    }, [tagsQuery, tags, tagQueryLimit]);

    const childrenLeft = (
        <GraphFilterLayout>
            <div className="flex flex-col space-y-6">
                <div className="text-white flex flex-col space-y-2">
                    <div>
                        Search Node Titles
                    </div>
                    <div className="ml-4 space-y-1">
                        <div className="flex flex-row space-x-4 items-center">
                            <InputLabel value="Case Sensitive" />
                            <Checkbox
                                checked={filters.queryIsCaseSensitive}
                                onChange={e => searchFieldChanged("queryIsCaseSensitive", e.target.checked)} />
                        </div>
                        <TextInput
                            placeholder=""
                            onChange={e => searchFieldChanged("query", e.target.value)} />
                    </div>
                </div>
                <div className="text-white flex flex-col space-y-2">
                    <div>
                        Allowed degrees of separation
                    </div>
                    <div className="ml-4 space-y-1">
                        <div className="flex flex-row space-x-4 items-center">
                            <div className="flex flex-row space-x-2 items-center">
                                <InputLabel value="Incoming" />
                                <Checkbox
                                    checked={filters.allowedSeparationIncoming}
                                    onChange={e => searchFieldChanged("allowedSeparationIncoming", e.target.checked)} />
                            </div>
                            <div className="flex flex-row space-x-2 items-center">
                                <InputLabel value="Outgoing" />
                                <Checkbox
                                    checked={filters.allowedSeparationOutgoing}
                                    onChange={e => searchFieldChanged("allowedSeparationOutgoing", e.target.checked)} />
                            </div>
                        </div>
                        <TextInput
                            placeholder="Allowed degrees of seperation"
                            onChange={e => searchFieldChanged("allowedDegreesOfSeparation", e.target.value)}
                            type="number"
                            defaultValue={filters.allowedDegreesOfSeparation} />
                    </div>
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="text-white flex flex-col space-y-2">
                        <div>
                            Orphans
                        </div>
                        <div className="ml-4 space-y-1">
                            <div className="flex flex-row space-x-4 items-center">
                                <InputLabel value="Show orphans" />
                                <Checkbox
                                    checked={filters.orphans}
                                    onChange={e => searchFieldChanged("orphans", e.target.checked)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="text-white flex flex-col space-y-2">
                        <div>
                            Blacklist Tags
                        </div>
                        <div className="ml-4 space-y-2 flex flex-col">
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-4">
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Button
                                            className="text-white bg-gray-700 p-1 rounded-md transition duration-150 ease-in-out hover:bg-gray-600"
                                            onClick={_ => updateFilter("tagBlacklist", [])}
                                        >
                                            Remove all
                                        </Button>
                                    </div>
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Button
                                            className="text-white bg-gray-700 p-1 rounded-md transition duration-150 ease-in-out hover:bg-gray-600"
                                            onClick={_ => updateFilter("tagBlacklist", tags)}
                                        >
                                            Add all
                                        </Button>
                                    </div>
                                </div>
                                <TextInput
                                    placeholder="search for tags"
                                    onChange={e => setTagsQuery(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                {sortedTags && sortedTags.map(tag => (
                                    <div className="flex flex-row space-x-2 items-center">
                                        <Checkbox
                                            checked={filters.tagBlacklist.includes(tag)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    updateFilter("tagBlacklist", [...filters.tagBlacklist, tag]);
                                                } else {
                                                    updateFilter("tagBlacklist", filters.tagBlacklist.filter(t => t !== tag));
                                                }
                                            }} />
                                        <InputLabel value={tag.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GraphFilterLayout >
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
