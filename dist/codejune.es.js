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
    return this.isNull(r) ? !0 : this.isObject(r) ? Object.keys(r).length === 0 : typeof r == "string" ? r.trim() === "" : typeof r == "number" ? isNaN(r) || r === 0 : typeof r != "boolean";
  },
  /**
   * 是否是对象
   *
   * @param data data
   *
   * @return boolean
   * */
  isObject(r) {
    return this.isNull(r) ? !1 : typeof r == "object";
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
    } else if (this.isObject(r)) {
      let e = {};
      for (let t in r) {
        let i = r[t];
        i !== void 0 && (this.isObject(i) ? e[t] = this.clone(i) : e[t] = i);
      }
      return e;
    } else
      return r;
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
        let n = r[i], s = e[i];
        if (!(n === void 0 || s === void 0)) {
          if (n === null) {
            r[i] = s;
            continue;
          }
          if (this.isObject(n)) {
            if (this.isObject(s)) {
              if (Array.isArray(n) && Array.isArray(s)) {
                n = [];
                for (let o of s)
                  n.push(o);
                r[i] = n;
                continue;
              }
              !Array.isArray(n) && !Array.isArray(s) && this.assignment(n, s, !0);
            }
          } else
            (s === null || typeof n == typeof s) && (r[i] = s);
        }
      }
    else
      for (let i in e) {
        let n = e[i];
        n !== void 0 && (r[i] = n);
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
    return this.isNull(r) ? `${r}` : this.isObject(r) ? JSON.stringify(r) : r.toString();
  },
  /**
   * 清空数据
   *
   * @param data 数据
   * */
  clean(r) {
    if (Array.isArray(r))
      r.splice(0, r.length);
    else
      for (let e in r) {
        let t = r[e];
        this.isNull(t) || (this.isObject(t) ? this.clean(t) : r[e] = null);
      }
  }
};
class d {
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
        let n = i.text();
        i.ok ? e(n) : t(n);
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
        let n = i.headers.get("Content-Type");
        n && n.indexOf("download") !== -1 ? i.blob().then((s) => {
          try {
            let o = document.createElement("a"), c = window.URL.createObjectURL(s), l = i.headers.get("Content-Disposition");
            l = l || "";
            let u = /filename=(.*?)$/g.exec(l);
            u !== null && (l = u[1]), o.href = c, o.download = decodeURI(l), o.click(), window.URL.revokeObjectURL(c), e();
          } catch (o) {
            t(o);
          }
        }) : i.text().then((s) => {
          t(s);
        });
      });
    });
  }
  _getFetch() {
    if (a.isObject(this.body)) {
      let e = (t) => {
        if (a.isNull(t))
          return !1;
        if (t.constructor === File || t.constructor === FileList)
          return !0;
        for (let i in t) {
          let n = this.body[i];
          if (e(n))
            return !0;
        }
        return !1;
      };
      e(this.body) && (this.contentType = "FORM_DATA");
    }
    if (this.contentType === "FORM_DATA") {
      delete this.header["Content-type"];
      let e = new FormData();
      if (a.isObject(this.body))
        for (let t in this.body) {
          let i = this.body[t];
          if (i !== void 0)
            if (!a.isNull(i) && (i.constructor === FileList || Array.isArray(i)))
              for (let n of i)
                e.append(t, n);
            else
              e.append(t, i);
        }
      this.body = e;
    } else
      a.isObject(this.body) && (this.body = JSON.stringify(this.body));
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
        let n = this.param[i];
        n && (t = t + i + "=" + n + "&");
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
  let e = "", t = 0, i, n, s = 0;
  for (; t < r.length; )
    i = r.charCodeAt(t), i < 128 ? (e += String.fromCharCode(i), t++) : i > 191 && i < 224 ? (n = r.charCodeAt(t + 1), e += String.fromCharCode((i & 31) << 6 | n & 63), t += 2) : (n = r.charCodeAt(t + 1), s = r.charCodeAt(t + 2), e += String.fromCharCode((i & 15) << 12 | (n & 63) << 6 | s & 63), t += 3);
  return e;
};
const g = {
  encode(r) {
    let e = "", t, i, n, s, o, c, l, h = 0;
    for (r = y(r); h < r.length; )
      t = r.charCodeAt(h++), i = r.charCodeAt(h++), n = r.charCodeAt(h++), s = t >> 2, o = (t & 3) << 4 | i >> 4, c = (i & 15) << 2 | n >> 6, l = n & 63, isNaN(i) ? c = l = 64 : isNaN(n) && (l = 64), e = e + f.charAt(s) + f.charAt(o) + f.charAt(c) + f.charAt(l);
    return e;
  },
  decode(r) {
    let e = "", t, i, n, s, o, c, l, h = 0;
    for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < r.length; )
      s = f.indexOf(r.charAt(h++)), o = f.indexOf(r.charAt(h++)), c = f.indexOf(r.charAt(h++)), l = f.indexOf(r.charAt(h++)), t = s << 2 | o >> 4, i = (o & 15) << 4 | c >> 2, n = (c & 3) << 6 | l, e = e + String.fromCharCode(t), c !== 64 && (e = e + String.fromCharCode(i)), l !== 64 && (e = e + String.fromCharCode(n));
    return e = p(e), e;
  }
}, w = {
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
class b {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((t, i) => {
      this.$getHttp(e).send().then((n) => {
        t(this.$responseHandler(n));
      }).catch((n) => {
        i(this.$responseHandler(n));
      });
    });
  }
  $download(e) {
    return new Promise((t, i) => {
      this.$getHttp(e).download().then(() => {
        t();
      }).catch((n) => {
        i(this.$responseHandler(n));
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((t, i) => {
      this.$getHttp(e).asyncDownload().then(() => {
        t();
      }).catch((n) => {
        i(this.$responseHandler(n));
      });
    });
  }
  $getHttp(e) {
    e.url = e.url.startsWith("http") ? e.url : this.url ? `${this.url}${e.url ? e.url.startsWith("/") ? e.url : `/${e.url}` : ""}` : e.url;
    let t = new d(e.url, e.type);
    if (e.header)
      for (let i in e.header)
        t.addHeader(i, e.header[i]);
    if (e.param)
      for (let i in e.param)
        t.addParam(i, e.param[i]);
    return t.setBody(e.body), t.contentType === null && e.type !== "GET" && a.isObject(e.body) && t.setContentType("APPLICATION_JSON"), t;
  }
  $responseHandler(e) {
    let t;
    try {
      t = JSON.parse(e);
    } catch {
      t = e;
    }
    return t;
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
  /**
   * 获取屏幕高度
   *
   * @return 屏幕高度
   * */
  getScreenHeight() {
    return window.screen.height;
  },
  /**
   * 获取屏幕宽度
   *
   * @return 屏幕宽度
   * */
  getScreenWidth() {
    return window.screen.width;
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
  d as Http,
  m as InfoException,
  b as Service,
  k as Websocket,
  g as base64,
  w as file,
  C as popup,
  a as variable,
  A as window
};
