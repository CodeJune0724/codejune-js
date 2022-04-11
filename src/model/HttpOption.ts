import httpType from "./httpType";

class HttpOption {

    private readonly _url: string;
    private readonly _type: httpType;
    private readonly _header?: object;
    private readonly _urlData?: object;
    private readonly _data?: object;

    constructor(data: HttpOption) {
        this._url = data._url;
        this._type = data._type;
        this._header = data._header;
        this._urlData = data._urlData;
        this._data = data._data;
    }

    get url(): string {
        return this._url;
    }

    get type(): httpType {
        return this._type;
    }

    get header(): object {
        return this._header ? this._header : {};
    }

    get urlData(): object {
        return this._urlData ? this._urlData : {};
    }

    get data(): object | null {
        return this._data ? this._data : null;
    }

}

export default HttpOption;