import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as t}from"./index-BNURykns.js";import{c as T}from"./createLucideIcon-e4Yg_r7P.js";import{S as Se}from"./sparkles-BzTtEY93.js";import{X as ve}from"./x-BAbVpizD.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]],ye=T("mic-off",xe);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]],I=T("mic",je);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],we=T("send",ke),Oe=["Show agent status","List active tasks","Clear file locks","Sync workspace","Open diagnostics","Show recent logs"];function E({isOpen:n=!1,onToggle:i,onCommand:a,presetCommands:b=Oe,isListening:d=!1,transcript:c="",response:m="",className:l=""}){const[o,p]=t.useState(n),[u,V]=t.useState(""),N=t.useRef(null);t.useEffect(()=>{p(n)},[n]),t.useEffect(()=>{const s=r=>{r.ctrlKey&&r.shiftKey&&r.key==="V"&&(r.preventDefault(),g())};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[]),t.useEffect(()=>{if(!o)return;const s=r=>{N.current&&!N.current.contains(r.target)&&g()};return setTimeout(()=>{document.addEventListener("mousedown",s)},100),()=>document.removeEventListener("mousedown",s)},[o]);const g=()=>{p(!o),i==null||i()},he=s=>{a==null||a(s)},fe=s=>{s.preventDefault(),u.trim()&&(a==null||a(u.trim()),V(""))};return o?e.jsxs("div",{ref:N,className:`voice-console ${l}`,children:[e.jsxs("div",{className:"console-header",children:[e.jsxs("div",{className:"console-title",children:[e.jsx(Se,{size:16}),e.jsx("span",{children:"Voice Console"})]}),e.jsx("button",{className:"console-close",onClick:g,title:"Close (Ctrl+Shift+V)",children:e.jsx(ve,{size:16})})]}),e.jsxs("div",{className:"console-body",children:[e.jsx("div",{className:`voice-indicator ${d?"listening":""}`,children:d?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"listening-animation",children:[e.jsx("span",{className:"pulse"}),e.jsx("span",{className:"pulse"}),e.jsx("span",{className:"pulse"})]}),e.jsx(ye,{size:20}),e.jsx("span",{children:"Listening..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(I,{size:20}),e.jsx("span",{children:"Ready"})]})}),c&&e.jsxs("div",{className:"transcript-display",children:[e.jsx("label",{children:"You said:"}),e.jsx("p",{children:c})]}),m&&e.jsxs("div",{className:"response-display",children:[e.jsx("label",{children:"Response:"}),e.jsx("p",{children:m})]}),e.jsxs("div",{className:"preset-commands",children:[e.jsx("label",{children:"Quick Commands"}),e.jsx("div",{className:"command-chips",children:b.map((s,r)=>e.jsx("button",{className:"command-chip",onClick:()=>he(s),children:s},r))})]}),e.jsxs("form",{className:"text-input-form",onSubmit:fe,children:[e.jsx("input",{type:"text",className:"text-input",placeholder:"Type a command...",value:u,onChange:s=>V(s.target.value)}),e.jsx("button",{type:"submit",className:"submit-btn",disabled:!u.trim(),children:e.jsx(we,{size:16})})]}),e.jsxs("div",{className:"keyboard-hint",children:[e.jsx("kbd",{children:"Ctrl"})," + ",e.jsx("kbd",{children:"Shift"})," + ",e.jsx("kbd",{children:"V"})," to toggle"]})]})]}):e.jsx("button",{className:`voice-console-trigger ${l}`,onClick:g,title:"Voice Console (Ctrl+Shift+V)",children:e.jsx(I,{size:20})})}E.__docgenInfo={description:"",methods:[],displayName:"VoiceConsole",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onToggle:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onCommand:{required:!1,tsType:{name:"signature",type:"function",raw:"(command: string) => void",signature:{arguments:[{type:{name:"string"},name:"command"}],return:{name:"void"}}},description:""},presetCommands:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:`[
    'Show agent status',
    'List active tasks',
    'Clear file locks',
    'Sync workspace',
    'Open diagnostics',
    'Show recent logs',
]`,computed:!1}},isListening:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},transcript:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},response:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const Ee={title:"Components/VoiceConsole",component:E,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[n=>e.jsx("div",{style:{width:"100vw",height:"100vh",background:"#0a0a0a",position:"relative"},children:e.jsx(n,{})})]},h={args:{isOpen:!1}},f={args:{isOpen:!0,presetCommands:["Show agent status","List active tasks","Clear file locks","Sync workspace","Open diagnostics","Show recent logs"]}},S={args:{isOpen:!0,isListening:!0}},v={args:{isOpen:!0,transcript:"Show me the status of all active agents"}},x={args:{isOpen:!0,transcript:"Show me the status of all active agents",response:"Found 3 active agents: Alpha (working), Beta (idle), Gamma (error state)"}},y={args:{isOpen:!0,isListening:!0,transcript:"Show me the"}},j={args:{isOpen:!0,presetCommands:["Deploy to production","Run all tests","Generate report","Backup database","Scale to 10 instances"]}},k={render:()=>{const[n,i]=t.useState(!1),[a,b]=t.useState(!1),[d,c]=t.useState(""),[m,l]=t.useState(""),o=p=>{c(p),b(!1),setTimeout(()=>{l(`Processing command: "${p}"`),setTimeout(()=>{c(""),l("")},5e3)},500)};return e.jsx(E,{isOpen:n,onToggle:()=>i(!n),onCommand:o,isListening:a,transcript:d,response:m})}},w={args:{isOpen:!0,presetCommands:["Show help","List commands"]}},O={args:{isOpen:!0,transcript:"Invalid command xyz",response:'Error: Command not recognized. Type "help" for available commands.'}},C={args:{isOpen:!0,transcript:"Clear all file locks",response:"Success: Cleared 5 file locks across 3 agents."}},L={args:{isOpen:!0,presetCommands:[]}};var R,z,_;h.parameters={...h.parameters,docs:{...(R=h.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    isOpen: false
  }
}`,...(_=(z=h.parameters)==null?void 0:z.docs)==null?void 0:_.source}}};var M,q,P;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    presetCommands: ['Show agent status', 'List active tasks', 'Clear file locks', 'Sync workspace', 'Open diagnostics', 'Show recent logs']
  }
}`,...(P=(q=f.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var $,A,D;S.parameters={...S.parameters,docs:{...($=S.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    isListening: true
  }
}`,...(D=(A=S.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var W,F,K;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    transcript: 'Show me the status of all active agents'
  }
}`,...(K=(F=v.parameters)==null?void 0:F.docs)==null?void 0:K.source}}};var B,G,H;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    transcript: 'Show me the status of all active agents',
    response: 'Found 3 active agents: Alpha (working), Beta (idle), Gamma (error state)'
  }
}`,...(H=(G=x.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var Q,U,X;y.parameters={...y.parameters,docs:{...(Q=y.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    isListening: true,
    transcript: 'Show me the'
  }
}`,...(X=(U=y.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,J,Z;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    presetCommands: ['Deploy to production', 'Run all tests', 'Generate report', 'Backup database', 'Scale to 10 instances']
  }
}`,...(Z=(J=j.parameters)==null?void 0:J.docs)==null?void 0:Z.source}}};var ee,se,te;k.parameters={...k.parameters,docs:{...(ee=k.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const handleCommand = (command: string) => {
      setTranscript(command);
      setIsListening(false);

      // Simulate processing
      setTimeout(() => {
        setResponse(\`Processing command: "\${command}"\`);

        // Clear after 5 seconds
        setTimeout(() => {
          setTranscript('');
          setResponse('');
        }, 5000);
      }, 500);
    };
    return <VoiceConsole isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} onCommand={handleCommand} isListening={isListening} transcript={transcript} response={response} />;
  }
}`,...(te=(se=k.parameters)==null?void 0:se.docs)==null?void 0:te.source}}};var ne,ae,re;w.parameters={...w.parameters,docs:{...(ne=w.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    presetCommands: ['Show help', 'List commands']
  }
}`,...(re=(ae=w.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var oe,ie,ce;O.parameters={...O.parameters,docs:{...(oe=O.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    transcript: 'Invalid command xyz',
    response: 'Error: Command not recognized. Type "help" for available commands.'
  }
}`,...(ce=(ie=O.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var le,pe,de;C.parameters={...C.parameters,docs:{...(le=C.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    transcript: 'Clear all file locks',
    response: 'Success: Cleared 5 file locks across 3 agents.'
  }
}`,...(de=(pe=C.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};var me,ue,ge;L.parameters={...L.parameters,docs:{...(me=L.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    presetCommands: []
  }
}`,...(ge=(ue=L.parameters)==null?void 0:ue.docs)==null?void 0:ge.source}}};const Ve=["Closed","Open","Listening","WithTranscript","WithResponse","LiveListening","CustomPresets","Interactive","WithKeyboardHint","ErrorState","SuccessState","NoPresets"];export{h as Closed,j as CustomPresets,O as ErrorState,k as Interactive,S as Listening,y as LiveListening,L as NoPresets,f as Open,C as SuccessState,w as WithKeyboardHint,x as WithResponse,v as WithTranscript,Ve as __namedExportsOrder,Ee as default};
