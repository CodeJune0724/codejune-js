const f = {
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
      for (let i of t)
        e.push(this.clone(i));
      return e;
    } else if (this.isObject(t)) {
      let e = {};
      for (let i in t) {
        let r = t[i];
        r !== void 0 && (this.isObject(r) ? e[i] = this.clone(r) : e[i] = r);
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
  assignment(t, e, i) {
    if (this.isNull(i) || i === !0)
      for (let r in t) {
        let n = t[r], o = e[r];
        if (!(n === void 0 || o === void 0)) {
          if (n === null) {
            t[r] = o;
            continue;
          }
          if (this.isObject(n)) {
            if (this.isObject(o)) {
              if (Array.isArray(n) && Array.isArray(o)) {
                n = [];
                for (let s of o)
                  n.push(s);
                t[r] = n;
                continue;
              }
              !Array.isArray(n) && !Array.isArray(o) && this.assignment(n, o, !0);
            }
          } else
            (o === null || typeof n == typeof o) && (t[r] = o);
        }
      }
    else
      for (let r in e) {
        let n = e[r];
        n !== void 0 && (t[r] = n);
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
        let i = t[e];
        this.isNull(i) || typeof i == "function" || (this.isObject(i) && !(i instanceof File) ? this.clean(i) : t[e] = null);
      }
  }
};
class m {
  url = "";
  type = "GET";
  param = {};
  header = {};
  contentType = null;
  body = null;
  constructor(e, i) {
    this.url = e, this.type = i;
  }
  addHeader(e, i) {
    this.header[e] = i;
  }
  addParam(e, i) {
    this.param[e] = i;
  }
  setContentType(e) {
    this.contentType = e;
    let i = "Content-type";
    switch (e) {
      case "APPLICATION_JSON":
        this.header[i] = "application/json";
        break;
      case "APPLICATION_XML":
        this.header[i] = "application/xml";
        break;
      case "ROW":
        this.header[i] = "text/plain";
        break;
      case null:
        delete this.header[i];
        break;
    }
  }
  setBody(e) {
    this.body = e;
  }
  send() {
    return new Promise((e, i) => {
      this._getFetch().then((r) => {
        let n = r.text();
        r.ok ? e(n) : i(n);
      }).catch((r) => {
        i(r);
      });
    });
  }
  download() {
    return new Promise((e, i) => {
      try {
        window.open(this._getUrl()), e();
      } catch (r) {
        i(r);
      }
    });
  }
  asyncDownload() {
    return new Promise((e, i) => {
      this._getFetch().then((r) => {
        let n = r.headers.get("Content-Type");
        n && n.indexOf("download") !== -1 ? r.blob().then((o) => {
          try {
            let s = document.createElement("a"), c = window.URL.createObjectURL(o), l = r.headers.get("Content-Disposition");
            l = l || "";
            let y = /filename=(.*?)$/g.exec(l);
            y !== null && (l = y[1]), s.href = c, s.download = decodeURI(l), s.click(), window.URL.revokeObjectURL(c), e();
          } catch (s) {
            i(s);
          }
        }) : r.text().then((o) => {
          i(o);
        });
      }).catch((r) => {
        i(r);
      });
    });
  }
  sendOfBlob() {
    return new Promise((e, i) => {
      this._getFetch().then((r) => {
        r.blob().then((n) => {
          e(n);
        });
      }).catch((r) => {
        i(r);
      });
    });
  }
  _getFetch() {
    if (this.contentType === "FORM_DATA") {
      delete this.header["Content-type"];
      let e = new FormData();
      if (f.isObject(this.body))
        for (let i in this.body) {
          let r = this.body[i];
          if (r != null)
            if (!f.isNull(r) && (r.constructor === FileList || Array.isArray(r)))
              for (let n of r)
                e.append(i, n);
            else
              e.append(i, r);
        }
      this.body = e;
    } else
      f.isObject(this.body) && (this.body = JSON.stringify(this.body));
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
    if (!f.isEmpty(this.param)) {
      let i = "?";
      for (let r in this.param) {
        let n = this.param[r];
        n && (i = i + r + "=" + n + "&");
      }
      i !== "?" ? i = i.substring(0, i.length - 1) : i = "", e = e + i;
    }
    return e;
  }
}
let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", A = function(t) {
  let e = "";
  t = t.replace(/\r\n/g, `
`);
  for (let i = 0; i < t.length; i++) {
    let r = t.charCodeAt(i);
    r < 128 ? e += String.fromCharCode(r) : r > 127 && r < 2048 ? (e += String.fromCharCode(r >> 6 | 192), e += String.fromCharCode(r & 63 | 128)) : (e += String.fromCharCode(r >> 12 | 224), e += String.fromCharCode(r >> 6 & 63 | 128), e += String.fromCharCode(r & 63 | 128));
  }
  return e;
}, g = function(t) {
  let e = "", i = 0, r, n, o = 0;
  for (; i < t.length; )
    r = t.charCodeAt(i), r < 128 ? (e += String.fromCharCode(r), i++) : r > 191 && r < 224 ? (n = t.charCodeAt(i + 1), e += String.fromCharCode((r & 31) << 6 | n & 63), i += 2) : (n = t.charCodeAt(i + 1), o = t.charCodeAt(i + 2), e += String.fromCharCode((r & 15) << 12 | (n & 63) << 6 | o & 63), i += 3);
  return e;
};
const C = {
  encode(t) {
    let e = "", i, r, n, o, s, c, l, h = 0;
    for (t = A(t); h < t.length; )
      i = t.charCodeAt(h++), r = t.charCodeAt(h++), n = t.charCodeAt(h++), o = i >> 2, s = (i & 3) << 4 | r >> 4, c = (r & 15) << 2 | n >> 6, l = n & 63, isNaN(r) ? c = l = 64 : isNaN(n) && (l = 64), e = e + a.charAt(o) + a.charAt(s) + a.charAt(c) + a.charAt(l);
    return e;
  },
  decode(t) {
    let e = "", i, r, n, o, s, c, l, h = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length; )
      o = a.indexOf(t.charAt(h++)), s = a.indexOf(t.charAt(h++)), c = a.indexOf(t.charAt(h++)), l = a.indexOf(t.charAt(h++)), i = o << 2 | s >> 4, r = (s & 15) << 4 | c >> 2, n = (c & 3) << 6 | l, e = e + String.fromCharCode(i), c !== 64 && (e = e + String.fromCharCode(r)), l !== 64 && (e = e + String.fromCharCode(n));
    return e = g(e), e;
  }
}, O = {
  select() {
    return new Promise((t) => {
      let e = document.createElement("input");
      e.type = "file", e.addEventListener("change", function() {
        let i = e.files;
        i === null ? t() : t(i[0]);
      }), e.click();
    });
  },
  selectMore() {
    return new Promise((t) => {
      let e = document.createElement("input");
      e.type = "file", e.multiple = !0, e.addEventListener("change", function() {
        let i = e.files;
        t(i);
      }), e.click();
    });
  },
  async slice(t, e, i) {
    if (e < 0)
      return;
    let r = 0, n = t.size;
    for (; r < n; ) {
      let o = r + e > n ? n - r : e, s = t.slice(r, r + o);
      r = r + o, await i({
        pointer: r,
        file: s
      });
    }
  }
};
let p = (t) => {
  if (typeof t == "string")
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  else
    return t;
}, w = (t, e) => {
  if (!f.isEmpty(e)) {
    let i = "?";
    for (let r in e) {
      let n = e[r];
      n && (i = i + r + "=" + n + "&");
    }
    i !== "?" ? i = i.substring(0, i.length - 1) : i = "", t = t + i;
  }
  return t;
};
class b {
  url = "";
  param;
  eventSource = null;
  openAction = () => {
  };
  messageAction = {};
  errorAction = () => {
  };
  closeAction = () => {
  };
  constructor(e, i) {
    this.url = e, this.param = i;
  }
  onOpen(e) {
    this.openAction = e;
  }
  onMessage(e, i) {
    this.messageAction[e] = i;
  }
  onError(e) {
    this.errorAction = e;
  }
  onClose(e) {
    this.closeAction = e;
  }
  open() {
    this.eventSource = new EventSource(w(this.url, this.param)), this.eventSource.onopen = () => {
      this.openAction();
    };
    for (let e in this.messageAction)
      this.eventSource.addEventListener(e, (i) => {
        this.messageAction[e](p(i.data));
      });
    this.eventSource.addEventListener("$error", (e) => {
      this.errorAction(p(e.data));
    }), this.eventSource.onerror = () => {
      this.closeAction(), this.close();
    };
  }
  close() {
    this.eventSource && this.eventSource.close();
  }
}
let d = (t, e) => {
  t.url = t.url.startsWith("http") ? t.url : e.url ? `${e.url}${t.url ? t.url.startsWith("/") ? t.url : `/${t.url}` : ""}` : t.url;
  let i = new m(t.url, t.type);
  if (t.header)
    for (let r in t.header)
      i.addHeader(r, t.header[r]);
  if (t.param)
    for (let r in t.param)
      i.addParam(r, t.param[r]);
  return i.setBody(t.body), t.contentType && i.setContentType(t.contentType), i.contentType === null && t.type !== "GET" && f.isObject(t.body) && i.setContentType("APPLICATION_JSON"), i;
}, u = (t) => {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    e = t;
  }
  return e;
};
class S {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((i, r) => {
      d(e, this).send().then((n) => {
        i(u(n));
      }).catch((n) => {
        r(u(n));
      });
    });
  }
  $serverSentEvent(e) {
    return new b(e.startsWith("http") ? e : this.url ? `${this.url}${e ? e.startsWith("/") ? e : `/${e}` : ""}` : e);
  }
  $download(e) {
    return new Promise((i, r) => {
      d(e, this).download().then(() => {
        i();
      }).catch((n) => {
        r(u(n));
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((i, r) => {
      d(e, this).asyncDownload().then(() => {
        i();
      }).catch((n) => {
        r(u(n));
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
class v {
  url = "";
  websocket = null;
  onOpenAction = () => {
  };
  onMessageAction = () => {
  };
  onCloseAction = () => {
  };
  onErrorAction = () => {
  };
  constructor(e) {
    this.url = e;
  }
  onOpen(e) {
    this.onOpenAction = e;
  }
  onMessage(e) {
    this.onMessageAction = e;
  }
  onClose(e) {
    this.onCloseAction = e;
  }
  onError(e) {
    this.onErrorAction = e;
  }
  open() {
    this.websocket = new WebSocket(this.url), this.websocket.onopen = (e) => {
      this.onOpenAction(e);
    }, this.websocket.onmessage = (e) => {
      this.onMessageAction(e);
    }, this.websocket.onclose = (e) => {
      this.onCloseAction(e);
    }, this.websocket.onerror = (e) => {
      this.onErrorAction(e);
    };
  }
  send(e) {
    this.websocket && (e instanceof Blob || e instanceof ArrayBuffer || typeof e == "string" ? this.websocket.send(e) : this.websocket.send(JSON.stringify(e)));
  }
  close() {
    this.websocket && this.websocket.close();
  }
}
export {
  m as Http,
  b as ServerSentEvent,
  S as Service,
  v as Websocket,
  C as base64,
  O as file,
  f as variable,
  k as window
};
