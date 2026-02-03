var content=function(){"use strict";var pe=Object.defineProperty;var ue=(x,u,h)=>u in x?pe(x,u,{enumerable:!0,configurable:!0,writable:!0,value:h}):x[u]=h;var f=(x,u,h)=>ue(x,typeof u!="symbol"?u+"":u,h);var V,j;function x(n){return n}const u={matches:["<all_urls>"],runAt:"document_idle",main(){const n=document.createElement("agentping-overlay");n.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(n);const t=n.attachShadow({mode:"closed"}),a=document.createElement("agentping-drawer");a.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;",document.documentElement.appendChild(a);const r=a.attachShadow({mode:"closed"}),p=document.createElement("style");p.textContent=`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: radial-gradient(
          ellipse 80% 70% at 50% 50%,
          rgba(5, 5, 5, 0.85) 0%,
          rgba(5, 5, 5, 0.92) 50%,
          rgba(0, 0, 0, 0.98) 100%
        );
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        pointer-events: none;
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
      }

      .overlay.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .overlay.fade-out {
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .modal {
        background: #0a0a0a;
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 12px;
        box-shadow: 0 0 40px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.5);
        padding: 28px 32px;
        max-width: 420px;
        width: 90%;
        transform: scale(0.95) translateY(10px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .overlay.visible .modal {
        transform: scale(1) translateY(0);
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(0, 229, 255, 0.1);
      }

      .icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.05) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .title {
        color: #00e5ff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .field {
        margin-bottom: 14px;
      }

      .field-label {
        color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 6px;
      }

      .field-value {
        color: #fff;
        font-size: 14px;
        word-break: break-word;
      }

      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .scope-tag {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
        color: #00e5ff;
      }

      .reason {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        padding: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        line-height: 1.5;
        font-style: italic;
      }

      .buttons {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }

      .btn {
        flex: 1;
        padding: 14px 20px;
        border: none;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-grant {
        background: rgba(0, 255, 157, 0.1);
        border: 1px solid rgba(0, 255, 157, 0.3);
        color: #00ff9d;
        box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
      }

      .btn-grant:hover {
        background: rgba(0, 255, 157, 0.2);
        box-shadow: 0 0 30px rgba(0, 255, 157, 0.2);
      }

      .btn-grant:active {
        transform: scale(0.98);
      }

      .btn-deny {
        background: rgba(255, 42, 109, 0.1);
        border: 1px solid rgba(255, 42, 109, 0.3);
        color: #ff2a6d;
        box-shadow: 0 0 20px rgba(255, 42, 109, 0.1);
      }

      .btn-deny:hover {
        background: rgba(255, 42, 109, 0.2);
        box-shadow: 0 0 30px rgba(255, 42, 109, 0.2);
      }

      .btn-deny:active {
        transform: scale(0.98);
      }

      .hints {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 11px;
      }

      .hint {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .key {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 500;
      }
    `,t.appendChild(p);const o=document.createElement("div");o.className="overlay",o.innerHTML=`
      <div class="modal">
        <div class="header">
          <div class="icon">🤖</div>
          <div>
            <div class="title">Lease Request</div>
            <div class="subtitle">Agent Authorization</div>
          </div>
        </div>
        <div class="field">
          <div class="field-label">Agent</div>
          <div class="field-value agent-name">--</div>
        </div>
        <div class="field">
          <div class="field-label">Scopes</div>
          <div class="scopes scope-list"></div>
        </div>
        <div class="field">
          <div class="field-label">Duration</div>
          <div class="field-value duration">--</div>
        </div>
        <div class="field">
          <div class="field-label">Reason</div>
          <div class="reason reason-text">No reason provided</div>
        </div>
        <div class="buttons">
          <button class="btn btn-grant" data-action="grant">Grant</button>
          <button class="btn btn-deny" data-action="deny">Deny</button>
        </div>
        <div class="hints">
          <span class="hint"><span class="key">G</span> Grant</span>
          <span class="hint"><span class="key">D</span> Deny</span>
          <span class="hint"><span class="key">Esc</span> Dismiss</span>
        </div>
      </div>
    `,t.appendChild(o);const I=o.querySelector(".agent-name"),C=o.querySelector(".scope-list"),F=o.querySelector(".duration"),J=o.querySelector(".reason-text"),K=o.querySelector('[data-action="grant"]'),Q=o.querySelector('[data-action="deny"]');let g=null;function Z(){try{const e=new AudioContext,i=e.createOscillator(),d=e.createGain();i.connect(d),d.connect(e.destination),i.type="sine",i.frequency.setValueAtTime(880,e.currentTime),i.frequency.setValueAtTime(1174.66,e.currentTime+.1),d.gain.setValueAtTime(.15,e.currentTime),d.gain.exponentialRampToValueAtTime(.001,e.currentTime+.3),i.start(e.currentTime),i.stop(e.currentTime+.3)}catch(e){console.warn("[AgentPing] Could not play chime:",e)}}function U(e){const i=document.createElement("div");return i.textContent=e,i.innerHTML}function ee(e){Z(),g=e.requestId,I.textContent=e.agentName||"Unknown Agent";const i=e.scopes||[];C.innerHTML=i.length>0?i.map(v=>`<span class="scope-tag">${U(v)}</span>`).join(""):'<span class="scope-tag">default</span>';const d=e.ttl;typeof d=="number"?F.textContent=`${d} minute${d!==1?"s":""}`:typeof d=="string"?F.textContent=U(d):F.textContent="--",J.textContent=e.reason||"No reason provided",o.classList.remove("fade-out"),o.classList.add("visible")}function q(e=!1){e?(o.classList.add("fade-out"),setTimeout(()=>{o.classList.remove("visible","fade-out"),g=null},400)):(o.classList.remove("visible"),g=null)}function _(){g&&(chrome.runtime.sendMessage({type:"approveLease",requestId:g}),q(!0))}function G(){g&&(chrome.runtime.sendMessage({type:"denyLease",requestId:g}),q(!1))}K.addEventListener("click",_),Q.addEventListener("click",G),document.addEventListener("keydown",e=>{o.classList.contains("visible")&&(e.key.toLowerCase()==="g"?(e.preventDefault(),_()):e.key.toLowerCase()==="d"?(e.preventDefault(),G()):e.key==="Escape"&&(e.preventDefault(),q(!1)))});const O=document.createElement("style");O.textContent=`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        pointer-events: none;
      }

      .drawer-backdrop.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .drawer {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: #0a0a0a;
        border-left: 1px solid rgba(0, 229, 255, 0.15);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .drawer-backdrop.visible .drawer {
        transform: translateX(0);
      }

      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 229, 255, 0.1);
      }

      .drawer-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 700;
        color: #fafafa;
      }

      .drawer-icon {
        color: #00e5ff;
        font-size: 16px;
      }

      .close-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.5);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .status-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(0, 229, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 12px;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-dot.gray { background: #555; }
      .status-dot.amber { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
      .status-dot.green { background: #00ff9d; box-shadow: 0 0 8px rgba(0, 255, 157, 0.5); }
      .status-dot.cyan { background: #00e5ff; box-shadow: 0 0 8px rgba(0, 229, 255, 0.5); }

      .status-text {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }

      .drawer-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }

      .section {
        margin-bottom: 24px;
      }

      .section-header {
        color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 12px;
      }

      .lease-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(0, 255, 157, 0.2);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
      }

      .request-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
      }

      .card-field {
        margin-bottom: 8px;
      }

      .card-label {
        font-size: 9px;
        font-weight: 600;
        color: #555;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .card-value {
        font-size: 12px;
        color: #e0e0e0;
      }

      .card-value.agent {
        color: #fafafa;
        font-weight: 600;
      }

      .card-value.countdown {
        font-size: 18px;
        font-weight: 700;
        color: #00ff9d;
        text-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
      }

      .card-value.countdown.warning {
        color: #ff2a6d;
      }

      .scope-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .scope-tag {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 11px;
        color: #00e5ff;
      }

      .card-buttons {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .card-btn {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .card-btn.grant {
        background: rgba(0, 255, 157, 0.15);
        color: #00ff9d;
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .card-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .card-btn.deny {
        background: rgba(255, 42, 109, 0.15);
        color: #ff2a6d;
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .card-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .card-btn.revoke {
        background: rgba(255, 255, 255, 0.05);
        color: #71717a;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .card-btn.revoke:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #e0e0e0;
      }

      .empty-state {
        text-align: center;
        color: #555;
        padding: 24px 0;
        font-size: 11px;
      }

      .empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.3;
      }

      .drawer-footer {
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #00e5ff;
        text-decoration: none;
        font-size: 12px;
        margin-bottom: 8px;
        transition: color 0.2s ease;
      }

      .footer-link:hover {
        color: #00ff9d;
      }

      .version {
        color: #555;
        font-size: 10px;
        text-align: center;
      }
    `,r.appendChild(O);const l=document.createElement("div");l.className="drawer-backdrop",l.innerHTML=`
      <div class="drawer">
        <div class="drawer-header">
          <div class="drawer-title">
            <span class="drawer-icon">⚡</span>
            <span>AgentPing</span>
          </div>
          <button class="close-btn" data-action="close">×</button>
        </div>
        <div class="status-bar">
          <div class="status-dot gray" data-status-dot></div>
          <div class="status-text" data-status-text>Checking...</div>
        </div>
        <div class="drawer-content">
          <div class="section">
            <div class="section-header">Active Leases</div>
            <div data-leases-container></div>
          </div>
          <div class="section">
            <div class="section-header">Pending Requests</div>
            <div data-requests-container></div>
          </div>
        </div>
        <div class="drawer-footer">
          <a href="http://localhost:7890" target="_blank" class="footer-link">
            🔗 Dashboard
          </a>
          <div class="version">v0.1.0</div>
        </div>
      </div>
    `,r.appendChild(l);const te=l.querySelector(".drawer"),ae=l.querySelector('[data-action="close"]'),ne=l.querySelector("[data-status-dot]"),se=l.querySelector("[data-status-text]"),M=l.querySelector("[data-leases-container]"),A=l.querySelector("[data-requests-container]");te.addEventListener("click",e=>{e.stopPropagation()}),l.addEventListener("click",()=>{H()}),ae.addEventListener("click",()=>{H()});let z=!1,w=new Map,k=null;function re(){z=!0,l.classList.add("visible"),b(),k||(k=setInterval(b,2e3))}function H(){z=!1,l.classList.remove("visible"),w.forEach(e=>clearInterval(e)),w.clear(),k&&(clearInterval(k),k=null)}function oe(){z?H():re()}function ie(e){if(e<=0)return"00:00";const i=Math.floor(e/1e3),d=Math.floor(i/60),v=i%60;return`${String(d).padStart(2,"0")}:${String(v).padStart(2,"0")}`}function $(e){const i=document.createElement("div");return i.textContent=e,i.innerHTML}async function b(){chrome.runtime.sendMessage({type:"getDrawerState"},e=>{if(!e)return;const{connectionState:i,activeLeases:d,pendingLeases:v}=e,de={disconnected:"gray",connecting:"amber",connected:"green",leased:"cyan"},ce={disconnected:"Not connected",connecting:"Connecting...",connected:"Connected",leased:"Active lease"};ne.className=`status-dot ${de[i]||"gray"}`,se.textContent=ce[i]||i,d&&d.length>0?(M.innerHTML=d.map(s=>{const c=(s.scopes||[]).map(m=>`<span class="scope-tag">${$(m)}</span>`).join("");return`
              <div class="lease-card" data-lease-token="${s.token}">
                <div class="card-field">
                  <div class="card-label">Scopes</div>
                  <div class="scope-tags">${c||'<span class="scope-tag">default</span>'}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Remaining</div>
                  <div class="card-value countdown" data-countdown="${s.token}">--</div>
                </div>
                <div class="card-buttons">
                  <button class="card-btn revoke" data-action="revoke" data-token="${s.token}">Revoke</button>
                </div>
              </div>
            `}).join(""),d.forEach(s=>{const c=M.querySelector(`[data-countdown="${s.token}"]`);if(c&&s.expiresAt){const m=()=>{const P=Math.max(0,s.expiresAt-Date.now());if(c.textContent=ie(P),c.className=P<6e4?"card-value countdown warning":"card-value countdown",P<=0){const Y=w.get(s.token);Y&&(clearInterval(Y),w.delete(s.token)),b()}};m();const le=setInterval(m,1e3);w.set(s.token,le)}}),M.querySelectorAll('[data-action="revoke"]').forEach(s=>{s.addEventListener("click",()=>{const c=s.dataset.token;c&&(chrome.runtime.sendMessage({type:"revokeLease",token:c}),b())})})):M.innerHTML='<div class="empty-state"><div class="empty-icon">💤</div>No active leases</div>',v&&v.length>0?(A.innerHTML=v.map(s=>{const c=(s.scopes||[]).map(m=>`<span class="scope-tag">${$(m)}</span>`).join("");return`
              <div class="request-card" data-request-id="${s.requestId}">
                <div class="card-field">
                  <div class="card-label">Agent</div>
                  <div class="card-value agent">${$(s.agentName||"Unknown Agent")}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Scopes</div>
                  <div class="scope-tags">${c||'<span class="scope-tag">default</span>'}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Duration</div>
                  <div class="card-value">${$(String(s.ttl||"--"))}</div>
                </div>
                <div class="card-buttons">
                  <button class="card-btn grant" data-action="grant" data-request="${s.requestId}">Grant</button>
                  <button class="card-btn deny" data-action="deny" data-request="${s.requestId}">Deny</button>
                </div>
              </div>
            `}).join(""),A.querySelectorAll('[data-action="grant"]').forEach(s=>{s.addEventListener("click",()=>{const c=s.dataset.request;c&&(chrome.runtime.sendMessage({type:"approveLease",requestId:c}),b())})}),A.querySelectorAll('[data-action="deny"]').forEach(s=>{s.addEventListener("click",()=>{const c=s.dataset.request;c&&(chrome.runtime.sendMessage({type:"denyLease",requestId:c}),b())})})):A.innerHTML='<div class="empty-state"><div class="empty-icon">✓</div>None pending</div>'})}chrome.storage.onChanged.addListener(e=>{z&&(e.activeLeases||e.pendingLeases)&&b()}),chrome.runtime.onMessage.addListener(e=>{e.type==="showLeaseOverlay"&&e.lease?ee(e.lease):e.type==="hideLeaseOverlay"?q(!1):e.type==="toggleDrawer"&&oe()})}},S=(j=(V=globalThis.browser)==null?void 0:V.runtime)!=null&&j.id?globalThis.browser:globalThis.chrome;function E(n,...t){}const B={debug:(...n)=>E(console.debug,...n),log:(...n)=>E(console.log,...n),warn:(...n)=>E(console.warn,...n),error:(...n)=>E(console.error,...n)},T=class T extends Event{constructor(t,a){super(T.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=a}};f(T,"EVENT_NAME",D("wxt:locationchange"));let N=T;function D(n){var t;return`${(t=S==null?void 0:S.runtime)==null?void 0:t.id}:content:${n}`}function W(n){let t,a;return{run(){t==null&&(a=new URL(location.href),t=n.setInterval(()=>{let r=new URL(location.href);r.href!==a.href&&(window.dispatchEvent(new N(r,a)),a=r)},1e3))}}}const y=class y{constructor(t,a){f(this,"isTopFrame",window.self===window.top);f(this,"abortController");f(this,"locationWatcher",W(this));f(this,"receivedMessageIds",new Set);this.contentScriptName=t,this.options=a,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return S.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,a){const r=setInterval(()=>{this.isValid&&t()},a);return this.onInvalidated(()=>clearInterval(r)),r}setTimeout(t,a){const r=setTimeout(()=>{this.isValid&&t()},a);return this.onInvalidated(()=>clearTimeout(r)),r}requestAnimationFrame(t){const a=requestAnimationFrame((...r)=>{this.isValid&&t(...r)});return this.onInvalidated(()=>cancelAnimationFrame(a)),a}requestIdleCallback(t,a){const r=requestIdleCallback((...p)=>{this.signal.aborted||t(...p)},a);return this.onInvalidated(()=>cancelIdleCallback(r)),r}addEventListener(t,a,r,p){var o;a==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(o=t.addEventListener)==null||o.call(t,a.startsWith("wxt:")?D(a):a,r,{...p,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),B.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:y.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){var o,I,C;const a=((o=t.data)==null?void 0:o.type)===y.SCRIPT_STARTED_MESSAGE_TYPE,r=((I=t.data)==null?void 0:I.contentScriptName)===this.contentScriptName,p=!this.receivedMessageIds.has((C=t.data)==null?void 0:C.messageId);return a&&r&&p}listenForNewerScripts(t){let a=!0;const r=p=>{if(this.verifyScriptStartedEvent(p)){this.receivedMessageIds.add(p.data.messageId);const o=a;if(a=!1,o&&(t!=null&&t.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",r),this.onInvalidated(()=>removeEventListener("message",r))}};f(y,"SCRIPT_STARTED_MESSAGE_TYPE",D("wxt:content-script-started"));let R=y;function ge(){}function L(n,...t){}const X={debug:(...n)=>L(console.debug,...n),log:(...n)=>L(console.log,...n),warn:(...n)=>L(console.warn,...n),error:(...n)=>L(console.error,...n)};return(async()=>{try{const{main:n,...t}=u,a=new R("content",t);return await n(a)}catch(n){throw X.error('The content script "content" crashed on startup!',n),n}})()}();
content;