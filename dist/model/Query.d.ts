import filter from "./filter";
export default class Query<T extends object> {
    page?: number | string;
    size?: number | string;
    filter?: filter<T>;
    sort?: {
        column?: string;
        orderBy?: string;
    };
    constructor(data?: object);
}
