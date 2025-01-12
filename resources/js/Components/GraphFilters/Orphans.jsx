import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";

export function Orphans({ filters, searchFieldChanged }) {
    return (
        <div className="text-white flex flex-col space-y-2">
            <div>Orphans</div>
            <div className="ml-4 space-y-1">
                <div className="flex flex-row space-x-4 items-center">
                    <InputLabel value="Show orphans" />
                    <Checkbox
                        checked={filters.orphans}
                        onChange={e => searchFieldChanged("orphans", e.target.checked)} />
                </div>
            </div>
        </div>
    );
}
