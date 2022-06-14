import filter from "./filter";
import { addNull } from "../util/TypeUtil";

export default class Query<FILTER extends addNull<filter<T>> = null, T extends object = {}> {
    page?: number | string;
    size?: number | string;
    filter?: FILTER;
    sort?: {
        column?: string,
        orderBy?: string
    };
};