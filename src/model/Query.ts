export default class Query {
    page?: number | string;
    size?: number | string;
    filter?: object;
    sort?: {
        column?: string,
        orderBy?: string
    };
};