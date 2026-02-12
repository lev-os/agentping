import{T as n}from"./TileCard-DFga_OKw.js";import"./iframe-CzJrb7DT.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";import"./card-C0C-qANj.js";import"./badge-HMrpZ3Xg.js";import"./index-B_jtOnfb.js";import"./button-D3q81IEX.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";const g={title:"Migrations/Canonical/Recipes/TileCard",component:n,tags:["autodocs"]},t={args:{item:{id:"1",name:"Agent Alpha",status:"active"},config:{title:"name",subtitle:"status"}}},a={args:{item:{id:"2",name:"Agent Beta",status:"idle"},config:{title:"name",subtitle:"status",avatar:{field:"name",type:"initials"}}}},e={args:{item:{id:"3",name:"Agent Gamma",status:"error",role:"worker"},config:{title:"name",subtitle:"status",badges:[{field:"role",variant:"outline"}]}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      id: "1",
      name: "Agent Alpha",
      status: "active"
    },
    config: {
      title: "name" as const,
      subtitle: "status" as const
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      id: "2",
      name: "Agent Beta",
      status: "idle"
    },
    config: {
      title: "name" as const,
      subtitle: "status" as const,
      avatar: {
        field: "name" as const,
        type: "initials" as const
      }
    }
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    item: {
      id: "3",
      name: "Agent Gamma",
      status: "error",
      role: "worker"
    },
    config: {
      title: "name" as const,
      subtitle: "status" as const,
      badges: [{
        field: "role" as const,
        variant: "outline" as const
      }]
    }
  }
}`,...e.parameters?.docs?.source}}};const f=["Default","WithAvatar","WithBadges"];export{t as Default,a as WithAvatar,e as WithBadges,f as __namedExportsOrder,g as default};
