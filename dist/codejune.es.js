class b extends Error {
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
  isNull(t) {
    return t == null;
  },
  /**
   * 对象是否为空
   *
   * @param data data
   *
   * @return boolean
   * */
  isEmpty(t) {
    return this.isNull(t) ? !0 : this.isObject(t) ? Object.keys(t).length === 0 : typeof t == "string" ? t.trim() === "" : typeof t == "number" ? isNaN(t) || t === 0 : typeof t != "boolean";
  },
  /**
   * 是否是对象
   *
   * @param data data
   *
   * @return boolean
   * */
  isObject(t) {
    return this.isNull(t) ? !1 : typeof t == "object";
  },
  /**
   * 克隆对象
   *
   * @param data 数据
   *
   * @return 克隆后的对象
   * */
  clone(t) {
    if (this.isNull(t))
      return t;
    if (Array.isArray(t)) {
      let e = [];
      for (let r of t)
        e.push(this.clone(r));
      return e;
    } else if (this.isObject(t)) {
      let e = {};
      for (let r in t) {
        let i = t[r];
        i !== void 0 && (this.isObject(i) ? e[r] = this.clone(i) : e[r] = i);
      }
      return e;
    } else
      return t;
  },
  /**
   * 给对象赋值
   *
   * @param object1 赋值的对象
   * @param object2 取值的对象
   * @param isStrict 是否是严谨模式
   * */
  assignment(t, e, r) {
    if (this.isNull(r) || r === !0)
      for (let i in t) {
        let n = t[i], l = e[i];
        if (!(n === void 0 || l === void 0)) {
          if (n === null) {
            t[i] = l;
            continue;
          }
          if (this.isObject(n)) {
            if (this.isObject(l)) {
              if (Array.isArray(n) && Array.isArray(l)) {
                n = [];
                for (let o of l)
                  n.push(o);
                t[i] = n;
                continue;
              }
              !Array.isArray(n) && !Array.isArray(l) && this.assignment(n, l, !0);
            }
          } else
            (l === null || typeof n == typeof l) && (t[i] = l);
        }
      }
    else
      for (let i in e) {
        let n = e[i];
        n !== void 0 && (t[i] = n);
      }
  },
  /**
   * toString
   *
   * @param data data
   *
   * @return string
   * */
  toStr(t) {
    return this.isNull(t) ? `${t}` : this.isObject(t) ? JSON.stringify(t) : t.toString();
  },
  /**
   * 清空数据
   *
   * @param data 数据
   * */
  clean(t) {
    if (Array.isArray(t))
      t.splice(0, t.length);
    else
      for (let e in t) {
        let r = t[e];
        this.isNull(r) || typeof r == "function" || (this.isObject(r) && !(r instanceof File) ? this.clean(r) : t[e] = null);
      }
  }
};
class p {
  url = "";
  type = "GET";
  param = {};
  header = {};
  contentType = null;
  body = null;
  constructor(e, r) {
    this.url = e, this.type = r;
  }
  addHeader(e, r) {
    this.header[e] = r;
  }
  addParam(e, r) {
    this.param[e] = r;
  }
  setContentType(e) {
    this.contentType = e;
    let r = "Content-type";
    switch (e) {
      case "APPLICATION_JSON":
        this.header[r] = "application/json";
        break;
      case "APPLICATION_XML":
        this.header[r] = "application/xml";
        break;
      case "ROW":
        this.header[r] = "text/plain";
        break;
      case null:
        delete this.header[r];
        break;
    }
  }
  setBody(e) {
    this.body = e;
  }
  send() {
    return new Promise((e, r) => {
      this._getFetch().then((i) => {
        let n = i.text();
        i.ok ? e(n) : r(n);
      }).catch((i) => {
        r(i);
      });
    });
  }
  download() {
    return new Promise((e, r) => {
      try {
        window.open(this._getUrl()), e();
      } catch (i) {
        r(i);
      }
    });
  }
  asyncDownload() {
    return new Promise((e, r) => {
      this._getFetch().then((i) => {
        let n = i.headers.get("Content-Type");
        n && n.indexOf("download") !== -1 ? i.blob().then((l) => {
          try {
            let o = document.createElement("a"), c = window.URL.createObjectURL(l), s = i.headers.get("Content-Disposition");
            s = s || "";
            let y = /filename=(.*?)$/g.exec(s);
            y !== null && (s = y[1]), o.href = c, o.download = decodeURI(s), o.click(), window.URL.revokeObjectURL(c), e();
          } catch (o) {
            r(o);
          }
        }) : i.text().then((l) => {
          r(l);
        });
      });
    });
  }
  _getFetch() {
    if (a.isObject(this.body)) {
      let e = (r) => {
        if (a.isNull(r))
          return !1;
        if (r.constructor === File || r.constructor === FileList)
          return !0;
        for (let i in r) {
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
        for (let r in this.body) {
          let i = this.body[r];
          if (i !== void 0)
            if (!a.isNull(i) && (i.constructor === FileList || Array.isArray(i)))
              for (let n of i)
                e.append(r, n);
            else
              e.append(r, i);
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
      let r = "?";
      for (let i in this.param) {
        let n = this.param[i];
        n && (r = r + i + "=" + n + "&");
      }
      r !== "?" ? r = r.substring(0, r.length - 1) : r = "", e = e + r;
    }
    return e;
  }
}
let f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", m = function(t) {
  let e = "";
  t = t.replace(/\r\n/g, `
`);
  for (let r = 0; r < t.length; r++) {
    let i = t.charCodeAt(r);
    i < 128 ? e += String.fromCharCode(i) : i > 127 && i < 2048 ? (e += String.fromCharCode(i >> 6 | 192), e += String.fromCharCode(i & 63 | 128)) : (e += String.fromCharCode(i >> 12 | 224), e += String.fromCharCode(i >> 6 & 63 | 128), e += String.fromCharCode(i & 63 | 128));
  }
  return e;
}, w = function(t) {
  let e = "", r = 0, i, n, l = 0;
  for (; r < t.length; )
    i = t.charCodeAt(r), i < 128 ? (e += String.fromCharCode(i), r++) : i > 191 && i < 224 ? (n = t.charCodeAt(r + 1), e += String.fromCharCode((i & 31) << 6 | n & 63), r += 2) : (n = t.charCodeAt(r + 1), l = t.charCodeAt(r + 2), e += String.fromCharCode((i & 15) << 12 | (n & 63) << 6 | l & 63), r += 3);
  return e;
};
const g = {
  encode(t) {
    let e = "", r, i, n, l, o, c, s, h = 0;
    for (t = m(t); h < t.length; )
      r = t.charCodeAt(h++), i = t.charCodeAt(h++), n = t.charCodeAt(h++), l = r >> 2, o = (r & 3) << 4 | i >> 4, c = (i & 15) << 2 | n >> 6, s = n & 63, isNaN(i) ? c = s = 64 : isNaN(n) && (s = 64), e = e + f.charAt(l) + f.charAt(o) + f.charAt(c) + f.charAt(s);
    return e;
  },
  decode(t) {
    let e = "", r, i, n, l, o, c, s, h = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length; )
      l = f.indexOf(t.charAt(h++)), o = f.indexOf(t.charAt(h++)), c = f.indexOf(t.charAt(h++)), s = f.indexOf(t.charAt(h++)), r = l << 2 | o >> 4, i = (o & 15) << 4 | c >> 2, n = (c & 3) << 6 | s, e = e + String.fromCharCode(r), c !== 64 && (e = e + String.fromCharCode(i)), s !== 64 && (e = e + String.fromCharCode(n));
    return e = w(e), e;
  }
}, C = {
  select() {
    return new Promise((t) => {
      let e = document.createElement("input");
      e.type = "file", e.addEventListener("change", function() {
        let r = e.files;
        r === null ? t() : t(r[0]);
      }), e.click();
    });
  },
  selectMore() {
    return new Promise((t) => {
      let e = document.createElement("input");
      e.type = "file", e.multiple = !0, e.addEventListener("change", function() {
        let r = e.files;
        t(r);
      }), e.click();
    });
  },
  async slice(t, e, r) {
    if (e < 0)
      return;
    let i = 0, n = t.size;
    for (; i < n; ) {
      let l = i + e > n ? n - i : e, o = t.slice(i, i + l);
      i = i + l, await r({
        pointer: i,
        file: o
      });
    }
  }
};
let d = (t, e) => {
  t.url = t.url.startsWith("http") ? t.url : e.url ? `${e.url}${t.url ? t.url.startsWith("/") ? t.url : `/${t.url}` : ""}` : t.url;
  let r = new p(t.url, t.type);
  if (t.header)
    for (let i in t.header)
      r.addHeader(i, t.header[i]);
  if (t.param)
    for (let i in t.param)
      r.addParam(i, t.param[i]);
  return r.setBody(t.body), t.contentType && r.setContentType(t.contentType), r.contentType === null && t.type !== "GET" && a.isObject(t.body) && r.setContentType("APPLICATION_JSON"), r;
}, u = (t) => {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    e = t;
  }
  return e;
};
class A {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((r, i) => {
      d(e, this).send().then((n) => {
        r(u(n));
      }).catch((n) => {
        i(u(n));
      });
    });
  }
  $download(e) {
    return new Promise((r, i) => {
      d(e, this).download().then(() => {
        r();
      }).catch((n) => {
        i(u(n));
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((r, i) => {
      d(e, this).asyncDownload().then(() => {
        r();
      }).catch((n) => {
        i(u(n));
      });
    });
  }
}
const k = {
  /**
   * 获取屏幕高度
   *
   * @return 屏幕高度
   * */
  getHeight() {
    return window.innerHeight;
  },
  /**
   * 获取屏幕宽度
   *
   * @return 屏幕宽度
   * */
  getWidth() {
    return window.innerWidth;
  }
};
class O {
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
  p as Http,
  b as InfoException,
  A as Service,
  O as Websocket,
  g as base64,
  C as file,
  a as variable,
  k as window
};
