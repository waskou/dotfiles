"use strict";var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var c=Object.prototype.hasOwnProperty;var f=(e,t)=>{for(var s in t)a(e,s,{get:t[s],enumerable:!0})},h=(e,t,s,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of i(t))!c.call(e,o)&&o!==s&&a(e,o,{get:()=>t[o],enumerable:!(n=p(t,o))||n.enumerable});return e};var l=e=>h(a({},"__esModule",{value:!0}),e);var $={};f($,{default:()=>m});module.exports=l($);var r=require("@raycast/api"),m=async()=>{let{host:e,port:t,ssl:s}=(0,r.getPreferenceValues)();await(0,r.open)(`${s?"https":"http"}://${e}:${t}/transmission/web/`)};0&&(module.exports={});
