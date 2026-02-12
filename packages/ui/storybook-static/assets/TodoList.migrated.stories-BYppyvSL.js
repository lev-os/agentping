import{j as t}from"./iframe-CzJrb7DT.js";import{c as o}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";function a({title:r,items:i=[],onRespond:d,className:c}){const l=e=>{d({action:"toggle",itemId:e.id,checked:!e.checked})};return t.jsxs("div",{className:o("bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4",c),children:[r&&t.jsx("h2",{className:"font-mono text-sm text-cyan-400 mb-3",children:r}),t.jsx("ul",{className:"space-y-1",children:i.map(e=>t.jsxs("li",{className:"flex items-start gap-3 group",children:[t.jsx("button",{onClick:()=>l(e),className:o("mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",e.checked?"bg-cyan-500 border-cyan-500":"border-gray-600 hover:border-cyan-500/50"),children:e.checked&&t.jsx("svg",{className:"w-2.5 h-2.5 text-black",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:3,children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"})})}),t.jsx("span",{className:o("text-sm leading-snug",e.checked?"line-through text-gray-600":"text-gray-200"),children:e.text}),e.priority&&t.jsx("span",{className:"ml-auto text-[10px] font-mono text-gray-500 shrink-0",children:e.priority})]},e.id))}),i.length===0&&t.jsx("p",{className:"text-xs text-gray-600 font-mono text-center py-4",children:"No items"})]})}try{a.displayName="TodoList",a.__docgenInfo={description:"TodoList - Migrated from canvas package",displayName:"TodoList",props:{title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}},items:{defaultValue:{value:"[]"},description:"",name:"items",required:!1,type:{name:"TodoItem[]"}},onRespond:{defaultValue:null,description:"",name:"onRespond",required:!0,type:{name:"(data: Record<string, unknown>) => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const g={title:"Migrations/Canvas/TodoList",component:a,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{title:"Sprint Tasks",items:[{id:"1",text:"Review PR #42",checked:!0,priority:"P0"},{id:"2",text:"Deploy staging",checked:!1,priority:"P1"},{id:"3",text:"Write tests",checked:!1}],onRespond:r=>console.log("respond:",r)}},n={args:{title:"Empty List",items:[],onRespond:()=>{}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Sprint Tasks",
    items: [{
      id: "1",
      text: "Review PR #42",
      checked: true,
      priority: "P0"
    }, {
      id: "2",
      text: "Deploy staging",
      checked: false,
      priority: "P1"
    }, {
      id: "3",
      text: "Write tests",
      checked: false
    }],
    onRespond: (data: Record<string, unknown>) => console.log("respond:", data)
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Empty List",
    items: [],
    onRespond: () => {}
  }
}`,...n.parameters?.docs?.source}}};const x=["Default","Empty"];export{s as Default,n as Empty,x as __namedExportsOrder,g as default};
