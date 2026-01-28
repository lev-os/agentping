import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as i}from"./index-BNURykns.js";import{Z as U}from"./zap--N__6G4c.js";import{c as G}from"./createLucideIcon-e4Yg_r7P.js";import{T as Y}from"./triangle-alert-Dqss0hRc.js";import{C as ee}from"./circle-x-BZUptzyg.js";import{C as te}from"./circle-check-big-DdlYkAcn.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],ae=G("funnel",se);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],Z=G("message-square",ne),X={success:e.jsx(te,{size:14}),error:e.jsx(ee,{size:14}),warning:e.jsx(Y,{size:14}),message:e.jsx(Z,{size:14}),task:e.jsx(U,{size:14})};function D(t){const o=new Date().getTime()-t.getTime(),n=Math.floor(o/1e3),r=Math.floor(n/60),c=Math.floor(r/60);return n<10?"just now":n<60?`${n}s ago`:r<60?`${r}m ago`:c<24?`${c}h ago`:t.toLocaleDateString()}function E({events:t=[],maxEvents:s=50,autoScroll:o=!0,showFilter:n=!0,className:r=""}){const[c,J]=i.useState(new Set(["success","error","warning","message","task"])),[x,K]=i.useState(!1),m=i.useRef(null),j=i.useRef(t.length);i.useEffect(()=>{o&&m.current&&t.length>j.current&&(m.current.scrollTop=m.current.scrollHeight),j.current=t.length},[t,o]);const Q=a=>{J(k=>{const l=new Set(k);return l.has(a)?l.delete(a):l.add(a),l})},d=t.filter(a=>c.has(a.type)).slice(-s);return e.jsxs("div",{className:`audit-feed ${r}`,children:[e.jsxs("div",{className:"feed-header",children:[e.jsxs("div",{className:"feed-title",children:[e.jsx(U,{size:16}),e.jsx("span",{children:"Activity Stream"}),e.jsx("span",{className:"event-count",children:d.length})]}),n&&e.jsxs("div",{className:"feed-filter",children:[e.jsx("button",{className:`filter-toggle ${x?"active":""}`,onClick:()=>K(!x),title:"Filter events",children:e.jsx(ae,{size:14})}),x&&e.jsx("div",{className:"filter-dropdown",children:["success","error","warning","message","task"].map(a=>e.jsxs("label",{className:"filter-option",children:[e.jsx("input",{type:"checkbox",checked:c.has(a),onChange:()=>Q(a)}),e.jsx("span",{className:`filter-icon ${a}`,children:X[a]}),e.jsx("span",{className:"filter-label",children:a})]},a))})]})]}),e.jsx("div",{className:"feed-events",ref:m,children:d.length===0?e.jsxs("div",{className:"feed-empty",children:[e.jsx(Z,{size:32,opacity:.3}),e.jsx("p",{children:"No events to display"})]}):d.map((a,k)=>e.jsx(re,{event:a,isNew:k===d.length-1&&t.length>j.current},a.id))})]})}function re({event:t,isNew:s}){const[o,n]=i.useState(D(t.timestamp));return i.useEffect(()=>{const r=setInterval(()=>{n(D(t.timestamp))},3e4);return()=>clearInterval(r)},[t.timestamp]),e.jsxs("div",{className:`event-item ${t.type} ${s?"new":""}`,children:[e.jsx("div",{className:"event-icon",children:X[t.type]}),e.jsxs("div",{className:"event-content",children:[e.jsx("div",{className:"event-message",children:t.message}),e.jsxs("div",{className:"event-meta",children:[e.jsx("span",{className:"event-time",title:t.timestamp.toLocaleString(),children:o}),t.metadata&&Object.keys(t.metadata).length>0&&e.jsx("span",{className:"event-metadata",children:Object.entries(t.metadata).map(([r,c])=>e.jsxs("span",{className:"meta-item",children:[r,": ",String(c)]},r))})]})]})]})}E.__docgenInfo={description:"",methods:[],displayName:"AuditFeed",props:{events:{required:!1,tsType:{name:"Array",elements:[{name:"AuditEvent"}],raw:"AuditEvent[]"},description:"",defaultValue:{value:"[]",computed:!1}},maxEvents:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"50",computed:!1}},autoScroll:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showFilter:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const pe={title:"Components/AuditFeed",component:E,parameters:{layout:"padded"},tags:["autodocs"],decorators:[t=>e.jsx("div",{style:{width:"400px",height:"600px"},children:e.jsx(t,{})})]},y=[{id:"1",timestamp:new Date(Date.now()-3e5),type:"task",message:"Agent Alpha started task: Refactor authentication module",metadata:{agent:"alpha",taskId:"task-123"}},{id:"2",timestamp:new Date(Date.now()-24e4),type:"success",message:"File locked successfully: src/auth/login.ts",metadata:{file:"login.ts",agent:"alpha"}},{id:"3",timestamp:new Date(Date.now()-18e4),type:"message",message:"Agent Alpha: Found 3 security vulnerabilities in auth flow"},{id:"4",timestamp:new Date(Date.now()-12e4),type:"warning",message:"Merge conflict detected in src/auth/middleware.ts",metadata:{severity:"medium"}},{id:"5",timestamp:new Date(Date.now()-6e4),type:"error",message:"Failed to acquire lock on src/auth/session.ts - locked by Agent Beta",metadata:{agent:"beta",file:"session.ts"}},{id:"6",timestamp:new Date(Date.now()-3e4),type:"success",message:"Task completed: Authentication refactor ready for review",metadata:{agent:"alpha",duration:"4m 30s"}},{id:"7",timestamp:new Date(Date.now()-5e3),type:"task",message:"Agent Beta started task: Update session management",metadata:{agent:"beta",taskId:"task-124"}}],u={args:{events:[],showFilter:!0}},p={args:{events:y,showFilter:!0,autoScroll:!0}},g={args:{events:[{id:"1",timestamp:new Date(Date.now()-12e4),type:"error",message:"Network request failed: Connection timeout",metadata:{endpoint:"/api/tasks"}},{id:"2",timestamp:new Date(Date.now()-9e4),type:"warning",message:"High memory usage detected: 85% of available RAM"},{id:"3",timestamp:new Date(Date.now()-6e4),type:"error",message:"File system error: Permission denied on /tmp/workspace",metadata:{code:"EACCES"}},{id:"4",timestamp:new Date(Date.now()-3e4),type:"warning",message:"API rate limit approaching: 95/100 requests used"}],showFilter:!0}},h={args:{events:Array.from({length:50},(t,s)=>({id:`event-${s}`,timestamp:new Date(Date.now()-(50-s)*1e4),type:["success","error","warning","message","task"][s%5],message:`Event ${s+1}: ${["Task completed","Error occurred","Warning detected","Message received","Task started"][s%5]}`,metadata:{index:s+1}})),showFilter:!0,maxEvents:50}},f={args:{events:y,showFilter:!1}},v={render:t=>{const[s,o]=i.useState(y);return i.useEffect(()=>{const n=setInterval(()=>{const r={id:`event-${Date.now()}`,timestamp:new Date,type:["success","error","warning","message","task"][Math.floor(Math.random()*5)],message:["New task assigned to Agent Gamma","File modification detected","Memory checkpoint created","Network connection restored","Cache invalidated"][Math.floor(Math.random()*5)],metadata:{agent:["alpha","beta","gamma"][Math.floor(Math.random()*3)]}};o(c=>[...c,r])},3e3);return()=>clearInterval(n)},[]),e.jsx(E,{...t,events:s})},args:{showFilter:!0,autoScroll:!0}},w={render:t=>{const[s,o]=i.useState([]);return i.useEffect(()=>{const n=setTimeout(()=>{o(y)},2e3);return()=>clearTimeout(n)},[]),e.jsx(E,{...t,events:s})},args:{showFilter:!0}};var A,F,N;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    events: [],
    showFilter: true
  }
}`,...(N=(F=u.parameters)==null?void 0:F.docs)==null?void 0:N.source}}};var M,S,T;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showFilter: true,
    autoScroll: true
  }
}`,...(T=(S=p.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var b,$,C;g.parameters={...g.parameters,docs:{...(b=g.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    events: [{
      id: '1',
      timestamp: new Date(Date.now() - 120000),
      type: 'error',
      message: 'Network request failed: Connection timeout',
      metadata: {
        endpoint: '/api/tasks'
      }
    }, {
      id: '2',
      timestamp: new Date(Date.now() - 90000),
      type: 'warning',
      message: 'High memory usage detected: 85% of available RAM'
    }, {
      id: '3',
      timestamp: new Date(Date.now() - 60000),
      type: 'error',
      message: 'File system error: Permission denied on /tmp/workspace',
      metadata: {
        code: 'EACCES'
      }
    }, {
      id: '4',
      timestamp: new Date(Date.now() - 30000),
      type: 'warning',
      message: 'API rate limit approaching: 95/100 requests used'
    }],
    showFilter: true
  }
}`,...(C=($=g.parameters)==null?void 0:$.docs)==null?void 0:C.source}}};var I,q,z;h.parameters={...h.parameters,docs:{...(I=h.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    events: Array.from({
      length: 50
    }, (_, i) => ({
      id: \`event-\${i}\`,
      timestamp: new Date(Date.now() - (50 - i) * 10000),
      type: ['success', 'error', 'warning', 'message', 'task'][i % 5] as AuditEvent['type'],
      message: \`Event \${i + 1}: \${['Task completed', 'Error occurred', 'Warning detected', 'Message received', 'Task started'][i % 5]}\`,
      metadata: {
        index: i + 1
      }
    })),
    showFilter: true,
    maxEvents: 50
  }
}`,...(z=(q=h.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var _,L,R;f.parameters={...f.parameters,docs:{...(_=f.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    events: sampleEvents,
    showFilter: false
  }
}`,...(R=(L=f.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var O,H,V;v.parameters={...v.parameters,docs:{...(O=v.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: args => {
    const [events, setEvents] = useState<AuditEvent[]>(sampleEvents);
    useEffect(() => {
      const interval = setInterval(() => {
        const newEvent: AuditEvent = {
          id: \`event-\${Date.now()}\`,
          timestamp: new Date(),
          type: ['success', 'error', 'warning', 'message', 'task'][Math.floor(Math.random() * 5)] as AuditEvent['type'],
          message: ['New task assigned to Agent Gamma', 'File modification detected', 'Memory checkpoint created', 'Network connection restored', 'Cache invalidated'][Math.floor(Math.random() * 5)],
          metadata: {
            agent: ['alpha', 'beta', 'gamma'][Math.floor(Math.random() * 3)]
          }
        };
        setEvents(prev => [...prev, newEvent]);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
    return <AuditFeed {...args} events={events} />;
  },
  args: {
    showFilter: true,
    autoScroll: true
  }
}`,...(V=(H=v.parameters)==null?void 0:H.docs)==null?void 0:V.source}}};var P,W,B;w.parameters={...w.parameters,docs:{...(P=w.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => {
    const [events, setEvents] = useState<AuditEvent[]>([]);
    useEffect(() => {
      const timer = setTimeout(() => {
        setEvents(sampleEvents);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
    return <AuditFeed {...args} events={events} />;
  },
  args: {
    showFilter: true
  }
}`,...(B=(W=w.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};const ge=["Empty","WithEvents","ErrorsOnly","ManyEvents","NoFilter","LiveUpdates","Loading"];export{u as Empty,g as ErrorsOnly,v as LiveUpdates,w as Loading,h as ManyEvents,f as NoFilter,p as WithEvents,ge as __namedExportsOrder,pe as default};
