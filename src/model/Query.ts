import filter from "./filter";
import { addNull } from "../util/TypeUtil";
import variable from "../variable";

export default class Query<FILTER extends addNull<filter<T>> = null, T extends object = {}> {
    page?: number | string;
    size?: number | string;
    filter?: FILTER;
    sort?: {
        column?: string,
        orderBy?: string
    };

    constructor(data?: object) {
        variable.assignment(this, data);
    }
};