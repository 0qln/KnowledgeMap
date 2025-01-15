import { DegreesOfSeparation } from "./DegreesOfSeparation";
import { Orphans } from "./Orphans";
import { SearchNodeTitles } from "./SearchNodeTitles";
import GraphFilterLayout from "../../Layouts/GraphFilterLayout";
import { BlacklistTags } from "./BlacklistTags";
import { Deletions } from "./Deletions";
import ExpansionMenu from "../ExpansionMenu";

export function GraphFilters({ filters, updateFilter, tags }) {
    const searchFieldChanged = (name, value) => {
        updateFilter(name, value);
    };

    return (
        <GraphFilterLayout>
            <ExpansionMenu multiple={true} defaultOpen={["search-node-titles"]}>
                <div className="flex flex-col space-y-6">
                    <SearchNodeTitles filters={filters} searchFieldChanged={searchFieldChanged} />
                    <DegreesOfSeparation filters={filters} searchFieldChanged={searchFieldChanged} />
                    <Orphans filters={filters} searchFieldChanged={searchFieldChanged} />
                    <Deletions filters={filters} searchFieldChanged={searchFieldChanged} />
                    <BlacklistTags filters={filters} searchFieldChanged={searchFieldChanged} tags={tags} />
                </div>
            </ExpansionMenu>
        </GraphFilterLayout>
    );
}
