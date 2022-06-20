import filter from "./filter";
import variable from "../variable";

export default class Query<FILTER extends filter<T> | null = null, T extends object = {}> {
    page?: number | string;
    size?: number | string;
    filter?: FILTER;
    sort?: {
        column?: string,
        orderBy?: string
    };

    constructor(data?: object) {
        if (data) {
            variable.filterKey(data, ["page", "size", "filter", "sort"]);
            variable.assignment(this, data, false);
        }
    }
};