(function(c,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(c=typeof globalThis<"u"?globalThis:c||self,d(c.codejune={}))})(this,function(c){"use strict";const d="";class g extends Error{constructor(e){super(e)}}const f={isNull(t){return t==null},isEmpty(t){if(this.isNull(t))return!0;let e=this.getType(t);return e===String&&t===""||e===Array&&t.length===0?!0:e===Object&&Object.keys(t).length===0},getType(t){return this.isNull(t)?null:t.constructor},isObject(t){if(this.isNull(t))return!1;if(t instanceof Object){let e=this.getType(t);return e==null?!1:JSON.stringify(t)!==void 0||e.toString().indexOf("class")===0||e===Array?!0:e===Object}return!1},clone(t){if(this.isObject(t))if(this.getType(t)===Array){let e=[];for(let i of t)e.push(this.clone(i));return e}else{let e={};for(let i in t)e[i]=this.clone(t[i]);return e}else return this.isNull(t)?null:t},assignment(t,e,i){let r=this.getType(t),n=this.isEmpty(i)?!0:i===!0;if(!(!this.isObject(t)||!this.isObject(e)))if(r===Array){let l=!0;if(n&&this.getType(e)!==Array&&(l=!1),r!==this.getType(e)&&(l=!1),l){t.splice(0,t.length);for(let s of e)t.push(s)}}else if(n)for(let l in t){let s=t[l],o=e[l];if(s===void 0||o===void 0)continue;let h=!1;(s===null||o===null&&!this.isObject(s)||this.getType(s)===this.getType(o)||this.isObject(s)&&this.isObject(o))&&(h=!0),h&&(this.isObject(o)&&(o=this.clone(o)),this.isObject(s)&&this.isObject(o)?this.assignment(s,o,!0):t[l]=o)}else for(let l in e){let s=e[l];s!==void 0&&(this.isObject(s)&&(s=this.clone(s)),t[l]=s)}},toStr(t){return this.isNull(t)?null:this.isObject(t)?JSON.stringify(t):t.toString()},clean(t){if(t instanceof Array)t.splice(0);else if(this.isObject(t))for(let e in t){let i=t[e];this.isObject(i)?this.clean(i):t[e]=null}},addKey(t,e){if(!(!this.isObject(t)||!this.isObject(e)))for(let i in e){let r=e[i];this.isNull(t[i])&&(this.isObject(r)?this.getType(r)===Array?t[i]=[]:t[i]={}:t[i]=null),this.addKey(t[i],r)}},filterKey(t,e){for(let i in t)e.indexOf(i)===-1&&delete t[i]}};class y{url="";type="GET";param={};header={};contentType=null;body=null;constructor(e,i){this.url=e,this.type=i}addHeader(e,i){this.header[e]=i}addParam(e,i){this.param[e]=i}setContentType(e){this.contentType=e;let i="Content-type";switch(e){case"APPLICATION_JSON":this.header[i]="application/json";break;case"APPLICATION_XML":this.header[i]="application/xml";break;case"ROW":this.header[i]="text/plain";break;case null:delete this.header[i];break}}setBody(e){this.body=e}send(){return new Promise((e,i)=>{this._getFetch().then(r=>{let n=r.text();r.ok?e(n):i(n)}).catch(r=>{i(r)})})}download(){return new Promise((e,i)=>{try{window.open(this._getUrl()),e()}catch(r){i(r)}})}asyncDownload(){return new Promise((e,i)=>{this._getFetch().then(r=>{let n=r.headers.get("Content-Type");n&&n.indexOf("download")!==-1?r.blob().then(l=>{try{let s=document.createElement("a"),o=window.URL.createObjectURL(l),h=r.headers.get("Content-Disposition");h=h||"";let p=/filename=(.*?)$/g.exec(h);p!==null&&(h=p[1]),s.href=o,s.download=decodeURI(h),s.click(),window.URL.revokeObjectURL(o),e()}catch(s){i(s)}}):r.text().then(l=>{i(l)})})})}_getFetch(){let e=!1;if(f.isObject(this.body)){for(let i in this.body){let r=this.body[i],n=f.getType(r);if(n===File||n===FileList){e=!0;break}if(n===Array){for(let l of r)if(f.getType(l)===File||f.getType(l)===FileList){e=!0;break}}}e&&(this.contentType="FORM_DATA")}if(this.contentType==="FORM_DATA"){delete this.header["Content-type"];let i=new FormData;if(f.isObject(this.body))for(let r in this.body){let n=this.body[r];if(f.getType(n)===FileList)for(let l of n)i.append(r,l);else if(f.getType(n)===Array)for(let l of n)i.append(r,l);else i.append(r,n)}this.body=i}else f.isObject(this.body)&&(this.body=JSON.stringify(this.body));return fetch(this._getUrl(),{cache:"no-cache",credentials:"same-origin",mode:"cors",redirect:"follow",referrer:"no-referrer",method:this.type,headers:this.header,body:this.type!=="GET"?this.body:void 0})}_getUrl(){let e=this.url;if(!f.isEmpty(this.param)){let i="?";for(let r in this.param){let n=this.param[r];n&&(i=i+r+"="+n+"&")}i!=="?"?i=i.substring(0,i.length-1):i="",e=e+i}return e}}let u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m=function(t){let e="";t=t.replace(/\r\n/g,`
`);for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e+=String.fromCharCode(r):r>127&&r<2048?(e+=String.fromCharCode(r>>6|192),e+=String.fromCharCode(r&63|128)):(e+=String.fromCharCode(r>>12|224),e+=String.fromCharCode(r>>6&63|128),e+=String.fromCharCode(r&63|128))}return e},b=function(t){let e="",i=0,r,n,l=0;for(;i<t.length;)r=t.charCodeAt(i),r<128?(e+=String.fromCharCode(r),i++):r>191&&r<224?(n=t.charCodeAt(i+1),e+=String.fromCharCode((r&31)<<6|n&63),i+=2):(n=t.charCodeAt(i+1),l=t.charCodeAt(i+2),e+=String.fromCharCode((r&15)<<12|(n&63)<<6|l&63),i+=3);return e};const w={encode(t){let e="",i,r,n,l,s,o,h,a=0;for(t=m(t);a<t.length;)i=t.charCodeAt(a++),r=t.charCodeAt(a++),n=t.charCodeAt(a++),l=i>>2,s=(i&3)<<4|r>>4,o=(r&15)<<2|n>>6,h=n&63,isNaN(r)?o=h=64:isNaN(n)&&(h=64),e=e+u.charAt(l)+u.charAt(s)+u.charAt(o)+u.charAt(h);return e},decode(t){let e="",i,r,n,l,s,o,h,a=0;for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");a<t.length;)l=u.indexOf(t.charAt(a++)),s=u.indexOf(t.charAt(a++)),o=u.indexOf(t.charAt(a++)),h=u.indexOf(t.charAt(a++)),i=l<<2|s>>4,r=(s&15)<<4|o>>2,n=(o&3)<<6|h,e=e+String.fromCharCode(i),o!==64&&(e=e+String.fromCharCode(r)),h!==64&&(e=e+String.fromCharCode(n));return e=b(e),e}},O={select(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.addEventListener("change",function(){let i=e.files;i===null?t():t(i[0])}),e.click()})},selectMore(){return new Promise(t=>{let e=document.createElement("input");e.type="file",e.multiple=!0,e.addEventListener("change",function(){let i=e.files;t(i)}),e.click()})}};class C{url;constructor(e){this.url=e}$send(e){return new Promise((i,r)=>{this._getHttp(e).send().then(n=>{let l;try{l=JSON.parse(n)}catch{l=n}i(l)}).catch(n=>{r(n)})})}$download(e){return new Promise((i,r)=>{this._getHttp(e).download().then(()=>{i()}).catch(n=>{r(n)})})}$asyncDownload(e){return new Promise((i,r)=>{this._getHttp(e).asyncDownload().then(()=>{i()}).catch(n=>{r(n)})})}_getHttp(e){e.url=e.url.startsWith("http")?e.url:this.url?`${this.url}${e.url?e.url.startsWith("/")?e.url:`/${e.url}`:""}`:e.url;let i=new y(e.url,e.type);if(e.header)for(let r in e.header)i.addHeader(r,e.header[r]);if(e.param)for(let r in e.param)i.addParam(r,e.param[r]);return i.setBody(e.body),i.contentType===null&&e.type!=="GET"&&f.isObject(e.body)&&i.setContentType("APPLICATION_JSON"),i}}const k={create(t){let e={loading:!1,display:!1,...t,async open(i){this.display=!0,this.loading=!0,t.openHandler&&await t.openHandler(i),this.loading=!1},close(){this.display=!1}};return t.close&&(e.close=t.close),e}},A={getScreenHeight(){return window.screen.height}};class T{url="";websocket=null;onOpen=()=>{};onMessage=()=>{};onClose=()=>{};onError=()=>{};constructor(e){this.url=e}open(){this.websocket=new WebSocket(this.url),this.websocket.onopen=e=>{this.onOpen(e)},this.websocket.onmessage=e=>{this.onMessage(e)},this.websocket.onclose=e=>{this.onClose(e)},this.websocket.onerror=e=>{this.onError(e)}}send(e){this.websocket&&(e instanceof Blob||e instanceof ArrayBuffer||typeof e=="string"?this.websocket.send(e):this.websocket.send(JSON.stringify(e)))}close(){this.websocket&&(this.websocket.close(),this.websocket=null)}}c.Http=y,c.InfoException=g,c.Service=C,c.Websocket=T,c.base64=w,c.file=O,c.popup=k,c.variable=f,c.window=A,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
