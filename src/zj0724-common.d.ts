declare let variable: {
    isNull(data: any): boolean;
    isEmpty(data: any): boolean;
    getType(data: any): any;
    isObject(data: any): boolean;
    clone(data: any): object;
    assignment(object1: any, object2: any, isStrict: boolean): void;
    toStr(data: any): string,
    clean(data: any): void
};

declare let http: {
    send(data: object): any;
    download(data: object): any;
    asynchronousDownload(data: object): any;
}

declare let base64: {
    encode(data: string): string;
    decode(data: string): string;
}

declare let file: {
    select(): any;
}

declare class DatabaseService {
    url: string;
    data: {
        query: {
            request: {
                page: string | number,
                size: string | number,
                filter: object,
                sort: {
                    column: string,
                    orderBy: null
                }
            },
            response: object
        },
        save: {
            request: object,
            response: object
        },
        saveList: {
            request: object[],
            response: object
        },
        delete: {
            request: object,
            response: object
        },
        deleteList: {
            request: object[],
            response: object
        }
    };
    constructor(url: string);
    query(request: object): any;
    save(request: object): any;
    saveList(request: object[]): any;
    doDelete(request: object): any;
    deleteList(request: object[]): any;
    $send(methodName: string, type: string, request: any): any;
    $requestHandler(requestData: object): object;
}

export {variable, http, base64, DatabaseService};