import{F as t}from"./FieldRenderer-BVhlFiYP.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./input-Bv_grbQj.js";import"./utils-CDN07tui.js";import"./textarea-gT2HoxmG.js";import"./label-DBRaLFZd.js";import"./index-DJNgIyCh.js";import"./index-p5YmI0II.js";import"./index-fvHFeWab.js";import"./index-DBhjKPQa.js";import"./index-DqYXjM1N.js";import"./index-B_jtOnfb.js";const y={title:"Migrations/Canonical/Recipes/FieldRenderer",component:t,tags:["autodocs"]},e={args:{field:{key:"name",label:"Name",type:"text",required:!0},value:"Agent Alpha",onChange:()=>{}}},r={args:{field:{key:"status",label:"Status",type:"select",options:[{label:"Active",value:"active"},{label:"Idle",value:"idle"},{label:"Error",value:"error"}]},value:"active",onChange:()=>{}}},a={args:{field:{key:"name",label:"Name",type:"text",required:!0},value:"",onChange:()=>{},error:"Name is required"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    field: {
      key: "name",
      label: "Name",
      type: "text",
      required: true
    },
    value: "Agent Alpha",
    onChange: () => {}
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    field: {
      key: "status",
      label: "Status",
      type: "select",
      options: [{
        label: "Active",
        value: "active"
      }, {
        label: "Idle",
        value: "idle"
      }, {
        label: "Error",
        value: "error"
      }]
    },
    value: "active",
    onChange: () => {}
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    field: {
      key: "name",
      label: "Name",
      type: "text",
      required: true
    },
    value: "",
    onChange: () => {},
    error: "Name is required"
  }
}`,...a.parameters?.docs?.source}}};const h=["Text","Select","WithError"];export{r as Select,e as Text,a as WithError,h as __namedExportsOrder,y as default};
