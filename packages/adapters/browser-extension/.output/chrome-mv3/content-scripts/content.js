var content=function(){"use strict";var oe=Object.defineProperty;var de=(y,b,x)=>b in y?oe(y,b,{enumerable:!0,configurable:!0,writable:!0,value:x}):y[b]=x;var n=(y,b,x)=>de(y,typeof b!="symbol"?b+"":b,x);var K,U;function y(s){return s}class b{constructor(t){n(this,"container");n(this,"previouslyFocused",null);n(this,"isActive",!1);n(this,"boundHandleKeyDown");this.container=t,this.boundHandleKeyDown=this.handleKeyDown.bind(this)}getFocusableElements(){const t=["button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])","a[href]",'[tabindex]:not([tabindex="-1"])'].join(", ");return Array.from(this.container.querySelectorAll(t))}handleKeyDown(t){if(t.key!=="Tab")return;const e=this.getFocusableElements();if(e.length===0)return;const a=e[0],r=e[e.length-1],l=this.container.getRootNode()instanceof ShadowRoot?this.container.getRootNode().activeElement:document.activeElement;t.shiftKey?l===a&&(t.preventDefault(),r.focus()):l===r&&(t.preventDefault(),a.focus())}activate(){if(this.isActive)return;this.previouslyFocused=document.activeElement,this.container.addEventListener("keydown",this.boundHandleKeyDown);const t=this.getFocusableElements();t.length>0&&t[0].focus(),this.isActive=!0}deactivate(){this.isActive&&(this.container.removeEventListener("keydown",this.boundHandleKeyDown),this.previouslyFocused&&typeof this.previouslyFocused.focus=="function"&&this.previouslyFocused.focus(),this.previouslyFocused=null,this.isActive=!1)}get active(){return this.isActive}}class x{constructor(t){n(this,"liveRegion");n(this,"shadow");this.shadow=t||null,this.liveRegion=this.createLiveRegion()}createLiveRegion(){const t=document.createElement("div");return t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,this.shadow?this.shadow.appendChild(t):document.body.appendChild(t),t}announce(t){this.liveRegion.setAttribute("aria-live","polite"),this.liveRegion.textContent="",setTimeout(()=>{this.liveRegion.textContent=t},100)}announceUrgent(t){this.liveRegion.setAttribute("aria-live","assertive"),this.liveRegion.textContent="",setTimeout(()=>{this.liveRegion.textContent=t},100)}destroy(){this.liveRegion.remove()}}class B{constructor(t=document){n(this,"shortcuts",new Map);n(this,"container");n(this,"boundHandleKeyDown");n(this,"isEnabled",!0);this.container=t,this.boundHandleKeyDown=this.handleKeyDown.bind(this),this.attach()}getShortcutKey(t,e){const a=[];return e!=null&&e.ctrl&&a.push("ctrl"),e!=null&&e.alt&&a.push("alt"),e!=null&&e.shift&&a.push("shift"),e!=null&&e.meta&&a.push("meta"),a.push(t.toLowerCase()),a.join("+")}handleKeyDown(t){if(!this.isEnabled)return;const e=t,a=this.getShortcutKey(e.key,{ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey,meta:e.metaKey}),r=this.shortcuts.get(a);r&&(e.preventDefault(),r.handler())}register(t){const e=this.getShortcutKey(t.key,t.modifiers);this.shortcuts.set(e,t)}unregister(t,e){const a=this.getShortcutKey(t,e);this.shortcuts.delete(a)}enable(){this.isEnabled=!0}disable(){this.isEnabled=!1}attach(){this.container.addEventListener("keydown",this.boundHandleKeyDown)}detach(){this.container.removeEventListener("keydown",this.boundHandleKeyDown)}getShortcuts(){return Array.from(this.shortcuts.values())}}function G(s,t={}){s.setAttribute("role","dialog"),t.modal&&s.setAttribute("aria-modal","true"),t.labelledBy&&s.setAttribute("aria-labelledby",t.labelledBy),t.describedBy&&s.setAttribute("aria-describedby",t.describedBy)}function v(s,t={}){t.label&&s.setAttribute("aria-label",t.label),t.pressed!==void 0&&s.setAttribute("aria-pressed",String(t.pressed)),t.expanded!==void 0&&s.setAttribute("aria-expanded",String(t.expanded)),t.controls&&s.setAttribute("aria-controls",t.controls),t.describedBy&&s.setAttribute("aria-describedby",t.describedBy)}let j=0;function m(s="ap"){return`${s}-${++j}-${Math.random().toString(36).slice(2,8)}`}function E(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}const V={bgPrimary:"#0a0a0a",bgSecondary:"#111111",bgTertiary:"#1a1a1a",bgOverlay:"rgba(5, 5, 5, 0.92)",accent:"#00e5ff",accentMuted:"rgba(0, 229, 255, 0.15)",accentGlow:"rgba(0, 229, 255, 0.3)",success:"#00ff9d",successMuted:"rgba(0, 255, 157, 0.15)",successGlow:"rgba(0, 255, 157, 0.3)",danger:"#ff2a6d",dangerMuted:"rgba(255, 42, 109, 0.15)",dangerGlow:"rgba(255, 42, 109, 0.3)",warning:"#f59e0b",warningMuted:"rgba(245, 158, 11, 0.15)",textPrimary:"#ffffff",textSecondary:"#e0e0e0",textMuted:"rgba(255, 255, 255, 0.5)",textInverse:"#0a0a0a",borderPrimary:"rgba(255, 255, 255, 0.1)",borderSecondary:"rgba(255, 255, 255, 0.06)",borderAccent:"rgba(0, 229, 255, 0.2)"},H={bgPrimary:"#ffffff",bgSecondary:"#f8f9fa",bgTertiary:"#f0f1f3",bgOverlay:"rgba(255, 255, 255, 0.95)",accent:"#0096b4",accentMuted:"rgba(0, 150, 180, 0.1)",accentGlow:"rgba(0, 150, 180, 0.2)",success:"#00b36b",successMuted:"rgba(0, 179, 107, 0.1)",successGlow:"rgba(0, 179, 107, 0.2)",danger:"#d92662",dangerMuted:"rgba(217, 38, 98, 0.1)",dangerGlow:"rgba(217, 38, 98, 0.2)",warning:"#d97706",warningMuted:"rgba(217, 119, 6, 0.1)",textPrimary:"#111111",textSecondary:"#374151",textMuted:"rgba(0, 0, 0, 0.5)",textInverse:"#ffffff",borderPrimary:"rgba(0, 0, 0, 0.1)",borderSecondary:"rgba(0, 0, 0, 0.06)",borderAccent:"rgba(0, 150, 180, 0.3)"},i={xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"28px",xxxl:"32px"},o={fontFamily:"'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",fontFamilySans:"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",fontSize:{xs:"10px",sm:"11px",base:"12px",md:"13px",lg:"14px",xl:"16px",xxl:"18px"},fontWeight:{medium:"500",semibold:"600",bold:"700"},lineHeight:{normal:"1.5"},letterSpacing:{wide:"0.5px",wider:"1px",widest:"1.5px"}},h={sm:"4px",md:"6px",lg:"8px",xl:"12px",full:"9999px"},p={duration:{fast:"150ms",normal:"200ms",slow:"300ms",slower:"400ms"},easing:{default:"cubic-bezier(0.4, 0, 0.2, 1)",bounce:"cubic-bezier(0.34, 1.56, 0.64, 1)"}};function M(s){return`
    --ap-bg-primary: ${s.bgPrimary};
    --ap-bg-secondary: ${s.bgSecondary};
    --ap-bg-tertiary: ${s.bgTertiary};
    --ap-bg-overlay: ${s.bgOverlay};

    --ap-accent: ${s.accent};
    --ap-accent-muted: ${s.accentMuted};
    --ap-accent-glow: ${s.accentGlow};

    --ap-success: ${s.success};
    --ap-success-muted: ${s.successMuted};
    --ap-success-glow: ${s.successGlow};

    --ap-danger: ${s.danger};
    --ap-danger-muted: ${s.dangerMuted};
    --ap-danger-glow: ${s.dangerGlow};

    --ap-warning: ${s.warning};
    --ap-warning-muted: ${s.warningMuted};

    --ap-text-primary: ${s.textPrimary};
    --ap-text-secondary: ${s.textSecondary};
    --ap-text-muted: ${s.textMuted};
    --ap-text-inverse: ${s.textInverse};

    --ap-border-primary: ${s.borderPrimary};
    --ap-border-secondary: ${s.borderSecondary};
    --ap-border-accent: ${s.borderAccent};

    --ap-spacing-xs: ${i.xs};
    --ap-spacing-sm: ${i.sm};
    --ap-spacing-md: ${i.md};
    --ap-spacing-lg: ${i.lg};
    --ap-spacing-xl: ${i.xl};
    --ap-spacing-xxl: ${i.xxl};

    --ap-font-mono: ${o.fontFamily};
    --ap-font-sans: ${o.fontFamilySans};

    --ap-radius-sm: ${h.sm};
    --ap-radius-md: ${h.md};
    --ap-radius-lg: ${h.lg};
    --ap-radius-xl: ${h.xl};

    --ap-transition-fast: ${p.duration.fast};
    --ap-transition-normal: ${p.duration.normal};
    --ap-transition-slow: ${p.duration.slow};
    --ap-ease-default: ${p.easing.default};
    --ap-ease-bounce: ${p.easing.bounce};
  `}function I(){return`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      font-family: var(--ap-font-mono);
      font-size: ${o.fontSize.base};
      line-height: ${o.lineHeight.normal};
      color: var(--ap-text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `}function W(){return window.matchMedia("(prefers-color-scheme: dark)").matches}function R(s){return s.mode==="system"?W()?"dark":"light":s.mode}function O(s){return s==="dark"?V:H}class X{constructor(t={mode:"system"}){n(this,"config");n(this,"effectiveTheme");n(this,"listeners",new Set);n(this,"mediaQuery",null);n(this,"boundHandleSystemChange");this.config=t,this.effectiveTheme=R(this.config),this.boundHandleSystemChange=this.handleSystemChange.bind(this),typeof window<"u"&&(this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.mediaQuery.addEventListener("change",this.boundHandleSystemChange))}handleSystemChange(){if(this.config.mode==="system"){const t=R(this.config);t!==this.effectiveTheme&&(this.effectiveTheme=t,this.notifyListeners())}}notifyListeners(){const t=this.getColors();for(const e of this.listeners)e(this.effectiveTheme,t)}getTheme(){return this.effectiveTheme}getColors(){return O(this.effectiveTheme)}getCSSVariables(){return M(this.getColors())}getConfig(){return{...this.config}}setConfig(t){this.config={...this.config,...t};const e=R(this.config);e!==this.effectiveTheme&&(this.effectiveTheme=e,this.notifyListeners())}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}destroy(){this.mediaQuery&&this.mediaQuery.removeEventListener("change",this.boundHandleSystemChange),this.listeners.clear()}}function Y(s,t){const e=document.createElement("style");e.id="ap-theme-vars";const a=()=>{e.textContent=`:host {
      ${t.getCSSVariables()}
    }

    :host([data-theme="dark"]) {
      ${M(V)}
    }

    :host([data-theme="light"]) {
      ${M(H)}
    }`};a(),s.prepend(e);const r=s.host;r.dataset.theme=t.getTheme();const l=t.subscribe(d=>{r.dataset.theme=d,a()});return()=>{l(),e.remove()}}function P(s,t){const e=s==="dark";switch(t){case"modal":return e?"0 0 40px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.5)":"0 25px 50px rgba(0, 0, 0, 0.15)";case"drawer":return e?"-4px 0 20px rgba(0, 0, 0, 0.5)":"-4px 0 20px rgba(0, 0, 0, 0.1)";case"toast":return e?"0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.1)":"0 4px 20px rgba(0, 0, 0, 0.1)";default:return"none"}}function Q(s){return s==="dark"?`radial-gradient(
        ellipse 80% 70% at 50% 50%,
        rgba(5, 5, 5, 0.85) 0%,
        rgba(5, 5, 5, 0.92) 50%,
        rgba(0, 0, 0, 0.98) 100%
      )`:`radial-gradient(
        ellipse 80% 70% at 50% 50%,
        rgba(255, 255, 255, 0.85) 0%,
        rgba(255, 255, 255, 0.92) 50%,
        rgba(240, 240, 240, 0.98) 100%
      )`}const A="agentping_theme_config";async function J(){try{const s=await chrome.storage.local.get(A);if(s[A])return s[A]}catch(s){console.warn("[AgentPing] Failed to load theme config:",s)}return{mode:"system"}}let S=null;async function Z(){const s=await J();return S?S.setConfig(s):S=new X(s),S}class z{constructor(t,e,a){n(this,"host");n(this,"shadow");n(this,"themeManager");n(this,"focusTrap",null);n(this,"announcer");n(this,"keyboardManager");n(this,"themeCleanup",null);n(this,"config");n(this,"_isVisible",!1);n(this,"pendingRequests",[]);n(this,"currentRequest",null);n(this,"onGrant",()=>{});n(this,"onDeny",()=>{});this.themeManager=e,this.config=a,this.host=document.createElement(t),this.host.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(this.host),this.shadow=this.host.attachShadow({mode:"closed"}),this.themeCleanup=Y(this.shadow,this.themeManager),this.announcer=new x(this.shadow),this.keyboardManager=new B(document),this.registerKeyboardShortcuts()}registerKeyboardShortcuts(){this.keyboardManager.register({key:"g",handler:()=>this.handleGrant(),description:"Grant the current lease request"}),this.keyboardManager.register({key:"d",handler:()=>this.handleDeny(),description:"Deny the current lease request"}),this.keyboardManager.register({key:"Escape",handler:()=>this.handleEscape(),description:"Dismiss the notification"}),this.keyboardManager.disable()}handleGrant(){!this._isVisible||!this.currentRequest||(this.onGrant(this.currentRequest.requestId),this.processNextOrHide())}handleDeny(){!this._isVisible||!this.currentRequest||(this.onDeny(this.currentRequest.requestId),this.processNextOrHide())}handleEscape(){this._isVisible&&this.hide(!1)}processNextOrHide(){if(this.pendingRequests.length>0){const t=this.pendingRequests.shift();this.currentRequest=t,this.renderContent(t)}else this.hide(!0)}playSound(){if(this.config.soundEnabled)try{const t=new AudioContext,e=t.createOscillator(),a=t.createGain();e.connect(a),a.connect(t.destination),e.type="sine",e.frequency.setValueAtTime(880,t.currentTime),e.frequency.setValueAtTime(1174.66,t.currentTime+.1),a.gain.setValueAtTime(this.config.soundVolume,t.currentTime),a.gain.exponentialRampToValueAtTime(.001,t.currentTime+.3),e.start(t.currentTime),e.stop(t.currentTime+.3)}catch(t){console.warn("[AgentPing] Could not play notification sound:",t)}}escapeHtml(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}formatTtl(t){return typeof t=="number"?`${t} minute${t!==1?"s":""}`:typeof t=="string"?this.escapeHtml(t):"--"}show(t){if(this._isVisible&&this.currentRequest){this.pendingRequests.push(t),this.announceToScreenReader(`New lease request queued. ${this.pendingRequests.length} pending.`);return}this.currentRequest=t,this.renderContent(t),this.playSound(),this._isVisible=!0,this.keyboardManager.enable(),this.focusTrap&&this.focusTrap.activate(),this.announceToScreenReader(`Lease request from ${t.agentName||"Unknown Agent"}. Scopes: ${(t.scopes||["default"]).join(", ")}. Press G to grant or D to deny.`)}hide(t=!1){this._isVisible=!1,this.currentRequest=null,this.pendingRequests=[],this.keyboardManager.disable(),this.focusTrap&&this.focusTrap.deactivate()}destroy(){this.hide(),this.themeCleanup&&this.themeCleanup(),this.keyboardManager.detach(),this.announcer.destroy(),this.host.remove()}get isVisible(){return this._isVisible}get pendingCount(){return this.pendingRequests.length}announceToScreenReader(t){this.announcer.announceUrgent(t)}}class F extends z{constructor(e,a){super("agentping-modal-overlay",e,a);n(this,"overlay");n(this,"modal");n(this,"stackContainer");n(this,"cardStack",[]);n(this,"ids",{title:m("modal-title"),desc:m("modal-desc"),dialog:m("modal-dialog")});this.initializeUI()}initializeUI(){const e=document.createElement("style");e.textContent=this.getStyles(),this.shadow.appendChild(e),this.overlay=document.createElement("div"),this.overlay.className="overlay",this.overlay.setAttribute("role","presentation"),this.stackContainer=document.createElement("div"),this.stackContainer.className="stack-container",this.overlay.appendChild(this.stackContainer),this.modal=document.createElement("div"),this.modal.className="modal",G(this.modal,{modal:!0,labelledBy:this.ids.title,describedBy:this.ids.desc}),this.modal.innerHTML=this.getModalTemplate(),this.overlay.appendChild(this.modal),this.shadow.appendChild(this.overlay),this.focusTrap=new b(this.modal),this.bindEvents()}getModalTemplate(){return`
      <div class="header">
        <div class="icon" aria-hidden="true">🤖</div>
        <div class="header-text">
          <h2 class="title" id="${this.ids.title}">Lease Request</h2>
          <div class="subtitle">Agent Authorization</div>
        </div>
        <div class="badge" aria-label="Pending requests count" data-badge></div>
      </div>

      <div id="${this.ids.desc}" class="sr-only">
        An agent is requesting access to browser capabilities. Review the details below and grant or deny the request.
      </div>

      <div class="field">
        <div class="field-label">Agent</div>
        <div class="field-value" data-agent-name>--</div>
      </div>

      <div class="field">
        <div class="field-label">Scopes</div>
        <div class="scopes" data-scope-list role="list" aria-label="Requested scopes"></div>
      </div>

      <div class="field">
        <div class="field-label">Duration</div>
        <div class="field-value" data-duration>--</div>
      </div>

      <div class="field">
        <div class="field-label">Reason</div>
        <div class="reason" data-reason>No reason provided</div>
      </div>

      <div class="buttons" role="group" aria-label="Actions">
        <button class="btn btn-grant" data-action="grant" type="button">
          Grant
        </button>
        <button class="btn btn-deny" data-action="deny" type="button">
          Deny
        </button>
      </div>

      <div class="hints" aria-hidden="true">
        <span class="hint"><kbd class="key">G</kbd> Grant</span>
        <span class="hint"><kbd class="key">D</kbd> Deny</span>
        <span class="hint"><kbd class="key">Esc</kbd> Dismiss</span>
      </div>
    `}bindEvents(){const e=this.modal.querySelector('[data-action="grant"]'),a=this.modal.querySelector('[data-action="deny"]');e&&(v(e,{label:"Grant lease request"}),e.addEventListener("click",()=>this.handleGrant())),a&&(v(a,{label:"Deny lease request"}),a.addEventListener("click",()=>this.handleDeny()))}renderContent(e){const a=this.modal.querySelector("[data-agent-name]"),r=this.modal.querySelector("[data-scope-list]"),l=this.modal.querySelector("[data-duration]"),d=this.modal.querySelector("[data-reason]"),c=this.modal.querySelector("[data-badge]");a.textContent=e.agentName||"Unknown Agent";const g=e.scopes||[];r.innerHTML=g.length>0?g.map(f=>`<span class="scope-tag" role="listitem">${this.escapeHtml(f)}</span>`).join(""):'<span class="scope-tag" role="listitem">default</span>',l.textContent=this.formatTtl(e.ttl),d.textContent=e.reason||"No reason provided";const u=this.pendingRequests.length;u>0?(c.textContent=`+${u}`,c.classList.add("visible")):c.classList.remove("visible"),this.updateCardStack()}updateCardStack(){this.stackContainer.innerHTML="",this.cardStack=[];const e=Math.min(this.pendingRequests.length,this.config.maxStack-1);for(let a=0;a<e;a++){const r=document.createElement("div");r.className="stack-card",r.style.setProperty("--stack-index",String(a+1)),r.setAttribute("aria-hidden","true"),this.stackContainer.appendChild(r),this.cardStack.push(r)}}getStyles(){const a=E()?"0ms":p.duration.slow;return`
      ${I()}

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: ${Q(this.themeManager.getTheme())};
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity ${a} ease, visibility ${a} ease;
        pointer-events: none;
      }

      .overlay.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .overlay.fade-out {
        opacity: 0;
        transition: opacity ${p.duration.slower} ease;
      }

      .stack-container {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .stack-card {
        position: absolute;
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.xl};
        max-width: 420px;
        width: 90%;
        height: 280px;
        transform: scale(calc(1 - var(--stack-index) * 0.05))
                   translateY(calc(var(--stack-index) * -10px));
        opacity: calc(0.3 - var(--stack-index) * 0.1);
        transition: transform ${a} ease, opacity ${a} ease;
      }

      .modal {
        position: relative;
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.xl};
        box-shadow: ${P(this.themeManager.getTheme(),"modal")};
        padding: ${i.xxl} ${i.xxxl};
        max-width: 420px;
        width: 90%;
        transform: scale(0.95) translateY(10px);
        transition: transform ${a} ${p.easing.bounce};
        z-index: 1;
      }

      .overlay.visible .modal {
        transform: scale(1) translateY(0);
      }

      .header {
        display: flex;
        align-items: center;
        gap: ${i.md};
        margin-bottom: ${i.xl};
        padding-bottom: ${i.lg};
        border-bottom: 1px solid var(--ap-border-accent);
      }

      .icon {
        width: 40px;
        height: 40px;
        border-radius: ${h.lg};
        background: linear-gradient(135deg, var(--ap-accent-muted) 0%, rgba(0, 229, 255, 0.05) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .header-text {
        flex: 1;
      }

      .title {
        color: var(--ap-accent);
        font-size: ${o.fontSize.xl};
        font-weight: ${o.fontWeight.semibold};
        letter-spacing: ${o.letterSpacing.wide};
        margin: 0;
      }

      .subtitle {
        color: var(--ap-text-muted);
        font-size: ${o.fontSize.sm};
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: ${o.letterSpacing.wider};
      }

      .badge {
        display: none;
        min-width: 24px;
        height: 24px;
        padding: 0 6px;
        background: var(--ap-danger-muted);
        border: 1px solid var(--ap-danger);
        border-radius: ${h.full};
        color: var(--ap-danger);
        font-size: ${o.fontSize.sm};
        font-weight: ${o.fontWeight.bold};
        line-height: 22px;
        text-align: center;
      }

      .badge.visible {
        display: block;
      }

      .field {
        margin-bottom: ${i.md};
      }

      .field-label {
        color: var(--ap-text-muted);
        font-size: ${o.fontSize.xs};
        text-transform: uppercase;
        letter-spacing: ${o.letterSpacing.widest};
        margin-bottom: ${i.xs};
      }

      .field-value {
        color: var(--ap-text-primary);
        font-size: ${o.fontSize.lg};
        word-break: break-word;
      }

      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: ${i.xs};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.sm};
        padding: ${i.xs} ${i.sm};
        font-size: ${o.fontSize.base};
        color: var(--ap-accent);
      }

      .reason {
        background: rgba(255, 255, 255, 0.03);
        border-radius: ${h.md};
        padding: ${i.md};
        color: var(--ap-text-secondary);
        font-size: ${o.fontSize.md};
        line-height: ${o.lineHeight.normal};
        font-style: italic;
      }

      .buttons {
        display: flex;
        gap: ${i.md};
        margin-top: ${i.xl};
      }

      .btn {
        flex: 1;
        padding: ${i.md} ${i.xl};
        border: none;
        border-radius: ${h.lg};
        font-family: inherit;
        font-size: ${o.fontSize.lg};
        font-weight: ${o.fontWeight.semibold};
        cursor: pointer;
        transition: all ${p.duration.normal} ease;
        text-transform: uppercase;
        letter-spacing: ${o.letterSpacing.wider};
      }

      .btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .btn-grant {
        background: var(--ap-success-muted);
        border: 1px solid rgba(0, 255, 157, 0.3);
        color: var(--ap-success);
        box-shadow: 0 0 20px var(--ap-success-glow);
      }

      .btn-grant:hover {
        background: rgba(0, 255, 157, 0.2);
        box-shadow: 0 0 30px var(--ap-success-glow);
      }

      .btn-grant:active {
        transform: scale(0.98);
      }

      .btn-deny {
        background: var(--ap-danger-muted);
        border: 1px solid rgba(255, 42, 109, 0.3);
        color: var(--ap-danger);
        box-shadow: 0 0 20px var(--ap-danger-glow);
      }

      .btn-deny:hover {
        background: rgba(255, 42, 109, 0.2);
        box-shadow: 0 0 30px var(--ap-danger-glow);
      }

      .btn-deny:active {
        transform: scale(0.98);
      }

      .hints {
        display: flex;
        justify-content: center;
        gap: ${i.xl};
        margin-top: ${i.lg};
        color: var(--ap-text-muted);
        font-size: ${o.fontSize.sm};
      }

      .hint {
        display: flex;
        align-items: center;
        gap: ${i.xs};
      }

      .key {
        background: var(--ap-border-primary);
        border: 1px solid var(--ap-border-secondary);
        border-radius: ${h.sm};
        padding: 2px ${i.sm};
        font-size: ${o.fontSize.sm};
        font-weight: ${o.fontWeight.medium};
      }
    `}show(e){super.show(e),this.overlay.classList.remove("fade-out"),this.overlay.classList.add("visible")}hide(e=!1){e?(this.overlay.classList.add("fade-out"),setTimeout(()=>{this.overlay.classList.remove("visible","fade-out"),super.hide(!1)},400)):(this.overlay.classList.remove("visible"),super.hide(!1))}}class w extends z{constructor(e,a){super("agentping-drawer",e,a);n(this,"backdrop");n(this,"drawer");n(this,"statusDot");n(this,"statusText");n(this,"leasesContainer");n(this,"requestsContainer");n(this,"state",{connectionState:"disconnected",activeLeases:[],pendingRequests:[]});n(this,"countdownIntervals",new Map);n(this,"refreshInterval",null);n(this,"ids",{drawer:m("drawer"),title:m("drawer-title"),leases:m("drawer-leases"),requests:m("drawer-requests")});n(this,"onRevoke",()=>{});n(this,"onStateRequest",()=>{});this.host.style.zIndex="2147483646",this.initializeUI()}initializeUI(){const e=document.createElement("style");e.textContent=this.getStyles(),this.shadow.appendChild(e),this.backdrop=document.createElement("div"),this.backdrop.className="drawer-backdrop",this.backdrop.setAttribute("role","presentation"),this.drawer=document.createElement("div"),this.drawer.className="drawer",G(this.drawer,{labelledBy:this.ids.title}),this.drawer.innerHTML=this.getDrawerTemplate(),this.backdrop.appendChild(this.drawer),this.shadow.appendChild(this.backdrop),this.statusDot=this.drawer.querySelector("[data-status-dot]"),this.statusText=this.drawer.querySelector("[data-status-text]"),this.leasesContainer=this.drawer.querySelector("[data-leases-container]"),this.requestsContainer=this.drawer.querySelector("[data-requests-container]"),this.focusTrap=new b(this.drawer),this.bindEvents()}getDrawerTemplate(){return this.config.position,`
      <div class="drawer-header">
        <div class="drawer-title" id="${this.ids.title}">
          <span class="drawer-icon" aria-hidden="true">⚡</span>
          <span>AgentPing</span>
        </div>
        <button class="close-btn" data-action="close" type="button" aria-label="Close drawer">
          ×
        </button>
      </div>

      <div class="status-bar">
        <div class="status-dot" data-status-dot aria-hidden="true"></div>
        <div class="status-text" data-status-text role="status" aria-live="polite">Checking...</div>
      </div>

      <div class="drawer-content">
        <section class="section" aria-labelledby="${this.ids.leases}">
          <h3 class="section-header" id="${this.ids.leases}">Active Leases</h3>
          <div data-leases-container role="list" aria-label="Active leases"></div>
        </section>

        <section class="section" aria-labelledby="${this.ids.requests}">
          <h3 class="section-header" id="${this.ids.requests}">Pending Requests</h3>
          <div data-requests-container role="list" aria-label="Pending requests"></div>
        </section>
      </div>

      <div class="drawer-footer">
        <a href="http://localhost:7890" target="_blank" rel="noopener" class="footer-link">
          🔗 Dashboard
        </a>
        <div class="version">v0.1.0</div>
      </div>
    `}bindEvents(){const e=this.drawer.querySelector('[data-action="close"]');e==null||e.addEventListener("click",()=>this.hide()),this.backdrop.addEventListener("click",a=>{a.target===this.backdrop&&this.hide()}),this.drawer.addEventListener("click",a=>{a.stopPropagation()})}updateState(e){this.state=e,this.renderStatus(),this.renderLeases(),this.renderRequests()}renderStatus(){const e={disconnected:"gray",connecting:"amber",connected:"green",leased:"cyan"},a={disconnected:"Not connected",connecting:"Connecting...",connected:"Connected",leased:"Active lease"};this.statusDot.className=`status-dot ${e[this.state.connectionState]||"gray"}`,this.statusText.textContent=a[this.state.connectionState]||this.state.connectionState}renderLeases(){if(this.countdownIntervals.forEach(e=>clearInterval(e)),this.countdownIntervals.clear(),this.state.activeLeases.length===0){this.leasesContainer.innerHTML=`
        <div class="empty-state" role="status">
          <div class="empty-icon" aria-hidden="true">💤</div>
          No active leases
        </div>
      `;return}this.leasesContainer.innerHTML=this.state.activeLeases.map(e=>`
      <div class="lease-card" data-lease-token="${e.token}" role="listitem">
        <div class="card-field">
          <div class="card-label">Scopes</div>
          <div class="scope-tags" role="list" aria-label="Lease scopes">
            ${(e.scopes||[]).map(a=>`<span class="scope-tag" role="listitem">${this.escapeHtml(a)}</span>`).join("")||'<span class="scope-tag" role="listitem">default</span>'}
          </div>
        </div>
        <div class="card-field">
          <div class="card-label">Remaining</div>
          <div class="card-value countdown" data-countdown="${e.token}" aria-live="polite">--</div>
        </div>
        <div class="card-buttons">
          <button class="card-btn revoke" data-action="revoke" data-token="${e.token}" type="button">
            Revoke
          </button>
        </div>
      </div>
    `).join(""),this.state.activeLeases.forEach(e=>{this.setupCountdown(e)}),this.leasesContainer.querySelectorAll('[data-action="revoke"]').forEach(e=>{const a=e.dataset.token;v(e,{label:"Revoke this lease"}),e.addEventListener("click",()=>{a&&this.onRevoke(a)})})}setupCountdown(e){const a=this.leasesContainer.querySelector(`[data-countdown="${e.token}"]`);if(!a||!e.expiresAt)return;const r=()=>{const d=Math.max(0,e.expiresAt-Date.now());if(a.textContent=this.formatRemaining(d),a.className=d<6e4?"card-value countdown warning":"card-value countdown",d<=0){const c=this.countdownIntervals.get(e.token);c&&(clearInterval(c),this.countdownIntervals.delete(e.token)),this.onStateRequest(g=>this.updateState(g))}};r();const l=setInterval(r,1e3);this.countdownIntervals.set(e.token,l)}formatRemaining(e){if(e<=0)return"00:00";const a=Math.floor(e/1e3),r=Math.floor(a/60),l=a%60;return`${String(r).padStart(2,"0")}:${String(l).padStart(2,"0")}`}renderRequests(){if(this.state.pendingRequests.length===0){this.requestsContainer.innerHTML=`
        <div class="empty-state" role="status">
          <div class="empty-icon" aria-hidden="true">✓</div>
          None pending
        </div>
      `;return}this.requestsContainer.innerHTML=this.state.pendingRequests.map(e=>`
      <div class="request-card" data-request-id="${e.requestId}" role="listitem">
        <div class="card-field">
          <div class="card-label">Agent</div>
          <div class="card-value agent">${this.escapeHtml(e.agentName||"Unknown Agent")}</div>
        </div>
        <div class="card-field">
          <div class="card-label">Scopes</div>
          <div class="scope-tags" role="list" aria-label="Requested scopes">
            ${(e.scopes||[]).map(a=>`<span class="scope-tag" role="listitem">${this.escapeHtml(a)}</span>`).join("")||'<span class="scope-tag" role="listitem">default</span>'}
          </div>
        </div>
        <div class="card-field">
          <div class="card-label">Duration</div>
          <div class="card-value">${this.formatTtl(e.ttl)}</div>
        </div>
        <div class="card-buttons">
          <button class="card-btn grant" data-action="grant" data-request="${e.requestId}" type="button">
            Grant
          </button>
          <button class="card-btn deny" data-action="deny" data-request="${e.requestId}" type="button">
            Deny
          </button>
        </div>
      </div>
    `).join(""),this.requestsContainer.querySelectorAll('[data-action="grant"]').forEach(e=>{const a=e.dataset.request;v(e,{label:"Grant lease request"}),e.addEventListener("click",()=>{a&&this.onGrant(a)})}),this.requestsContainer.querySelectorAll('[data-action="deny"]').forEach(e=>{const a=e.dataset.request;v(e,{label:"Deny lease request"}),e.addEventListener("click",()=>{a&&this.onDeny(a)})})}renderContent(e){this.state.pendingRequests.some(r=>r.requestId===e.requestId)||this.state.pendingRequests.push(e),this.renderRequests()}getStyles(){const a=E()?"0ms":p.duration.slow,r=this.config.position==="left";return`
      ${I()}

      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        opacity: 0;
        visibility: hidden;
        transition: opacity ${a} ease, visibility ${a} ease;
        pointer-events: none;
      }

      .drawer-backdrop.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .drawer {
        position: fixed;
        ${r?"left":"right"}: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: var(--ap-bg-primary);
        border-${r?"right":"left"}: 1px solid var(--ap-border-accent);
        box-shadow: ${r?"":"-"}4px 0 20px rgba(0, 0, 0, 0.5);
        transform: translateX(${r?"-100%":"100%"});
        transition: transform ${a} ${p.easing.default};
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
        padding: ${i.lg} ${i.xl};
        border-bottom: 1px solid var(--ap-border-accent);
      }

      .drawer-title {
        display: flex;
        align-items: center;
        gap: ${i.sm};
        font-size: ${o.fontSize.lg};
        font-weight: ${o.fontWeight.bold};
        color: var(--ap-text-primary);
      }

      .drawer-icon {
        color: var(--ap-accent);
        font-size: ${o.fontSize.xl};
      }

      .close-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: var(--ap-border-primary);
        color: var(--ap-text-muted);
        border-radius: ${h.md};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all ${p.duration.normal} ease;
      }

      .close-btn:hover {
        background: var(--ap-border-secondary);
        color: var(--ap-text-primary);
      }

      .close-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .status-bar {
        display: flex;
        align-items: center;
        gap: ${i.sm};
        padding: ${i.md} ${i.xl};
        background: var(--ap-accent-muted);
        border-bottom: 1px solid var(--ap-border-secondary);
        font-size: ${o.fontSize.base};
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: ${h.full};
        flex-shrink: 0;
      }

      .status-dot.gray { background: #555; }
      .status-dot.amber { background: var(--ap-warning); box-shadow: 0 0 8px var(--ap-warning-muted); }
      .status-dot.green { background: var(--ap-success); box-shadow: 0 0 8px var(--ap-success-glow); }
      .status-dot.cyan { background: var(--ap-accent); box-shadow: 0 0 8px var(--ap-accent-glow); }

      .status-text {
        color: var(--ap-text-secondary);
        font-size: ${o.fontSize.base};
      }

      .drawer-content {
        flex: 1;
        overflow-y: auto;
        padding: ${i.lg} ${i.xl};
      }

      .section {
        margin-bottom: ${i.xl};
      }

      .section-header {
        color: var(--ap-text-muted);
        font-size: ${o.fontSize.xs};
        font-weight: ${o.fontWeight.semibold};
        text-transform: uppercase;
        letter-spacing: ${o.letterSpacing.widest};
        margin: 0 0 ${i.md} 0;
      }

      .lease-card {
        background: var(--ap-bg-tertiary);
        border: 1px solid rgba(0, 255, 157, 0.2);
        border-radius: ${h.lg};
        padding: ${i.md};
        margin-bottom: ${i.sm};
      }

      .request-card {
        background: var(--ap-bg-tertiary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.lg};
        padding: ${i.md};
        margin-bottom: ${i.sm};
      }

      .card-field {
        margin-bottom: ${i.sm};
      }

      .card-label {
        font-size: 9px;
        font-weight: ${o.fontWeight.semibold};
        color: var(--ap-text-muted);
        text-transform: uppercase;
        margin-bottom: ${i.xs};
      }

      .card-value {
        font-size: ${o.fontSize.base};
        color: var(--ap-text-secondary);
      }

      .card-value.agent {
        color: var(--ap-text-primary);
        font-weight: ${o.fontWeight.semibold};
      }

      .card-value.countdown {
        font-size: ${o.fontSize.xxl};
        font-weight: ${o.fontWeight.bold};
        color: var(--ap-success);
        text-shadow: 0 0 10px var(--ap-success-glow);
      }

      .card-value.countdown.warning {
        color: var(--ap-danger);
        text-shadow: 0 0 10px var(--ap-danger-glow);
      }

      .scope-tags {
        display: flex;
        flex-wrap: wrap;
        gap: ${i.xs};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.sm};
        padding: ${i.xs} ${i.sm};
        font-size: ${o.fontSize.sm};
        color: var(--ap-accent);
      }

      .card-buttons {
        display: flex;
        gap: ${i.sm};
        margin-top: ${i.md};
      }

      .card-btn {
        flex: 1;
        padding: ${i.sm} ${i.md};
        border: none;
        border-radius: ${h.md};
        font-size: ${o.fontSize.sm};
        font-weight: ${o.fontWeight.semibold};
        cursor: pointer;
        font-family: inherit;
        transition: all ${p.duration.normal} ease;
      }

      .card-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .card-btn.grant {
        background: var(--ap-success-muted);
        color: var(--ap-success);
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .card-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .card-btn.deny {
        background: var(--ap-danger-muted);
        color: var(--ap-danger);
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .card-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .card-btn.revoke {
        background: var(--ap-border-primary);
        color: var(--ap-text-muted);
        border: 1px solid var(--ap-border-secondary);
      }

      .card-btn.revoke:hover {
        background: var(--ap-border-secondary);
        color: var(--ap-text-secondary);
      }

      .empty-state {
        text-align: center;
        color: var(--ap-text-muted);
        padding: ${i.xl} 0;
        font-size: ${o.fontSize.sm};
      }

      .empty-icon {
        font-size: 32px;
        margin-bottom: ${i.sm};
        opacity: 0.3;
      }

      .drawer-footer {
        padding: ${i.lg} ${i.xl};
        border-top: 1px solid var(--ap-border-secondary);
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: ${i.sm};
        color: var(--ap-accent);
        text-decoration: none;
        font-size: ${o.fontSize.base};
        margin-bottom: ${i.sm};
        transition: color ${p.duration.normal} ease;
      }

      .footer-link:hover {
        color: var(--ap-success);
      }

      .footer-link:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .version {
        color: var(--ap-text-muted);
        font-size: ${o.fontSize.xs};
        text-align: center;
      }
    `}toggle(){this._isVisible?this.hide():this.showDrawer()}showDrawer(){this._isVisible=!0,this.backdrop.classList.add("visible"),this.keyboardManager.enable(),this.focusTrap&&this.focusTrap.activate(),this.refreshInterval||(this.refreshInterval=setInterval(()=>{this.onStateRequest(e=>this.updateState(e))},2e3)),this.announceToScreenReader("AgentPing drawer opened")}show(e){super.show(e),this.backdrop.classList.add("visible"),this.refreshInterval||(this.refreshInterval=setInterval(()=>{this.onStateRequest(a=>this.updateState(a))},2e3))}hide(e=!1){this._isVisible=!1,this.backdrop.classList.remove("visible"),this.keyboardManager.disable(),this.focusTrap&&this.focusTrap.deactivate(),this.countdownIntervals.forEach(a=>clearInterval(a)),this.countdownIntervals.clear(),this.refreshInterval&&(clearInterval(this.refreshInterval),this.refreshInterval=null),super.hide(!1)}}class ee extends z{constructor(e,a){super("agentping-toast-container",e,a);n(this,"container");n(this,"toasts",new Map);n(this,"autoDismissDelay",3e4);this.host.style.pointerEvents="none",this.initializeUI()}initializeUI(){const e=document.createElement("style");e.textContent=this.getStyles(),this.shadow.appendChild(e),this.container=document.createElement("div"),this.container.className=`toast-container position-${this.config.position}`,this.container.setAttribute("role","region"),this.container.setAttribute("aria-label","Notifications"),this.container.setAttribute("aria-live","polite"),this.shadow.appendChild(this.container)}renderContent(e){this.createToast(e)}createToast(e){const a=m("toast"),r=m("toast-title"),l=m("toast-desc"),d=document.createElement("div");d.className="toast",d.setAttribute("role","alertdialog"),d.setAttribute("aria-labelledby",r),d.setAttribute("aria-describedby",l),d.dataset.requestId=e.requestId,d.innerHTML=`
      <div class="toast-header">
        <div class="toast-icon" aria-hidden="true">🤖</div>
        <div class="toast-title" id="${r}">
          ${this.escapeHtml(e.agentName||"Unknown Agent")}
        </div>
        <button class="toast-close" data-action="dismiss" type="button" aria-label="Dismiss notification">
          ×
        </button>
      </div>

      <div class="toast-body" id="${l}">
        <div class="toast-scopes" role="list" aria-label="Requested scopes">
          ${(e.scopes||["default"]).map(u=>`<span class="scope-tag" role="listitem">${this.escapeHtml(u)}</span>`).join("")}
        </div>
        <div class="toast-meta">
          <span class="toast-duration">${this.formatTtl(e.ttl)}</span>
          ${e.reason?`<span class="toast-reason">${this.escapeHtml(e.reason.slice(0,50))}${e.reason.length>50?"...":""}</span>`:""}
        </div>
      </div>

      <div class="toast-actions">
        <button class="toast-btn grant" data-action="grant" type="button">
          Grant
        </button>
        <button class="toast-btn deny" data-action="deny" type="button">
          Deny
        </button>
      </div>

      <div class="toast-progress" aria-hidden="true">
        <div class="toast-progress-bar"></div>
      </div>
    `,this.bindToastEvents(d,e.requestId),this.container.appendChild(d),requestAnimationFrame(()=>{d.classList.add("visible")});const c=setTimeout(()=>{this.dismissToast(e.requestId)},this.autoDismissDelay),g={id:a,lease:e,element:d,timeoutId:c};this.toasts.set(e.requestId,g),this.enforceMaxStack()}bindToastEvents(e,a){const r=e.querySelector('[data-action="grant"]');r&&(v(r,{label:"Grant lease request"}),r.addEventListener("click",c=>{c.stopPropagation(),this.handleToastGrant(a)}));const l=e.querySelector('[data-action="deny"]');l&&(v(l,{label:"Deny lease request"}),l.addEventListener("click",c=>{c.stopPropagation(),this.handleToastDeny(a)}));const d=e.querySelector('[data-action="dismiss"]');d&&d.addEventListener("click",c=>{c.stopPropagation(),this.dismissToast(a)}),e.addEventListener("mouseenter",()=>{const c=this.toasts.get(a);c!=null&&c.timeoutId&&(clearTimeout(c.timeoutId),c.timeoutId=void 0);const g=e.querySelector(".toast-progress-bar");g&&(g.style.animationPlayState="paused")}),e.addEventListener("mouseleave",()=>{const c=this.toasts.get(a);if(c){c.timeoutId=setTimeout(()=>{this.dismissToast(a)},this.autoDismissDelay/2);const g=e.querySelector(".toast-progress-bar");g&&(g.style.animationPlayState="running")}})}handleToastGrant(e){this.onGrant(e),this.removeToast(e,!0)}handleToastDeny(e){this.onDeny(e),this.removeToast(e,!1)}dismissToast(e){this.removeToast(e,!1)}removeToast(e,a){const r=this.toasts.get(e);r&&(r.timeoutId&&clearTimeout(r.timeoutId),r.element.classList.add(a?"exit-grant":"exit-deny"),setTimeout(()=>{r.element.remove(),this.toasts.delete(e),this.toasts.size===0&&(this._isVisible=!1,this.currentRequest=null)},300))}enforceMaxStack(){const e=Array.from(this.container.children),a=e.length-this.config.maxStack;if(a>0)for(let r=0;r<a;r++){const d=e[r].dataset.requestId;d&&this.dismissToast(d)}}getStyles(){const a=E()?"0ms":p.duration.slow;return`
      ${I()}

      .toast-container {
        position: fixed;
        top: ${i.xl};
        display: flex;
        flex-direction: column;
        gap: ${i.sm};
        max-width: 380px;
        width: calc(100vw - 40px);
        max-height: calc(100vh - 40px);
        overflow: hidden;
        pointer-events: none;
        z-index: 2147483645;
      }

      .toast-container.position-right {
        right: ${i.xl};
        align-items: flex-end;
      }

      .toast-container.position-left {
        left: ${i.xl};
        align-items: flex-start;
      }

      .toast-container.position-center {
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
      }

      .toast {
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.xl};
        box-shadow: ${P(this.themeManager.getTheme(),"toast")};
        width: 100%;
        max-width: 360px;
        overflow: hidden;
        pointer-events: auto;
        transform: translateX(100%) scale(0.95);
        opacity: 0;
        transition: transform ${a} ${p.easing.bounce},
                    opacity ${a} ease;
      }

      .toast-container.position-left .toast {
        transform: translateX(-100%) scale(0.95);
      }

      .toast-container.position-center .toast {
        transform: translateY(-20px) scale(0.95);
      }

      .toast.visible {
        transform: translateX(0) scale(1);
        opacity: 1;
      }

      .toast-container.position-center .toast.visible {
        transform: translateY(0) scale(1);
      }

      .toast.exit-grant {
        transform: translateX(100%) scale(0.9);
        opacity: 0;
        border-color: var(--ap-success);
      }

      .toast.exit-deny {
        transform: translateX(-100%) scale(0.9);
        opacity: 0;
        border-color: var(--ap-danger);
      }

      .toast-header {
        display: flex;
        align-items: center;
        gap: ${i.sm};
        padding: ${i.md} ${i.lg};
        border-bottom: 1px solid var(--ap-border-secondary);
      }

      .toast-icon {
        font-size: ${o.fontSize.xl};
      }

      .toast-title {
        flex: 1;
        font-size: ${o.fontSize.md};
        font-weight: ${o.fontWeight.semibold};
        color: var(--ap-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .toast-close {
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        color: var(--ap-text-muted);
        cursor: pointer;
        border-radius: ${h.sm};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all ${p.duration.fast} ease;
      }

      .toast-close:hover {
        background: var(--ap-border-primary);
        color: var(--ap-text-primary);
      }

      .toast-close:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .toast-body {
        padding: ${i.md} ${i.lg};
      }

      .toast-scopes {
        display: flex;
        flex-wrap: wrap;
        gap: ${i.xs};
        margin-bottom: ${i.sm};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${h.sm};
        padding: 2px ${i.sm};
        font-size: ${o.fontSize.xs};
        color: var(--ap-accent);
      }

      .toast-meta {
        display: flex;
        align-items: center;
        gap: ${i.sm};
        font-size: ${o.fontSize.xs};
        color: var(--ap-text-muted);
      }

      .toast-duration {
        font-weight: ${o.fontWeight.medium};
      }

      .toast-reason {
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }

      .toast-actions {
        display: flex;
        gap: ${i.sm};
        padding: 0 ${i.lg} ${i.md};
      }

      .toast-btn {
        flex: 1;
        padding: ${i.sm} ${i.md};
        border: none;
        border-radius: ${h.md};
        font-size: ${o.fontSize.sm};
        font-weight: ${o.fontWeight.semibold};
        cursor: pointer;
        font-family: inherit;
        transition: all ${p.duration.fast} ease;
      }

      .toast-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .toast-btn.grant {
        background: var(--ap-success-muted);
        color: var(--ap-success);
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .toast-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .toast-btn.deny {
        background: var(--ap-danger-muted);
        color: var(--ap-danger);
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .toast-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .toast-progress {
        height: 3px;
        background: var(--ap-border-secondary);
        overflow: hidden;
      }

      .toast-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--ap-accent), var(--ap-success));
        width: 100%;
        transform-origin: left;
        animation: progress ${this.autoDismissDelay}ms linear forwards;
      }

      @keyframes progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
    `}registerKeyboardShortcuts(){this.keyboardManager.register({key:"Escape",handler:()=>this.dismissAll(),description:"Dismiss all notifications"}),this.keyboardManager.disable()}dismissAll(){const e=Array.from(this.toasts.keys());for(const a of e)this.dismissToast(a)}show(e){this._isVisible=!0,this.currentRequest=e,this.renderContent(e),this.playSound(),this.keyboardManager.enable(),this.announceToScreenReader(`New lease request from ${e.agentName||"Unknown Agent"}. Scopes: ${(e.scopes||["default"]).join(", ")}.`)}hide(e=!1){this.dismissAll(),this._isVisible=!1,this.currentRequest=null,this.keyboardManager.disable()}get pendingCount(){return this.toasts.size}}const _={position:"right",maxStack:5,soundEnabled:!0,soundVolume:.15};function te(s,t,e=_){switch(s){case"modal":return new F(t,e);case"drawer":return new w(t,e);case"toast":return new ee(t,e);default:return console.warn(`[AgentPing] Unknown notification style: ${s}, falling back to modal`),new F(t,e)}}class ae{constructor(t){n(this,"ui",null);n(this,"themeManager",null);n(this,"config");n(this,"initialized",!1);n(this,"onGrant",()=>{});n(this,"onDeny",()=>{});n(this,"onRevoke",()=>{});n(this,"onStateRequest",()=>{});this.config={style:(t==null?void 0:t.style)||"drawer",notification:{..._,...t==null?void 0:t.notification}}}async initialize(){this.initialized||(this.themeManager=await Z(),this.ui=te(this.config.style,this.themeManager,this.config.notification),this.ui.onGrant=t=>this.onGrant(t),this.ui.onDeny=t=>this.onDeny(t),this.ui instanceof w&&(this.ui.onRevoke=t=>this.onRevoke(t),this.ui.onStateRequest=t=>this.onStateRequest(t)),this.initialized=!0)}async updateConfig(t){const e=t.style&&t.style!==this.config.style;this.config={style:t.style||this.config.style,notification:{...this.config.notification,...t.notification}},e&&this.initialized&&(this.destroy(),this.initialized=!1,await this.initialize())}show(t){if(!this.ui){console.warn("[AgentPing] NotificationManager not initialized");return}this.ui.show(t)}hide(t=!1){var e;(e=this.ui)==null||e.hide(t)}toggleDrawer(){this.ui instanceof w&&this.ui.toggle()}showDrawer(){this.ui instanceof w&&this.ui.showDrawer()}updateDrawerState(t){this.ui instanceof w&&this.ui.updateState(t)}announce(t){var e;(e=this.ui)==null||e.announceToScreenReader(t)}get isVisible(){var t;return((t=this.ui)==null?void 0:t.isVisible)??!1}get pendingCount(){var t;return((t=this.ui)==null?void 0:t.pendingCount)??0}get style(){return this.config.style}destroy(){var t;(t=this.ui)==null||t.destroy(),this.ui=null,this.initialized=!1}}const se={matches:["<all_urls>"],runAt:"document_idle",async main(){var r,l,d,c,g;const s=await chrome.storage.local.get(["notificationConfig","themeConfig"]),t=((r=s.notificationConfig)==null?void 0:r.style)||"drawer",e={position:((l=s.notificationConfig)==null?void 0:l.position)||"right",maxStack:((d=s.notificationConfig)==null?void 0:d.maxStack)||5,soundEnabled:((c=s.notificationConfig)==null?void 0:c.soundEnabled)??!0,soundVolume:((g=s.notificationConfig)==null?void 0:g.soundVolume)||.15},a=new ae({style:t,notification:e});await a.initialize(),a.onGrant=u=>{chrome.runtime.sendMessage({type:"approveLease",requestId:u})},a.onDeny=u=>{chrome.runtime.sendMessage({type:"denyLease",requestId:u})},a.onRevoke=u=>{chrome.runtime.sendMessage({type:"revokeLease",token:u})},a.onStateRequest=u=>{chrome.runtime.sendMessage({type:"getDrawerState"},f=>{f&&u({connectionState:f.connectionState,activeLeases:f.activeLeases||[],pendingRequests:f.pendingLeases||[]})})},chrome.runtime.onMessage.addListener(u=>{var f;switch(u.type){case"showLeaseOverlay":u.lease&&a.show(u.lease);break;case"hideLeaseOverlay":a.hide(!1);break;case"toggleDrawer":a.toggleDrawer();break;case"showDrawer":a.showDrawer();break;case"updateDrawerState":u.state&&a.updateDrawerState(u.state);break;case"updateConfig":u.config&&a.updateConfig({style:(f=u.config.notification)==null?void 0:f.style,notification:u.config.notification});break}}),chrome.storage.onChanged.addListener(u=>{if(a.style==="drawer"&&a.isVisible&&(u.activeLeases||u.pendingLeases)&&a.onStateRequest(f=>a.updateDrawerState(f)),u.notificationConfig){const f=u.notificationConfig.newValue;f&&a.updateConfig({style:f.style,notification:f})}}),window.addEventListener("unload",()=>{a.destroy()})}},k=(U=(K=globalThis.browser)==null?void 0:K.runtime)!=null&&U.id?globalThis.browser:globalThis.chrome;function T(s,...t){}const ie={debug:(...s)=>T(console.debug,...s),log:(...s)=>T(console.log,...s),warn:(...s)=>T(console.warn,...s),error:(...s)=>T(console.error,...s)},q=class q extends Event{constructor(t,e){super(q.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=e}};n(q,"EVENT_NAME",L("wxt:locationchange"));let D=q;function L(s){var t;return`${(t=k==null?void 0:k.runtime)==null?void 0:t.id}:content:${s}`}function ne(s){let t,e;return{run(){t==null&&(e=new URL(location.href),t=s.setInterval(()=>{let a=new URL(location.href);a.href!==e.href&&(window.dispatchEvent(new D(a,e)),e=a)},1e3))}}}const $=class ${constructor(t,e){n(this,"isTopFrame",window.self===window.top);n(this,"abortController");n(this,"locationWatcher",ne(this));n(this,"receivedMessageIds",new Set);this.contentScriptName=t,this.options=e,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(t){return this.abortController.abort(t)}get isInvalid(){return k.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(t){return this.signal.addEventListener("abort",t),()=>this.signal.removeEventListener("abort",t)}block(){return new Promise(()=>{})}setInterval(t,e){const a=setInterval(()=>{this.isValid&&t()},e);return this.onInvalidated(()=>clearInterval(a)),a}setTimeout(t,e){const a=setTimeout(()=>{this.isValid&&t()},e);return this.onInvalidated(()=>clearTimeout(a)),a}requestAnimationFrame(t){const e=requestAnimationFrame((...a)=>{this.isValid&&t(...a)});return this.onInvalidated(()=>cancelAnimationFrame(e)),e}requestIdleCallback(t,e){const a=requestIdleCallback((...r)=>{this.signal.aborted||t(...r)},e);return this.onInvalidated(()=>cancelIdleCallback(a)),a}addEventListener(t,e,a,r){var l;e==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(l=t.addEventListener)==null||l.call(t,e.startsWith("wxt:")?L(e):e,a,{...r,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),ie.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:$.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(t){var l,d,c;const e=((l=t.data)==null?void 0:l.type)===$.SCRIPT_STARTED_MESSAGE_TYPE,a=((d=t.data)==null?void 0:d.contentScriptName)===this.contentScriptName,r=!this.receivedMessageIds.has((c=t.data)==null?void 0:c.messageId);return e&&a&&r}listenForNewerScripts(t){let e=!0;const a=r=>{if(this.verifyScriptStartedEvent(r)){this.receivedMessageIds.add(r.data.messageId);const l=e;if(e=!1,l&&(t!=null&&t.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",a),this.onInvalidated(()=>removeEventListener("message",a))}};n($,"SCRIPT_STARTED_MESSAGE_TYPE",L("wxt:content-script-started"));let N=$;function ce(){}function C(s,...t){}const re={debug:(...s)=>C(console.debug,...s),log:(...s)=>C(console.log,...s),warn:(...s)=>C(console.warn,...s),error:(...s)=>C(console.error,...s)};return(async()=>{try{const{main:s,...t}=se,e=new N("content",t);return await s(e)}catch(s){throw re.error('The content script "content" crashed on startup!',s),s}})()}();
content;