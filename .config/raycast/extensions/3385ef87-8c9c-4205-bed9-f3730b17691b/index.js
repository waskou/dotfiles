"use strict";var y=Object.create;var u=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var A=(t,e)=>{for(var r in e)u(t,r,{get:e[r],enumerable:!0})},d=(t,e,r,p)=>{if(e&&typeof e=="object"||typeof e=="function")for(let m of D(e))!x.call(t,m)&&m!==r&&u(t,m,{get:()=>e[m],enumerable:!(p=F(e,m))||p.enumerable});return t};var P=(t,e,r)=>(r=t!=null?y(b(t)):{},d(e||!t||!t.__esModule?u(r,"default",{value:t,enumerable:!0}):r,t)),O=t=>d(u({},"__esModule",{value:!0}),t);var v={};A(v,{default:()=>g});module.exports=O(v);var o=require("@raycast/api");var s=require("@raycast/api");async function f(){let{items:t}=await s.LocalStorage.allItems();return t?JSON.parse(t):[]}async function I(t){await s.LocalStorage.setItem("items",JSON.stringify(t))}var c=P(require("crypto"),1);var h="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var T=128,i,n,N=t=>{!i||i.length<t?(i=Buffer.allocUnsafe(t*T),c.default.randomFillSync(i),n=0):n+t>i.length&&(c.default.randomFillSync(i),n=0),n+=t};var w=(t=21)=>{N(t-=0);let e="";for(let r=n-t;r<n;r++)e+=h[i[r]&63];return e};var a=require("@raycast/api");function S(t){return t.name===""?((0,a.showToast)(a.Toast.Style.Failure,"An error occurred","Name can not be empty"),!1):t.date===null?((0,a.showToast)(a.Toast.Style.Failure,"An error occurred","Please select a date"),!1):!0}var l=require("react/jsx-runtime");function g(){async function t(e){if(S(e)){let r=await f();r.push({...e,id:w()}),(0,o.popToRoot)(),I(r),(0,o.showToast)({title:"Success",message:"Successfully added item"})}}return(0,l.jsxs)(o.Form,{actions:(0,l.jsx)(o.ActionPanel,{children:(0,l.jsx)(o.Action.SubmitForm,{onSubmit:t})}),children:[(0,l.jsx)(o.Form.TextField,{id:"name",title:"Name",placeholder:"Enter Name"}),(0,l.jsx)(o.Form.TextField,{id:"subtitle",title:"Subtitle",placeholder:"Enter Subtitle (optional)"}),(0,l.jsx)(o.Form.DatePicker,{id:"date",title:"Date"}),(0,l.jsx)(o.Form.Dropdown,{id:"icon",title:"Icon",defaultValue:"",children:Object.entries(o.Icon).map(([e,r])=>(0,l.jsx)(o.Form.Dropdown.Item,{value:r,title:e,icon:r},e))}),(0,l.jsxs)(o.Form.Dropdown,{id:"color",title:"Color",defaultValue:"",children:[(0,l.jsx)(o.Form.Dropdown.Item,{value:"",title:"No Color"}),Object.entries(o.Color).map(([e,r])=>(0,l.jsx)(o.Form.Dropdown.Item,{value:`${r}`,title:e,icon:{source:o.Icon.Dot,tintColor:r}},e))]})]})}
