import{j as r}from"./iframe-CzJrb7DT.js";import{E as n}from"./EntityForm-CYg8QEy0.js";import{m as s,a as e}from"./mock-crud-decorator-DGOzF4QO.js";import{C as i}from"./context-BXwyrT09.js";import"./preload-helper-PPVm8Dsz.js";import"./FieldRenderer-DchKKhuq.js";import"./input-BawzCQYs.js";import"./utils-CDN07tui.js";import"./textarea-DSOyAXy_.js";import"./label-D8f8WTW2.js";import"./index-CJ_imsi-.js";import"./index-WHAuAub8.js";import"./index-Dwoj57sw.js";import"./index-DiN5Zsj0.js";import"./index-Czr-OA3y.js";import"./index-B_jtOnfb.js";const h={title:"Migrations/Canonical/Recipes/EntityForm",component:n,tags:["autodocs"],decorators:[o=>r.jsx(i,{config:e,initialItems:s,children:r.jsx(o,{})})]},t={args:{onSubmit:async o=>{console.log("submit",o)}}},a={args:{initialData:{name:"Agent Alpha",status:"active"},onSubmit:async o=>{console.log("submit",o)},onCancel:()=>{console.log("cancel")}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    onSubmit: async data => {
      console.log("submit", data);
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    initialData: {
      name: "Agent Alpha",
      status: "active"
    },
    onSubmit: async data => {
      console.log("submit", data);
    },
    onCancel: () => {
      console.log("cancel");
    }
  }
}`,...a.parameters?.docs?.source}}};const v=["Create","Edit"];export{t as Create,a as Edit,v as __namedExportsOrder,h as default};
