export default class Query {
    page?: number | string;
    size?: number | string;
    filter: { [key: string]: object } = {};
    sort: {
        column?: string,
        orderBy?: string
    } = {};
}