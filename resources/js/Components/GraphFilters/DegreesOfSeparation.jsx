import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export function DegreesOfSeparation({ filters, searchFieldChanged }) {
    return (
        <div className="text-white flex flex-col space-y-2">
            <div>Allowed degrees of separation</div>
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
                    placeholder="Allowed degrees of separation"
                    onChange={e => searchFieldChanged("allowedDegreesOfSeparation", e.target.value)}
                    type="number"
                    defaultValue={filters.allowedDegreesOfSeparation} />
            </div>
        </div>
    );
}
