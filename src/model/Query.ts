export default class Query {
    page?: number | string;
    size?: number | string;
    filter: { [key: string]: any } = {};
    sort: {
        column?: string,
        orderBy?: string
    } = {};
};