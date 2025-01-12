import { DegreesOfSeparation } from "./DegreesOfSeparation";
import { Orphans } from "./Orphans";
import { SearchNodeTitles } from "./SearchNodeTitles";
import GraphFilterLayout from "../../Layouts/GraphFilterLayout";
import { BlacklistTags } from "./BlacklistTags";

export function GraphFilters({ filters, updateFilter, tags }) {
    const searchFieldChanged = (name, value) => {
        updateFilter(name, value);
    };

    return (
        <GraphFilterLayout>
            <div className="flex flex-col space-y-6">
                <SearchNodeTitles filters={filters} searchFieldChanged={searchFieldChanged} />
                <DegreesOfSeparation filters={filters} searchFieldChanged={searchFieldChanged} />
                <Orphans filters={filters} searchFieldChanged={searchFieldChanged} />
                <BlacklistTags filters={filters} updateFilter={updateFilter} tags={tags} />
            </div>
        </GraphFilterLayout>
    );
}
