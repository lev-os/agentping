import{j as e}from"./iframe-rZoXeK5l.js";import{c as i}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({restarts:o,className:c}){const m=Math.min(160,Math.max(8,o/20*160));return e.jsxs("div",{className:i("border border-cyan-500/20 bg-black/60 rounded-lg p-4",c),children:[e.jsx("h3",{className:"text-sm font-semibold text-white/80 mb-4",children:"Restart Count"}),e.jsx("div",{className:"flex items-end justify-center gap-2",style:{height:160},children:e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("div",{className:"w-16 rounded-t bg-green-500/80 transition-all duration-500",style:{height:m}}),e.jsx("span",{className:"text-xs font-mono text-white/50",children:"Total"})]})}),e.jsxs("div",{className:"text-center mt-2",children:[e.jsx("span",{className:"text-2xl font-bold text-green-400 font-mono",children:o}),e.jsx("span",{className:"text-xs text-white/40 ml-1",children:"restarts"})]})]})}try{n.displayName="DmRestartHistogram",n.__docgenInfo={description:"DmRestartHistogram - Migrated from dashboard-manager-ui",displayName:"DmRestartHistogram",props:{restarts:{defaultValue:null,description:"",name:"restarts",required:!0,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const u={title:"Migrations/DashboardManager/RestartHistogram",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{restarts:2}},s={args:{restarts:15}},t={args:{restarts:0}},a=r;r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    restarts: 2
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    restarts: 15
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    restarts: 0
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"Low",...a.parameters?.docs?.source}}};const x=["Low","High","Zero","Default"];export{a as Default,s as High,r as Low,t as Zero,x as __namedExportsOrder,u as default};
