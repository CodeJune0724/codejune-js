(function(c,h){typeof exports=="object"&&typeof module<"u"?h(exports):typeof define=="function"&&define.amd?define(["exports"],h):(c=typeof globalThis<"u"?globalThis:c||self,h(c.codejune={}))})(this,function(c){"use strict";const h={isNull(t){return t==null},isEmpty(t){return this.isNull(t)?!0:this.isObject(t)?Object.keys(t).length===0:typeof t=="string"?t.trim()==="":typeof t=="number"?isNaN(t)||t===0:typeof t!="boolean"},isObject(t){return this.isNull(t)?!1:typeof t=="object"},clone(t){if(this.isNull(t))return t;if(Array.isArray(t)){let e=[];for(let i of t)e.push(this.clone(i));return e}else if(this.isObject(t)){let e={};for(let i in t){let n=t[i];n!==void 0&&(this.isObject(n)?e[i]=this.clone(n):e[i]=n)}return e}else return t},assignment(t,e,i){if(this.isNull(i)||i===!0)for(let n in t){let r=t[n],o=e[n];if(!(r===void 0||o===void 0)){if(r===null){t[n]=o;continue}if(this.isObject(r)){if(this.isObject(o)){if(Array.isArray(r)&&Array.isArray(o)){r=[];for(let s of o)r.push(s);t[n]=r;continue}!Array.isArray(r)&&!Array.isArray(o)&&this.assignment(r,o,!0)}}else(o===null||typeof r==typeof o)&&(t[n]=o)}}else for(let n in e){let r=e[n];r!==void 0&&(t[n]=r)}},toStr(t){return this.isNull(t)?`${t}`:this.isObject(t)?JSON.stringify(t):t.toString()},clean(t){if(Array.isArray(t))t.splice(0,t.length);else for(let e in t){let i=t[e];this.isNull(i)||typeof i=="function"||(this.isObject(i)&&!(i instanceof File)?this.clean(i):t[e]=null)}}};class p{url="";type="GET";param={};header={};contentType=null;body=null;constructor(e,i){this.url=e,this.type=i}addHeader(e,i){this.header[e]=i}addParam(e,i){this.param[e]=i}setContentType(e){this.contentType=e;let i="Content-type";switch(e){case"APPLICATION_JSON":this.header[i]="application/json";break;case"APPLICATION_XML":this.header[i]="application/xml";break;case"ROW":this.header[i]="text/plain";break;case null:delete this.header[i];break}}setBody(e){this.body=e}send(){return new Promise((e,i)=>{this._getFetch().then(n=>{let r=n.text();n.ok?e(r):i(r)}).catch(n=>{i(n)})})}download(){return new Promise((e,i)=>{try{window.open(this._getUrl()),e()}catch(n){i(n)}})}asyncDownload(){return new Promise((e,i)=>{this._getFetch().then(n=>{let r=n.headers.get("Content-Type");r&&r.indexOf("download")!==-1?n.blob().then(o=>{try{let s=document.createElement("a"),f=window.URL.createObjectURL(o),l=n.headers.get("Content-Disposition");l=l||"";let g=/filename=(.*?)$/g.exec(l);g!==null&&(l=g[1]),s.href=f,s.download=decodeURI(l),s.click(),window.URL.revokeObjectURL(f),e()}catch(s){i(s)}}):n.text().then(o=>{i(o)})}).catch(n=>{i(n)})})}sendOfBlob(){return new Promise((e,i)=>{this._getFetch().then(n=>{n.blob().then(r=>{e(r)})}).catch(n=>{i(n)})})}_getFetch(){if(this.contentType==="FORM_DATA"){delete this.header["Content-type"];let e=new FormData;if(h.isObject(this.body))for(let i in this.body){let n=this.body[i];if(n!=null)if(!h.isNull(n)&&(n.constructor===FileList||Array.isArray(n)))for(let r of n)e.append(i,r);else e.append(i,n)}this.body=e}else h.isObject(this.body)&&(this.body=JSON.stringify(this.body));return fetch(this._getUrl(),{cache:"no-cache",credentials:"same-origin",mode:"cors",redirect:"follow",referrer:"no-referrer",method:this.type,headers:this.header,body:this.type!=="GET"?this.body:void 0})}_getUrl(){let e=this.url;if(!h.isEmpty(this.param)){let i="?";for(let n in this.param){let r=this.param[n];r&&(i=i+n+"="+r+"&")}i!=="?"?i=i.substring(0,i.length-1):i="",e=e+i}return e}}let u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",b=function(t){let e="";t=t.replace(/\r\n/g,`
`);for(let i=0;i<t.length;i++){let n=t.charCodeAt(i);n<128?e+=String.fromCharCode(n):n>127&&n<2048?(e+=String.fromCharCode(n>>6|192),e+=String.fromCharCode(n&63|128)):(e+=String.fromCharCode(n>>12|224),e+=String.fromCharCode(n>>6&63|128),e+=String.fromCharCode(n&63|128))}return e},w=function(t){let e="",i=0,n,r,o=0;for(;i<t.length;)n=t.charCodeAt(i),n<128?(e+=String.fromCharCode(n),i++):n>191&&n<224?(r=t.charCodeAt(i+1),e+=String.fromCharCode((n&31)<<6|r&63),i+=2):(r=t.charCodeAt(i+1),o=t.charCodeAt(i+2),e+=String.fromCharCode((n&15)<<12|(r&63)<<6|o&63),i+=3);return e};const C={encode(t){let e="",i,n,r,o,s,f,l,a=0;for(t=b(t);a<t.length;)i=t.charCodeAt(a++),n=t.charCodeAt(a++),r=t.charCodeAt(a++),o=i>>2,s=(i&3)<<4|n>>4,f=(n&15)<<2|r>>6,l=r&63,isNaN(n)?f=l=64:isNaN(r)&&(l=64),e=e+u.charAt(o)+u.charAt(s)+u.charAt(f)+u.charAt(l);return e},decode(t){let e="",i,n,r,o,s,f,l,a=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");a<t.length;)o=u.indexOf(t.charAt(a++)),s=u.indexOf(t.charAt(a++)),f=u.indexOf(t.charAt(a++)),l=u.indexOf(t.charAt(a++)),i=o<<2|s>>4,n=(s&15)<<4|f>>2,r=(f&3)<<6|l,e=e+String.fromCharCode(i),f!==64&&(e=e+String.fromCharCode(n)),l!==64&&(e=e+String.fromCharCode(r));return e=w(e),e}},S={select(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.addEventListener("change",function(){let i=e.files;i===null?t():t(i[0])}),e.click()})},selectMore(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.multiple=!0,e.addEventListener("change",function(){let i=e.files;t(i)}),e.click()})},async slice(t,e,i){if(e<0)return;let n=0,r=t.size;for(;n<r;){let o=n+e>r?r-n:e,s=t.slice(n,n+o);n=n+o,await i({pointer:n,file:s})}}};let m=t=>{if(typeof t=="string")try{return JSON.parse(t)}catch{return t}else return t},v=(t,e)=>{if(!h.isEmpty(e)){let i="?";for(let n in e){let r=e[n];r&&(i=i+n+"="+r+"&")}i!=="?"?i=i.substring(0,i.length-1):i="",t=t+i}return t};class A{url="";param;eventSource=null;openAction=()=>{};messageAction={};errorAction=()=>{};closeAction=()=>{};constructor(e,i){this.url=e,this.param=i}onOpen(e){this.openAction=e}onMessage(e,i){this.messageAction[e]=i}onError(e){this.errorAction=e}onClose(e){this.closeAction=e}open(){this.eventSource=new EventSource(v(this.url,this.param)),this.eventSource.onopen=()=>{this.openAction()};for(let e in this.messageAction)this.eventSource.addEventListener(e,i=>{this.messageAction[e](m(i.data))});this.eventSource.addEventListener("$error",e=>{this.errorAction(m(e.data))}),this.eventSource.onerror=()=>{this.closeAction(),this.close()}}close(){this.eventSource&&this.eventSource.close()}}let y=(t,e)=>{t.url=t.url.startsWith("http")?t.url:e.url?`${e.url}${t.url?t.url.startsWith("/")?t.url:`/${t.url}`:""}`:t.url;let i=new p(t.url,t.type);if(t.header)for(let n in t.header)i.addHeader(n,t.header[n]);if(t.param)for(let n in t.param)i.addParam(n,t.param[n]);return i.setBody(t.body),t.contentType&&i.setContentType(t.contentType),i.contentType===null&&t.type!=="GET"&&h.isObject(t.body)&&i.setContentType("APPLICATION_JSON"),i},d=t=>{let e;try{e=JSON.parse(t)}catch{e=t}return e};class O{url;constructor(e){this.url=e}$send(e){return new Promise((i,n)=>{y(e,this).send().then(r=>{i(d(r))}).catch(r=>{n(d(r))})})}$serverSentEvent(e,i){return new A(e.startsWith("http")?e:this.url?`${this.url}${e?e.startsWith("/")?e:`/${e}`:""}`:e,i)}$download(e){return new Promise((i,n)=>{y(e,this).download().then(()=>{i()}).catch(r=>{n(d(r))})})}$asyncDownload(e){return new Promise((i,n)=>{y(e,this).asyncDownload().then(()=>{i()}).catch(r=>{n(d(r))})})}}const k={getHeight(){return window.innerHeight},getWidth(){return window.innerWidth}};class N{url="";websocket=null;onOpenAction=()=>{};onMessageAction=()=>{};onCloseAction=()=>{};onErrorAction=()=>{};constructor(e){this.url=e}onOpen(e){this.onOpenAction=e}onMessage(e){this.onMessageAction=e}onClose(e){this.onCloseAction=e}onError(e){this.onErrorAction=e}open(){this.websocket=new WebSocket(this.url),this.websocket.onopen=e=>{this.onOpenAction(e)},this.websocket.onmessage=e=>{this.onMessageAction(e)},this.websocket.onclose=e=>{this.onCloseAction(e)},this.websocket.onerror=e=>{this.onErrorAction(e)}}send(e){this.websocket&&(e instanceof Blob||e instanceof ArrayBuffer||typeof e=="string"?this.websocket.send(e):this.websocket.send(JSON.stringify(e)))}close(){this.websocket&&this.websocket.close()}}c.Http=p,c.ServerSentEvent=A,c.Service=O,c.Websocket=N,c.base64=C,c.file=S,c.variable=h,c.window=k,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});
