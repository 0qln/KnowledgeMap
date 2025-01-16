import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import ExpansionMenu from "../ExpansionMenu";
import { ChevronDown } from "../ChevronDown";
import { ChevronUp } from "../ChevronUp";

export function SearchNodeTitles({ filters, searchFieldChanged }) {
    const id = "search-node-titles";
    return (
        <div className="text-white flex flex-col space-y-2">
            <ExpansionMenu.Trigger id={id}>
                {({ isOpen }) => (
                    <div className="flex flex-row space-x-4">
                        {isOpen ? ChevronUp : ChevronDown}
                        <div>Search Node Titles</div>
                    </div>
                )}
            </ExpansionMenu.Trigger>
            <ExpansionMenu.Content id={id} className="ml-4 space-y-1">
                <div className="flex flex-row space-x-4 items-center">
                    <InputLabel value="Case Sensitive" />
                    <Checkbox
                        checked={filters.queryIsCaseSensitive}
                        onChange={e => searchFieldChanged("queryIsCaseSensitive", e.target.checked)} />
                </div>
                <TextInput
                    placeholder=""
                    onChange={e => searchFieldChanged("query", e.target.value)} />
            </ExpansionMenu.Content>
        </div>
    );
}
