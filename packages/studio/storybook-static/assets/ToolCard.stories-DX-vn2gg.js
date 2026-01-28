import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as p}from"./index-BNURykns.js";import"./Button-CuNwQsQB.js";import"./Table-eno7KEco.js";import"./Tabs-DWG1meoA.js";import"./Input-BHY9sN05.js";import"./Dropdown-Dt4QakVY.js";import"./index-oiHgbqC6.js";import{a as Se,b as we,C as Ie,T as be}from"./CodeDiffViewer-Byg8_5oh.js";import"./Toast-DfuF8klP.js";import"./Timeline-DMZoiotk.js";import"./StatusGrid-CFrOiMWW.js";import{T as Re}from"./triangle-alert-Dqss0hRc.js";import{C as k}from"./circle-check-big-DdlYkAcn.js";import{C as ke}from"./chevron-up-C3WeIuvy.js";import{C as qe}from"./chevron-down-Dx1Dkz5T.js";import{X as E}from"./x-BAbVpizD.js";import{S as q}from"./sparkles-BzTtEY93.js";import{c as Ce}from"./createLucideIcon-e4Yg_r7P.js";import"./info-B5XUCa8E.js";import"./circle-x-BZUptzyg.js";import"./clock-BhVhGfhk.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],Ee=Ce("folder-open",Be);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],ze=Ce("plus",Ae),A={cmd:"⌘",command:"⌘",ctrl:"⌃",control:"⌃",alt:"⌥",option:"⌥",shift:"⇧",enter:"↵",return:"↵",backspace:"⌫",delete:"⌦",escape:"⎋",esc:"⎋",tab:"⇥",up:"↑",down:"↓",left:"←",right:"→",space:"␣"};function Te({keys:t,className:s=""}){var l;const n=((l=window.platform)==null?void 0:l.isMac)??navigator.platform.includes("Mac"),r=(a=>a.split("+").map(o=>{const c=o.trim().toLowerCase();return c==="mod"||c==="cmdctrl"?n?A.cmd:"Ctrl":A[c]||o.trim().toUpperCase()}))(t);return e.jsx("span",{className:`ui-kbd-group ${s}`,children:r.map((a,o)=>e.jsx("kbd",{className:"ui-kbd",children:a},o))})}Te.__docgenInfo={description:"",methods:[],displayName:"Kbd",props:{keys:{required:!0,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};function _e({text:t,shortcut:s,position:n="bottom",visible:i=!1}){const r=["ui-tooltip",`ui-tooltip--${n}`,i&&"ui-tooltip--visible"].filter(Boolean).join(" ");return e.jsxs("div",{className:r,role:"tooltip",children:[e.jsx("span",{children:t}),s&&e.jsx("span",{className:"ui-tooltip-shortcut",children:e.jsx(Te,{keys:s})})]})}_e.__docgenInfo={description:"",methods:[],displayName:"Tooltip",props:{text:{required:!0,tsType:{name:"string"},description:""},shortcut:{required:!1,tsType:{name:"string"},description:""},position:{required:!1,tsType:{name:"union",raw:"'top' | 'bottom' | 'left' | 'right'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"",defaultValue:{value:"'bottom'",computed:!1}},visible:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ne=p.forwardRef(({icon:t,label:s,size:n="md",active:i=!1,shortcut:r,tooltipPosition:l="bottom",className:a="",...o},c)=>{const[R,d]=p.useState(!1),u=["ui-icon-button",n!=="md"&&`ui-icon-button--${n}`,i&&"ui-icon-button--active",a].filter(Boolean).join(" ");return e.jsxs("div",{className:"ui-tooltip-wrapper",onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[e.jsx("button",{ref:c,className:u,"aria-label":s,...o,children:t}),e.jsx(_e,{text:s,shortcut:r,position:l,visible:R&&!o.disabled})]})});Ne.displayName="IconButton";Ne.__docgenInfo={description:"",methods:[],displayName:"IconButton",props:{icon:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},active:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},shortcut:{required:!1,tsType:{name:"string"},description:""},tooltipPosition:{required:!1,tsType:{name:"union",raw:"'top' | 'bottom' | 'left' | 'right'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"",defaultValue:{value:"'bottom'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["ButtonHTMLAttributes"]};const Fe=p.createContext(null);function Pe({icon:t,children:s,shortcut:n,danger:i=!1,disabled:r=!1,onClick:l}){const a=p.useContext(Fe),o=()=>{r||(l==null||l(),a==null||a.close())};return e.jsxs("button",{className:`ui-context-menu-item ${i?"ui-context-menu-item--danger":""}`,role:"menuitem",disabled:r,onClick:o,children:[t&&e.jsx("span",{className:"ui-context-menu-item-icon",children:t}),e.jsx("span",{children:s}),n&&e.jsx("span",{className:"ui-context-menu-item-shortcut",children:n})]})}function Me(){return e.jsx("div",{className:"ui-context-menu-separator",role:"separator"})}Pe.__docgenInfo={description:"",methods:[],displayName:"ContextMenuItem",props:{icon:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},shortcut:{required:!1,tsType:{name:"string"},description:""},danger:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};Me.__docgenInfo={description:"",methods:[],displayName:"ContextMenuSeparator"};function w({text:t,size:s=14,className:n=""}){const[i,r]=p.useState(!1),l=p.useCallback(async()=>{try{await navigator.clipboard.writeText(t),r(!0),setTimeout(()=>r(!1),2e3)}catch(a){console.error("Failed to copy:",a)}},[t]);return e.jsx("button",{className:`ui-copy-button ${i?"ui-copy-button--copied":""} ${n}`,onClick:l,"aria-label":i?"Copied!":"Copy to clipboard",title:i?"Copied!":"Copy",children:i?e.jsx(Se,{size:s}):e.jsx(we,{size:s})})}w.__docgenInfo={description:"",methods:[],displayName:"CopyButton",props:{text:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"14",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const De={Read:{icon:e.jsx(Ee,{size:14}),label:"Reading file",color:"var(--accent-primary)"},Write:{icon:e.jsx(ze,{size:14}),label:"Creating file",color:"var(--status-success)"},Edit:{icon:e.jsx(q,{size:14}),label:"Applying changes",color:"var(--accent-secondary)"},Bash:{icon:e.jsx(be,{size:14}),label:"Running command",color:"var(--text-primary)"},Glob:{icon:e.jsx(q,{size:14}),label:"Searching project",color:"var(--accent-primary)"},Grep:{icon:e.jsx(q,{size:14}),label:"Searching project",color:"var(--accent-primary)"}};function Ve(t){return De[t]||{icon:e.jsx(be,{size:14}),label:"Executing tool",color:"var(--text-tertiary)"}}function z(t){return["Bash","Write","Edit"].includes(t)}function I({tool:t,onResolve:s}){const[n,i]=p.useState(!0),r=t.type==="tool_result",l=t.status==="pending_approval",{name:a,input:o}=t,c=Ve(a),R=(a==="Write"||a==="Edit")&&t.proposedContent!==void 0;if(r){const m=t.status==="error";return e.jsxs("div",{className:`tool-card tool-result animate-in ${m?"error":"success"}`,children:[e.jsxs("div",{className:"tool-card-header",children:[e.jsx("span",{className:"tool-icon",style:{color:m?"var(--status-error)":"var(--status-success)"},children:m?e.jsx(Re,{size:14}):e.jsx(k,{size:14})}),e.jsx("span",{className:"tool-label",children:m?"Tool Failed":"Action Complete"}),t.content&&e.jsx(w,{text:t.content,className:"tool-copy-btn"})]}),t.content&&typeof t.content=="string"&&e.jsx("div",{className:"tool-result-content",children:e.jsx("code",{children:t.content.length>300?`${t.content.slice(0,300)}...`:t.content})})]})}const d=(o==null?void 0:o.path)||(o==null?void 0:o.file_path),u=o==null?void 0:o.command,B=o==null?void 0:o.pattern;return e.jsxs("div",{className:`tool-card tool-call animate-in ${l?"pending":""}`,children:[e.jsxs("div",{className:"tool-card-header",children:[e.jsx("span",{className:"tool-icon",style:{color:c.color},children:c.icon}),e.jsx("span",{className:"tool-label",children:l?`Confirm ${a}`:c.label}),e.jsxs("div",{className:"tool-card-meta",children:[e.jsx("span",{className:"tool-name",children:a}),e.jsx("span",{className:`risk-tag risk-${z(a)?"high":"low"}`,children:z(a)?"High Risk":"Standard"})]})]}),o&&e.jsxs("div",{className:"tool-input-details",children:[d&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Path:"}),e.jsx("code",{children:d}),e.jsx(w,{text:d,size:12})]}),u&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Run:"}),e.jsx("code",{children:u}),e.jsx(w,{text:u,size:12})]}),B&&e.jsxs("div",{className:"detail-row",children:[e.jsx("strong",{children:"Pattern:"}),e.jsx("code",{children:B})]})]}),l&&R&&e.jsxs("div",{className:"tool-diff-section",children:[e.jsxs("button",{className:"diff-toggle-btn",onClick:()=>i(!n),children:[n?e.jsx(ke,{size:12}):e.jsx(qe,{size:12}),e.jsx("span",{children:n?"Hide Changes":"Show Changes"})]}),n&&e.jsx("div",{className:"tool-diff-preview",children:e.jsx(Ie,{oldCode:t.originalContent||"",newCode:t.proposedContent||"",filePath:t.filePath,maxHeight:250,showHeader:!1})})]}),l&&s&&t.id&&e.jsxs("div",{className:"tool-approval-actions",children:[e.jsxs("button",{className:"approve-btn",onClick:()=>s(t.id,!0),"aria-label":"Approve this action",children:[e.jsx(k,{size:14}),e.jsx("span",{children:"Approve"})]}),e.jsxs("button",{className:"deny-btn",onClick:()=>s(t.id,!1),"aria-label":"Deny this action",children:[e.jsx(E,{size:14}),e.jsx("span",{children:"Deny"})]})]}),t.status==="approved"&&e.jsxs("div",{className:"tool-status approved",children:[e.jsx(k,{size:12}),e.jsx("span",{children:"Approved"})]}),t.status==="denied"&&e.jsxs("div",{className:"tool-status denied",children:[e.jsx(E,{size:12}),e.jsx("span",{children:"Denied"})]})]})}I.__docgenInfo={description:"",methods:[],displayName:"ToolCard",props:{tool:{required:!0,tsType:{name:"ToolInfo"},description:""},onResolve:{required:!1,tsType:{name:"signature",type:"function",raw:"(toolId: string, approved: boolean) => void",signature:{arguments:[{type:{name:"string"},name:"toolId"},{type:{name:"boolean"},name:"approved"}],return:{name:"void"}}},description:""}}};const ct={title:"Chat/ToolCard",component:I,parameters:{layout:"centered"},tags:["autodocs"]},f={args:{tool:{type:"tool_use",name:"Read",input:{path:"/src/components/Button.tsx"}}}},h={args:{tool:{type:"tool_use",name:"Write",input:{file_path:"/src/components/NewComponent.tsx",content:"export function NewComponent() { return <div>Hello</div>; }"}}}},g={args:{tool:{type:"tool_use",name:"Edit",input:{file_path:"/src/App.tsx"}}}},x={args:{tool:{type:"tool_use",name:"Bash",input:{command:"npm install react-query"}}}},v={args:{tool:{type:"tool_use",name:"Glob",input:{pattern:"**/*.test.ts"}}}},y={args:{tool:{type:"tool_use",name:"Grep",input:{pattern:"useState",path:"/src"}}}},j={render:()=>{const[t,s]=p.useState({type:"tool_use",name:"Bash",id:"tool-123",status:"pending_approval",input:{command:"rm -rf dist && npm run build"}}),n=(i,r)=>{s({...t,status:r?"approved":"denied"})};return e.jsx(I,{tool:t,onResolve:n})}},b={render:()=>{const[t,s]=p.useState({type:"tool_use",name:"Edit",id:"tool-456",status:"pending_approval",input:{file_path:"/src/config.ts"},filePath:"/src/config.ts",originalContent:`export const config = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  retries: 3
};`,proposedContent:`export const config = {
  apiUrl: 'https://api.production.com',
  timeout: 10000,
  retries: 5,
  debug: true
};`}),n=(i,r)=>{s({...t,status:r?"approved":"denied"})};return e.jsx(I,{tool:t,onResolve:n})}},C={args:{tool:{type:"tool_result",name:"Read",status:"success",content:"export function Button() { return <button>Click me</button>; }"}}},T={args:{tool:{type:"tool_result",name:"Bash",status:"error",content:`Error: Command failed with exit code 1
sh: invalid-command: command not found`}}},_={args:{tool:{type:"tool_use",name:"Write",id:"tool-789",status:"approved",input:{file_path:"/src/components/NewFeature.tsx"}}}},N={args:{tool:{type:"tool_use",name:"Bash",id:"tool-101",status:"denied",input:{command:"rm -rf /"}}}},S={args:{tool:{type:"tool_result",name:"Grep",status:"success",content:`Found 45 matches:
src/components/App.tsx:12: import { useState } from 'react';
src/components/Form.tsx:8: const [name, setName] = useState('');
src/components/Counter.tsx:5: const [count, setCount] = useState(0);
src/hooks/useAuth.tsx:15: const [user, setUser] = useState(null);
src/hooks/useData.tsx:20: const [loading, setLoading] = useState(false);
... and 40 more matches`}}};var F,P,M;f.parameters={...f.parameters,docs:{...(F=f.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Read',
      input: {
        path: '/src/components/Button.tsx'
      }
    } as ToolInfo
  }
}`,...(M=(P=f.parameters)==null?void 0:P.docs)==null?void 0:M.source}}};var D,V,G;h.parameters={...h.parameters,docs:{...(D=h.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(G=(V=h.parameters)==null?void 0:V.docs)==null?void 0:G.source}}};var $,H,W;g.parameters={...g.parameters,docs:{...($=g.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Edit',
      input: {
        file_path: '/src/App.tsx'
      }
    } as ToolInfo
  }
}`,...(W=(H=g.parameters)==null?void 0:H.docs)==null?void 0:W.source}}};var L,U,O;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Bash',
      input: {
        command: 'npm install react-query'
      }
    } as ToolInfo
  }
}`,...(O=(U=x.parameters)==null?void 0:U.docs)==null?void 0:O.source}}};var K,Y,X;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_use',
      name: 'Glob',
      input: {
        pattern: '**/*.test.ts'
      }
    } as ToolInfo
  }
}`,...(X=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:X.source}}};var J,Q,Z;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Z=(Q=y.parameters)==null?void 0:Q.docs)==null?void 0:Z.source}}};var ee,te,oe;j.parameters={...j.parameters,docs:{...(ee=j.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(oe=(te=j.parameters)==null?void 0:te.docs)==null?void 0:oe.source}}};var se,ne,ae;b.parameters={...b.parameters,docs:{...(se=b.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(ae=(ne=b.parameters)==null?void 0:ne.docs)==null?void 0:ae.source}}};var re,ie,le;C.parameters={...C.parameters,docs:{...(re=C.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_result',
      name: 'Read',
      status: 'success',
      content: 'export function Button() { return <button>Click me</button>; }'
    } as ToolInfo
  }
}`,...(le=(ie=C.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var ce,pe,de;T.parameters={...T.parameters,docs:{...(ce=T.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    tool: {
      type: 'tool_result',
      name: 'Bash',
      status: 'error',
      content: 'Error: Command failed with exit code 1\\nsh: invalid-command: command not found'
    } as ToolInfo
  }
}`,...(de=(pe=T.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};var ue,me,fe;_.parameters={..._.parameters,docs:{...(ue=_.parameters)==null?void 0:ue.docs,source:{originalSource:`{
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
}`,...(fe=(me=_.parameters)==null?void 0:me.docs)==null?void 0:fe.source}}};var he,ge,xe;N.parameters={...N.parameters,docs:{...(he=N.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
}`,...(xe=(ge=N.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};var ve,ye,je;S.parameters={...S.parameters,docs:{...(ve=S.parameters)==null?void 0:ve.docs,source:{originalSource:`{
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
}`,...(je=(ye=S.parameters)==null?void 0:ye.docs)==null?void 0:je.source}}};const pt=["ReadFile","WriteFile","EditFile","BashCommand","GlobSearch","GrepSearch","PendingApproval","PendingWithDiff","SuccessResult","ErrorResult","Approved","Denied","LongContentResult"];export{_ as Approved,x as BashCommand,N as Denied,g as EditFile,T as ErrorResult,v as GlobSearch,y as GrepSearch,S as LongContentResult,j as PendingApproval,b as PendingWithDiff,f as ReadFile,C as SuccessResult,h as WriteFile,pt as __namedExportsOrder,ct as default};
