import variable from "../variable";
export default class Query {
    page;
    size;
    filter;
    sort;
    constructor(data) {
        if (data) {
            variable.filterKey(data, ["page", "size", "filter", "sort"]);
            variable.assignment(this, data, false);
        }
    }
}
;
