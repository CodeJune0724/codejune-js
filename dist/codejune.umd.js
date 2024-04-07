(function(c,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(c=typeof globalThis<"u"?globalThis:c||self,d(c.codejune={}))})(this,function(c){"use strict";class d extends Error{constructor(e){super(e)}}const a={isNull(t){return t==null},isEmpty(t){return this.isNull(t)?!0:this.isObject(t)?Object.keys(t).length===0:typeof t=="string"?t.trim()==="":typeof t=="number"?isNaN(t)||t===0:typeof t!="boolean"},isObject(t){return this.isNull(t)?!1:typeof t=="object"},clone(t){if(this.isNull(t))return t;if(Array.isArray(t)){let e=[];for(let i of t)e.push(this.clone(i));return e}else if(this.isObject(t)){let e={};for(let i in t){let r=t[i];r!==void 0&&(this.isObject(r)?e[i]=this.clone(r):e[i]=r)}return e}else return t},assignment(t,e,i){if(this.isNull(i)||i===!0)for(let r in t){let n=t[r],l=e[r];if(!(n===void 0||l===void 0)){if(n===null){t[r]=l;continue}if(this.isObject(n)){if(this.isObject(l)){if(Array.isArray(n)&&Array.isArray(l)){n=[];for(let o of l)n.push(o);t[r]=n;continue}!Array.isArray(n)&&!Array.isArray(l)&&this.assignment(n,l,!0)}}else(l===null||typeof n==typeof l)&&(t[r]=l)}}else for(let r in e){let n=e[r];n!==void 0&&(t[r]=n)}},toStr(t){return this.isNull(t)?`${t}`:this.isObject(t)?JSON.stringify(t):t.toString()},clean(t){if(Array.isArray(t))t.splice(0,t.length);else for(let e in t){let i=t[e];this.isNull(i)||typeof i=="function"||(this.isObject(i)&&!(i instanceof File)?this.clean(i):t[e]=null)}}};class m{url="";type="GET";param={};header={};contentType=null;body=null;constructor(e,i){this.url=e,this.type=i}addHeader(e,i){this.header[e]=i}addParam(e,i){this.param[e]=i}setContentType(e){this.contentType=e;let i="Content-type";switch(e){case"APPLICATION_JSON":this.header[i]="application/json";break;case"APPLICATION_XML":this.header[i]="application/xml";break;case"ROW":this.header[i]="text/plain";break;case null:delete this.header[i];break}}setBody(e){this.body=e}send(){return new Promise((e,i)=>{this._getFetch().then(r=>{let n=r.text();r.ok?e(n):i(n)}).catch(r=>{i(r)})})}download(){return new Promise((e,i)=>{try{window.open(this._getUrl()),e()}catch(r){i(r)}})}asyncDownload(){return new Promise((e,i)=>{this._getFetch().then(r=>{let n=r.headers.get("Content-Type");n&&n.indexOf("download")!==-1?r.blob().then(l=>{try{let o=document.createElement("a"),h=window.URL.createObjectURL(l),s=r.headers.get("Content-Disposition");s=s||"";let b=/filename=(.*?)$/g.exec(s);b!==null&&(s=b[1]),o.href=h,o.download=decodeURI(s),o.click(),window.URL.revokeObjectURL(h),e()}catch(o){i(o)}}):r.text().then(l=>{i(l)})})})}_getFetch(){if(a.isObject(this.body)){let e=i=>{if(a.isNull(i))return!1;if(i.constructor===File||i.constructor===FileList)return!0;for(let r in i){let n=this.body[r];if(e(n))return!0}return!1};e(this.body)&&(this.contentType="FORM_DATA")}if(this.contentType==="FORM_DATA"){delete this.header["Content-type"];let e=new FormData;if(a.isObject(this.body))for(let i in this.body){let r=this.body[i];if(r!==void 0)if(!a.isNull(r)&&(r.constructor===FileList||Array.isArray(r)))for(let n of r)e.append(i,n);else e.append(i,r)}this.body=e}else a.isObject(this.body)&&(this.body=JSON.stringify(this.body));return fetch(this._getUrl(),{cache:"no-cache",credentials:"same-origin",mode:"cors",redirect:"follow",referrer:"no-referrer",method:this.type,headers:this.header,body:this.type!=="GET"?this.body:void 0})}_getUrl(){let e=this.url;if(!a.isEmpty(this.param)){let i="?";for(let r in this.param){let n=this.param[r];n&&(i=i+r+"="+n+"&")}i!=="?"?i=i.substring(0,i.length-1):i="",e=e+i}return e}}let u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",w=function(t){let e="";t=t.replace(/\r\n/g,`
`);for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e+=String.fromCharCode(r):r>127&&r<2048?(e+=String.fromCharCode(r>>6|192),e+=String.fromCharCode(r&63|128)):(e+=String.fromCharCode(r>>12|224),e+=String.fromCharCode(r>>6&63|128),e+=String.fromCharCode(r&63|128))}return e},g=function(t){let e="",i=0,r,n,l=0;for(;i<t.length;)r=t.charCodeAt(i),r<128?(e+=String.fromCharCode(r),i++):r>191&&r<224?(n=t.charCodeAt(i+1),e+=String.fromCharCode((r&31)<<6|n&63),i+=2):(n=t.charCodeAt(i+1),l=t.charCodeAt(i+2),e+=String.fromCharCode((r&15)<<12|(n&63)<<6|l&63),i+=3);return e};const C={encode(t){let e="",i,r,n,l,o,h,s,f=0;for(t=w(t);f<t.length;)i=t.charCodeAt(f++),r=t.charCodeAt(f++),n=t.charCodeAt(f++),l=i>>2,o=(i&3)<<4|r>>4,h=(r&15)<<2|n>>6,s=n&63,isNaN(r)?h=s=64:isNaN(n)&&(s=64),e=e+u.charAt(l)+u.charAt(o)+u.charAt(h)+u.charAt(s);return e},decode(t){let e="",i,r,n,l,o,h,s,f=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");f<t.length;)l=u.indexOf(t.charAt(f++)),o=u.indexOf(t.charAt(f++)),h=u.indexOf(t.charAt(f++)),s=u.indexOf(t.charAt(f++)),i=l<<2|o>>4,r=(o&15)<<4|h>>2,n=(h&3)<<6|s,e=e+String.fromCharCode(i),h!==64&&(e=e+String.fromCharCode(r)),s!==64&&(e=e+String.fromCharCode(n));return e=g(e),e}},A={select(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.addEventListener("change",function(){let i=e.files;i===null?t():t(i[0])}),e.click()})},selectMore(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.multiple=!0,e.addEventListener("change",function(){let i=e.files;t(i)}),e.click()})},async slice(t,e,i){if(e<0)return;let r=0,n=t.size;for(;r<n;){let l=r+e>n?n-r:e,o=t.slice(r,r+l);r=r+l,await i({pointer:r,file:o})}}};let p=(t,e)=>{t.url=t.url.startsWith("http")?t.url:e.url?`${e.url}${t.url?t.url.startsWith("/")?t.url:`/${t.url}`:""}`:t.url;let i=new m(t.url,t.type);if(t.header)for(let r in t.header)i.addHeader(r,t.header[r]);if(t.param)for(let r in t.param)i.addParam(r,t.param[r]);return i.setBody(t.body),t.contentType&&i.setContentType(t.contentType),i.contentType===null&&t.type!=="GET"&&a.isObject(t.body)&&i.setContentType("APPLICATION_JSON"),i},y=t=>{let e;try{e=JSON.parse(t)}catch{e=t}return e};class k{url;constructor(e){this.url=e}$send(e){return new Promise((i,r)=>{p(e,this).send().then(n=>{i(y(n))}).catch(n=>{r(y(n))})})}$download(e){return new Promise((i,r)=>{p(e,this).download().then(()=>{i()}).catch(n=>{r(y(n))})})}$asyncDownload(e){return new Promise((i,r)=>{p(e,this).asyncDownload().then(()=>{i()}).catch(n=>{r(y(n))})})}}const O={getHeight(){return window.innerHeight},getWidth(){return window.innerWidth}};class N{url="";websocket=null;onOpen=()=>{};onMessage=()=>{};onClose=()=>{};onError=()=>{};constructor(e){this.url=e}open(){this.websocket=new WebSocket(this.url),this.websocket.onopen=e=>{this.onOpen(e)},this.websocket.onmessage=e=>{this.onMessage(e)},this.websocket.onclose=e=>{this.onClose(e)},this.websocket.onerror=e=>{this.onError(e)}}send(e){this.websocket&&(e instanceof Blob||e instanceof ArrayBuffer||typeof e=="string"?this.websocket.send(e):this.websocket.send(JSON.stringify(e)))}close(){this.websocket&&(this.websocket.close(),this.websocket=null)}}c.Http=m,c.InfoException=d,c.Service=k,c.Websocket=N,c.base64=C,c.file=A,c.variable=a,c.window=O,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});
