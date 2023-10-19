(function(c,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(c=typeof globalThis<"u"?globalThis:c||self,d(c.codejune={}))})(this,function(c){"use strict";const d="";class m extends Error{constructor(e){super(e)}}const a={isNull(i){return i==null},isEmpty(i){return this.isNull(i)?!0:this.isObject(i)?Object.keys(i).length===0:typeof i=="string"?i.trim()==="":typeof i=="number"?isNaN(i)||i===0:typeof i!="boolean"},isObject(i){return this.isNull(i)?!1:typeof i=="object"},clone(i){if(this.isNull(i))return i;if(Array.isArray(i)){let e=[];for(let t of i)e.push(this.clone(t));return e}else if(this.isObject(i)){let e={};for(let t in i){let r=i[t];r!==void 0&&(this.isObject(r)?e[t]=this.clone(r):e[t]=r)}return e}else return i},assignment(i,e,t){if(this.isNull(t)||t===!0)for(let r in i){let n=i[r],l=e[r];if(!(n===void 0||l===void 0)){if(n===null){i[r]=l;continue}if(this.isObject(n)){if(this.isObject(l)){if(Array.isArray(n)&&Array.isArray(l)){n=[];for(let s of l)n.push(s);i[r]=n;continue}!Array.isArray(n)&&!Array.isArray(l)&&this.assignment(n,l,!0)}}else(l===null||typeof n==typeof l)&&(i[r]=l)}}else for(let r in e){let n=e[r];n!==void 0&&(i[r]=n)}},toStr(i){return this.isNull(i)?`${i}`:this.isObject(i)?JSON.stringify(i):i.toString()},clean(i){if(Array.isArray(i))i.splice(0,i.length);else for(let e in i){let t=i[e];this.isNull(t)||(this.isObject(t)?this.clean(t):i[e]=null)}}};class y{url="";type="GET";param={};header={};contentType=null;body=null;constructor(e,t){this.url=e,this.type=t}addHeader(e,t){this.header[e]=t}addParam(e,t){this.param[e]=t}setContentType(e){this.contentType=e;let t="Content-type";switch(e){case"APPLICATION_JSON":this.header[t]="application/json";break;case"APPLICATION_XML":this.header[t]="application/xml";break;case"ROW":this.header[t]="text/plain";break;case null:delete this.header[t];break}}setBody(e){this.body=e}send(){return new Promise((e,t)=>{this._getFetch().then(r=>{let n=r.text();r.ok?e(n):t(n)}).catch(r=>{t(r)})})}download(){return new Promise((e,t)=>{try{window.open(this._getUrl()),e()}catch(r){t(r)}})}asyncDownload(){return new Promise((e,t)=>{this._getFetch().then(r=>{let n=r.headers.get("Content-Type");n&&n.indexOf("download")!==-1?r.blob().then(l=>{try{let s=document.createElement("a"),h=window.URL.createObjectURL(l),o=r.headers.get("Content-Disposition");o=o||"";let p=/filename=(.*?)$/g.exec(o);p!==null&&(o=p[1]),s.href=h,s.download=decodeURI(o),s.click(),window.URL.revokeObjectURL(h),e()}catch(s){t(s)}}):r.text().then(l=>{t(l)})})})}_getFetch(){if(a.isObject(this.body)){let e=t=>{if(a.isNull(t))return!1;if(t.constructor===File||t.constructor===FileList)return!0;for(let r in t){let n=this.body[r];if(e(n))return!0}return!1};e(this.body)&&(this.contentType="FORM_DATA")}if(this.contentType==="FORM_DATA"){delete this.header["Content-type"];let e=new FormData;if(a.isObject(this.body))for(let t in this.body){let r=this.body[t];if(r!==void 0)if(!a.isNull(r)&&(r.constructor===FileList||Array.isArray(r)))for(let n of r)e.append(t,n);else e.append(t,r)}this.body=e}else a.isObject(this.body)&&(this.body=JSON.stringify(this.body));return fetch(this._getUrl(),{cache:"no-cache",credentials:"same-origin",mode:"cors",redirect:"follow",referrer:"no-referrer",method:this.type,headers:this.header,body:this.type!=="GET"?this.body:void 0})}_getUrl(){let e=this.url;if(!a.isEmpty(this.param)){let t="?";for(let r in this.param){let n=this.param[r];n&&(t=t+r+"="+n+"&")}t!=="?"?t=t.substring(0,t.length-1):t="",e=e+t}return e}}let u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",b=function(i){let e="";i=i.replace(/\r\n/g,`
`);for(let t=0;t<i.length;t++){let r=i.charCodeAt(t);r<128?e+=String.fromCharCode(r):r>127&&r<2048?(e+=String.fromCharCode(r>>6|192),e+=String.fromCharCode(r&63|128)):(e+=String.fromCharCode(r>>12|224),e+=String.fromCharCode(r>>6&63|128),e+=String.fromCharCode(r&63|128))}return e},g=function(i){let e="",t=0,r,n,l=0;for(;t<i.length;)r=i.charCodeAt(t),r<128?(e+=String.fromCharCode(r),t++):r>191&&r<224?(n=i.charCodeAt(t+1),e+=String.fromCharCode((r&31)<<6|n&63),t+=2):(n=i.charCodeAt(t+1),l=i.charCodeAt(t+2),e+=String.fromCharCode((r&15)<<12|(n&63)<<6|l&63),t+=3);return e};const w={encode(i){let e="",t,r,n,l,s,h,o,f=0;for(i=b(i);f<i.length;)t=i.charCodeAt(f++),r=i.charCodeAt(f++),n=i.charCodeAt(f++),l=t>>2,s=(t&3)<<4|r>>4,h=(r&15)<<2|n>>6,o=n&63,isNaN(r)?h=o=64:isNaN(n)&&(o=64),e=e+u.charAt(l)+u.charAt(s)+u.charAt(h)+u.charAt(o);return e},decode(i){let e="",t,r,n,l,s,h,o,f=0;for(i=i.replace(/[^A-Za-z0-9\+\/\=]/g,"");f<i.length;)l=u.indexOf(i.charAt(f++)),s=u.indexOf(i.charAt(f++)),h=u.indexOf(i.charAt(f++)),o=u.indexOf(i.charAt(f++)),t=l<<2|s>>4,r=(s&15)<<4|h>>2,n=(h&3)<<6|o,e=e+String.fromCharCode(t),h!==64&&(e=e+String.fromCharCode(r)),o!==64&&(e=e+String.fromCharCode(n));return e=g(e),e}},C={select(){return new Promise(i=>{let e=document.createElement("input");e.type="file",e.addEventListener("change",function(){let t=e.files;t===null?i():i(t[0])}),e.click()})},selectMore(){return new Promise(i=>{let e=document.createElement("input");e.type="file",e.multiple=!0,e.addEventListener("change",function(){let t=e.files;i(t)}),e.click()})}};class A{url;constructor(e){this.url=e}$send(e){return new Promise((t,r)=>{this._getHttp(e).send().then(n=>{let l;try{l=JSON.parse(n)}catch{l=n}t(l)}).catch(n=>{r(n)})})}$download(e){return new Promise((t,r)=>{this._getHttp(e).download().then(()=>{t()}).catch(n=>{r(n)})})}$asyncDownload(e){return new Promise((t,r)=>{this._getHttp(e).asyncDownload().then(()=>{t()}).catch(n=>{r(n)})})}_getHttp(e){e.url=e.url.startsWith("http")?e.url:this.url?`${this.url}${e.url?e.url.startsWith("/")?e.url:`/${e.url}`:""}`:e.url;let t=new y(e.url,e.type);if(e.header)for(let r in e.header)t.addHeader(r,e.header[r]);if(e.param)for(let r in e.param)t.addParam(r,e.param[r]);return t.setBody(e.body),t.contentType===null&&e.type!=="GET"&&a.isObject(e.body)&&t.setContentType("APPLICATION_JSON"),t}}const k={create(i){let e={loading:!1,display:!1,...i,async open(t){this.display=!0,this.loading=!0,i.openHandler&&await i.openHandler(t),this.loading=!1},close(){this.display=!1}};return i.close&&(e.close=i.close),e}},O={getScreenHeight(){return window.screen.height},getScreenWidth(){return window.screen.width}};class S{url="";websocket=null;onOpen=()=>{};onMessage=()=>{};onClose=()=>{};onError=()=>{};constructor(e){this.url=e}open(){this.websocket=new WebSocket(this.url),this.websocket.onopen=e=>{this.onOpen(e)},this.websocket.onmessage=e=>{this.onMessage(e)},this.websocket.onclose=e=>{this.onClose(e)},this.websocket.onerror=e=>{this.onError(e)}}send(e){this.websocket&&(e instanceof Blob||e instanceof ArrayBuffer||typeof e=="string"?this.websocket.send(e):this.websocket.send(JSON.stringify(e)))}close(){this.websocket&&(this.websocket.close(),this.websocket=null)}}c.Http=y,c.InfoException=m,c.Service=A,c.Websocket=S,c.base64=w,c.file=C,c.popup=k,c.variable=a,c.window=O,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});
