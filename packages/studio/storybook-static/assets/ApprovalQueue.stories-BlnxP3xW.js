import{j as s}from"./jsx-runtime-BjG_zV1W.js";import{r as d}from"./index-BNURykns.js";import{C as me,T as he}from"./CodeDiffViewer-Byg8_5oh.js";import{C as ue}from"./circle-check-big-DdlYkAcn.js";import{X as ie}from"./x-BAbVpizD.js";import{C as de}from"./chevron-up-C3WeIuvy.js";import{C as ve}from"./chevron-down-Dx1Dkz5T.js";import{c as ge}from"./createLucideIcon-e4Yg_r7P.js";import{F as fe}from"./file-text-7SLw8HbY.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M9 15h6",key:"cctwl0"}],["path",{d:"M12 18v-6",key:"17g6i2"}]],ye=ge("file-plus",we);function P({sessionId:e}){const[a,r]=d.useState([]),[c,u]=d.useState(!0),[l,t]=d.useState(new Set);d.useEffect(()=>{if(!e||!window.claudeCode)return;window.claudeCode.getApprovalQueue(e).then(o=>{r(o),o.length>0&&t(new Set([o[0].toolCallId]))});const n=window.claudeCode.onApprovalQueued(({sessionId:o,request:A})=>{o===e&&(r(i=>[...i,A]),t(i=>new Set([...i,A.toolCallId])))}),p=window.claudeCode.onApprovalResolved(({sessionId:o,toolId:A})=>{o===e&&(r(i=>i.filter(g=>g.toolCallId!==A)),t(i=>{const g=new Set(i);return g.delete(A),g}))});return()=>{n(),p()}},[e]);const m=async n=>{e&&await window.claudeCode.resolveApproval(e,n,!0)},R=async n=>{e&&await window.claudeCode.resolveApproval(e,n,!1)},S=async()=>{e&&await window.claudeCode.resolveAllApprovals(e,!0)},q=async()=>{e&&await window.claudeCode.resolveAllApprovals(e,!1)},h=n=>{t(p=>{const o=new Set(p);return o.has(n)?o.delete(n):o.add(n),o})};return a.length===0?null:s.jsxs("div",{className:"approval-queue",children:[s.jsxs("div",{className:"queue-header",onClick:()=>u(!c),children:[s.jsxs("div",{className:"queue-title",children:[s.jsx("span",{className:"queue-count",children:a.length}),s.jsxs("span",{children:["Pending Approval",a.length!==1?"s":""]})]}),s.jsxs("div",{className:"queue-batch-actions",onClick:n=>n.stopPropagation(),children:[s.jsxs("button",{className:"batch-approve-btn",onClick:S,title:"Accept all pending changes",children:[s.jsx(ue,{size:14}),s.jsx("span",{children:"Accept All"})]}),s.jsxs("button",{className:"batch-deny-btn",onClick:q,title:"Reject all pending changes",children:[s.jsx(ie,{size:14}),s.jsx("span",{children:"Reject All"})]})]}),s.jsx("button",{className:"expand-toggle",children:c?s.jsx(de,{size:16}):s.jsx(ve,{size:16})})]}),c&&s.jsx("div",{className:"queue-items",children:a.map(n=>s.jsx(Ce,{item:n,isExpanded:l.has(n.toolCallId),onToggle:()=>h(n.toolCallId),onApprove:()=>m(n.toolCallId),onDeny:()=>R(n.toolCallId)},n.toolCallId))})]})}function Ce({item:e,isExpanded:a,onToggle:r,onApprove:c,onDeny:u}){var h,n;const l=e.name==="Write"||e.name==="Edit",t=e.name==="Bash",m=l&&!e.originalContent,R=()=>m?s.jsx(ye,{size:14}):l?s.jsx(fe,{size:14}):s.jsx(he,{size:14}),S=()=>e.name==="Write"?m?"Create":"Write":e.name==="Edit"?"Edit":e.name,q=()=>{var p;if(e.filePath)return e.filePath.split("/").pop()||e.filePath;if((p=e.input)!=null&&p.command){const o=e.input.command;return o.length>50?o.slice(0,47)+"...":o}return"Unknown"};return s.jsxs("div",{className:`queue-item ${a?"expanded":""}`,children:[s.jsxs("div",{className:"queue-item-header",onClick:r,children:[s.jsx("span",{className:`item-icon ${e.name.toLowerCase()}`,children:R()}),s.jsx("span",{className:"item-label",children:S()}),s.jsx("span",{className:"item-path",title:e.filePath||((h=e.input)==null?void 0:h.command),children:q()}),s.jsxs("div",{className:"item-actions",onClick:p=>p.stopPropagation(),children:[s.jsx("button",{className:"item-approve",onClick:c,title:"Accept this change",children:s.jsx(ue,{size:14})}),s.jsx("button",{className:"item-deny",onClick:u,title:"Reject this change",children:s.jsx(ie,{size:14})})]}),s.jsx("span",{className:"item-expand-icon",children:a?s.jsx(de,{size:14}):s.jsx(ve,{size:14})})]}),a&&l&&s.jsx("div",{className:"queue-item-diff",children:s.jsx(me,{oldCode:e.originalContent||"",newCode:e.proposedContent||"",filePath:e.filePath,maxHeight:300,showHeader:!1})}),a&&t&&s.jsx("div",{className:"queue-item-command",children:s.jsx("pre",{children:s.jsxs("code",{children:["$ ",(n=e.input)==null?void 0:n.command]})})})]})}P.__docgenInfo={description:"",methods:[],displayName:"ApprovalQueue",props:{sessionId:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""}}};const Se={title:"Components/ApprovalQueue",component:P,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[e=>s.jsx("div",{style:{width:"100vw",height:"100vh",background:"#0a0a0a",position:"relative"},children:s.jsx(e,{})})]},b={toolCallId:"write-1",name:"Write",input:{file_path:"/src/components/Button.tsx",content:"export const Button = ..."},filePath:"/src/components/Button.tsx",proposedContent:`export const Button = () => {
  return <button>Click me</button>;
};`,timestamp:new Date},v={toolCallId:"edit-1",name:"Edit",input:{file_path:"/src/utils/helpers.ts",old_string:"old code",new_string:"new code"},filePath:"/src/utils/helpers.ts",originalContent:`function helper() {
  // old code
  return false;
}`,proposedContent:`function helper() {
  // new code
  return true;
}`,timestamp:new Date},N={toolCallId:"bash-1",name:"Bash",input:{command:"rm -rf /tmp/cache && mkdir -p /tmp/cache"},timestamp:new Date},Ae={toolCallId:"write-2",name:"Write",input:{file_path:"/src/config/settings.json",content:'{"theme": "dark"}'},filePath:"/src/config/settings.json",proposedContent:`{
  "theme": "dark",
  "language": "en"
}`,timestamp:new Date},f={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{}}}},w={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[b],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},y={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[v],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},C={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[N],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},x={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[Ae],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},Q={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[b,v,N,Ae],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},j={args:{sessionId:"session-1"},beforeEach:()=>{const e=Array.from({length:10},(a,r)=>({...v,toolCallId:`edit-${r}`,filePath:`/src/components/Component${r}.tsx`}));window.claudeCode={getApprovalQueue:async()=>e,onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},I={render:e=>{const[a,r]=d.useState([b,v]);return d.useEffect(()=>{window.claudeCode={getApprovalQueue:async()=>a,onApprovalQueued:c=>{const u=setTimeout(()=>{const l={...N,toolCallId:`bash-${Date.now()}`};c({sessionId:e.sessionId,request:l}),r(t=>[...t,l])},3e3);return()=>clearTimeout(u)},onApprovalResolved:()=>()=>{},resolveApproval:async(c,u)=>(r(l=>l.filter(t=>t.toolCallId!==u)),{success:!0}),resolveAllApprovals:async()=>(r([]),{success:!0})}},[a,e.sessionId]),s.jsx(P,{...e})},args:{sessionId:"session-1"}},E={args:{sessionId:"session-1"},beforeEach:()=>{window.claudeCode={getApprovalQueue:async()=>[b,v,N],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}},k={args:{sessionId:"session-1"},beforeEach:()=>{const e={...v,toolCallId:"large-edit",originalContent:Array(50).fill("  // Line of old code").join(`
`),proposedContent:Array(50).fill("  // Line of new code").join(`
`)};window.claudeCode={getApprovalQueue:async()=>[e],onApprovalQueued:()=>()=>{},onApprovalResolved:()=>()=>{},resolveApproval:async()=>({success:!0}),resolveAllApprovals:async()=>({success:!0})}}};var B,z,D;f.parameters={...f.parameters,docs:{...(B=f.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    // Mock empty queue
    window.claudeCode = {
      getApprovalQueue: async () => [],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {}
    } as any;
  }
}`,...(D=(z=f.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var _,W,F;w.parameters={...w.parameters,docs:{...(_=w.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockWriteApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(F=(W=w.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};var L,M,T;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockEditApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(T=(M=y.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var $,H,U;C.parameters={...C.parameters,docs:{...($=C.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockBashApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(U=(H=C.parameters)==null?void 0:H.docs)==null?void 0:U.source}}};var V,O,X;x.parameters={...x.parameters,docs:{...(V=x.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockNewFileApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(X=(O=x.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};var G,J,K;Q.parameters={...Q.parameters,docs:{...(G=Q.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockWriteApproval, mockEditApproval, mockBashApproval, mockNewFileApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(K=(J=Q.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Y,Z,ee;j.parameters={...j.parameters,docs:{...(Y=j.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    const manyApprovals = Array.from({
      length: 10
    }, (_, i) => ({
      ...mockEditApproval,
      toolCallId: \`edit-\${i}\`,
      filePath: \`/src/components/Component\${i}.tsx\`
    }));
    window.claudeCode = {
      getApprovalQueue: async () => manyApprovals,
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(ee=(Z=j.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,ne,oe;I.parameters={...I.parameters,docs:{...(se=I.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: args => {
    const [queue, setQueue] = useState<ApprovalRequest[]>([mockWriteApproval, mockEditApproval]);
    useEffect(() => {
      window.claudeCode = {
        getApprovalQueue: async () => queue,
        onApprovalQueued: (callback: any) => {
          // Simulate new approval after 3 seconds
          const timer = setTimeout(() => {
            const newApproval = {
              ...mockBashApproval,
              toolCallId: \`bash-\${Date.now()}\`
            };
            callback({
              sessionId: args.sessionId,
              request: newApproval
            });
            setQueue(prev => [...prev, newApproval]);
          }, 3000);
          return () => clearTimeout(timer);
        },
        onApprovalResolved: () => () => {},
        resolveApproval: async (sessionId: string, toolId: string) => {
          setQueue(prev => prev.filter(r => r.toolCallId !== toolId));
          return {
            success: true
          };
        },
        resolveAllApprovals: async () => {
          setQueue([]);
          return {
            success: true
          };
        }
      } as any;
    }, [queue, args.sessionId]);
    return <ApprovalQueue {...args} />;
  },
  args: {
    sessionId: 'session-1'
  }
}`,...(oe=(ne=I.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var ae,re,le;E.parameters={...E.parameters,docs:{...(ae=E.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    window.claudeCode = {
      getApprovalQueue: async () => [mockWriteApproval, mockEditApproval, mockBashApproval],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(le=(re=E.parameters)==null?void 0:re.docs)==null?void 0:le.source}}};var te,ce,pe;k.parameters={...k.parameters,docs:{...(te=k.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    sessionId: 'session-1'
  },
  beforeEach: () => {
    const largeEdit: ApprovalRequest = {
      ...mockEditApproval,
      toolCallId: 'large-edit',
      originalContent: Array(50).fill('  // Line of old code').join('\\n'),
      proposedContent: Array(50).fill('  // Line of new code').join('\\n')
    };
    window.claudeCode = {
      getApprovalQueue: async () => [largeEdit],
      onApprovalQueued: () => () => {},
      onApprovalResolved: () => () => {},
      resolveApproval: async () => ({
        success: true
      }),
      resolveAllApprovals: async () => ({
        success: true
      })
    } as any;
  }
}`,...(pe=(ce=k.parameters)==null?void 0:ce.docs)==null?void 0:pe.source}}};const qe=["Empty","SingleWrite","SingleEdit","SingleBash","NewFile","MultipleApprovals","ManyApprovals","Interactive","Collapsed","LargeDiff"];export{E as Collapsed,f as Empty,I as Interactive,k as LargeDiff,j as ManyApprovals,Q as MultipleApprovals,x as NewFile,C as SingleBash,y as SingleEdit,w as SingleWrite,qe as __namedExportsOrder,Se as default};
