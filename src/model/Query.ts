export default class Query {
    page?: number | string;
    size?: number | string;
    filter?: object | null;
    sort?: {
        column: string,
        orderBy: string
    }
}