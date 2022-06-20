import variable from "../variable";
export default class Query {
    page;
    size;
    filter;
    sort;
    constructor(data) {
        variable.assignment(this, data);
    }
}
;
