import{j as e,r as w}from"./iframe-rZoXeK5l.js";import{c as x}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const j=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},l=n=>typeof n=="string"?n:void 0,v=n=>Array.isArray(n)?n.filter(o=>typeof o=="string"):void 0,_=n=>{if(!Array.isArray(n))return[];const o=[];for(const p of n){const t=j(p),c=l(t.id),s=l(t.title),a=l(t.column);if(!c||!s||!a)continue;const i={id:c,title:s,column:a},m=l(t.priority);(m==="P0"||m==="P1"||m==="P2"||m==="P3")&&(i.priority=m);const d=l(t.type);d&&(i.type=d);const r=v(t.blockedBy);r&&(i.blockedBy=r);const g=v(t.blocks);g&&(i.blocks=g);const y=l(t.description);y&&(i.description=y);const u=l(t.owner);u&&(i.owner=u),o.push(i)}return o},I=n=>{if(!Array.isArray(n))return[];const o=[];for(const p of n){const t=j(p),c=l(t.id),s=l(t.text);if(!c||!s)continue;const a={id:c,text:s};typeof t.checked=="boolean"&&(a.checked=t.checked);const i=l(t.priority);i&&(a.priority=i),o.push(a)}return o},S=n=>n.variant?.toLowerCase()??n.widgetId.toLowerCase();function k({payload:n,onRespond:o,className:p}){if(n.action==="selection")return e.jsxs("div",{className:x("rounded-xl border border-gray-800 backdrop-blur-md p-4 space-y-3",p),children:[e.jsx("p",{className:"font-mono text-sm text-[var(--warning)]",children:"Canvas selection requested."}),e.jsx("p",{className:"text-sm text-gray-300",children:n.instruction??"Select an object on the canvas."}),e.jsx("button",{type:"button",className:"rounded-md border border-[var(--primary)]/40 px-3 py-1.5 text-xs font-mono text-[var(--primary)] hover:bg-[var(--primary)]/10",onClick:()=>o({action:"selection_acknowledged",selectionType:n.selectionType??"object"}),children:"Acknowledge"})]});const{componentType:t,props:c}=n;if(t!=="sofia-widget"||c.provider!=="sofia")return e.jsxs("div",{className:x("rounded-xl border border-gray-800 backdrop-blur-md p-4",p),children:[e.jsx("p",{className:"font-mono text-sm text-[var(--warning)] mb-2",children:"Invalid Sofia payload contract."}),e.jsx("pre",{className:"font-mono text-xs text-gray-500 whitespace-pre-wrap break-all",children:JSON.stringify(n,null,2)})]});const s=S(c),a=j(c.data);return s==="kanban"||s==="bd-dashboard"?e.jsx(C,{columns:v(a.columns),cards:_(a.cards),onRespond:o}):s==="todo"||s==="todo-list"||s==="todolist"?e.jsx(R,{title:l(a.title),items:I(a.items),onRespond:o}):s==="markdown"||s==="markdown-card"?e.jsx(A,{title:l(a.title),content:l(a.content)}):e.jsxs("div",{className:x("rounded-xl border border-gray-800 backdrop-blur-md p-4",p),children:[e.jsxs("p",{className:"font-mono text-sm text-[var(--accent)] mb-2",children:["Sofia widget: ",c.widgetId]}),e.jsx("pre",{className:"font-mono text-xs text-gray-500 whitespace-pre-wrap break-all",children:JSON.stringify(c.data??{},null,2)})]})}const P=["open","in_progress","blocked","closed"],N={P0:"bg-[var(--danger)]/20 text-[var(--danger)] border-[var(--danger)]/40",P1:"bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/40",P2:"bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/40",P3:"bg-gray-700/30 text-gray-400 border-gray-600/40"},T=n=>n.replace(/_/g," ").replace(/\b\w/g,o=>o.toUpperCase());function C({columns:n=P,cards:o=[],onRespond:p}){const[t,c]=w.useState(null),[s,a]=w.useState(null),i=d=>o.filter(r=>r.column===d),m=(d,r)=>{d.preventDefault();const g=d.dataTransfer.getData("text/plain"),y=o.find(u=>u.id===g);if(!y||y.column===r){a(null);return}p({action:"move",cardId:g,fromColumn:y.column,toColumn:r}),a(null)};return e.jsx("div",{className:"flex gap-3 overflow-x-auto pb-2",children:n.map(d=>e.jsxs("div",{className:"bg-[var(--bg-secondary)] rounded-xl p-3 min-h-[200px] flex-1 min-w-[220px] flex flex-col gap-2",onDragOver:r=>{r.preventDefault(),r.dataTransfer.dropEffect="move"},onDrop:r=>m(r,d),children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("h3",{className:"font-mono text-xs uppercase tracking-wider text-gray-400",children:T(d)}),e.jsx("span",{className:"bg-gray-800 text-gray-400 text-xs font-mono rounded-full px-2 py-0.5",children:i(d).length})]}),i(d).map(r=>e.jsxs("div",{draggable:!0,onDragStart:g=>{g.dataTransfer.setData("text/plain",r.id),a(r.id)},onDragEnd:()=>a(null),onClick:()=>c(t===r.id?null:r.id),className:x("bg-[var(--bg-tertiary,#111)] border border-[var(--glass-border,#222)] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[var(--primary)]/30 transition-colors",s===r.id&&"opacity-40"),children:[e.jsxs("div",{className:"flex items-start justify-between gap-2 mb-1",children:[e.jsx("span",{className:"font-mono text-sm text-cyan-400 shrink-0",children:r.id}),r.priority&&e.jsx("span",{className:x("text-[10px] font-mono px-1.5 py-0.5 rounded border",N[r.priority]??N.P3),children:r.priority})]}),e.jsx("p",{className:"text-sm text-gray-200 leading-snug",children:r.title}),r.blockedBy&&r.blockedBy.length>0&&e.jsxs("div",{className:"mt-1.5 flex items-center gap-1 text-[10px] text-[var(--danger)] font-mono",children:[e.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-[var(--danger)]"}),r.blockedBy.length," blocker",r.blockedBy.length>1?"s":""]}),r.owner&&e.jsx("p",{className:"mt-1 text-[10px] text-gray-500 font-mono truncate",children:r.owner}),t===r.id&&r.description&&e.jsx("p",{className:"mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 leading-relaxed",children:r.description})]},r.id)),i(d).length===0&&e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsx("p",{className:"text-xs text-gray-600 font-mono",children:"Empty"})})]},d))})}function R({title:n,items:o=[],onRespond:p}){return e.jsxs("div",{className:"bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4",children:[n&&e.jsx("h2",{className:"font-mono text-sm text-cyan-400 mb-3",children:n}),e.jsx("ul",{className:"space-y-1",children:o.map(t=>e.jsxs("li",{className:"flex items-start gap-3 group",children:[e.jsx("button",{onClick:()=>p({action:"toggle",itemId:t.id,checked:!t.checked}),className:x("mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",t.checked?"bg-cyan-500 border-cyan-500":"border-gray-600 hover:border-cyan-500/50"),children:t.checked&&e.jsx("svg",{className:"w-2.5 h-2.5 text-black",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:3,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),e.jsx("span",{className:x("text-sm leading-snug",t.checked?"line-through text-gray-600":"text-gray-200"),children:t.text}),t.priority&&e.jsx("span",{className:"ml-auto text-[10px] font-mono text-gray-500 shrink-0",children:t.priority})]},t.id))}),o.length===0&&e.jsx("p",{className:"text-xs text-gray-600 font-mono text-center py-4",children:"No items"})]})}function A({title:n,content:o}){return e.jsxs("div",{className:"bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4",children:[n&&e.jsx("h2",{className:"font-mono text-sm text-cyan-400 mb-3",children:n}),o?e.jsx("div",{className:"prose prose-invert prose-sm max-w-none prose-headings:text-gray-200 prose-headings:font-mono prose-code:text-cyan-400 prose-p:text-gray-300",children:e.jsx("p",{className:"whitespace-pre-wrap",children:o})}):e.jsx("p",{className:"text-xs text-gray-600 font-mono",children:"No content"})]})}try{k.displayName="CanvasRenderer",k.__docgenInfo={description:"CanvasRenderer - Migrated from canvas package",displayName:"CanvasRenderer",props:{payload:{defaultValue:null,description:"",name:"payload",required:!0,type:{name:"CanvasInteractionPayload"}},onRespond:{defaultValue:null,description:"",name:"onRespond",required:!0,type:{name:"(data: Record<string, unknown>) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const L={title:"Migrations/Canvas/CanvasRenderer",component:k,parameters:{layout:"padded"},tags:["autodocs"]},b={args:{payload:{type:"canvas_interaction",action:"selection",instruction:"Select a node to inspect"},onRespond:n=>console.log("respond:",n)}},f={args:{payload:{type:"canvas_interaction",action:"render",componentType:"sofia-widget",props:{provider:"sofia",widgetId:"kanban",variant:"kanban",data:{columns:["open","in_progress","closed"],cards:[{id:"T-1",title:"Fix login bug",column:"open",priority:"P1"},{id:"T-2",title:"Add dark mode",column:"in_progress",priority:"P2",owner:"alice"},{id:"T-3",title:"Deploy v2",column:"closed",priority:"P0"}]}}},onRespond:n=>console.log("respond:",n)}},h={args:{payload:{type:"canvas_interaction",action:"render",componentType:"sofia-widget",props:{provider:"sofia",widgetId:"unknown-widget"}},onRespond:n=>console.log("respond:",n)}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    payload: {
      type: "canvas_interaction",
      action: "selection",
      instruction: "Select a node to inspect"
    },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data)
  }
}`,...b.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    payload: {
      type: "canvas_interaction",
      action: "render",
      componentType: "sofia-widget",
      props: {
        provider: "sofia",
        widgetId: "kanban",
        variant: "kanban",
        data: {
          columns: ["open", "in_progress", "closed"],
          cards: [{
            id: "T-1",
            title: "Fix login bug",
            column: "open",
            priority: "P1"
          }, {
            id: "T-2",
            title: "Add dark mode",
            column: "in_progress",
            priority: "P2",
            owner: "alice"
          }, {
            id: "T-3",
            title: "Deploy v2",
            column: "closed",
            priority: "P0"
          }]
        }
      }
    },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data)
  }
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    payload: {
      type: "canvas_interaction",
      action: "render",
      componentType: "sofia-widget",
      props: {
        provider: "sofia",
        widgetId: "unknown-widget"
      }
    },
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data)
  }
}`,...h.parameters?.docs?.source}}};const K=["SelectionMode","KanbanWidget","InvalidPayload"];export{h as InvalidPayload,f as KanbanWidget,b as SelectionMode,K as __namedExportsOrder,L as default};
