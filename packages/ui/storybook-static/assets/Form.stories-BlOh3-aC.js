import{j as e,r as p}from"./iframe-rZoXeK5l.js";import{F as t,a,b as u,c as m}from"./form-DhvQ9qaZ.js";import{I as d}from"./input-Bv_grbQj.js";import{T as O}from"./textarea-gT2HoxmG.js";import{C as N}from"./checkbox-Bmm6JN_L.js";import{S as j}from"./switch-Dr6yQ2Kk.js";import{B as x}from"./button-OgTxl8kR.js";import{B as R}from"./badge-G0y1RK3D.js";import"./preload-helper-PPVm8Dsz.js";import"./label-DBRaLFZd.js";import"./index-DJNgIyCh.js";import"./index-p5YmI0II.js";import"./index-fvHFeWab.js";import"./index-DBhjKPQa.js";import"./index-DqYXjM1N.js";import"./index-B_jtOnfb.js";import"./utils-CDN07tui.js";import"./index-BabMczZl.js";import"./index-DgHvID4o.js";import"./index-CqSIw0EQ.js";import"./check-C6g1ZBL2.js";import"./createLucideIcon-oH0TnkMA.js";const ie={title:"Components/Form",component:t,parameters:{layout:"centered",docs:{description:{component:"Form field components with SKYNET cyberpunk styling. Includes FormField (wrapper), FormLabel, FormMessage (errors), and FormDescription (help text). Designed for accessibility with proper ARIA associations."}}},tags:["autodocs"]},D=()=>{const[r,o]=p.useState(""),[s,b]=p.useState(""),[c,g]=p.useState(!1),n=l=>{if(l.preventDefault(),r.length<2){b("Callsign must be at least 2 characters");return}if(!/^[A-Z0-9]+$/i.test(r)){b("Callsign must be alphanumeric only");return}b(""),g(!0)};return e.jsxs("form",{onSubmit:n,className:"w-[320px] space-y-4",children:[e.jsxs(t,{children:[e.jsx(a,{htmlFor:"callsign",required:!0,children:"CALLSIGN"}),e.jsx(d,{id:"callsign",placeholder:"Enter callsign...",value:r,onChange:l=>{o(l.target.value.toUpperCase()),b(""),g(!1)},error:!!s,"aria-describedby":"callsign-error callsign-desc"}),e.jsx(u,{id:"callsign-desc",children:"Your unique pilot identification"}),e.jsx(m,{error:!0,id:"callsign-error",children:s})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(x,{type:"submit",children:"VALIDATE"}),c&&e.jsxs(R,{variant:"success",children:["VALID: ",r]})]})]})},v={render:()=>e.jsx(D,{}),args:{children:null},parameters:{docs:{description:{story:"Basic form with real-time validation. Shows error states and success feedback."}}}},k=()=>{const[r,o]=p.useState({learningRate:"3e-4",batchSize:"64",nEnvs:"8",epochs:"10",useBc:!0,useHer:!0,useCuriosity:!1,useWorldModel:!1,vecNormalize:!0}),[s,b]=p.useState({}),c=(n,l,i)=>{const h=parseFloat(n);return isNaN(h)?"Must be a valid number":h<l||h>i?`Must be between ${l} and ${i}`:""},g=n=>{n.preventDefault();const l={},i=c(r.batchSize,1,512);i&&(l.batchSize=i);const h=c(r.nEnvs,1,64);h&&(l.nEnvs=h);const F=c(r.epochs,1,100);F&&(l.epochs=F),b(l),Object.keys(l).length===0&&alert("Configuration saved successfully!")};return e.jsxs("form",{onSubmit:g,className:"w-[400px] space-y-6",children:[e.jsxs("div",{className:"p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary mb-4",children:"PPO HYPERPARAMETERS"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs(t,{children:[e.jsx(a,{htmlFor:"lr",required:!0,children:"LEARNING RATE"}),e.jsx(d,{id:"lr",value:r.learningRate,onChange:n=>o({...r,learningRate:n.target.value}),className:"font-mono"}),e.jsx(u,{children:"Default: 3e-4"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"batch",required:!0,children:"BATCH SIZE"}),e.jsx(d,{id:"batch",type:"number",value:r.batchSize,onChange:n=>o({...r,batchSize:n.target.value}),error:!!s.batchSize,className:"font-mono"}),e.jsx(m,{error:!0,children:s.batchSize})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"envs",required:!0,children:"N ENVIRONMENTS"}),e.jsx(d,{id:"envs",type:"number",value:r.nEnvs,onChange:n=>o({...r,nEnvs:n.target.value}),error:!!s.nEnvs,className:"font-mono"}),e.jsx(m,{error:!0,children:s.nEnvs})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"epochs",required:!0,children:"EPOCHS"}),e.jsx(d,{id:"epochs",type:"number",value:r.epochs,onChange:n=>o({...r,epochs:n.target.value}),error:!!s.epochs,className:"font-mono"}),e.jsx(m,{error:!0,children:s.epochs})]})]})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary mb-4",children:"TRAINING FEATURES"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"bc",children:"BEHAVIORAL CLONING"}),e.jsx(u,{children:"Self-imitation from best trajectories"})]}),e.jsx(j,{id:"bc",checked:r.useBc,onCheckedChange:n=>o({...r,useBc:n})})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"her",children:"HINDSIGHT EXPERIENCE REPLAY"}),e.jsx(u,{children:"Goal relabeling for sparse rewards"})]}),e.jsx(j,{id:"her",checked:r.useHer,onCheckedChange:n=>o({...r,useHer:n})})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"curiosity",children:"CURIOSITY (RND+ICM)"}),e.jsx(u,{children:"Intrinsic exploration motivation"})]}),e.jsx(j,{id:"curiosity",checked:r.useCuriosity,onCheckedChange:n=>o({...r,useCuriosity:n})})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"wm",children:"WORLD MODEL"}),e.jsx(u,{children:"DreamerV3 imagination training"})]}),e.jsx(j,{id:"wm",checked:r.useWorldModel,onCheckedChange:n=>o({...r,useWorldModel:n})})]})]})]}),e.jsx("div",{className:"p-4 border border-border bg-card/50",children:e.jsxs(t,{className:"flex items-center gap-3",children:[e.jsx(N,{id:"vecnorm",checked:r.vecNormalize,onCheckedChange:n=>o({...r,vecNormalize:n===!0})}),e.jsxs("div",{children:[e.jsx(a,{htmlFor:"vecnorm",children:"VECTOR NORMALIZATION"}),e.jsx(u,{children:"Normalize observations and rewards (recommended)"})]})]})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(x,{type:"submit",children:"APPLY CONFIG"}),e.jsx(x,{type:"button",variant:"outline",children:"RESET DEFAULTS"})]})]})},y={render:()=>e.jsx(k,{}),args:{children:null},parameters:{layout:"padded",docs:{description:{story:"Aviation-themed training configuration form with hyperparameters, feature toggles, and validation."}}}},P=()=>{const[r,o]=p.useState({pilotId:"",accessCode:"",remember:!1}),[s,b]=p.useState({}),[c,g]=p.useState(!1),n=l=>{l.preventDefault();const i={};r.pilotId.trim()||(i.pilotId="Pilot ID is required"),r.accessCode.trim()?r.accessCode.length<6&&(i.accessCode="Access code must be at least 6 characters"):i.accessCode="Access code is required",b(i),Object.keys(i).length===0&&(g(!0),setTimeout(()=>g(!1),1500))};return e.jsxs("form",{onSubmit:n,className:"w-[320px] space-y-4",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h2",{className:"font-display text-xl text-primary",children:"SOFIA ACCESS"}),e.jsx("p",{className:"text-xs text-muted-foreground mt-1",children:"Flight Intelligence System Authentication"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"pilotId",required:!0,children:"PILOT ID"}),e.jsx(d,{id:"pilotId",placeholder:"Enter pilot ID...",value:r.pilotId,onChange:l=>o({...r,pilotId:l.target.value.toUpperCase()}),error:!!s.pilotId,autoComplete:"username"}),e.jsx(m,{error:!0,children:s.pilotId})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"accessCode",required:!0,children:"ACCESS CODE"}),e.jsx(d,{id:"accessCode",type:"password",placeholder:"Enter access code...",value:r.accessCode,onChange:l=>o({...r,accessCode:l.target.value}),error:!!s.accessCode,autoComplete:"current-password"}),e.jsx(m,{error:!0,children:s.accessCode})]}),e.jsxs(t,{className:"flex items-center gap-3",children:[e.jsx(N,{id:"remember",checked:r.remember,onCheckedChange:l=>o({...r,remember:l===!0})}),e.jsx(a,{htmlFor:"remember",className:"cursor-pointer",children:"Remember this terminal"})]}),e.jsx(x,{type:"submit",className:"w-full",disabled:c,children:c?"AUTHENTICATING...":"AUTHENTICATE"}),e.jsx("p",{className:"text-xs text-center text-muted-foreground",children:"Unauthorized access will be logged and reported"})]})},E={render:()=>e.jsx(P,{}),args:{children:null},parameters:{docs:{description:{story:"Authentication form with validation, password field, and remember-me option."}}}},M=()=>{const[r,o]=p.useState({departure:"",arrival:"",altitude:"",squawk:"",remarks:"",ifr:!1,hazmat:!1,priority:"normal"}),[s,b]=p.useState({}),c=n=>n.trim()?/^[A-Z]{4}$/.test(n)?"":"Must be 4-letter ICAO code":"Required",g=n=>{n.preventDefault();const l={},i=c(r.departure);i&&(l.departure=i);const h=c(r.arrival);if(h&&(l.arrival=h),r.departure===r.arrival&&r.departure&&(l.arrival="Arrival must differ from departure"),r.altitude){const F=parseInt(r.altitude);(isNaN(F)||F<500||F>45e3)&&(l.altitude="Altitude must be 500-45000 ft")}r.squawk&&!/^[0-7]{4}$/.test(r.squawk)&&(l.squawk="Must be 4 octal digits (0-7)"),b(l),Object.keys(l).length===0&&alert("Flight plan filed successfully!")};return e.jsxs("form",{onSubmit:g,className:"w-[450px] space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"font-display text-lg text-primary",children:"FILE FLIGHT PLAN"}),e.jsx(R,{variant:r.ifr?"default":"outline",children:r.ifr?"IFR":"VFR"})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-4",children:[e.jsx("h3",{className:"text-xs font-mono text-muted-foreground",children:"ROUTE"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs(t,{children:[e.jsx(a,{htmlFor:"dep",required:!0,children:"DEPARTURE (ICAO)"}),e.jsx(d,{id:"dep",placeholder:"KJFK",maxLength:4,value:r.departure,onChange:n=>o({...r,departure:n.target.value.toUpperCase()}),error:!!s.departure,className:"font-mono uppercase"}),e.jsx(m,{error:!0,children:s.departure})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"arr",required:!0,children:"ARRIVAL (ICAO)"}),e.jsx(d,{id:"arr",placeholder:"KLAX",maxLength:4,value:r.arrival,onChange:n=>o({...r,arrival:n.target.value.toUpperCase()}),error:!!s.arrival,className:"font-mono uppercase"}),e.jsx(m,{error:!0,children:s.arrival})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"alt",children:"CRUISE ALTITUDE (FT)"}),e.jsx(d,{id:"alt",type:"number",placeholder:"35000",value:r.altitude,onChange:n=>o({...r,altitude:n.target.value}),error:!!s.altitude,className:"font-mono"}),e.jsx(m,{error:!0,children:s.altitude})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"squawk",children:"SQUAWK CODE"}),e.jsx(d,{id:"squawk",placeholder:"1200",maxLength:4,value:r.squawk,onChange:n=>o({...r,squawk:n.target.value}),error:!!s.squawk,className:"font-mono"}),e.jsx(u,{children:"VFR: 1200, IFR: Assigned"}),e.jsx(m,{error:!0,children:s.squawk})]})]})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-4",children:[e.jsx("h3",{className:"text-xs font-mono text-muted-foreground",children:"FLIGHT RULES & OPTIONS"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs(t,{className:"flex items-center gap-3",children:[e.jsx(N,{id:"ifr",checked:r.ifr,onCheckedChange:n=>o({...r,ifr:n===!0})}),e.jsxs("div",{children:[e.jsx(a,{htmlFor:"ifr",children:"IFR FLIGHT RULES"}),e.jsx(u,{children:"Instrument flight rules"})]})]}),e.jsxs(t,{className:"flex items-center gap-3",children:[e.jsx(N,{id:"hazmat",checked:r.hazmat,onCheckedChange:n=>o({...r,hazmat:n===!0})}),e.jsxs("div",{children:[e.jsx(a,{htmlFor:"hazmat",children:"HAZMAT CARGO"}),e.jsx(u,{children:"Dangerous goods aboard"})]})]})]})]}),e.jsx("div",{className:"p-4 border border-border bg-card/50",children:e.jsxs(t,{children:[e.jsx(a,{htmlFor:"remarks",children:"REMARKS"}),e.jsx(O,{id:"remarks",placeholder:"Enter any additional remarks, equipment codes, or special requests...",value:r.remarks,onChange:n=>o({...r,remarks:n.target.value}),rows:3}),e.jsx(u,{children:"Include equipment codes, PBN capabilities, or special handling"})]})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(x,{type:"submit",children:"FILE PLAN"}),e.jsx(x,{type:"button",variant:"outline",children:"SAVE DRAFT"}),e.jsx(x,{type:"button",variant:"ghost",children:"CLEAR"})]})]})},C={render:()=>e.jsx(M,{}),args:{children:null},parameters:{layout:"padded",docs:{description:{story:"Complex multi-field flight plan form with aviation-specific validation (ICAO codes, squawk codes, altitude)."}}}},I={args:{children:null},render:()=>e.jsxs("div",{className:"w-[350px] space-y-6",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"ERROR STATES"}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"error1",required:!0,children:"FIELD WITH ERROR"}),e.jsx(d,{id:"error1",value:"invalid value",error:!0,"aria-describedby":"error1-msg"}),e.jsx(m,{error:!0,id:"error1-msg",children:"This field contains an invalid value"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"error2",required:!0,children:"REQUIRED FIELD EMPTY"}),e.jsx(d,{id:"error2",placeholder:"This field is required",error:!0,"aria-describedby":"error2-msg"}),e.jsx(m,{error:!0,id:"error2-msg",children:"This field is required"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"error3",children:"FIELD WITH WARNING"}),e.jsx(d,{id:"error3",value:"KXYZ","aria-describedby":"error3-msg"}),e.jsx(m,{id:"error3-msg",className:"text-yellow-500",children:"Warning: Unknown airport code"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"success",children:"VALID FIELD"}),e.jsx(d,{id:"success",value:"KJFK",className:"border-green-500 focus-visible:ring-green-500","aria-describedby":"success-msg"}),e.jsx(m,{id:"success-msg",className:"text-green-500",children:"Valid ICAO code: John F. Kennedy International"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"disabled",children:"DISABLED FIELD"}),e.jsx(d,{id:"disabled",value:"Cannot edit",disabled:!0,"aria-describedby":"disabled-desc"}),e.jsx(u,{id:"disabled-desc",children:"This field is locked"})]})]}),parameters:{layout:"padded",docs:{description:{story:"Various error and validation states: error, warning, success, and disabled."}}}},S={args:{children:null},render:()=>{const[r,o]=p.useState({text:"",number:"",email:"",password:"",textarea:"",checkbox:!1,switch:!1});return e.jsxs("div",{className:"w-[400px] space-y-4 p-4 border border-border bg-card/50",children:[e.jsx("h3",{className:"font-display text-sm text-primary",children:"SUPPORTED FIELD TYPES"}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"text",children:"TEXT INPUT"}),e.jsx(d,{id:"text",type:"text",placeholder:"Enter text...",value:r.text,onChange:s=>o({...r,text:s.target.value})})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"number",children:"NUMBER INPUT"}),e.jsx(d,{id:"number",type:"number",placeholder:"Enter number...",value:r.number,onChange:s=>o({...r,number:s.target.value})})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"email",children:"EMAIL INPUT"}),e.jsx(d,{id:"email",type:"email",placeholder:"pilot@sofia.ai",value:r.email,onChange:s=>o({...r,email:s.target.value})})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"password",children:"PASSWORD INPUT"}),e.jsx(d,{id:"password",type:"password",placeholder:"Enter password...",value:r.password,onChange:s=>o({...r,password:s.target.value})})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"textarea",children:"TEXTAREA"}),e.jsx(O,{id:"textarea",placeholder:"Enter longer text...",value:r.textarea,onChange:s=>o({...r,textarea:s.target.value}),rows:3})]}),e.jsxs(t,{className:"flex items-center gap-3",children:[e.jsx(N,{id:"checkbox",checked:r.checkbox,onCheckedChange:s=>o({...r,checkbox:s===!0})}),e.jsx(a,{htmlFor:"checkbox",children:"CHECKBOX OPTION"})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsx(a,{htmlFor:"switch",children:"SWITCH TOGGLE"}),e.jsx(j,{id:"switch",checked:r.switch,onCheckedChange:s=>o({...r,switch:s})})]}),e.jsx("div",{className:"pt-4 border-t border-border",children:e.jsxs("p",{className:"text-xs font-mono text-muted-foreground",children:["VALUES: ",JSON.stringify(r,null,2)]})})]})},parameters:{layout:"padded",docs:{description:{story:"All supported field types: text, number, email, password, textarea, checkbox, and switch."}}}},q=()=>{const[r,o]=p.useState({ipAddress:"127.0.0.1",port:"49000",controlRate:"20",autoReconnect:!0,safetyMonitor:!0,recordFlights:!1}),[s,b]=p.useState({}),[c,g]=p.useState("idle"),n=i=>/^(\d{1,3}\.){3}\d{1,3}$/.test(i)?i.split(".").map(Number).some(f=>f>255)?"Invalid IP address":"":"Invalid IP address format",l=i=>{i.preventDefault();const h={},F=n(r.ipAddress);F&&(h.ipAddress=F);const f=parseInt(r.port);(isNaN(f)||f<1024||f>65535)&&(h.port="Port must be 1024-65535");const A=parseInt(r.controlRate);(isNaN(A)||A<1||A>50)&&(h.controlRate="Rate must be 1-50 Hz"),b(h),Object.keys(h).length===0&&(g("connecting"),setTimeout(()=>g("connected"),1500))};return e.jsxs("form",{onSubmit:l,className:"w-[380px] space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"font-display text-lg text-primary",children:"X-PLANE CONNECTION"}),e.jsx(R,{variant:c==="connected"?"success":c==="connecting"?"warning":"outline",children:c==="connected"?"ONLINE":c==="connecting"?"CONNECTING...":"OFFLINE"})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-4",children:[e.jsx("h3",{className:"text-xs font-mono text-muted-foreground",children:"NETWORK SETTINGS"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs(t,{children:[e.jsx(a,{htmlFor:"ip",required:!0,children:"IP ADDRESS"}),e.jsx(d,{id:"ip",value:r.ipAddress,onChange:i=>o({...r,ipAddress:i.target.value}),error:!!s.ipAddress,className:"font-mono",disabled:c==="connected"}),e.jsx(m,{error:!0,children:s.ipAddress})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"port",required:!0,children:"UDP PORT"}),e.jsx(d,{id:"port",type:"number",value:r.port,onChange:i=>o({...r,port:i.target.value}),error:!!s.port,className:"font-mono",disabled:c==="connected"}),e.jsx(m,{error:!0,children:s.port})]})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"rate",required:!0,children:"CONTROL RATE (HZ)"}),e.jsx(d,{id:"rate",type:"number",value:r.controlRate,onChange:i=>o({...r,controlRate:i.target.value}),error:!!s.controlRate,className:"font-mono",disabled:c==="connected"}),e.jsx(u,{children:"UDP command frequency (default: 20 Hz)"}),e.jsx(m,{error:!0,children:s.controlRate})]})]}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-3",children:[e.jsx("h3",{className:"text-xs font-mono text-muted-foreground",children:"OPTIONS"}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"autorecon",children:"AUTO-RECONNECT"}),e.jsx(u,{children:"Reconnect on connection loss"})]}),e.jsx(j,{id:"autorecon",checked:r.autoReconnect,onCheckedChange:i=>o({...r,autoReconnect:i})})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"safety",children:"SAFETY MONITOR"}),e.jsx(u,{children:"50 Hz stall/overspeed protection"})]}),e.jsx(j,{id:"safety",checked:r.safetyMonitor,onCheckedChange:i=>o({...r,safetyMonitor:i})})]}),e.jsxs(t,{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{htmlFor:"record",children:"RECORD FLIGHTS"}),e.jsx(u,{children:"Save flight data to disk"})]}),e.jsx(j,{id:"record",checked:r.recordFlights,onCheckedChange:i=>o({...r,recordFlights:i})})]})]}),e.jsxs("div",{className:"flex gap-2",children:[c==="connected"?e.jsx(x,{type:"button",variant:"destructive",onClick:()=>g("idle"),children:"DISCONNECT"}):e.jsx(x,{type:"submit",disabled:c==="connecting",children:c==="connecting"?"CONNECTING...":"CONNECT"}),e.jsx(x,{type:"button",variant:"outline",disabled:c==="connected",children:"TEST CONNECTION"})]})]})},T={render:()=>e.jsx(q,{}),args:{children:null},parameters:{layout:"padded",docs:{description:{story:"X-Plane UDP connection configuration form with IP validation, port settings, and connection status."}}}},w={args:{children:null},render:()=>{const[r,o]=p.useState("");return e.jsxs("div",{className:"w-[500px] space-y-6",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"INLINE FORMS"}),e.jsxs("div",{className:"flex items-end gap-2",children:[e.jsxs(t,{className:"flex-1",children:[e.jsx(a,{htmlFor:"search",children:"SEARCH FLIGHTS"}),e.jsx(d,{id:"search",placeholder:"Enter callsign or route...",value:r,onChange:s=>o(s.target.value)})]}),e.jsx(x,{type:"button",children:"SEARCH"})]}),e.jsxs("div",{className:"flex items-end gap-2",children:[e.jsxs(t,{className:"w-24",children:[e.jsx(a,{htmlFor:"qty",children:"QTY"}),e.jsx(d,{id:"qty",type:"number",defaultValue:"1",className:"font-mono"})]}),e.jsxs(t,{className:"flex-1",children:[e.jsx(a,{htmlFor:"item",children:"ITEM CODE"}),e.jsx(d,{id:"item",placeholder:"Enter item...",className:"font-mono"})]}),e.jsx(x,{type:"button",variant:"outline",children:"ADD"})]}),e.jsx("div",{className:"p-4 border border-border bg-card/50",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t,{className:"flex-1",children:e.jsx(d,{placeholder:"Enter waypoint...",className:"font-mono"})}),e.jsx(x,{type:"button",size:"sm",children:"INSERT"}),e.jsx(x,{type:"button",size:"sm",variant:"ghost",children:"CLEAR"})]})})]})},parameters:{layout:"padded",docs:{description:{story:"Inline form layouts for search bars and quick-add interfaces."}}}},L={args:{children:null},render:()=>e.jsxs("div",{className:"w-[400px] space-y-6",children:[e.jsx("h3",{className:"font-display text-lg text-foreground",children:"FORM COMPONENT ANATOMY"}),e.jsxs("div",{className:"p-4 border border-border bg-card/50 space-y-6",children:[e.jsxs(t,{children:[e.jsxs(a,{htmlFor:"demo",required:!0,children:["FORM LABEL",e.jsx("span",{className:"ml-2 text-xs text-muted-foreground font-normal",children:"(with required indicator)"})]}),e.jsx(d,{id:"demo",placeholder:"Input placeholder text...","aria-describedby":"demo-desc demo-msg"}),e.jsx(u,{id:"demo-desc",children:"FormDescription: Helper text explaining the field"}),e.jsx(m,{id:"demo-msg",children:"FormMessage: Neutral message (no error prop)"})]}),e.jsxs(t,{children:[e.jsx(a,{htmlFor:"demo-error",required:!0,children:"FIELD WITH ERROR"}),e.jsx(d,{id:"demo-error",value:"Invalid input",error:!0,"aria-describedby":"demo-error-msg"}),e.jsx(m,{error:!0,id:"demo-error-msg",children:"FormMessage with error prop: This field has an error"})]}),e.jsxs("div",{className:"pt-4 border-t border-border space-y-2",children:[e.jsx("p",{className:"text-xs font-mono text-muted-foreground",children:"COMPONENTS:"}),e.jsxs("ul",{className:"text-xs space-y-1 text-muted-foreground",children:[e.jsxs("li",{children:[e.jsx("code",{className:"text-primary",children:"FormField"})," - Wrapper with spacing"]}),e.jsxs("li",{children:[e.jsx("code",{className:"text-primary",children:"FormLabel"})," - Accessible label with required indicator"]}),e.jsxs("li",{children:[e.jsx("code",{className:"text-primary",children:"FormDescription"})," - Help text"]}),e.jsxs("li",{children:[e.jsx("code",{className:"text-primary",children:"FormMessage"})," - Error/info message with role=alert"]})]})]})]})]}),parameters:{layout:"padded",docs:{description:{story:"Overview of all Form subcomponents: FormField, FormLabel, FormDescription, and FormMessage."}}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <SimpleFormDemo />,
  args: {
    children: null
  },
  parameters: {
    docs: {
      description: {
        story: "Basic form with real-time validation. Shows error states and success feedback."
      }
    }
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <TrainingConfigFormDemo />,
  args: {
    children: null
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Aviation-themed training configuration form with hyperparameters, feature toggles, and validation."
      }
    }
  }
}`,...y.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <LoginFormDemo />,
  args: {
    children: null
  },
  parameters: {
    docs: {
      description: {
        story: "Authentication form with validation, password field, and remember-me option."
      }
    }
  }
}`,...E.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <FlightPlanFormDemo />,
  args: {
    children: null
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Complex multi-field flight plan form with aviation-specific validation (ICAO codes, squawk codes, altitude)."
      }
    }
  }
}`,...C.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <div className="w-[350px] space-y-6">
      <h3 className="font-display text-lg text-foreground">ERROR STATES</h3>

      <FormField>
        <FormLabel htmlFor="error1" required>
          FIELD WITH ERROR
        </FormLabel>
        <Input id="error1" value="invalid value" error aria-describedby="error1-msg" />
        <FormMessage error id="error1-msg">
          This field contains an invalid value
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="error2" required>
          REQUIRED FIELD EMPTY
        </FormLabel>
        <Input id="error2" placeholder="This field is required" error aria-describedby="error2-msg" />
        <FormMessage error id="error2-msg">
          This field is required
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="error3">FIELD WITH WARNING</FormLabel>
        <Input id="error3" value="KXYZ" aria-describedby="error3-msg" />
        <FormMessage id="error3-msg" className="text-yellow-500">
          Warning: Unknown airport code
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="success">VALID FIELD</FormLabel>
        <Input id="success" value="KJFK" className="border-green-500 focus-visible:ring-green-500" aria-describedby="success-msg" />
        <FormMessage id="success-msg" className="text-green-500">
          Valid ICAO code: John F. Kennedy International
        </FormMessage>
      </FormField>

      <FormField>
        <FormLabel htmlFor="disabled">DISABLED FIELD</FormLabel>
        <Input id="disabled" value="Cannot edit" disabled aria-describedby="disabled-desc" />
        <FormDescription id="disabled-desc">
          This field is locked
        </FormDescription>
      </FormField>
    </div>,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Various error and validation states: error, warning, success, and disabled."
      }
    }
  }
}`,...I.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => {
    const [values, setValues] = useState({
      text: "",
      number: "",
      email: "",
      password: "",
      textarea: "",
      checkbox: false,
      switch: false
    });
    return <div className="w-[400px] space-y-4 p-4 border border-border bg-card/50">
        <h3 className="font-display text-sm text-primary">
          SUPPORTED FIELD TYPES
        </h3>

        <FormField>
          <FormLabel htmlFor="text">TEXT INPUT</FormLabel>
          <Input id="text" type="text" placeholder="Enter text..." value={values.text} onChange={e => setValues({
          ...values,
          text: e.target.value
        })} />
        </FormField>

        <FormField>
          <FormLabel htmlFor="number">NUMBER INPUT</FormLabel>
          <Input id="number" type="number" placeholder="Enter number..." value={values.number} onChange={e => setValues({
          ...values,
          number: e.target.value
        })} />
        </FormField>

        <FormField>
          <FormLabel htmlFor="email">EMAIL INPUT</FormLabel>
          <Input id="email" type="email" placeholder="pilot@sofia.ai" value={values.email} onChange={e => setValues({
          ...values,
          email: e.target.value
        })} />
        </FormField>

        <FormField>
          <FormLabel htmlFor="password">PASSWORD INPUT</FormLabel>
          <Input id="password" type="password" placeholder="Enter password..." value={values.password} onChange={e => setValues({
          ...values,
          password: e.target.value
        })} />
        </FormField>

        <FormField>
          <FormLabel htmlFor="textarea">TEXTAREA</FormLabel>
          <Textarea id="textarea" placeholder="Enter longer text..." value={values.textarea} onChange={e => setValues({
          ...values,
          textarea: e.target.value
        })} rows={3} />
        </FormField>

        <FormField className="flex items-center gap-3">
          <Checkbox id="checkbox" checked={values.checkbox} onCheckedChange={checked => setValues({
          ...values,
          checkbox: checked === true
        })} />
          <FormLabel htmlFor="checkbox">CHECKBOX OPTION</FormLabel>
        </FormField>

        <FormField className="flex items-center justify-between">
          <FormLabel htmlFor="switch">SWITCH TOGGLE</FormLabel>
          <Switch id="switch" checked={values.switch} onCheckedChange={checked => setValues({
          ...values,
          switch: checked
        })} />
        </FormField>

        <div className="pt-4 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground">
            VALUES: {JSON.stringify(values, null, 2)}
          </p>
        </div>
      </div>;
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "All supported field types: text, number, email, password, textarea, checkbox, and switch."
      }
    }
  }
}`,...S.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <XPlaneConnectionFormDemo />,
  args: {
    children: null
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "X-Plane UDP connection configuration form with IP validation, port settings, and connection status."
      }
    }
  }
}`,...T.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => {
    const [search, setSearch] = useState("");
    return <div className="w-[500px] space-y-6">
        <h3 className="font-display text-lg text-foreground">INLINE FORMS</h3>

        <div className="flex items-end gap-2">
          <FormField className="flex-1">
            <FormLabel htmlFor="search">SEARCH FLIGHTS</FormLabel>
            <Input id="search" placeholder="Enter callsign or route..." value={search} onChange={e => setSearch(e.target.value)} />
          </FormField>
          <Button type="button">SEARCH</Button>
        </div>

        <div className="flex items-end gap-2">
          <FormField className="w-24">
            <FormLabel htmlFor="qty">QTY</FormLabel>
            <Input id="qty" type="number" defaultValue="1" className="font-mono" />
          </FormField>
          <FormField className="flex-1">
            <FormLabel htmlFor="item">ITEM CODE</FormLabel>
            <Input id="item" placeholder="Enter item..." className="font-mono" />
          </FormField>
          <Button type="button" variant="outline">
            ADD
          </Button>
        </div>

        <div className="p-4 border border-border bg-card/50">
          <div className="flex items-center gap-4">
            <FormField className="flex-1">
              <Input placeholder="Enter waypoint..." className="font-mono" />
            </FormField>
            <Button type="button" size="sm">
              INSERT
            </Button>
            <Button type="button" size="sm" variant="ghost">
              CLEAR
            </Button>
          </div>
        </div>
      </div>;
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Inline form layouts for search bars and quick-add interfaces."
      }
    }
  }
}`,...w.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: () => <div className="w-[400px] space-y-6">
      <h3 className="font-display text-lg text-foreground">
        FORM COMPONENT ANATOMY
      </h3>

      <div className="p-4 border border-border bg-card/50 space-y-6">
        <FormField>
          <FormLabel htmlFor="demo" required>
            FORM LABEL
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (with required indicator)
            </span>
          </FormLabel>
          <Input id="demo" placeholder="Input placeholder text..." aria-describedby="demo-desc demo-msg" />
          <FormDescription id="demo-desc">
            FormDescription: Helper text explaining the field
          </FormDescription>
          <FormMessage id="demo-msg">
            FormMessage: Neutral message (no error prop)
          </FormMessage>
        </FormField>

        <FormField>
          <FormLabel htmlFor="demo-error" required>
            FIELD WITH ERROR
          </FormLabel>
          <Input id="demo-error" value="Invalid input" error aria-describedby="demo-error-msg" />
          <FormMessage error id="demo-error-msg">
            FormMessage with error prop: This field has an error
          </FormMessage>
        </FormField>

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs font-mono text-muted-foreground">COMPONENTS:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>
              <code className="text-primary">FormField</code> - Wrapper with
              spacing
            </li>
            <li>
              <code className="text-primary">FormLabel</code> - Accessible label
              with required indicator
            </li>
            <li>
              <code className="text-primary">FormDescription</code> - Help text
            </li>
            <li>
              <code className="text-primary">FormMessage</code> - Error/info
              message with role=alert
            </li>
          </ul>
        </div>
      </div>
    </div>,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Overview of all Form subcomponents: FormField, FormLabel, FormDescription, and FormMessage."
      }
    }
  }
}`,...L.parameters?.docs?.source}}};const le=["SimpleValidation","TrainingConfiguration","LoginForm","FlightPlanForm","ErrorStates","FieldTypes","XPlaneConnection","InlineForm","AllComponents"];export{L as AllComponents,I as ErrorStates,S as FieldTypes,C as FlightPlanForm,w as InlineForm,E as LoginForm,v as SimpleValidation,y as TrainingConfiguration,T as XPlaneConnection,le as __namedExportsOrder,ie as default};
