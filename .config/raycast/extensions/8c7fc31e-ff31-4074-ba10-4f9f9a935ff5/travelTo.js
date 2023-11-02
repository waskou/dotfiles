"use strict";var m=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var b=(n,t)=>{for(var i in t)m(n,i,{get:t[i],enumerable:!0})},k=(n,t,i,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of L(t))!x.call(n,r)&&r!==i&&m(n,r,{get:()=>t[r],enumerable:!(a=A(t,r))||a.enumerable});return n};var B=n=>k(m({},"__esModule",{value:!0}),n);var R={};b(R,{default:()=>w});module.exports=B(R);var e=require("@raycast/api"),s=require("react");var d=require("@raycast/api"),C=async()=>(0,d.getSelectedText)().then(async n=>f(n)?await h():n).catch(async()=>await h()).then(n=>f(n)?"":n).catch(()=>""),f=n=>!(n!=null&&String(n).length>0),h=async()=>{let n=await d.Clipboard.readText();return typeof n>"u"?"":n};function g(n,t,i){return"https://www.google.com/maps/dir/?api=1"+"&origin="+encodeURI(n)+"&destination="+encodeURI(t)+"&travelmode="+encodeURI(i)}var o=require("react/jsx-runtime");function w(){let n=(0,e.getPreferenceValues)(),[t,i]=(0,s.useState)("curloc"),[a,r]=(0,s.useState)(""),[p,u]=(0,s.useState)(""),[l,O]=(0,s.useState)(n.preferredMode),[I,D]=(0,s.useState)(n.useSelected);(0,s.useEffect)(()=>{async function c(){let y=await C();u(y),D(!1)}n.useSelected&&c().then()},[]);let v=c=>{c==="curloc"?(r(""),i("curloc")):c==="home"?(r(n.homeAddress),i("home")):(r(""),i("custom"))};return(0,o.jsxs)(e.Form,{isLoading:I,actions:(0,o.jsxs)(e.ActionPanel,{children:[(0,o.jsx)(e.Action.OpenInBrowser,{url:g(a,p,l),icon:e.Icon.Globe,onOpen:()=>(0,e.popToRoot)()}),(0,o.jsx)(e.Action.CopyToClipboard,{content:g(a,p,l),icon:e.Icon.Clipboard,onCopy:()=>(0,e.popToRoot)()})]}),children:[(0,o.jsx)(e.Form.TextField,{id:"destination",title:"Destination",placeholder:"Name or Address",value:p,onChange:u}),(0,o.jsx)(e.Form.Separator,{}),(0,o.jsxs)(e.Form.Dropdown,{id:"origin",title:"Origin",value:t,onChange:v,children:[(0,o.jsx)(e.Form.Dropdown.Item,{value:"curloc",title:"Current Location",icon:"\u{1F4CD}"}),(0,o.jsx)(e.Form.Dropdown.Item,{value:"home",title:"Home",icon:"\u{1F3E0}"}),(0,o.jsx)(e.Form.Dropdown.Item,{value:"custom",title:"Custom Address",icon:"\u270F\uFE0F"})]}),t==="custom"&&(0,o.jsx)(e.Form.TextField,{id:"originAddress",title:"Origin Address",placeholder:"Name or Address",value:a,onChange:r}),(0,o.jsxs)(e.Form.Dropdown,{id:"travelmode",title:"Travel Mode",value:l,onChange:O,children:[(0,o.jsx)(e.Form.Dropdown.Item,{value:"driving",title:"Car",icon:"\u{1F697}"}),(0,o.jsx)(e.Form.Dropdown.Item,{value:"transit",title:"Public Transport",icon:"\u{1F686}"}),(0,o.jsx)(e.Form.Dropdown.Item,{value:"walking",title:"Walk",icon:"\u{1F6B6}\u200D\u2640\uFE0F"}),(0,o.jsx)(e.Form.Dropdown.Item,{value:"bicycling",title:"Bike",icon:"\u{1F6B2}"})]})]})}0&&(module.exports={});