"use strict";var r=Object.defineProperty;var n=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var s=(o,a)=>{for(var t in a)r(o,t,{get:a[t],enumerable:!0})},d=(o,a,t,c)=>{if(a&&typeof a=="object"||typeof a=="function")for(let e of i(a))!l.call(o,e)&&e!==t&&r(o,e,{get:()=>a[e],enumerable:!(c=n(a,e))||c.enumerable});return o};var h=o=>d(r({},"__esModule",{value:!0}),o);var f={};s(f,{default:()=>m});module.exports=h(f);var p=require("@raycast/api"),m=async()=>{(0,p.open)("https://app.dashlane.com"),await(0,p.closeMainWindow)({clearRootSearch:!0})};0&&(module.exports={});