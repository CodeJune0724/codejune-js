import ResponseResult from "../model/ResponseResult";
import BasePO from "./BasePO";
import Query from "../model/Query";
import BaseService from "./BaseService";
import QueryResult from "../model/QueryResult";
import filter from "../model/filter";
export default class DatabaseService<T extends BasePO, FILTER extends filter<T> | null = null> extends BaseService {
    data: {
        query: {
            request: Query<FILTER>;
            response: ResponseResult<QueryResult<T>>;
        };
        save: {
            request: T;
            response: ResponseResult<T>;
        };
        saveList: {
            request: T[];
            response: ResponseResult<T[]>;
        };
        delete: {
            request: T;
            response: ResponseResult<null>;
        };
        deleteList: {
            request: T[];
            response: ResponseResult<null>;
        };
        [key: string]: {
            request: any;
            response: ResponseResult<any>;
        };
    };
    constructor(url: string, t: T, filter?: FILTER);
    query(request?: Query): Promise<ResponseResult<QueryResult<T>>>;
    save(request?: T): Promise<ResponseResult<T>>;
    saveList(request?: T[]): Promise<ResponseResult<T[]>>;
    doDelete(request?: T): Promise<ResponseResult<null>>;
    deleteList(request?: T[]): Promise<ResponseResult<null>>;
}
