(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const G=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),C=__DEFINES__;Object.keys(C).forEach(e=>{const t=e.split(".");let n=G;for(let o=0;o<t.length;o++){const r=t[o];o===t.length-1?n[r]=C[e]:n=n[r]||(n[r]={})}});function b(e){"@babel/helpers - typeof";return b=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},b(e)}function Y(e,t){if(b(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var o=n.call(e,t);if(b(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Z(e){var t=Y(e,"string");return b(t)=="symbol"?t:t+""}function p(e,t,n){return(t=Z(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var ee=class{constructor(e,t,n){this.logger=e,this.transport=t,this.importUpdatedModule=n,p(this,"hotModulesMap",new Map),p(this,"disposeMap",new Map),p(this,"pruneMap",new Map),p(this,"dataMap",new Map),p(this,"customListenersMap",new Map),p(this,"ctxToListenersMap",new Map),p(this,"currentFirstInvalidatedBy",void 0),p(this,"updateQueue",[]),p(this,"pendingUpdateQueue",!1)}async notifyListeners(e,t){const n=this.customListenersMap.get(e);n&&await Promise.allSettled(n.map(o=>o(t)))}send(e){this.transport.send(e).catch(t=>{this.logger.error(t)})}clear(){this.hotModulesMap.clear(),this.disposeMap.clear(),this.pruneMap.clear(),this.dataMap.clear(),this.customListenersMap.clear(),this.ctxToListenersMap.clear()}async prunePaths(e){await Promise.all(e.map(t=>{const n=this.disposeMap.get(t);if(n)return n(this.dataMap.get(t))})),await Promise.all(e.map(t=>{const n=this.pruneMap.get(t);if(n)return n(this.dataMap.get(t))}))}warnFailedUpdate(e,t){(!(e instanceof Error)||!e.message.includes("fetch"))&&this.logger.error(e),this.logger.error(`Failed to reload ${t}. This could be due to syntax errors or importing non-existent modules. (see errors above)`)}async queueUpdate(e){if(this.updateQueue.push(this.fetchUpdate(e)),!this.pendingUpdateQueue){this.pendingUpdateQueue=!0,await Promise.resolve(),this.pendingUpdateQueue=!1;const t=[...this.updateQueue];this.updateQueue=[],(await Promise.all(t)).forEach(n=>n&&n())}}async fetchUpdate(e){const{path:t,acceptedPath:n,firstInvalidatedBy:o}=e,r=this.hotModulesMap.get(t);if(!r)return;let i;const s=t===n,a=r.callbacks.filter(({deps:c})=>c.includes(n));if(s||a.length>0){const c=this.disposeMap.get(n);c&&await c(this.dataMap.get(n));try{i=await this.importUpdatedModule(e)}catch(l){this.warnFailedUpdate(l,n)}}return()=>{try{this.currentFirstInvalidatedBy=o;for(const{deps:l,fn:u}of a)u(l.map(h=>h===n?i:void 0));const c=s?t:`${n} via ${t}`;this.logger.debug(`hot updated: ${c}`)}finally{this.currentFirstInvalidatedBy=void 0}}}};let te="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",ne=(e=21)=>{let t="",n=e|0;for(;n--;)t+=te[Math.random()*64|0];return t};typeof process<"u"&&process.platform;function re(){let e,t;return{promise:new Promise((n,o)=>{e=n,t=o}),resolve:e,reject:t}}function I(e){const t=new Error(e.message||"Unknown invoke error");return Object.assign(t,e,{runnerError:new Error("RunnerError")}),t}const oe=e=>{if(e.invoke)return{...e,async invoke(n,o){const r=await e.invoke({type:"custom",event:"vite:invoke",data:{id:"send",name:n,data:o}});if("error"in r)throw I(r.error);return r.result}};if(!e.send||!e.connect)throw new Error("transport must implement send and connect when invoke is not implemented");const t=new Map;return{...e,connect({onMessage:n,onDisconnection:o}){return e.connect({onMessage(r){if(r.type==="custom"&&r.event==="vite:invoke"){const i=r.data;if(i.id.startsWith("response:")){const s=i.id.slice(9),a=t.get(s);if(!a)return;a.timeoutId&&clearTimeout(a.timeoutId),t.delete(s);const{error:c,result:l}=i.data;c?a.reject(c):a.resolve(l);return}}n(r)},onDisconnection:o})},disconnect(){return t.forEach(n=>{n.reject(new Error(`transport was disconnected, cannot call ${JSON.stringify(n.name)}`))}),t.clear(),e.disconnect?.()},send(n){return e.send(n)},async invoke(n,o){const r=ne(),i={type:"custom",event:"vite:invoke",data:{name:n,id:`send:${r}`,data:o}},s=e.send(i),{promise:a,resolve:c,reject:l}=re(),u=e.timeout??6e4;let h;u>0&&(h=setTimeout(()=>{t.delete(r),l(new Error(`transport invoke timed out after ${u}ms (data: ${JSON.stringify(i)})`))},u),h?.unref?.()),t.set(r,{resolve:c,reject:l,name:n,timeoutId:h}),s&&s.catch(v=>{clearTimeout(h),t.delete(r),l(v)});try{return await a}catch(v){throw I(v)}}}},ie=e=>{const t=oe(e);let n=!t.connect,o;return{...e,...t.connect?{async connect(r){if(n)return;if(o){await o;return}const i=t.connect({onMessage:r??(()=>{}),onDisconnection(){n=!1}});i&&(o=i,await o,o=void 0),n=!0}}:{},...t.disconnect?{async disconnect(){n&&(o&&await o,n=!1,await t.disconnect())}}:{},async send(r){if(t.send){if(!n)if(o)await o;else throw new Error("send was called before connect");await t.send(r)}},async invoke(r,i){if(!n)if(o)await o;else throw new Error("invoke was called before connect");return t.invoke(r,i)}}},U=e=>{const t=e.pingInterval??3e4;let n,o;return{async connect({onMessage:r,onDisconnection:i}){const s=e.createConnection();s.addEventListener("message",async({data:c})=>{r(JSON.parse(c))});let a=s.readyState===s.OPEN;a||await new Promise((c,l)=>{s.addEventListener("open",()=>{a=!0,c()},{once:!0}),s.addEventListener("close",async()=>{if(!a){l(new Error("WebSocket closed without opened."));return}r({type:"custom",event:"vite:ws:disconnect",data:{webSocket:s}}),i()})}),r({type:"custom",event:"vite:ws:connect",data:{webSocket:s}}),n=s,o=setInterval(()=>{s.readyState===s.OPEN&&s.send(JSON.stringify({type:"ping"}))},t)},disconnect(){clearInterval(o),n?.close()},send(r){n.send(JSON.stringify(r))}}};function se(e){const t=new ae;return n=>t.enqueue(()=>e(n))}var ae=class{constructor(){p(this,"queue",[]),p(this,"pending",!1)}enqueue(e){return new Promise((t,n)=>{this.queue.push({promise:e,resolve:t,reject:n}),this.dequeue()})}dequeue(){if(this.pending)return!1;const e=this.queue.shift();return e?(this.pending=!0,e.promise().then(e.resolve).catch(e.reject).finally(()=>{this.pending=!1,this.dequeue()}),!0):!1}};const ce=__HMR_CONFIG_NAME__,le=__BASE__||"/",de="document"in globalThis?document.querySelector("meta[property=csp-nonce]")?.nonce:void 0;function d(e,t={},...n){const o=document.createElement(e);for(const[r,i]of Object.entries(t))i!==void 0&&o.setAttribute(r,i);return o.append(...n),o}const ue=`
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`,pe=()=>d("div",{class:"backdrop",part:"backdrop"},d("div",{class:"window",part:"window"},d("pre",{class:"message",part:"message"},d("span",{class:"plugin",part:"plugin"}),d("span",{class:"message-body",part:"message-body"})),d("pre",{class:"file",part:"file"}),d("pre",{class:"frame",part:"frame"}),d("pre",{class:"stack",part:"stack"}),d("div",{class:"tip",part:"tip"},"Click outside, press ",d("kbd",{},"Esc")," key, or fix the code to dismiss.",d("br"),"You can also disable this overlay by setting ",d("code",{part:"config-option-name"},"server.hmr.overlay")," to ",d("code",{part:"config-option-value"},"false")," in ",d("code",{part:"config-file-name"},ce),".")),d("style",{nonce:de},ue)),$=/(?:file:\/\/)?(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g,L=/^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm,{HTMLElement:fe=class{}}=globalThis;var he=class extends fe{constructor(e,t=!0){super(),p(this,"root",void 0),p(this,"closeOnEsc",void 0),this.root=this.attachShadow({mode:"open"}),this.root.appendChild(pe()),L.lastIndex=0;const n=e.frame&&L.test(e.frame),o=n?e.message.replace(L,""):e.message;e.plugin&&this.text(".plugin",`[plugin:${e.plugin}] `),this.text(".message-body",o.trim());const[r]=(e.loc?.file||e.id||"unknown file").split("?");e.loc?this.text(".file",`${r}:${e.loc.line}:${e.loc.column}`,t):e.id&&this.text(".file",r),n&&this.text(".frame",e.frame.trim()),this.text(".stack",e.stack,t),this.root.querySelector(".window").addEventListener("click",i=>{i.stopPropagation()}),this.addEventListener("click",()=>{this.close()}),this.closeOnEsc=i=>{(i.key==="Escape"||i.code==="Escape")&&this.close()},document.addEventListener("keydown",this.closeOnEsc)}text(e,t,n=!1){const o=this.root.querySelector(e);if(!n)o.textContent=t;else{let r=0,i;for($.lastIndex=0;i=$.exec(t);){const{0:s,index:a}=i,c=t.slice(r,a);o.appendChild(document.createTextNode(c));const l=document.createElement("a");l.textContent=s,l.className="file-link",l.onclick=()=>{fetch(new URL(`${le}__open-in-editor?file=${encodeURIComponent(s)}`,import.meta.url))},o.appendChild(l),r+=c.length+s.length}r<t.length&&o.appendChild(document.createTextNode(t.slice(r)))}}close(){this.parentNode?.removeChild(this),document.removeEventListener("keydown",this.closeOnEsc)}};const y="vite-error-overlay",{customElements:x}=globalThis;x&&!x.get(y)&&x.define(y,he);console.debug("[vite] connecting...");const P=new URL(import.meta.url),me=__SERVER_HOST__,q=__HMR_PROTOCOL__||(P.protocol==="https:"?"wss":"ws"),Q=__HMR_PORT__,N=`${__HMR_HOSTNAME__||P.hostname}:${Q||P.port}${__HMR_BASE__}`,A=__HMR_DIRECT_TARGET__,T=__BASE__||"/",H=__HMR_TIMEOUT__,W=__WS_TOKEN__,D=ie((()=>{let e=U({createConnection:()=>new WebSocket(`${q}://${N}?token=${W}`,"vite-hmr"),pingInterval:H});return{async connect(t){try{await e.connect(t)}catch(n){if(!Q){e=U({createConnection:()=>new WebSocket(`${q}://${A}?token=${W}`,"vite-hmr"),pingInterval:H});try{await e.connect(t),console.info("[vite] Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.")}catch(o){if(o instanceof Error&&o.message.includes("WebSocket closed without opened.")){const r=new URL(import.meta.url),i=r.host+r.pathname.replace(/@vite\/client$/,"");console.error(`[vite] failed to connect to websocket.
your current setup:
  (browser) ${i} <--[HTTP]--> ${me} (server)
  (browser) ${N} <--[WebSocket (failing)]--> ${A} (server)
Check out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr .`)}}return}throw console.error(`[vite] failed to connect to websocket (${n}). `),n}},async disconnect(){await e.disconnect()},send(t){e.send(t)}}})());let J=!1;typeof window<"u"&&window.addEventListener?.("beforeunload",()=>{J=!0});function F(e){const t=new URL(e,"http://vite.dev");return t.searchParams.delete("direct"),t.pathname+t.search}let j=!0;const B=new WeakSet,ve=e=>{let t;return()=>{t&&(clearTimeout(t),t=null),t=setTimeout(()=>{location.reload()},e)}},O=ve(20),m=new ee({error:e=>console.error("[vite]",e),debug:(...e)=>console.debug("[vite]",...e)},D,async function({acceptedPath:t,timestamp:n,explicitImportRequired:o,isWithinCircularImport:r}){const[i,s]=t.split("?"),a=import(T+i.slice(1)+`?${o?"import&":""}t=${n}${s?`&${s}`:""}`);return r&&a.catch(()=>{console.info(`[hmr] ${t} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`),O()}),await a});D.connect(se(ge));async function ge(e){switch(e.type){case"connected":console.debug("[vite] connected.");break;case"update":if(await m.notifyListeners("vite:beforeUpdate",e),_)if(j&&be()){location.reload();return}else z&&V(),j=!1;await Promise.all(e.updates.map(async t=>{if(t.type==="js-update")return m.queueUpdate(t);const{path:n,timestamp:o}=t,r=F(n),i=Array.from(document.querySelectorAll("link")).find(a=>!B.has(a)&&F(a.href).includes(r));if(!i)return;const s=`${T}${r.slice(1)}${r.includes("?")?"&":"?"}t=${o}`;return new Promise(a=>{const c=i.cloneNode();c.href=new URL(s,i.href).href;const l=()=>{i.remove(),console.debug(`[vite] css hot updated: ${r}`),a()};c.addEventListener("load",l),c.addEventListener("error",l),B.add(i),i.after(c)})})),await m.notifyListeners("vite:afterUpdate",e);break;case"custom":if(await m.notifyListeners(e.event,e.data),e.event==="vite:ws:disconnect"&&_&&!J){console.log("[vite] server connection lost. Polling for restart...");const t=e.data.webSocket,n=new URL(t.url);n.search="",await ye(n.href),location.reload()}break;case"full-reload":if(await m.notifyListeners("vite:beforeFullReload",e),_)if(e.path&&e.path.endsWith(".html")){const t=decodeURI(location.pathname),n=T+e.path.slice(1);(t===n||e.path==="/index.html"||t.endsWith("/")&&t+"index.html"===n)&&O();return}else O();break;case"prune":await m.notifyListeners("vite:beforePrune",e),await m.prunePaths(e.paths);break;case"error":if(await m.notifyListeners("vite:error",e),_){const t=e.err;z?we(t):console.error(`[vite] Internal Server Error
${t.message}
${t.stack}`)}break;case"ping":break;default:return e}}const z=__HMR_ENABLE_OVERLAY__,_="document"in globalThis;function we(e){V();const{customElements:t}=globalThis;if(t){const n=t.get(y);document.body.appendChild(new n(e))}}function V(){document.querySelectorAll(y).forEach(e=>e.close())}function be(){return document.querySelectorAll(y).length}function ye(e){if(typeof SharedWorker>"u"){const r={currentState:document.visibilityState,listeners:new Set},i=()=>{r.currentState=document.visibilityState;for(const s of r.listeners)s(r.currentState)};return document.addEventListener("visibilitychange",i),R(e,r)}const t=new Blob(['"use strict";',`const waitForSuccessfulPingInternal = ${R.toString()};`,`const fn = ${ke.toString()};`,`fn(${JSON.stringify(e)})`],{type:"application/javascript"}),n=URL.createObjectURL(t),o=new SharedWorker(n);return new Promise((r,i)=>{const s=()=>{o.port.postMessage({visibility:document.visibilityState})};document.addEventListener("visibilitychange",s),o.port.addEventListener("message",a=>{document.removeEventListener("visibilitychange",s),o.port.close();const c=a.data;if(c.type==="error"){i(c.error);return}r()}),s(),o.port.start()})}function ke(e){self.addEventListener("connect",t=>{const n=t.ports[0];if(!e){n.postMessage({type:"error",error:new Error("socketUrl not found")});return}const o={currentState:"visible",listeners:new Set};n.addEventListener("message",r=>{const{visibility:i}=r.data;o.currentState=i,console.debug("[vite] new window visibility",i);for(const s of o.listeners)s(i)}),n.start(),console.debug("[vite] connected from window"),R(e,o).then(()=>{console.debug("[vite] ping successful");try{n.postMessage({type:"success"})}catch(r){n.postMessage({type:"error",error:r})}},r=>{console.debug("[vite] error happened",r);try{n.postMessage({type:"error",error:r})}catch(i){n.postMessage({type:"error",error:i})}})})}async function R(e,t,n=1e3){function o(s){return new Promise(a=>setTimeout(a,s))}async function r(){try{const s=new WebSocket(e,"vite-ping");return new Promise(a=>{function c(){a(!0),u()}function l(){a(!1),u()}function u(){s.removeEventListener("open",c),s.removeEventListener("error",l),s.close()}s.addEventListener("open",c),s.addEventListener("error",l)})}catch{return!1}}function i(s){return new Promise(a=>{const c=l=>{l==="visible"&&(a(),s.listeners.delete(c))};s.listeners.add(c)})}if(!await r())for(await o(n);;)if(t.currentState==="visible"){if(await r())break;await o(n)}else await i(t)}const Ee=new Map,_e=new Map;"document"in globalThis&&(document.querySelectorAll("style[data-vite-dev-id]").forEach(e=>{Ee.set(e.getAttribute("data-vite-dev-id"),e)}),document.querySelectorAll('link[rel="stylesheet"][data-vite-dev-id]').forEach(e=>{_e.set(e.getAttribute("data-vite-dev-id"),e)}));(function(){document.querySelectorAll(".platform-carousel").forEach(e);function e(t){const n=t.querySelector(".platform-carousel__track"),o=Array.from(t.querySelectorAll(".platform-carousel__slide")),r=t.querySelector(".platform-carousel__nav--prev"),i=t.querySelector(".platform-carousel__nav--next"),s=t.querySelector(".platform-carousel__tabs");if(!n||o.length===0)return;let a=0,c=0,l=0,u=!1;function h(){s.innerHTML="",o.forEach((f,w)=>{const M=f.querySelector(".platform-carousel__slide-title").textContent,E=document.createElement("button");E.className=w===0?"platform-carousel__tab platform-carousel__tab--active":"platform-carousel__tab",E.dataset.slide=w,E.textContent=M,s.appendChild(E)})}const v=()=>t.getBoundingClientRect().width,k=()=>{a=Math.max(0,Math.min(a,o.length-1))},X=()=>{t.querySelectorAll(".platform-carousel__tab").forEach((w,M)=>{M===a?w.classList.add("platform-carousel__tab--active"):w.classList.remove("platform-carousel__tab--active")})},K=()=>{r.disabled=a===0,i.disabled=a===o.length-1,r.style.opacity=a===0?"0.4":"1",i.style.opacity=a===o.length-1?"0.4":"1",r.style.cursor=a===0?"not-allowed":"pointer",i.style.cursor=a===o.length-1?"not-allowed":"pointer"},g=(f=!0)=>{n.style.transition=f?"transform 0.35s ease":"none",n.style.transform=`translate3d(${-a*v()}px, 0, 0)`,X(),K()};i?.addEventListener("click",()=>{i.disabled||(a++,k(),g())}),r?.addEventListener("click",()=>{r.disabled||(a--,k(),g())}),s.addEventListener("click",f=>{f.target.matches(".platform-carousel__tab")&&(a=parseInt(f.target.dataset.slide),k(),g())}),n.addEventListener("pointerdown",f=>{u=!0,c=f.clientX,l=0,n.style.transition="none",n.setPointerCapture(f.pointerId)}),n.addEventListener("pointermove",f=>{u&&(l=f.clientX-c,n.style.transform=`translate3d(${l-a*v()}px, 0, 0)`)});const S=()=>{u&&(u=!1,n.style.transition="transform 0.35s ease",Math.abs(l)>v()/3&&(a+=l<0?1:-1),k(),l=0,g())};n.addEventListener("pointerup",S),n.addEventListener("pointercancel",S),n.addEventListener("pointerleave",S),window.addEventListener("resize",()=>{g(!1)}),h(),g(!1)}})();
