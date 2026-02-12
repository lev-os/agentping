import{j as e}from"./iframe-rZoXeK5l.js";import{c as d}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function n({content:o,title:t,className:s}){return e.jsxs("div",{className:d("bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4",s),children:[t&&e.jsx("h2",{className:"font-mono text-sm text-cyan-400 mb-3",children:t}),o?e.jsx("div",{className:"prose prose-invert prose-sm max-w-none prose-headings:text-gray-200 prose-headings:font-mono prose-code:text-cyan-400 prose-code:bg-gray-800/60 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-li:text-gray-300 prose-p:text-gray-300",children:e.jsx("p",{className:"whitespace-pre-wrap",children:o})}):e.jsx("p",{className:"text-xs text-gray-600 font-mono",children:"No content"})]})}try{n.displayName="MarkdownCard",n.__docgenInfo={description:"MarkdownCard - Migrated from canvas package",displayName:"MarkdownCard",props:{content:{defaultValue:null,description:"",name:"content",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},onRespond:{defaultValue:null,description:"",name:"onRespond",required:!1,type:{name:"((data: Record<string, unknown>) => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const l={title:"Migrations/Canvas/MarkdownCard",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{title:"Release Notes",content:`## v2.0

- Added polymorph renderer
- Fixed canvas drag-drop
- Improved theme tokens`}},a={args:{title:"Empty Card"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Release Notes",
    content: "## v2.0\\n\\n- Added polymorph renderer\\n- Fixed canvas drag-drop\\n- Improved theme tokens"
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Empty Card"
  }
}`,...a.parameters?.docs?.source}}};const m=["Default","Empty"];export{r as Default,a as Empty,m as __namedExportsOrder,l as default};
