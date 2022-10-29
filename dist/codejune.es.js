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
    let r = this.getType(t), l = this.isEmpty(i) ? !0 : i === !0;
    if (!(!this.isObject(t) || !this.isObject(e)))
      if (r === Array) {
        let s = !0;
        if (l && this.getType(e) !== Array && (s = !1), r !== this.getType(e) && (s = !1), s) {
          t.splice(0, t.length);
          for (let n of e)
            t.push(n);
        }
      } else if (l)
        for (let s in t) {
          let n = t[s], o = e[s];
          if (n === void 0 || o === void 0)
            continue;
          let h = !1;
          (n === null || o === null && !this.isObject(n) || this.getType(n) === this.getType(o)) && (h = !0), h && (this.isObject(o) && (o = this.clone(o)), this.isObject(n) && this.isObject(o) ? this.assignment(n, o, !0) : t[s] = o);
        }
      else
        for (let s in e) {
          let n = e[s];
          n !== void 0 && (this.isObject(n) && (n = this.clone(n)), t[s] = n);
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
        let l = r.text();
        r.ok ? e(l) : i(l);
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
        let l = r.headers.get("Content-Type");
        l && l.indexOf("download") !== -1 ? r.blob().then((s) => {
          try {
            let n = document.createElement("a"), o = window.URL.createObjectURL(s), h = r.headers.get("Content-Disposition");
            h = h || "";
            let d = /filename=(.*?)$/g.exec(h);
            d !== null && (h = d[1]), n.href = o, n.download = decodeURI(h), n.click(), window.URL.revokeObjectURL(o), e();
          } catch (n) {
            i(n);
          }
        }) : r.text().then((s) => {
          i(s);
        });
      });
    });
  }
  _getFetch() {
    let e = !1;
    if (f.isObject(this.body)) {
      for (let i in this.body) {
        let r = this.body[i], l = f.getType(r);
        if (l === File || l === FileList) {
          e = !0;
          break;
        }
        if (l === Array) {
          for (let s of r)
            if (f.getType(s) === File || f.getType(s) === FileList) {
              e = !0;
              break;
            }
        }
      }
      e && (this.contentType = "FORM_DATA");
    }
    if (this.contentType === "FORM_DATA") {
      let i = new FormData();
      if (f.isObject(this.body))
        for (let r in this.body) {
          let l = this.body[r];
          if (f.getType(l) === FileList)
            for (let s of l)
              i.append(r, s);
          else if (f.getType(l) === Array)
            for (let s of l)
              i.append(r, s);
          else
            i.append(r, l);
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
        let l = this.param[r];
        l && (i = i + r + "=" + l + "&");
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
  let e = "", i = 0, r, l, s = 0;
  for (; i < t.length; )
    r = t.charCodeAt(i), r < 128 ? (e += String.fromCharCode(r), i++) : r > 191 && r < 224 ? (l = t.charCodeAt(i + 1), e += String.fromCharCode((r & 31) << 6 | l & 63), i += 2) : (l = t.charCodeAt(i + 1), s = t.charCodeAt(i + 2), e += String.fromCharCode((r & 15) << 12 | (l & 63) << 6 | s & 63), i += 3);
  return e;
};
const m = {
  encode(t) {
    let e = "", i, r, l, s, n, o, h, c = 0;
    for (t = y(t); c < t.length; )
      i = t.charCodeAt(c++), r = t.charCodeAt(c++), l = t.charCodeAt(c++), s = i >> 2, n = (i & 3) << 4 | r >> 4, o = (r & 15) << 2 | l >> 6, h = l & 63, isNaN(r) ? o = h = 64 : isNaN(l) && (h = 64), e = e + a.charAt(s) + a.charAt(n) + a.charAt(o) + a.charAt(h);
    return e;
  },
  decode(t) {
    let e = "", i, r, l, s, n, o, h, c = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); c < t.length; )
      s = a.indexOf(t.charAt(c++)), n = a.indexOf(t.charAt(c++)), o = a.indexOf(t.charAt(c++)), h = a.indexOf(t.charAt(c++)), i = s << 2 | n >> 4, r = (n & 15) << 4 | o >> 2, l = (o & 3) << 6 | h, e = e + String.fromCharCode(i), o !== 64 && (e = e + String.fromCharCode(r)), h !== 64 && (e = e + String.fromCharCode(l));
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
      this._getHttp(e).send().then((l) => {
        let s;
        try {
          s = JSON.parse(l);
        } catch {
          s = l;
        }
        i(s);
      }).catch((l) => {
        r(l);
      });
    });
  }
  $download(e) {
    return new Promise((i, r) => {
      this._getHttp(e).download().then(() => {
        i();
      }).catch((l) => {
        r(l);
      });
    });
  }
  $asyncDownload(e) {
    return new Promise((i, r) => {
      this._getHttp(e).asyncDownload().then(() => {
        i();
      }).catch((l) => {
        r(l);
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
const C = {
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
}, b = {
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
    this.websocket = new WebSocket(this.url), this.websocket.onopen = this.onOpen, this.websocket.onmessage = this.onMessage, this.websocket.onclose = this.onClose, this.websocket.onerror = this.onError;
  }
  send(e) {
    this.websocket?.send(e);
  }
  close() {
    this.websocket && this.websocket.close();
  }
}
export {
  u as Http,
  g as InfoException,
  O as Service,
  k as Websocket,
  m as base64,
  w as file,
  C as popup,
  f as variable,
  b as window
};
