import{r as z,j as e}from"./iframe-rZoXeK5l.js";import{c as v}from"./utils-CDN07tui.js";import{L as c}from"./layers-BApCRtLs.js";import{c as p}from"./createLucideIcon-oH0TnkMA.js";import{E as T}from"./eye-C5NMUG_V.js";import{E as _}from"./eye-off-DdiC9VlA.js";import{T as I}from"./trash-2-DbqV1OwA.js";import{S as h}from"./square-DQVkq2r2.js";import{I as C}from"./image-BT8vX6cW.js";import{T as S}from"./type-CjU64DNN.js";import{C as V}from"./circle-Q3hm3bTk.js";import"./preload-helper-PPVm8Dsz.js";const w=[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]],D=p("grip-vertical",w);const E=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],q=p("lock-open",E);const O=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],G=p("lock",O),H={rectangle:e.jsx(h,{size:12}),ellipse:e.jsx(V,{size:12}),text:e.jsx(S,{size:12}),image:e.jsx(C,{size:12}),group:e.jsx(c,{size:12}),frame:e.jsx(h,{size:12})};function d({canvasObjects:r,selectedLayerId:b,onSelectLayer:j,onToggleVisibility:m,onToggleLock:u,onDeleteLayer:y,onReorderLayers:l,className:k}){const[o,x]=z.useState(null),f=(a,s,g=0)=>{const L=a.id===b;return e.jsxs("div",{children:[e.jsxs("div",{className:v("group flex items-center gap-1.5 px-2 py-1","cursor-pointer transition-colors duration-100",L?"bg-cyan-500/10 text-cyan-400":"text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",!a.visible&&"opacity-40"),style:{paddingLeft:`${8+g*16}px`},onClick:()=>j?.(a.id),draggable:!!l,onDragStart:()=>x(s),onDragOver:t=>t.preventDefault(),onDrop:()=>{o!==null&&o!==s&&l?.(o,s),x(null)},children:[l&&e.jsx(D,{size:10,className:"text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"}),e.jsx("span",{className:"flex-shrink-0",children:H[a.type]}),e.jsx("span",{className:"flex-1 text-xs truncate",children:a.name}),e.jsxs("div",{className:"flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",children:[m&&e.jsx("button",{onClick:t=>{t.stopPropagation(),m(a.id)},className:"p-0.5 hover:text-zinc-200 transition-colors","aria-label":a.visible?"Hide layer":"Show layer",children:a.visible?e.jsx(T,{size:10}):e.jsx(_,{size:10})}),u&&e.jsx("button",{onClick:t=>{t.stopPropagation(),u(a.id)},className:"p-0.5 hover:text-zinc-200 transition-colors","aria-label":a.locked?"Unlock layer":"Lock layer",children:a.locked?e.jsx(G,{size:10}):e.jsx(q,{size:10})}),y&&e.jsx("button",{onClick:t=>{t.stopPropagation(),y(a.id)},className:"p-0.5 hover:text-red-400 transition-colors","aria-label":"Delete layer",children:e.jsx(I,{size:10})})]})]}),a.children?.map((t,N)=>f(t,N,g+1))]},a.id)};return e.jsxs("div",{className:v("flex flex-col h-full",k),children:[e.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 border-b border-zinc-800",children:[e.jsx(c,{size:14,className:"text-cyan-500"}),e.jsx("span",{className:"text-xs font-medium text-zinc-300",children:"Layers"}),e.jsx("span",{className:"text-[10px] text-zinc-600 ml-auto",children:r.length})]}),e.jsx("div",{className:"flex-1 overflow-y-auto py-1",children:r.length===0?e.jsxs("div",{className:"flex flex-col items-center justify-center py-8 text-zinc-600",children:[e.jsx(c,{size:20,className:"mb-2"}),e.jsx("span",{className:"text-xs",children:"No layers"})]}):r.map((a,s)=>f(a,s))})]})}try{d.displayName="Layers",d.__docgenInfo={description:"",displayName:"Layers",props:{canvasObjects:{defaultValue:null,description:"Canvas layer objects",name:"canvasObjects",required:!0,type:{name:"LayerItem[]"}},selectedLayerId:{defaultValue:null,description:"Currently selected layer id",name:"selectedLayerId",required:!1,type:{name:"string | null"}},onSelectLayer:{defaultValue:null,description:"Layer select handler",name:"onSelectLayer",required:!1,type:{name:"((id: string) => void)"}},onToggleVisibility:{defaultValue:null,description:"Toggle layer visibility",name:"onToggleVisibility",required:!1,type:{name:"((id: string) => void)"}},onToggleLock:{defaultValue:null,description:"Toggle layer lock",name:"onToggleLock",required:!1,type:{name:"((id: string) => void)"}},onDeleteLayer:{defaultValue:null,description:"Delete a layer",name:"onDeleteLayer",required:!1,type:{name:"((id: string) => void)"}},onReorderLayers:{defaultValue:null,description:"Reorder layers",name:"onReorderLayers",required:!1,type:{name:"((fromIndex: number, toIndex: number) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const W={title:"Migrations/Studio/Layers",component:d,parameters:{layout:"padded"},tags:["autodocs"],decorators:[r=>e.jsx("div",{style:{height:400,width:260},children:e.jsx(r,{})})]},i={args:{canvasObjects:[{id:"1",name:"Header Frame",type:"frame",visible:!0,locked:!1},{id:"2",name:"Hero Image",type:"image",visible:!0,locked:!1},{id:"3",name:"Title Text",type:"text",visible:!0,locked:!0},{id:"4",name:"Button",type:"rectangle",visible:!1,locked:!1},{id:"5",name:"Card Group",type:"group",visible:!0,locked:!1,children:[{id:"5a",name:"Card BG",type:"rectangle",visible:!0,locked:!1},{id:"5b",name:"Card Title",type:"text",visible:!0,locked:!1}]}],selectedLayerId:"3",onSelectLayer:()=>{},onToggleVisibility:()=>{},onToggleLock:()=>{},onDeleteLayer:()=>{}}},n={args:{canvasObjects:[]}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    canvasObjects: [{
      id: "1",
      name: "Header Frame",
      type: "frame",
      visible: true,
      locked: false
    }, {
      id: "2",
      name: "Hero Image",
      type: "image",
      visible: true,
      locked: false
    }, {
      id: "3",
      name: "Title Text",
      type: "text",
      visible: true,
      locked: true
    }, {
      id: "4",
      name: "Button",
      type: "rectangle",
      visible: false,
      locked: false
    }, {
      id: "5",
      name: "Card Group",
      type: "group",
      visible: true,
      locked: false,
      children: [{
        id: "5a",
        name: "Card BG",
        type: "rectangle",
        visible: true,
        locked: false
      }, {
        id: "5b",
        name: "Card Title",
        type: "text",
        visible: true,
        locked: false
      }]
    }],
    selectedLayerId: "3",
    onSelectLayer: () => {},
    onToggleVisibility: () => {},
    onToggleLock: () => {},
    onDeleteLayer: () => {}
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    canvasObjects: []
  }
}`,...n.parameters?.docs?.source}}};const X=["Default","Empty"];export{i as Default,n as Empty,X as __namedExportsOrder,W as default};
