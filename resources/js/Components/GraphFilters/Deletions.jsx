import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";

export function Deletions({ filters, searchFieldChanged }) {
    return (
        <div className="text-white flex flex-col space-y-2">
            <div>Deletions</div>
            <div className="ml-4 space-y-1">
                <div className="flex flex-row space-x-4 items-center">
                    <InputLabel value="Show deleted nodes" />
                    <Checkbox
                        checked={filters.showDeletedNodes}
                        onChange={e => searchFieldChanged("showDeletedNodes", e.target.checked)} />
                </div>
                <div className="flex flex-row space-x-4 items-center">
                    <InputLabel value="Show deleted edges" />
                    <Checkbox
                        checked={filters.showDeletedEdges}
                        onChange={e => searchFieldChanged("showDeletedEdges", e.target.checked)} />
                </div>
            </div>
        </div>
    );
}
