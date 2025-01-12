import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export function SearchNodeTitles({ filters, searchFieldChanged }) {
    return (
        <div className="text-white flex flex-col space-y-2">
            <div>Search Node Titles</div>
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
    );
}
