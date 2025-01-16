import { Button } from "@headlessui/react";
import fuzzysort from "fuzzysort";
import { useMemo, useState } from "react";
import TextInput from "../TextInput";
import Checkbox from "../Checkbox";
import InputLabel from "../InputLabel";
import ExpansionMenu from "../ExpansionMenu";
import { ChevronDown } from "../ChevronDown";
import { ChevronUp } from "../ChevronUp";

export function BlacklistTags({ filters, searchFieldChanged, tags }) {
    const [tagQueryLimit, setTagQueryLimit] = useState(10);
    const [tagsQuery, setTagsQuery] = useState("");
    const sortedTags = useMemo(() => {
        return fuzzysort.go(tagsQuery, tags, {
            limit: tagQueryLimit,
            key: 'name'
        }).map(r => r.obj);
    }, [tagsQuery, tags, tagQueryLimit]);

    const id = "blacklist-tags";
    return (
        <div className="text-white flex flex-col space-y-2">
            <ExpansionMenu.Trigger id={id} >
                {({ isOpen }) => (
                    <div className="flex flex-row space-x-4">
                        {isOpen ? ChevronUp : ChevronDown}
                        <div>Blacklist Tags</div>
                    </div>
                )}
            </ExpansionMenu.Trigger>
            <ExpansionMenu.Content id={id} className="ml-4 space-y-2 flex flex-col">
                <div className="flex flex-row space-x-4">
                    <Button
                        className="text-white bg-gray-700 p-1 rounded-md transition duration-150 ease-in-out hover:bg-gray-600"
                        onClick={() => searchFieldChanged("tagBlacklist", [])}
                    >
                        Remove all
                    </Button>
                    <Button
                        className="text-white bg-gray-700 p-1 rounded-md transition duration-150 ease-in-out hover:bg-gray-600"
                        onClick={() => searchFieldChanged("tagBlacklist", tags)}
                    >
                        Add all
                    </Button>
                </div>
                <TextInput
                    placeholder="search for tags"
                    onChange={e => setTagsQuery(e.target.value)} />
                <div className="space-y-1">
                    {sortedTags.map(tag => (
                        <div className="flex flex-row space-x-2 items-center" key={tag.id}>
                            <Checkbox
                                checked={filters.tagBlacklist.includes(tag)}
                                onChange={e => {
                                    searchFieldChanged("tagBlacklist", e.target.checked
                                        ? [...filters.tagBlacklist, tag]
                                        : filters.tagBlacklist.filter(t => t !== tag));
                                }} />
                            <InputLabel value={tag.name} />
                        </div>
                    ))}
                </div>
            </ExpansionMenu.Content>
        </div>
    );
}