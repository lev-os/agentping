import{C as o}from"./confirmation-modal-DLESJf2J.js";import"./iframe-rZoXeK5l.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CDN07tui.js";const i={title:"Migrations/WebUI/ConfirmationModal",component:o,tags:["autodocs"]},e={args:{isOpen:!0,title:"Delete Agent",message:"Are you sure you want to delete this agent? This action cannot be undone.",variant:"destructive",onConfirm:()=>{},onCancel:()=>{}}},t={args:{isOpen:!0,title:"Archive Workflow",message:"This workflow will be moved to the archive. You can restore it later.",onConfirm:()=>{},onCancel:()=>{}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Delete Agent",
    message: "Are you sure you want to delete this agent? This action cannot be undone.",
    variant: "destructive",
    onConfirm: () => {},
    onCancel: () => {}
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Archive Workflow",
    message: "This workflow will be moved to the archive. You can restore it later.",
    onConfirm: () => {},
    onCancel: () => {}
  }
}`,...t.parameters?.docs?.source}}};const c=["Default","NonDestructive"];export{e as Default,t as NonDestructive,c as __namedExportsOrder,i as default};
