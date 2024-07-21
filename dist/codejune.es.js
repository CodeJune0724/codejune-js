const C = {
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
        let n = t[r];
        n !== void 0 && (this.isObject(n) ? e[r] = this.clone(n) : e[r] = n);
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
      for (let n in t) {
        let i = t[n], o = e[n];
        if (!(i === void 0 || o === void 0)) {
          if (i === null) {
            t[n] = o;
            continue;
          }
          if (this.isObject(i)) {
            if (this.isObject(o)) {
              if (Array.isArray(i) && Array.isArray(o)) {
                i = [];
                for (let s of o)
                  i.push(s);
                t[n] = i;
                continue;
              }
              !Array.isArray(i) && !Array.isArray(o) && this.assignment(i, o, !0);
            }
          } else
            (o === null || typeof i == typeof o) && (t[n] = o);
        }
      }
    else
      for (let n in e) {
        let i = e[n];
        i !== void 0 && (t[n] = i);
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
let f = (t, e, r) => {
  let n = r && r.startsWith("http") ? r : `${t}/${r}`;
  if (n = n.replace(/\/\//g, "/"), !e)
    return n;
  let i = "?";
  for (let o in e) {
    let s = e[o];
    s && (i = i + o + "=" + s + "&");
  }
  return i !== "?" ? i = i.substring(0, i.length - 1) : i = "", n = n + i, n;
}, d = (t) => {
  if (t.contentType === "FORM_DATA") {
    t.header && delete t.header["Content-type"];
    let e = new FormData();
    if (t.body && typeof t.body == "object")
      for (let r in t.body) {
        let n = t.body[r];
        if (n)
          if (n.constructor === FileList || Array.isArray(n))
            for (let i of n)
              e.append(r, i);
          else
            e.append(r, n);
      }
    t.body = e;
  } else
    t.body && (t.body = JSON.stringify(t.body));
  return fetch(f(t.url, t.param), {
    cache: "no-cache",
    credentials: "same-origin",
    mode: "cors",
    redirect: "follow",
    referrer: "no-referrer",
    method: t.type,
    headers: (() => {
      let e = {};
      if (t.header)
        for (let r in t.header) {
          let n = t.header[r];
          n && (e[r] = n);
        }
      return e;
    })(),
    body: t.type !== "GET" ? t.body : void 0
  });
};
class m {
  request = {
    url: "",
    type: "GET"
  };
  constructor(e, r) {
    this.request.url = e, this.request.type = r;
  }
  addHeader(e, r) {
    this.request.header || (this.request.header = {}), this.request.header[e] = r;
  }
  addParam(e, r) {
    this.request.param || (this.request.param = {}), this.request.param[e] = r;
  }
  setContentType(e) {
    this.request.contentType = e;
    let r = "Content-type";
    switch (this.request.header || (this.request.header = {}), e) {
      case "APPLICATION_JSON":
        this.request.header[r] = "application/json";
        break;
      case "APPLICATION_XML":
        this.request.header[r] = "application/xml";
        break;
      case "ROW":
        this.request.header[r] = "text/plain";
        break;
      case null:
        delete this.request.header[r];
        break;
    }
  }
  setBody(e) {
    this.request.body = e;
  }
  send() {
    return new Promise((e, r) => {
      d(this.request).then((n) => {
        let i = n.text();
        n.ok ? e(i) : r(i);
      }).catch((n) => {
        r(n);
      });
    });
  }
  download() {
    return new Promise((e, r) => {
      try {
        window.open(f(this.request.url, this.request.param)), e();
      } catch (n) {
        r(n);
      }
    });
  }
  asyncDownload() {
    return new Promise((e, r) => {
      d(this.request).then((n) => {
        let i = n.headers.get("Content-Type");
        i && i.indexOf("download") !== -1 ? n.blob().then((o) => {
          try {
            let s = document.createElement("a"), c = window.URL.createObjectURL(o), l = n.headers.get("Content-Disposition");
            l = l || "";
            let p = /filename=(.*?)$/g.exec(l);
            p !== null && (l = p[1]), s.href = c, s.download = decodeURI(l), s.click(), window.URL.revokeObjectURL(c), e();
          } catch (s) {
            r(s);
          }
        }) : n.text().then((o) => {
          r(o);
        });
      }).catch((n) => {
        r(n);
      });
    });
  }
  sendOfBlob() {
    return new Promise((e, r) => {
      d(this.request).then((n) => {
        n.blob().then((i) => {
          e(i);
        });
      }).catch((n) => {
        r(n);
      });
    });
  }
}
let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", g = function(t) {
  let e = "";
  t = t.replace(/\r\n/g, `
`);
  for (let r = 0; r < t.length; r++) {
    let n = t.charCodeAt(r);
    n < 128 ? e += String.fromCharCode(n) : n > 127 && n < 2048 ? (e += String.fromCharCode(n >> 6 | 192), e += String.fromCharCode(n & 63 | 128)) : (e += String.fromCharCode(n >> 12 | 224), e += String.fromCharCode(n >> 6 & 63 | 128), e += String.fromCharCode(n & 63 | 128));
  }
  return e;
}, w = function(t) {
  let e = "", r = 0, n, i, o = 0;
  for (; r < t.length; )
    n = t.charCodeAt(r), n < 128 ? (e += String.fromCharCode(n), r++) : n > 191 && n < 224 ? (i = t.charCodeAt(r + 1), e += String.fromCharCode((n & 31) << 6 | i & 63), r += 2) : (i = t.charCodeAt(r + 1), o = t.charCodeAt(r + 2), e += String.fromCharCode((n & 15) << 12 | (i & 63) << 6 | o & 63), r += 3);
  return e;
};
const S = {
  encode(t) {
    let e = "", r, n, i, o, s, c, l, h = 0;
    for (t = g(t); h < t.length; )
      r = t.charCodeAt(h++), n = t.charCodeAt(h++), i = t.charCodeAt(h++), o = r >> 2, s = (r & 3) << 4 | n >> 4, c = (n & 15) << 2 | i >> 6, l = i & 63, isNaN(n) ? c = l = 64 : isNaN(i) && (l = 64), e = e + a.charAt(o) + a.charAt(s) + a.charAt(c) + a.charAt(l);
    return e;
  },
  decode(t) {
    let e = "", r, n, i, o, s, c, l, h = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length; )
      o = a.indexOf(t.charAt(h++)), s = a.indexOf(t.charAt(h++)), c = a.indexOf(t.charAt(h++)), l = a.indexOf(t.charAt(h++)), r = o << 2 | s >> 4, n = (s & 15) << 4 | c >> 2, i = (c & 3) << 6 | l, e = e + String.fromCharCode(r), c !== 64 && (e = e + String.fromCharCode(n)), l !== 64 && (e = e + String.fromCharCode(i));
    return e = w(e), e;
  }
}, k = {
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
    let n = 0, i = t.size;
    for (; n < i; ) {
      let o = n + e > i ? i - n : e, s = t.slice(n, n + o);
      n = n + o, await r({
        pointer: n,
        file: s
      });
    }
  }
};
let A = (t) => {
  if (typeof t == "string")
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  else
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
  constructor(e, r) {
    this.url = e, this.param = r;
  }
  onOpen(e) {
    this.openAction = e;
  }
  onMessage(e, r) {
    this.messageAction[e] = r;
  }
  onError(e) {
    this.errorAction = e;
  }
  onClose(e) {
    this.closeAction = e;
  }
  open() {
    this.eventSource = new EventSource(f(this.url, this.param)), this.eventSource.onopen = () => {
      this.openAction();
    };
    for (let e in this.messageAction)
      this.eventSource.addEventListener(e, (r) => {
        this.messageAction[e](A(r.data));
      });
    this.eventSource.addEventListener("$error", (e) => {
      this.errorAction(A(e.data));
    }), this.eventSource.onerror = () => {
      this.closeAction(), this.close();
    };
  }
  close() {
    this.eventSource && this.eventSource.close();
  }
}
let y = (t, e) => {
  let r = new m(f(t.url ? t.url : "", {}, e.url), e.type);
  if (e.param)
    for (let n in e.param)
      r.addParam(n, e.param[n]);
  if (e.header)
    for (let n in e.header)
      r.addHeader(n, e.header[n]);
  return e.contentType && r.setContentType(e.contentType), r.setBody(e.body), r.request.contentType === null && r.request.type !== "GET" && typeof r.request.body == "object" && r.setContentType("APPLICATION_JSON"), r;
}, u = (t) => {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    e = t;
  }
  return e;
};
class O {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((r, n) => {
      y(this, e).send().then((i) => {
        r(u(i));
      }).catch((i) => {
        n(u(i));
      });
    });
  }
  $serverSentEvent(e, r) {
    return new b(f(this.url ? this.url : "", {}, e), r);
  }
  $download(e) {
    return new Promise((r, n) => {
      y(this, e).download().then(() => {
        r();
      }).catch((i) => {
        n(u(i));
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((r, n) => {
      y(this, e).asyncDownload().then(() => {
        r();
      }).catch((i) => {
        n(u(i));
      });
    });
  }
}
const v = {
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
class N {
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
  O as Service,
  N as Websocket,
  S as base64,
  k as file,
  C as variable,
  v as window
};
