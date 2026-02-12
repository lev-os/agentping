import{j as i}from"./iframe-rZoXeK5l.js";import{c as r}from"./utils-CDN07tui.js";function s({active:e=!1,bars:n=12,className:t}){return i.jsxs("div",{className:r("flex items-end justify-center gap-0.5 h-12",t),children:[Array.from({length:n},(o,a)=>{const l=20+Math.sin(a*.8)*15;return i.jsx("div",{className:r("w-1 rounded-full transition-all duration-150",e?"bg-cyan-400":"bg-cyan-500/20"),style:{height:e?`${l+Math.random()*30}%`:"10%",animation:e?`voice-bar ${.3+Math.random()*.4}s ease-in-out infinite alternate`:"none",animationDelay:`${a*.05}s`}},a)}),i.jsx("style",{children:`
        @keyframes voice-bar {
          0% { height: 15%; }
          100% { height: 80%; }
        }
      `})]})}try{s.displayName="VoiceVisualizer",s.__docgenInfo={description:"VoiceVisualizer - Migrated from",displayName:"VoiceVisualizer",props:{active:{defaultValue:{value:"false"},description:"",name:"active",required:!1,type:{name:"boolean"}},bars:{defaultValue:{value:"12"},description:"",name:"bars",required:!1,type:{name:"number"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}export{s as V};
