var index = "";
class InfoException extends Error {
  constructor(message) {
    super(message);
  }
}
class Request {
  constructor(data) {
    this.url = data.url;
    this.type = data.type;
    this.header = data.header;
    this.param = data.param;
    this.body = data.body;
    this.config = data.config;
  }
}
var variable = {
  isNull(data) {
    return data === void 0 || data === null;
  },
  isEmpty(data) {
    if (this.isNull(data)) {
      return true;
    }
    let type = this.getType(data);
    if (type === String && data === "") {
      return true;
    }
    if (type === Array && data.length === 0) {
      return true;
    }
    return type === Object && Object.keys(data).length === 0;
  },
  getType(data) {
    if (this.isNull(data)) {
      return null;
    }
    return data.constructor;
  },
  isObject(data) {
    if (this.isNull(data)) {
      return false;
    }
    if (data instanceof Object) {
      let type = this.getType(data);
      if (type == null) {
        return false;
      }
      if (JSON.stringify(data) !== void 0) {
        return true;
      }
      if (type.toString().indexOf("class") === 0) {
        return true;
      }
      if (type === Array) {
        return true;
      }
      return type === Object;
    }
    return false;
  },
  clone(data) {
    if (this.isObject(data)) {
      if (this.getType(data) === Array) {
        let newData = [];
        for (let item of data) {
          newData.push(this.clone(item));
        }
        return newData;
      } else {
        let newData = {};
        for (let key in data) {
          newData[key] = this.clone(data[key]);
        }
        return newData;
      }
    } else {
      if (this.isNull(data)) {
        return null;
      }
      return data;
    }
  },
  assignment(object1, object2, isStrict) {
    let type1 = this.getType(object1);
    let isStrictBoolean = this.isEmpty(isStrict) ? true : isStrict === true;
    if (!this.isObject(object1) || !this.isObject(object2)) {
      return;
    }
    if (type1 === Array) {
      let ok = true;
      if (isStrictBoolean && this.getType(object2) !== Array) {
        ok = false;
      }
      if (type1 !== this.getType(object2)) {
        ok = false;
      }
      if (ok) {
        object1.splice(0, object1.length);
        for (let item of object2) {
          object1.push(item);
        }
      }
    } else {
      if (isStrictBoolean) {
        for (let key in object1) {
          let value1 = object1[key];
          let value2 = object2[key];
          if (value1 === void 0 || value2 === void 0) {
            continue;
          }
          let isAssignment = false;
          if (value1 === null) {
            isAssignment = true;
          } else if (value2 === null && !this.isObject(value1)) {
            isAssignment = true;
          } else if (this.getType(value1) === this.getType(value2)) {
            isAssignment = true;
          }
          if (isAssignment) {
            if (this.isObject(value2)) {
              value2 = this.clone(value2);
            }
            if (this.isObject(value1) && this.isObject(value2)) {
              this.assignment(value1, value2, true);
            } else {
              object1[key] = value2;
            }
          }
        }
      } else {
        for (let key in object2) {
          let value2 = object2[key];
          if (value2 === void 0) {
            continue;
          }
          if (this.isObject(value2)) {
            value2 = this.clone(value2);
          }
          object1[key] = value2;
        }
      }
    }
  },
  toStr(data) {
    if (this.isNull(data)) {
      return null;
    }
    if (this.isObject(data)) {
      return JSON.stringify(data);
    }
    return data.toString();
  },
  clean(data) {
    if (data instanceof Array) {
      data.splice(0);
    } else if (this.isObject(data)) {
      for (let key in data) {
        let value = data[key];
        if (this.isObject(value)) {
          this.clean(value);
        } else {
          data[key] = null;
        }
      }
    }
  },
  addKey(object1, object2) {
    if (!this.isObject(object1) || !this.isObject(object2)) {
      return;
    }
    for (let key in object2) {
      let o2 = object2[key];
      if (this.isNull(object1[key])) {
        if (this.isObject(o2)) {
          if (this.getType(o2) === Array) {
            object1[key] = [];
          } else {
            object1[key] = {};
          }
        } else {
          object1[key] = null;
        }
      }
      this.addKey(object1[key], o2);
    }
  },
  filterKey(object, keys) {
    for (let key in object) {
      if (keys.indexOf(key) === -1) {
        delete object[key];
      }
    }
  }
};
var http = {
  send(data) {
    return new Promise((success, error) => {
      this._getFetch(data).then((response) => {
        let responseText = response.text();
        if (response.ok) {
          success(responseText);
        } else {
          error(responseText);
        }
      }).catch((m) => {
        error(m);
      });
    });
  },
  download(data) {
    return new Promise((success, error) => {
      try {
        window.open(this._getUrl(data));
        success();
      } catch (e) {
        error(e);
      }
    });
  },
  asyncDownload(data) {
    return new Promise((success, error) => {
      this._getFetch(data).then((response) => {
        let contentType = response.headers.get("Content-Type");
        if (contentType && contentType.indexOf("download") !== -1) {
          response.blob().then((blob) => {
            try {
              let a = document.createElement("a");
              let url = window.URL.createObjectURL(blob);
              let filename = response.headers.get("Content-Disposition");
              filename = filename ? filename : "";
              let test = /filename=(.*?)$/g;
              let fileNameList = test.exec(filename);
              if (fileNameList !== null) {
                filename = fileNameList[1];
              }
              a.href = url;
              a.download = decodeURI(filename);
              a.click();
              window.URL.revokeObjectURL(url);
              success();
            } catch (e) {
              error(e);
            }
          });
        } else {
          response.text().then((text) => {
            error(text);
          });
        }
      });
    });
  },
  _getUrl(data) {
    let url = data.url;
    let param = data.param ? data.param : {};
    if (!variable.isEmpty(param)) {
      let u = "?";
      for (let key in param) {
        let value = param[key];
        if (!variable.isEmpty(value)) {
          u = u + key + "=" + value + "&";
        }
      }
      if (u !== "?") {
        u = u.substring(0, u.length - 1);
      } else {
        u = "";
      }
      url = url + u;
    }
    return url;
  },
  _getFetch(data) {
    let url = this._getUrl(data);
    let type = data.type;
    let header = data.header ? data.header : {};
    let sendData = data.body;
    let config = data.config;
    let isExistFile = false;
    if (variable.isObject(sendData)) {
      for (let key in sendData) {
        let valueType = variable.getType(sendData[key]);
        if (valueType === File || valueType === FileList) {
          isExistFile = true;
          break;
        }
        if (valueType === Array) {
          for (let item of sendData[key]) {
            if (variable.getType(item) === File || variable.getType(item) === FileList) {
              isExistFile = true;
              break;
            }
          }
        }
      }
      if (isExistFile) {
        let formData = new FormData();
        for (let key in sendData) {
          let value = sendData[key];
          if (variable.getType(value) === FileList) {
            for (let item of value) {
              formData.append(key, item);
            }
          } else if (variable.getType(value) === Array) {
            for (let item of value) {
              formData.append(key, item);
            }
          } else {
            formData.append(key, value);
          }
        }
        sendData = formData;
      }
    }
    if (variable.isObject(sendData)) {
      if (variable.getType(sendData) !== FormData) {
        let dataType = "BODY";
        if (config) {
          if (config.dataType) {
            dataType = config.dataType;
          }
        }
        switch (dataType) {
          case "BODY":
            sendData = JSON.stringify(sendData);
            break;
          case "FORM_DATA":
            let formData = new FormData();
            for (let key in sendData) {
              formData.append(key, sendData[key]);
            }
            sendData = formData;
            break;
        }
      }
    }
    if (type !== "GET" && !isExistFile) {
      header["content-type"] = "application/json";
    }
    return fetch(url, {
      cache: "no-cache",
      credentials: "same-origin",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
      method: type,
      headers: header,
      body: type !== "GET" ? sendData : void 0
    });
  }
};
let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
let _utf8_encode = function(string) {
  let utftext = "";
  string = string.replace(/\r\n/g, "\n");
  for (let n = 0; n < string.length; n++) {
    let c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode(c >> 6 | 192);
      utftext += String.fromCharCode(c & 63 | 128);
    } else {
      utftext += String.fromCharCode(c >> 12 | 224);
      utftext += String.fromCharCode(c >> 6 & 63 | 128);
      utftext += String.fromCharCode(c & 63 | 128);
    }
  }
  return utftext;
};
let _utf8_decode = function(utftext) {
  let string = "";
  let i = 0;
  let c, c2, c3 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode((c & 31) << 6 | c2 & 63);
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      i += 3;
    }
  }
  return string;
};
var base64 = {
  encode(input) {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  },
  decode(input) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }
};
var file = {
  select() {
    return new Promise((s) => {
      let fileE = document.createElement("input");
      fileE.type = "file";
      fileE.addEventListener("change", function() {
        let files = fileE.files;
        if (files === null) {
          s();
        } else {
          s(files[0]);
        }
      });
      fileE.click();
    });
  },
  selectMore() {
    return new Promise((s) => {
      let fileE = document.createElement("input");
      fileE.type = "file";
      fileE.multiple = true;
      fileE.addEventListener("change", function() {
        let files = fileE.files;
        s(files);
      });
      fileE.click();
    });
  }
};
class Service {
  constructor(url) {
    this.url = url;
  }
  $send(request) {
    return new Promise((s, e) => {
      http.send(this._getHttpRequest(request)).then((responseData) => {
        let responseDataJson;
        try {
          responseDataJson = JSON.parse(responseData);
        } catch (exception) {
          responseDataJson = responseData;
        }
        s(responseDataJson);
      }).catch((responseData) => {
        e(responseData);
      });
    });
  }
  $download(request) {
    return new Promise((s, e) => {
      http.download(this._getHttpRequest(request)).then(() => {
        s();
      }).catch((responseData) => {
        e(responseData);
      });
    });
  }
  $asyncDownload(request) {
    return new Promise((s, e) => {
      http.asyncDownload(this._getHttpRequest(request)).then(() => {
        s();
      }).catch((responseData) => {
        e(responseData);
      });
    });
  }
  $requestHandler(request) {
  }
  _getHttpRequest(request) {
    let url = request.url;
    let type = request.type;
    let header = request.header;
    let body = request.body;
    let param = request.param;
    if (variable.isEmpty(url)) {
      throw new InfoException("url is null");
    }
    if (variable.isEmpty(type)) {
      throw new InfoException("type is null");
    }
    let result = {
      url: url.indexOf("http") !== -1 ? url : this.url + "/" + url,
      type,
      header,
      body,
      param
    };
    this.$requestHandler(result);
    return result;
  }
}
var popup = {
  create(data) {
    let result = {
      loading: false,
      display: false,
      ...data,
      async open(d) {
        this.display = true;
        this.loading = true;
        if (data.openHandler) {
          await data.openHandler(d);
        }
        this.loading = false;
      },
      close() {
        this.display = false;
      }
    };
    if (data.close) {
      result.close = data.close;
    }
    return result;
  }
};
var window$1 = {
  getScreenHeight() {
    return window.screen.height;
  }
};
export { Request as HttpRequest, InfoException, Service, base64, file, http, popup, variable, window$1 as window };
