import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as m}from"./index-BNURykns.js";import"./Button-CuNwQsQB.js";import{C as Ie}from"./Badge-COI3DMhx.js";import"./Tabs-DWG1meoA.js";import"./Input-BHY9sN05.js";import"./Dropdown-Dt4QakVY.js";import"./index-oiHgbqC6.js";import{c as v}from"./createLucideIcon-e4Yg_r7P.js";import{C as qe}from"./chevron-down-Dx1Dkz5T.js";import{T as Fe}from"./triangle-alert-Dqss0hRc.js";import{C as $}from"./circle-check-big-DdlYkAcn.js";import{X as D}from"./x-BAbVpizD.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],Re=v("check",De);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Be=v("copy",Pe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],He=v("folder-open",Ge);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Ue=v("plus",We);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],A=v("sparkles",Oe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]],ze=v("terminal",Ke),P={cmd:"⌘",command:"⌘",ctrl:"⌃",control:"⌃",alt:"⌥",option:"⌥",shift:"⇧",enter:"↵",return:"↵",backspace:"⌫",delete:"⌦",escape:"⎋",esc:"⎋",tab:"⇥",up:"↑",down:"↓",left:"←",right:"→",space:"␣"};function Le({keys:t,className:o=""}){var d;const a=((d=window.platform)==null?void 0:d.isMac)??navigator.platform.includes("Mac"),l=(n=>n.split("+").map(s=>{const f=s.trim().toLowerCase();return f==="mod"||f==="cmdctrl"?a?P.cmd:"Ctrl":P[f]||s.trim().toUpperCase()}))(t);return e.jsx("span",{className:`ui-kbd-group ${o}`,children:l.map((n,s)=>e.jsx("kbd",{className:"ui-kbd",children:n},s))})}Le.__docgenInfo={description:"",methods:[],displayName:"Kbd",props:{keys:{required:!0,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};function Me({text:t,shortcut:o,position:a="bottom",visible:i=!1}){const l=["ui-tooltip",`ui-tooltip--${a}`,i&&"ui-tooltip--visible"].filter(Boolean).join(" ");return e.jsxs("div",{className:l,role:"tooltip",children:[e.jsx("span",{children:t}),o&&e.jsx("span",{className:"ui-tooltip-shortcut",children:e.jsx(Le,{keys:o})})]})}Me.__docgenInfo={description:"",methods:[],displayName:"Tooltip",props:{text:{required:!0,tsType:{name:"string"},description:""},shortcut:{required:!1,tsType:{name:"string"},description:""},position:{required:!1,tsType:{name:"union",raw:"'top' | 'bottom' | 'left' | 'right'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"",defaultValue:{value:"'bottom'",computed:!1}},visible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ee=m.forwardRef(({icon:t,label:o,size:a="md",active:i=!1,shortcut:l,tooltipPosition:d="bottom",className:n="",...s},f)=>{const[j,x]=m.useState(!1),g=["ui-icon-button",a!=="md"&&`ui-icon-button--${a}`,i&&"ui-icon-button--active",n].filter(Boolean).join(" ");return e.jsxs("div",{className:"ui-tooltip-wrapper",onMouseEnter:()=>x(!0),onMouseLeave:()=>x(!1),children:[e.jsx("button",{ref:f,className:g,"aria-label":o,...s,children:t}),e.jsx(Me,{text:o,shortcut:l,position:d,visible:j&&!s.disabled})]})});Ee.displayName="IconButton";Ee.__docgenInfo={description:"",methods:[],displayName:"IconButton",props:{icon:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},active:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},shortcut:{required:!1,tsType:{name:"string"},description:""},tooltipPosition:{required:!1,tsType:{name:"union",raw:"'top' | 'bottom' | 'left' | 'right'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"",defaultValue:{value:"'bottom'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["ButtonHTMLAttributes"]};const Ye=m.createContext(null);function Xe({icon:t,children:o,shortcut:a,danger:i=!1,disabled:l=!1,onClick:d}){const n=m.useContext(Ye),s=()=>{l||(d==null||d(),n==null||n.close())};return e.jsxs("button",{className:`ui-context-menu-item ${i?"ui-context-menu-item--danger":""}`,role:"menuitem",disabled:l,onClick:s,children:[t&&e.jsx("span",{className:"ui-context-menu-item-icon",children:t}),e.jsx("span",{children:o}),a&&e.jsx("span",{className:"ui-context-menu-item-shortcut",children:a})]})}function Je(){return e.jsx("div",{className:"ui-context-menu-separator",role:"separator"})}Xe.__docgenInfo={description:"",methods:[],displayName:"ContextMenuItem",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},shortcut:{required:!1,tsType:{name:"string"},description:""},danger:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};Je.__docgenInfo={description:"",methods:[],displayName:"ContextMenuSeparator"};function E({text:t,size:o=14,className:a=""}){const[i,l]=m.useState(!1),d=m.useCallback(async()=>{try{await navigator.clipboard.writeText(t),l(!0),setTimeout(()=>l(!1),2e3)}catch(n){console.error("Failed to copy:",n)}},[t]);return e.jsx("button",{className:`ui-copy-button ${i?"ui-copy-button--copied":""} ${a}`,onClick:d,"aria-label":i?"Copied!":"Copy to clipboard",title:i?"Copied!":"Copy",children:i?e.jsx(Re,{size:o}):e.jsx(Be,{size:o})})}E.__docgenInfo={description:"",methods:[],displayName:"CopyButton",props:{text:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"14",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};function Ve({oldCode:t,newCode:o,language:a="plaintext",filePath:i,mode:l="unified",className:d,collapsible:n=!1,defaultCollapsed:s=!1,maxHeight:f,showHeader:j=!0}){const[x,g]=m.useState(s),[N,y]=m.useState(!1),b=m.useMemo(()=>{const r=t.split(`
`),u=o.split(`
`),h=[];let c=0,p=0;for(;c<r.length||p<u.length;)c>=r.length?(h.push({type:"add",content:u[p],newLineNum:p+1}),p++):p>=u.length?(h.push({type:"remove",content:r[c],oldLineNum:c+1}),c++):r[c]===u[p]?(h.push({type:"unchanged",content:r[c],oldLineNum:c+1,newLineNum:p+1}),c++,p++):c+1<r.length&&r[c+1]===u[p]?(h.push({type:"remove",content:r[c],oldLineNum:c+1}),c++):p+1<u.length&&r[c]===u[p+1]?(h.push({type:"add",content:u[p],newLineNum:p+1}),p++):(h.push({type:"remove",content:r[c],oldLineNum:c+1}),h.push({type:"add",content:u[p],newLineNum:p+1}),c++,p++);return h},[t,o]),F=m.useMemo(()=>{const r=b.filter(h=>h.type==="add").length,u=b.filter(h=>h.type==="remove").length;return{added:r,removed:u}},[b]),$e=async()=>{await navigator.clipboard.writeText(o),y(!0),setTimeout(()=>y(!1),2e3)},Ae=(i==null?void 0:i.split("/").pop())||"Untitled";return e.jsxs("div",{className:`code-diff-viewer diff-${l} ${d||""}`,children:[j&&e.jsxs("div",{className:`diff-header ${n?"clickable":""}`,onClick:n?()=>g(!x):void 0,children:[e.jsxs("div",{className:"diff-header-left",children:[n&&e.jsx("span",{className:"diff-collapse-icon",children:x?e.jsx(qe,{size:14}):e.jsx(Ie,{size:14})}),e.jsx("span",{className:"diff-filepath",title:i,children:Ae}),e.jsxs("span",{className:"diff-stats",children:[e.jsxs("span",{className:"diff-added",children:["+",F.added]}),e.jsxs("span",{className:"diff-removed",children:["-",F.removed]})]})]}),e.jsx("div",{className:"diff-actions",onClick:r=>r.stopPropagation(),children:e.jsxs("button",{className:"diff-action-btn",onClick:$e,title:"Copy new code",children:[N?e.jsx(Re,{size:12}):e.jsx(Be,{size:12}),e.jsx("span",{children:N?"Copied":"Copy"})]})})]}),!x&&e.jsx("div",{className:"diff-scroll-container",style:f?{maxHeight:f,overflowY:"auto"}:void 0,children:e.jsx("pre",{className:"diff-content","data-language":a,children:e.jsx("code",{children:b.map((r,u)=>e.jsxs("div",{className:`diff-line diff-line-${r.type}`,children:[e.jsx("span",{className:"diff-line-num old",children:r.oldLineNum||""}),e.jsx("span",{className:"diff-line-num new",children:r.newLineNum||""}),e.jsx("span",{className:"diff-line-prefix",children:r.type==="add"?"+":r.type==="remove"?"-":" "}),e.jsx("span",{className:"diff-line-content",children:r.content||" "})]},u))})})})]})}Ve.__docgenInfo={description:"",methods:[],displayName:"CodeDiffViewer",props:{oldCode:{required:!0,tsType:{name:"string"},description:""},newCode:{required:!0,tsType:{name:"string"},description:""},language:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'plaintext'",computed:!1}},filePath:{required:!1,tsType:{name:"string"},description:""},mode:{required:!1,tsType:{name:"union",raw:"'unified' | 'split'",elements:[{name:"literal",value:"'unified'"},{name:"literal",value:"'split'"}]},description:"",defaultValue:{value:"'unified'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},collapsible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},defaultCollapsed:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxHeight:{required:!1,tsType:{name:"number"},description:""},showHeader:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const Qe={Read:{icon:e.jsx(He,{size:14}),label:"Reading file",color:"var(--accent-primary)"},Write:{icon:e.jsx(Ue,{size:14}),label:"Creating file",color:"var(--status-success)"},Edit:{icon:e.jsx(A,{size:14}),label:"Applying changes",color:"var(--accent-secondary)"},Bash:{icon:e.jsx(ze,{size:14}),label:"Running command",color:"var(--text-primary)"},Glob:{icon:e.jsx(A,{size:14}),label:"Searching project",color:"var(--accent-primary)"},Grep:{icon:e.jsx(A,{size:14}),label:"Searching project",color:"var(--accent-primary)"}};function Ze(t){return Qe[t]||{icon:e.jsx(ze,{size:14}),label:"Executing tool",color:"var(--text-tertiary)"}}function G(t){return["Bash","Write","Edit"].includes(t)}function V({tool:t,onResolve:o}){const[a,i]=m.useState(!0),l=t.type==="tool_result",d=t.status==="pending_approval",{name:n,input:s}=t,f=Ze(n),j=(n==="Write"||n==="Edit")&&t.proposedContent!==void 0;if(l){const y=t.status==="error";return e.jsxs("div",{className:`tool-card tool-result animate-in ${y?"error":"success"}`,children:[e.jsxs("div",{className:"tool-card-header",children:[e.jsx("span",{className:"tool-icon",style:{color:y?"var(--status-error)":"var(--status-success)"},children:y?e.jsx(Fe,{size:14}):e.jsx($,{size:14})}),e.jsx("span",{className:"tool-label",children:y?"Tool Failed":"Action Complete"}),t.content&&e.jsx(E,{text:t.content,className:"tool-copy-btn"})]}),t.content&&typeof t.content=="string"&&e.jsx("div",{className:"tool-result-content",children:e.jsx("code",{children:t.content.length>300?`${t.content.slice(0,300)}...`:t.content})})]})}const x=(s==null?void 0:s.path)||(s==null?void 0:s.file_path),g=s==null?void 0:s.command,N=s==null?void 0:s.pattern;return e.jsxs("div",{className:`tool-card tool-call animate-in ${d?"pending":""}`,children:[e.jsxs("div",{className:"tool-card-header",children:[e.jsx("span",{className:"tool-icon",style:{color:f.color},children:f.icon}),e.jsx("span",{className:"tool-label",children:d?`Confirm ${n}`:f.label}),e.jsxs("div",{className:"tool-card-meta",children:[e.jsx("span",{className:"tool-name",children:n}),e.jsx("span",{className:`risk-tag risk-${G(n)?"high":"low"}`,children:G(n)?"High Risk":"Standard"})]})]}),s&&e.jsxs("div",{className:"tool-input-details",children:[x&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Path:"}),e.jsx("code",{children:x}),e.jsx(E,{text:x,size:12})]}),g&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Run:"}),e.jsx("code",{children:g}),e.jsx(E,{text:g,size:12})]}),N&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Pattern:"}),e.jsx("code",{children:N})]})]}),d&&j&&e.jsxs("div",{className:"tool-diff-section",children:[e.jsxs("button",{className:"diff-toggle-btn",onClick:()=>i(!a),children:[a?e.jsx(Ie,{size:12}):e.jsx(qe,{size:12}),e.jsx("span",{children:a?"Hide Changes":"Show Changes"})]}),a&&e.jsx("div",{className:"tool-diff-preview",children:e.jsx(Ve,{oldCode:t.originalContent||"",newCode:t.proposedContent||"",filePath:t.filePath,maxHeight:250,showHeader:!1})})]}),d&&o&&t.id&&e.jsxs("div",{className:"tool-approval-actions",children:[e.jsxs("button",{className:"approve-btn",onClick:()=>o(t.id,!0),"aria-label":"Approve this action",children:[e.jsx($,{size:14}),e.jsx("span",{children:"Approve"})]}),e.jsxs("button",{className:"deny-btn",onClick:()=>o(t.id,!1),"aria-label":"Deny this action",children:[e.jsx(D,{size:14}),e.jsx("span",{children:"Deny"})]})]}),t.status==="approved"&&e.jsxs("div",{className:"tool-status approved",children:[e.jsx($,{size:12}),e.jsx("span",{children:"Approved"})]}),t.status==="denied"&&e.jsxs("div",{className:"tool-status denied",children:[e.jsx(D,{size:12}),e.jsx("span",{children:"Denied"})]})]})}V.__docgenInfo={description:"",methods:[],displayName:"ToolCard",props:{tool:{required:!0,tsType:{name:"ToolInfo"},description:""},onResolve:{required:!1,tsType:{name:"signature",type:"function",raw:"(toolId: string, approved: boolean) => void",signature:{arguments:[{type:{name:"string"},name:"toolId"},{type:{name:"boolean"},name:"approved"}],return:{name:"void"}}},description:""}}};const mt={title:"Chat/ToolCard",component:V,parameters:{layout:"centered"},tags:["autodocs"]},C={args:{tool:{type:"tool_use",name:"Read",input:{path:"/src/components/Button.tsx"}}}},T={args:{tool:{type:"tool_use",name:"Write",input:{file_path:"/src/components/NewComponent.tsx",content:"export function NewComponent() { return <div>Hello</div>; }"}}}},_={args:{tool:{type:"tool_use",name:"Edit",input:{file_path:"/src/App.tsx"}}}},w={args:{tool:{type:"tool_use",name:"Bash",input:{command:"npm install react-query"}}}},S={args:{tool:{type:"tool_use",name:"Glob",input:{pattern:"**/*.test.ts"}}}},k={args:{tool:{type:"tool_use",name:"Grep",input:{pattern:"useState",path:"/src"}}}},I={render:()=>{const[t,o]=m.useState({type:"tool_use",name:"Bash",id:"tool-123",status:"pending_approval",input:{command:"rm -rf dist && npm run build"}}),a=(i,l)=>{o({...t,status:l?"approved":"denied"})};return e.jsx(V,{tool:t,onResolve:a})}},q={render:()=>{const[t,o]=m.useState({type:"tool_use",name:"Edit",id:"tool-456",status:"pending_approval",input:{file_path:"/src/config.ts"},filePath:"/src/config.ts",originalContent:`export const config = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  retries: 3
};`,proposedContent:`export const config = {
  apiUrl: 'https://api.production.com',
  timeout: 10000,
  retries: 5,
  debug: true
};`}),a=(i,l)=>{o({...t,status:l?"approved":"denied"})};return e.jsx(V,{tool:t,onResolve:a})}},R={args:{tool:{type:"tool_result",name:"Read",status:"success",content:"export function Button() { return <button>Click me</button>; }"}}},B={args:{tool:{type:"tool_result",name:"Bash",status:"error",content:`Error: Command failed with exit code 1
sh: invalid-command: command not found`}}},z={args:{tool:{type:"tool_use",name:"Write",id:"tool-789",status:"approved",input:{file_path:"/src/components/NewFeature.tsx"}}}},L={args:{tool:{type:"tool_use",name:"Bash",id:"tool-101",status:"denied",input:{command:"rm -rf /"}}}},M={args:{tool:{type:"tool_result",name:"Grep",status:"success",content:`Found 45 matches:
src/components/App.tsx:12: import { useState } from 'react';
src/components/Form.tsx:8: const [name, setName] = useState('');
src/components/Counter.tsx:5: const [count, setCount] = useState(0);
src/hooks/useAuth.tsx:15: const [user, setUser] = useState(null);
src/hooks/useData.tsx:20: const [loading, setLoading] = useState(false);
... and 40 more matches`}}};var H,W,U;C.parameters={...C.parameters,docs:{...(H=C.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Read',
      input: {
        path: '/src/components/Button.tsx'
      }
    } as ToolInfo
  }
}`,...(U=(W=C.parameters)==null?void 0:W.docs)==null?void 0:U.source}}};var O,K,Y;T.parameters={...T.parameters,docs:{...(O=T.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Write',
      input: {
        file_path: '/src/components/NewComponent.tsx',
        content: 'export function NewComponent() { return <div>Hello</div>; }'
      }
    } as ToolInfo
  }
}`,...(Y=(K=T.parameters)==null?void 0:K.docs)==null?void 0:Y.source}}};var X,J,Q;_.parameters={..._.parameters,docs:{...(X=_.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Edit',
      input: {
        file_path: '/src/App.tsx'
      }
    } as ToolInfo
  }
}`,...(Q=(J=_.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};var Z,ee,te;w.parameters={...w.parameters,docs:{...(Z=w.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Bash',
      input: {
        command: 'npm install react-query'
      }
    } as ToolInfo
  }
}`,...(te=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var se,oe,ne;S.parameters={...S.parameters,docs:{...(se=S.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Glob',
      input: {
        pattern: '**/*.test.ts'
      }
    } as ToolInfo
  }
}`,...(ne=(oe=S.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var ae,re,ie;k.parameters={...k.parameters,docs:{...(ae=k.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Grep',
      input: {
        pattern: 'useState',
        path: '/src'
      }
    } as ToolInfo
  }
}`,...(ie=(re=k.parameters)==null?void 0:re.docs)==null?void 0:ie.source}}};var le,ce,de;I.parameters={...I.parameters,docs:{...(le=I.parameters)==null?void 0:le.docs,source:{originalSource:`{
  render: () => {
    const [tool, setTool] = useState<ToolInfo>({
      type: 'tool_use',
      name: 'Bash',
      id: 'tool-123',
      status: 'pending_approval',
      input: {
        command: 'rm -rf dist && npm run build'
      }
    });
    const handleResolve = (toolId: string, approved: boolean) => {
      setTool({
        ...tool,
        status: approved ? 'approved' : 'denied'
      });
    };
    return <ToolCard tool={tool} onResolve={handleResolve} />;
  }
}`,...(de=(ce=I.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};var pe,ue,me;q.parameters={...q.parameters,docs:{...(pe=q.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: () => {
    const [tool, setTool] = useState<ToolInfo>({
      type: 'tool_use',
      name: 'Edit',
      id: 'tool-456',
      status: 'pending_approval',
      input: {
        file_path: '/src/config.ts'
      },
      filePath: '/src/config.ts',
      originalContent: \`export const config = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  retries: 3
};\`,
      proposedContent: \`export const config = {
  apiUrl: 'https://api.production.com',
  timeout: 10000,
  retries: 5,
  debug: true
};\`
    });
    const handleResolve = (toolId: string, approved: boolean) => {
      setTool({
        ...tool,
        status: approved ? 'approved' : 'denied'
      });
    };
    return <ToolCard tool={tool} onResolve={handleResolve} />;
  }
}`,...(me=(ue=q.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var fe,he,xe;R.parameters={...R.parameters,docs:{...(fe=R.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_result',
      name: 'Read',
      status: 'success',
      content: 'export function Button() { return <button>Click me</button>; }'
    } as ToolInfo
  }
}`,...(xe=(he=R.parameters)==null?void 0:he.docs)==null?void 0:xe.source}}};var ge,ye,ve;B.parameters={...B.parameters,docs:{...(ge=B.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_result',
      name: 'Bash',
      status: 'error',
      content: 'Error: Command failed with exit code 1\\nsh: invalid-command: command not found'
    } as ToolInfo
  }
}`,...(ve=(ye=B.parameters)==null?void 0:ye.docs)==null?void 0:ve.source}}};var je,Ne,be;z.parameters={...z.parameters,docs:{...(je=z.parameters)==null?void 0:je.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Write',
      id: 'tool-789',
      status: 'approved',
      input: {
        file_path: '/src/components/NewFeature.tsx'
      }
    } as ToolInfo
  }
}`,...(be=(Ne=z.parameters)==null?void 0:Ne.docs)==null?void 0:be.source}}};var Ce,Te,_e;L.parameters={...L.parameters,docs:{...(Ce=L.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Bash',
      id: 'tool-101',
      status: 'denied',
      input: {
        command: 'rm -rf /'
      }
    } as ToolInfo
  }
}`,...(_e=(Te=L.parameters)==null?void 0:Te.docs)==null?void 0:_e.source}}};var we,Se,ke;M.parameters={...M.parameters,docs:{...(we=M.parameters)==null?void 0:we.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_result',
      name: 'Grep',
      status: 'success',
      content: \`Found 45 matches:
src/components/App.tsx:12: import { useState } from 'react';
src/components/Form.tsx:8: const [name, setName] = useState('');
src/components/Counter.tsx:5: const [count, setCount] = useState(0);
src/hooks/useAuth.tsx:15: const [user, setUser] = useState(null);
src/hooks/useData.tsx:20: const [loading, setLoading] = useState(false);
... and 40 more matches\`
    } as ToolInfo
  }
}`,...(ke=(Se=M.parameters)==null?void 0:Se.docs)==null?void 0:ke.source}}};const ft=["ReadFile","WriteFile","EditFile","BashCommand","GlobSearch","GrepSearch","PendingApproval","PendingWithDiff","SuccessResult","ErrorResult","Approved","Denied","LongContentResult"];export{z as Approved,w as BashCommand,L as Denied,_ as EditFile,B as ErrorResult,S as GlobSearch,k as GrepSearch,M as LongContentResult,I as PendingApproval,q as PendingWithDiff,C as ReadFile,R as SuccessResult,T as WriteFile,ft as __namedExportsOrder,mt as default};
