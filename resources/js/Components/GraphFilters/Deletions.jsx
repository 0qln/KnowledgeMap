import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import ExpansionMenu from "../ExpansionMenu";
import { ChevronDown } from "../ChevronDown";
import { ChevronUp } from "../ChevronUp";

export function Deletions({ filters, searchFieldChanged }) {
    const id = "deletions";
    return (
        <ExpansionMenu.Option className="text-white flex flex-col space-y-2">
            <ExpansionMenu.Option.Trigger id={id}>
                {({ isOpen }) => (
                    <div className="flex flex-row space-x-4">
                        {isOpen ? ChevronUp : ChevronDown}
                        <div>Deletions</div>
                    </div>
                )}
            </ExpansionMenu.Option.Trigger>
            <ExpansionMenu.Option.Content id={id} className="ml-4 space-y-1">
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
            </ExpansionMenu.Option.Content>
        </ExpansionMenu.Option>
    );
}
