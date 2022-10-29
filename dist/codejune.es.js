class g extends Error {
  constructor(e) {
    super(e);
  }
}
const f = {
  isNull(t) {
    return t == null;
  },
  isEmpty(t) {
    if (this.isNull(t))
      return !0;
    let e = this.getType(t);
    return e === String && t === "" || e === Array && t.length === 0 ? !0 : e === Object && Object.keys(t).length === 0;
  },
  getType(t) {
    return this.isNull(t) ? null : t.constructor;
  },
  isObject(t) {
    if (this.isNull(t))
      return !1;
    if (t instanceof Object) {
      let e = this.getType(t);
      return e == null ? !1 : JSON.stringify(t) !== void 0 || e.toString().indexOf("class") === 0 || e === Array ? !0 : e === Object;
    }
    return !1;
  },
  clone(t) {
    if (this.isObject(t))
      if (this.getType(t) === Array) {
        let e = [];
        for (let i of t)
          e.push(this.clone(i));
        return e;
      } else {
        let e = {};
        for (let i in t)
          e[i] = this.clone(t[i]);
        return e;
      }
    else
      return this.isNull(t) ? null : t;
  },
  assignment(t, e, i) {
    let r = this.getType(t), s = this.isEmpty(i) ? !0 : i === !0;
    if (!(!this.isObject(t) || !this.isObject(e)))
      if (r === Array) {
        let l = !0;
        if (s && this.getType(e) !== Array && (l = !1), r !== this.getType(e) && (l = !1), l) {
          t.splice(0, t.length);
          for (let n of e)
            t.push(n);
        }
      } else if (s)
        for (let l in t) {
          let n = t[l], o = e[l];
          if (n === void 0 || o === void 0)
            continue;
          let h = !1;
          (n === null || o === null && !this.isObject(n) || this.getType(n) === this.getType(o)) && (h = !0), h && (this.isObject(o) && (o = this.clone(o)), this.isObject(n) && this.isObject(o) ? this.assignment(n, o, !0) : t[l] = o);
        }
      else
        for (let l in e) {
          let n = e[l];
          n !== void 0 && (this.isObject(n) && (n = this.clone(n)), t[l] = n);
        }
  },
  toStr(t) {
    return this.isNull(t) ? null : this.isObject(t) ? JSON.stringify(t) : t.toString();
  },
  clean(t) {
    if (t instanceof Array)
      t.splice(0);
    else if (this.isObject(t))
      for (let e in t) {
        let i = t[e];
        this.isObject(i) ? this.clean(i) : t[e] = null;
      }
  },
  addKey(t, e) {
    if (!(!this.isObject(t) || !this.isObject(e)))
      for (let i in e) {
        let r = e[i];
        this.isNull(t[i]) && (this.isObject(r) ? this.getType(r) === Array ? t[i] = [] : t[i] = {} : t[i] = null), this.addKey(t[i], r);
      }
  },
  filterKey(t, e) {
    for (let i in t)
      e.indexOf(i) === -1 && delete t[i];
  }
};
class u {
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
        let s = r.text();
        r.ok ? e(s) : i(s);
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
        let s = r.headers.get("Content-Type");
        s && s.indexOf("download") !== -1 ? r.blob().then((l) => {
          try {
            let n = document.createElement("a"), o = window.URL.createObjectURL(l), h = r.headers.get("Content-Disposition");
            h = h || "";
            let d = /filename=(.*?)$/g.exec(h);
            d !== null && (h = d[1]), n.href = o, n.download = decodeURI(h), n.click(), window.URL.revokeObjectURL(o), e();
          } catch (n) {
            i(n);
          }
        }) : r.text().then((l) => {
          i(l);
        });
      });
    });
  }
  _getFetch() {
    let e = !1;
    if (f.isObject(this.body)) {
      for (let i in this.body) {
        let r = this.body[i], s = f.getType(r);
        if (s === File || s === FileList) {
          e = !0;
          break;
        }
        if (s === Array) {
          for (let l of r)
            if (f.getType(l) === File || f.getType(l) === FileList) {
              e = !0;
              break;
            }
        }
      }
      e && (this.contentType = "FORM_DATA");
    }
    if (this.contentType === "FORM_DATA") {
      delete this.header["Content-type"];
      let i = new FormData();
      if (f.isObject(this.body))
        for (let r in this.body) {
          let s = this.body[r];
          if (f.getType(s) === FileList)
            for (let l of s)
              i.append(r, l);
          else if (f.getType(s) === Array)
            for (let l of s)
              i.append(r, l);
          else
            i.append(r, s);
        }
      this.body = i;
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
        let s = this.param[r];
        s && (i = i + r + "=" + s + "&");
      }
      i !== "?" ? i = i.substring(0, i.length - 1) : i = "", e = e + i;
    }
    return e;
  }
}
let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", y = function(t) {
  let e = "";
  t = t.replace(/\r\n/g, `
`);
  for (let i = 0; i < t.length; i++) {
    let r = t.charCodeAt(i);
    r < 128 ? e += String.fromCharCode(r) : r > 127 && r < 2048 ? (e += String.fromCharCode(r >> 6 | 192), e += String.fromCharCode(r & 63 | 128)) : (e += String.fromCharCode(r >> 12 | 224), e += String.fromCharCode(r >> 6 & 63 | 128), e += String.fromCharCode(r & 63 | 128));
  }
  return e;
}, p = function(t) {
  let e = "", i = 0, r, s, l = 0;
  for (; i < t.length; )
    r = t.charCodeAt(i), r < 128 ? (e += String.fromCharCode(r), i++) : r > 191 && r < 224 ? (s = t.charCodeAt(i + 1), e += String.fromCharCode((r & 31) << 6 | s & 63), i += 2) : (s = t.charCodeAt(i + 1), l = t.charCodeAt(i + 2), e += String.fromCharCode((r & 15) << 12 | (s & 63) << 6 | l & 63), i += 3);
  return e;
};
const m = {
  encode(t) {
    let e = "", i, r, s, l, n, o, h, c = 0;
    for (t = y(t); c < t.length; )
      i = t.charCodeAt(c++), r = t.charCodeAt(c++), s = t.charCodeAt(c++), l = i >> 2, n = (i & 3) << 4 | r >> 4, o = (r & 15) << 2 | s >> 6, h = s & 63, isNaN(r) ? o = h = 64 : isNaN(s) && (h = 64), e = e + a.charAt(l) + a.charAt(n) + a.charAt(o) + a.charAt(h);
    return e;
  },
  decode(t) {
    let e = "", i, r, s, l, n, o, h, c = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < t.length; )
      l = a.indexOf(t.charAt(c++)), n = a.indexOf(t.charAt(c++)), o = a.indexOf(t.charAt(c++)), h = a.indexOf(t.charAt(c++)), i = l << 2 | n >> 4, r = (n & 15) << 4 | o >> 2, s = (o & 3) << 6 | h, e = e + String.fromCharCode(i), o !== 64 && (e = e + String.fromCharCode(r)), h !== 64 && (e = e + String.fromCharCode(s));
    return e = p(e), e;
  }
}, w = {
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
  }
};
class O {
  url;
  constructor(e) {
    this.url = e;
  }
  $send(e) {
    return new Promise((i, r) => {
      this._getHttp(e).send().then((s) => {
        let l;
        try {
          l = JSON.parse(s);
        } catch {
          l = s;
        }
        i(l);
      }).catch((s) => {
        r(s);
      });
    });
  }
  $download(e) {
    return new Promise((i, r) => {
      this._getHttp(e).download().then(() => {
        i();
      }).catch((s) => {
        r(s);
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((i, r) => {
      this._getHttp(e).asyncDownload().then(() => {
        i();
      }).catch((s) => {
        r(s);
      });
    });
  }
  $requestHandler(e) {
  }
  _getHttp(e) {
    e.url = e.url.indexOf("http") !== -1 ? e.url : this.url + "/" + e.url, this.$requestHandler(e);
    let i = new u(e.url, e.type);
    if (e.header)
      for (let r in e.header)
        i.addHeader(r, e.header[r]);
    if (e.param)
      for (let r in e.param)
        i.addParam(r, e.param[r]);
    return i.setBody(e.body), i.contentType === null && e.type !== "GET" && f.isObject(e.body) && i.setContentType("APPLICATION_JSON"), i;
  }
}
const b = {
  create(t) {
    let e = {
      loading: !1,
      display: !1,
      ...t,
      async open(i) {
        this.display = !0, this.loading = !0, t.openHandler && await t.openHandler(i), this.loading = !1;
      },
      close() {
        this.display = !1;
      }
    };
    return t.close && (e.close = t.close), e;
  }
}, C = {
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
  g as InfoException,
  O as Service,
  k as Websocket,
  m as base64,
  w as file,
  b as popup,
  f as variable,
  C as window
};
