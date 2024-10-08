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
        let n = t[i], o = e[i];
        if (!(n === void 0 || o === void 0)) {
          if (n === null) {
            t[i] = o;
            continue;
          }
          if (this.isObject(n)) {
            if (this.isObject(o)) {
              if (Array.isArray(n) && Array.isArray(o)) {
                n = [];
                for (let s of o)
                  n.push(s);
                t[i] = n;
                continue;
              }
              !Array.isArray(n) && !Array.isArray(o) && this.assignment(n, o, !0);
            }
          } else
            (o === null || typeof n == typeof o) && (t[i] = o);
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
let f = (t, e, r) => {
  let i = r && r.startsWith("http") ? r : `${t}${r ? `/${r}` : ""}`;
  if (!e)
    return i;
  let n = "?";
  for (let o in e) {
    let s = e[o];
    s && (n = n + o + "=" + s + "&");
  }
  return n !== "?" ? n = n.substring(0, n.length - 1) : n = "", i = i + n, i;
}, d = (t) => {
  if (t.contentType === "FORM_DATA") {
    t.header && delete t.header["Content-type"];
    let e = new FormData();
    if (t.body && typeof t.body == "object")
      for (let r in t.body) {
        let i = t.body[r];
        if (i)
          if (i.constructor === FileList || Array.isArray(i))
            for (let n of i)
              e.append(r, n);
          else
            e.append(r, i);
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
          let i = t.header[r];
          i && (e[r] = i);
        }
      return e;
    })(),
    body: t.type !== "GET" ? t.body : void 0
  });
};
class p {
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
      case "FORM_DATA":
        this.request.header[r] = "multipart/form-data";
        break;
      case "TEXT_PLAIN":
        this.request.header[r] = "text/plain";
        break;
      case "TEXT_HTML":
        this.request.header[r] = "text/html";
        break;
      case "FORM_URLENCODED":
        this.request.header[r] = "application/x-www-form-urlencoded";
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
      d(this.request).then(async (i) => {
        let n = {
          code: i.status,
          header: (() => {
            let o = {};
            return i.headers.forEach((s, c) => {
              o[s] = c;
            }), o;
          })(),
          body: await i.text()
        };
        e(n);
      }).catch((i) => {
        r(i);
      });
    });
  }
  download() {
    return new Promise((e, r) => {
      try {
        window.open(f(this.request.url, this.request.param)), e(void 0);
      } catch (i) {
        r(i);
      }
    });
  }
  asyncDownload() {
    return new Promise((e, r) => {
      d(this.request).then((i) => {
        let n = i.headers.get("Content-Type");
        n && n.indexOf("download") !== -1 ? i.blob().then((o) => {
          try {
            let s = document.createElement("a"), c = window.URL.createObjectURL(o), l = i.headers.get("Content-Disposition");
            l = l || "";
            let m = /filename=(.*?)$/g.exec(l);
            m !== null && (l = m[1]), s.href = c, s.download = decodeURI(l), s.click(), window.URL.revokeObjectURL(c), e();
          } catch (s) {
            r(s);
          }
        }) : i.text().then((o) => {
          r(o);
        });
      }).catch((i) => {
        r(i);
      });
    });
  }
  sendOfBlob() {
    return new Promise((e, r) => {
      d(this.request).then((i) => {
        i.blob().then((n) => {
          let o = {
            code: i.status,
            header: (() => {
              let s = {};
              return i.headers.forEach((c, l) => {
                s[c] = l;
              }), s;
            })(),
            body: n
          };
          e(o);
        });
      }).catch((i) => {
        r(i);
      });
    });
  }
}
let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", w = function(t) {
  let e = "";
  t = t.replace(/\r\n/g, `
`);
  for (let r = 0; r < t.length; r++) {
    let i = t.charCodeAt(r);
    i < 128 ? e += String.fromCharCode(i) : i > 127 && i < 2048 ? (e += String.fromCharCode(i >> 6 | 192), e += String.fromCharCode(i & 63 | 128)) : (e += String.fromCharCode(i >> 12 | 224), e += String.fromCharCode(i >> 6 & 63 | 128), e += String.fromCharCode(i & 63 | 128));
  }
  return e;
}, b = function(t) {
  let e = "", r = 0, i, n, o = 0;
  for (; r < t.length; )
    i = t.charCodeAt(r), i < 128 ? (e += String.fromCharCode(i), r++) : i > 191 && i < 224 ? (n = t.charCodeAt(r + 1), e += String.fromCharCode((i & 31) << 6 | n & 63), r += 2) : (n = t.charCodeAt(r + 1), o = t.charCodeAt(r + 2), e += String.fromCharCode((i & 15) << 12 | (n & 63) << 6 | o & 63), r += 3);
  return e;
};
const k = {
  encode(t) {
    let e = "", r, i, n, o, s, c, l, h = 0;
    for (t = w(t); h < t.length; )
      r = t.charCodeAt(h++), i = t.charCodeAt(h++), n = t.charCodeAt(h++), o = r >> 2, s = (r & 3) << 4 | i >> 4, c = (i & 15) << 2 | n >> 6, l = n & 63, isNaN(i) ? c = l = 64 : isNaN(n) && (l = 64), e = e + a.charAt(o) + a.charAt(s) + a.charAt(c) + a.charAt(l);
    return e;
  },
  decode(t) {
    let e = "", r, i, n, o, s, c, l, h = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length; )
      o = a.indexOf(t.charAt(h++)), s = a.indexOf(t.charAt(h++)), c = a.indexOf(t.charAt(h++)), l = a.indexOf(t.charAt(h++)), r = o << 2 | s >> 4, i = (s & 15) << 4 | c >> 2, n = (c & 3) << 6 | l, e = e + String.fromCharCode(r), c !== 64 && (e = e + String.fromCharCode(i)), l !== 64 && (e = e + String.fromCharCode(n));
    return e = b(e), e;
  }
}, v = {
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
      let o = i + e > n ? n - i : e, s = t.slice(i, i + o);
      i = i + o, await r({
        pointer: i,
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
class g {
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
  let r = new p(f(t.url ? t.url : "", {}, e.url), e.type);
  if (e.param)
    for (let i in e.param)
      r.addParam(i, e.param[i]);
  if (e.header)
    for (let i in e.header)
      r.addHeader(i, e.header[i]);
  return e.contentType && r.setContentType(e.contentType), r.setBody(e.body), !r.request.contentType && r.request.type !== "GET" && typeof r.request.body == "object" && r.setContentType("APPLICATION_JSON"), r;
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
    return new Promise((r, i) => {
      y(this, e).send().then((n) => {
        n.body = u(n.body), n.code === 200 ? r(n) : i(n);
      }).catch((n) => {
        i(u(n));
      });
    });
  }
  $serverSentEvent(e, r) {
    return new g(f(this.url ? this.url : "", {}, e), r);
  }
  $download(e) {
    return new Promise((r, i) => {
      y(this, e).download().then(() => {
        r(void 0);
      }).catch((n) => {
        i(u(n));
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((r, i) => {
      y(this, e).asyncDownload().then(() => {
        r();
      }).catch((n) => {
        i(u(n));
      });
    });
  }
}
const S = {
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
class E {
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
  connect() {
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
const N = {
  debounce(t, e) {
    let r;
    return function() {
      let i = arguments;
      clearTimeout(r), r = setTimeout(() => {
        t.apply(this, i);
      }, e);
    };
  }
};
export {
  p as Http,
  g as ServerSentEvent,
  O as Service,
  E as Websocket,
  k as base64,
  v as file,
  N as func,
  C as variable,
  S as window
};
