import{j as e}from"./iframe-CzJrb7DT.js";import{c as l}from"./utils-CDN07tui.js";import"./preload-helper-PPVm8Dsz.js";const m={online:"bg-green-400",away:"bg-yellow-400",offline:"bg-gray-500"};function d(a){return a.split(" ").map(r=>r[0]).slice(0,2).join("").toUpperCase()}function o({members:a,className:r}){const i=a.filter(n=>n.status==="online").length;return e.jsxs("div",{className:l("border border-cyan-500/20 bg-black/60 rounded-lg p-4",r),children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"text-xs font-mono text-cyan-400 uppercase tracking-wider",children:"Team Roster"}),e.jsxs("div",{className:"text-[10px] font-mono text-green-400/70",children:[i,"/",a.length," online"]})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-3",children:a.map((n,c)=>e.jsxs("div",{className:"flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-black/40 px-3 py-2.5 hover:border-cyan-500/20 transition-colors",children:[e.jsxs("div",{className:"relative flex-shrink-0",children:[n.avatar?e.jsx("img",{src:n.avatar,alt:n.name,className:"w-8 h-8 rounded-full object-cover"}):e.jsx("div",{className:"w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400",children:d(n.name)}),e.jsx("div",{className:l("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-black/80",m[n.status])})]}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"text-xs font-mono text-gray-200 truncate",children:n.name}),e.jsx("div",{className:"text-[10px] font-mono text-cyan-500/40 truncate",children:n.role})]})]},c))})]})}try{o.displayName="TeamRoster",o.__docgenInfo={description:"TeamRoster - Team member cards with status",displayName:"TeamRoster",props:{members:{defaultValue:null,description:"",name:"members",required:!0,type:{name:"TeamMember[]"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const x={title:"Migrations/WebUI/Root/TeamRoster",component:o,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{members:[{name:"Alice Chen",role:"Tech Lead",status:"online"},{name:"Bob Martinez",role:"Backend Dev",status:"online"},{name:"Carol Kim",role:"Frontend Dev",status:"away"},{name:"Dan Okafor",role:"DevOps",status:"online"},{name:"Eva Johansson",role:"Designer",status:"offline"},{name:"Frank Li",role:"QA Engineer",status:"online"}]}},t={args:{members:[{name:"Zara Ahmed",role:"Founder",status:"online"},{name:"Kai Tanaka",role:"CTO",status:"away"}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    members: [{
      name: "Alice Chen",
      role: "Tech Lead",
      status: "online"
    }, {
      name: "Bob Martinez",
      role: "Backend Dev",
      status: "online"
    }, {
      name: "Carol Kim",
      role: "Frontend Dev",
      status: "away"
    }, {
      name: "Dan Okafor",
      role: "DevOps",
      status: "online"
    }, {
      name: "Eva Johansson",
      role: "Designer",
      status: "offline"
    }, {
      name: "Frank Li",
      role: "QA Engineer",
      status: "online"
    }]
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    members: [{
      name: "Zara Ahmed",
      role: "Founder",
      status: "online"
    }, {
      name: "Kai Tanaka",
      role: "CTO",
      status: "away"
    }]
  }
}`,...t.parameters?.docs?.source}}};const f=["Default","SmallTeam"];export{s as Default,t as SmallTeam,f as __namedExportsOrder,x as default};
