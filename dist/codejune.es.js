class m extends Error {
  constructor(e) {
    super(e);
  }
}
const a = {
  /**
   * 是否为空
   *
   * @param data data
   *
   * @return boolean
   * */
  isNull(r) {
    return r == null;
  },
  /**
   * 对象是否为空
   *
   * @param data data
   *
   * @return boolean
   * */
  isEmpty(r) {
    return this.isNull(r) ? !0 : typeof r == "object" ? Object.keys(r).length === 0 : typeof r == "string" ? r.trim() === "" : typeof r == "number" ? isNaN(r) || r === 0 : typeof r != "boolean";
  },
  /**
   * 克隆对象
   *
   * @param data 数据
   *
   * @return 克隆后的对象
   * */
  clone(r) {
    if (this.isNull(r))
      return r;
    if (Array.isArray(r)) {
      let e = [];
      for (let t of r)
        e.push(this.clone(t));
      return e;
    } else {
      let e = {};
      for (let t in r) {
        let i = r[t];
        i !== void 0 && (typeof i == "object" ? e[t] = this.clone(i) : e[t] = i);
      }
      return e;
    }
  },
  /**
   * 给对象赋值
   *
   * @param object1 赋值的对象
   * @param object2 取值的对象
   * @param isStrict 是否是严谨模式
   * */
  assignment(r, e, t) {
    if (this.isNull(t) || t === !0)
      for (let i in r) {
        let o = r[i], n = e[i];
        if (!(o === void 0 || n === void 0)) {
          if (o === null) {
            r[i] = n;
            continue;
          }
          if (typeof o == "object") {
            if (typeof n == "object") {
              if (Array.isArray(o) && Array.isArray(n)) {
                o = [];
                for (let l of n)
                  o.push(l);
                r[i] = o;
                continue;
              }
              !Array.isArray(o) && !Array.isArray(n) && this.assignment(o, n, !0);
            }
          } else
            typeof o == typeof n && (r[i] = n);
        }
      }
    else
      for (let i in e) {
        let o = e[i];
        o !== void 0 && (r[i] = o);
      }
  },
  /**
   * toString
   *
   * @param data data
   *
   * @return string
   * */
  toStr(r) {
    return this.isNull(r) ? `${r}` : typeof r == "object" ? JSON.stringify(r) : r.toString();
  },
  /**
   * 清空数据
   *
   * @param data 数据
   * */
  clean(r) {
    for (let e in r) {
      let t = r[e];
      this.isNull(t) || (typeof t == "object" ? Array.isArray(t) ? r[e] = [] : this.clean(t) : r[e] = null);
    }
  }
};
class u {
  url = "";
  type = "GET";
  param = {};
  header = {};
  contentType = null;
  body = null;
  constructor(e, t) {
    this.url = e, this.type = t;
  }
  addHeader(e, t) {
    this.header[e] = t;
  }
  addParam(e, t) {
    this.param[e] = t;
  }
  setContentType(e) {
    this.contentType = e;
    let t = "Content-type";
    switch (e) {
      case "APPLICATION_JSON":
        this.header[t] = "application/json";
        break;
      case "APPLICATION_XML":
        this.header[t] = "application/xml";
        break;
      case "ROW":
        this.header[t] = "text/plain";
        break;
      case null:
        delete this.header[t];
        break;
    }
  }
  setBody(e) {
    this.body = e;
  }
  send() {
    return new Promise((e, t) => {
      this._getFetch().then((i) => {
        let o = i.text();
        i.ok ? e(o) : t(o);
      }).catch((i) => {
        t(i);
      });
    });
  }
  download() {
    return new Promise((e, t) => {
      try {
        window.open(this._getUrl()), e();
      } catch (i) {
        t(i);
      }
    });
  }
  asyncDownload() {
    return new Promise((e, t) => {
      this._getFetch().then((i) => {
        let o = i.headers.get("Content-Type");
        o && o.indexOf("download") !== -1 ? i.blob().then((n) => {
          try {
            let l = document.createElement("a"), c = window.URL.createObjectURL(n), s = i.headers.get("Content-Disposition");
            s = s || "";
            let d = /filename=(.*?)$/g.exec(s);
            d !== null && (s = d[1]), l.href = c, l.download = decodeURI(s), l.click(), window.URL.revokeObjectURL(c), e();
          } catch (l) {
            t(l);
          }
        }) : i.text().then((n) => {
          t(n);
        });
      });
    });
  }
  _getFetch() {
    if (!a.isNull(this.body) && typeof this.body == "object") {
      let e = (t) => {
        if (a.isNull(t))
          return !1;
        if (t.constructor === File || t.constructor === FileList)
          return !0;
        for (let i in t) {
          let o = this.body[i];
          if (e(o))
            return !0;
        }
        return !1;
      };
      e(this.body) && (this.contentType = "FORM_DATA");
    }
    if (this.contentType === "FORM_DATA") {
      delete this.header["Content-type"];
      let e = new FormData();
      if (!a.isNull(this.body) && typeof this.body == "object")
        for (let t in this.body) {
          let i = this.body[t];
          if (i !== void 0)
            if (!a.isNull(i) && (i.constructor === FileList || Array.isArray(i)))
              for (let o of i)
                e.append(t, o);
            else
              e.append(t, i);
        }
      this.body = e;
    } else
      a.isNull(this.body) && typeof this.body == "object" && (this.body = JSON.stringify(this.body));
    return fetch(this._getUrl(), {
      cache: "no-cache",
      credentials: "same-origin",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
      method: this.type,
      headers: this.header,
      body: this.type !== "GET" ? this.body : void 0
    });
  }
  _getUrl() {
    let e = this.url;
    if (!a.isEmpty(this.param)) {
      let t = "?";
      for (let i in this.param) {
        let o = this.param[i];
        o && (t = t + i + "=" + o + "&");
      }
      t !== "?" ? t = t.substring(0, t.length - 1) : t = "", e = e + t;
    }
    return e;
  }
}
let f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", y = function(r) {
  let e = "";
  r = r.replace(/\r\n/g, `
`);
  for (let t = 0; t < r.length; t++) {
    let i = r.charCodeAt(t);
    i < 128 ? e += String.fromCharCode(i) : i > 127 && i < 2048 ? (e += String.fromCharCode(i >> 6 | 192), e += String.fromCharCode(i & 63 | 128)) : (e += String.fromCharCode(i >> 12 | 224), e += String.fromCharCode(i >> 6 & 63 | 128), e += String.fromCharCode(i & 63 | 128));
  }
  return e;
}, p = function(r) {
  let e = "", t = 0, i, o, n = 0;
  for (; t < r.length; )
    i = r.charCodeAt(t), i < 128 ? (e += String.fromCharCode(i), t++) : i > 191 && i < 224 ? (o = r.charCodeAt(t + 1), e += String.fromCharCode((i & 31) << 6 | o & 63), t += 2) : (o = r.charCodeAt(t + 1), n = r.charCodeAt(t + 2), e += String.fromCharCode((i & 15) << 12 | (o & 63) << 6 | n & 63), t += 3);
  return e;
};
const g = {
  encode(r) {
    let e = "", t, i, o, n, l, c, s, h = 0;
    for (r = y(r); h < r.length; )
      t = r.charCodeAt(h++), i = r.charCodeAt(h++), o = r.charCodeAt(h++), n = t >> 2, l = (t & 3) << 4 | i >> 4, c = (i & 15) << 2 | o >> 6, s = o & 63, isNaN(i) ? c = s = 64 : isNaN(o) && (s = 64), e = e + f.charAt(n) + f.charAt(l) + f.charAt(c) + f.charAt(s);
    return e;
  },
  decode(r) {
    let e = "", t, i, o, n, l, c, s, h = 0;
    for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < r.length; )
      n = f.indexOf(r.charAt(h++)), l = f.indexOf(r.charAt(h++)), c = f.indexOf(r.charAt(h++)), s = f.indexOf(r.charAt(h++)), t = n << 2 | l >> 4, i = (l & 15) << 4 | c >> 2, o = (c & 3) << 6 | s, e = e + String.fromCharCode(t), c !== 64 && (e = e + String.fromCharCode(i)), s !== 64 && (e = e + String.fromCharCode(o));
    return e = p(e), e;
  }
}, b = {
  select() {
    return new Promise((r) => {
      let e = document.createElement("input");
      e.type = "file", e.addEventListener("change", function() {
        let t = e.files;
        t === null ? r() : r(t[0]);
      }), e.click();
    });
  },
  selectMore() {
    return new Promise((r) => {
      let e = document.createElement("input");
      e.type = "file", e.multiple = !0, e.addEventListener("change", function() {
        let t = e.files;
        r(t);
      }), e.click();
    });
  }
};
class w {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((t, i) => {
      this._getHttp(e).send().then((o) => {
        let n;
        try {
          n = JSON.parse(o);
        } catch {
          n = o;
        }
        t(n);
      }).catch((o) => {
        i(o);
      });
    });
  }
  $download(e) {
    return new Promise((t, i) => {
      this._getHttp(e).download().then(() => {
        t();
      }).catch((o) => {
        i(o);
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((t, i) => {
      this._getHttp(e).asyncDownload().then(() => {
        t();
      }).catch((o) => {
        i(o);
      });
    });
  }
  _getHttp(e) {
    e.url = e.url.startsWith("http") ? e.url : this.url ? `${this.url}${e.url ? e.url.startsWith("/") ? e.url : `/${e.url}` : ""}` : e.url;
    let t = new u(e.url, e.type);
    if (e.header)
      for (let i in e.header)
        t.addHeader(i, e.header[i]);
    if (e.param)
      for (let i in e.param)
        t.addParam(i, e.param[i]);
    return t.setBody(e.body), t.contentType === null && e.type !== "GET" && typeof e.body == "object" && t.setContentType("APPLICATION_JSON"), t;
  }
}
const C = {
  create(r) {
    let e = {
      loading: !1,
      display: !1,
      ...r,
      async open(t) {
        this.display = !0, this.loading = !0, r.openHandler && await r.openHandler(t), this.loading = !1;
      },
      close() {
        this.display = !1;
      }
    };
    return r.close && (e.close = r.close), e;
  }
}, A = {
  getScreenHeight() {
    return window.screen.height;
  }
};
class k {
  url = "";
  websocket = null;
  onOpen = () => {
  };
  onMessage = () => {
  };
  onClose = () => {
  };
  onError = () => {
  };
  constructor(e) {
    this.url = e;
  }
  open() {
    this.websocket = new WebSocket(this.url), this.websocket.onopen = (e) => {
      this.onOpen(e);
    }, this.websocket.onmessage = (e) => {
      this.onMessage(e);
    }, this.websocket.onclose = (e) => {
      this.onClose(e);
    }, this.websocket.onerror = (e) => {
      this.onError(e);
    };
  }
  send(e) {
    this.websocket && (e instanceof Blob || e instanceof ArrayBuffer || typeof e == "string" ? this.websocket.send(e) : this.websocket.send(JSON.stringify(e)));
  }
  close() {
    this.websocket && (this.websocket.close(), this.websocket = null);
  }
}
export {
  u as Http,
  m as InfoException,
  w as Service,
  k as Websocket,
  g as base64,
  b as file,
  C as popup,
  a as variable,
  A as window
};
