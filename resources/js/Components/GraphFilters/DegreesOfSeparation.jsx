import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import ExpansionMenu from "../ExpansionMenu";
import { ChevronDown } from "../ChevronDown";
import { ChevronUp } from "../ChevronUp";

export function DegreesOfSeparation({ filters, searchFieldChanged }) {
    const id = "degrees-of-separation";
    return (
        <ExpansionMenu.Option className="text-white flex flex-col space-y-2">
            <ExpansionMenu.Option.Trigger id={id}>
                {({ isOpen }) => (
                    <div className="flex flex-row space-x-4">
                        {isOpen ? ChevronUp : ChevronDown}
                        <div>Allowed degrees of separation</div>
                    </div>
                )}
            </ExpansionMenu.Option.Trigger>
            <ExpansionMenu.Option.Content id={id} className="ml-4 space-y-1">
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
                    placeholder="Allowed degrees of separation"
                    onChange={e => searchFieldChanged("allowedDegreesOfSeparation", e.target.value)}
                    type="number"
                    defaultValue={filters.allowedDegreesOfSeparation} />
            </ExpansionMenu.Option.Content>
        </ExpansionMenu.Option>
    );
}
