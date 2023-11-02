"use strict";var Mn=Object.create;var W=Object.defineProperty;var Bn=Object.getOwnPropertyDescriptor;var jn=Object.getOwnPropertyNames;var Un=Object.getPrototypeOf,Dn=Object.prototype.hasOwnProperty;var c=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Wn=(e,t)=>{for(var r in t)W(e,r,{get:t[r],enumerable:!0})},ke=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of jn(t))!Dn.call(e,o)&&o!==r&&W(e,o,{get:()=>t[o],enumerable:!(n=Bn(t,o))||n.enumerable});return e};var X=(e,t,r)=>(r=e!=null?Mn(Un(e)):{},ke(t||!e||!e.__esModule?W(r,"default",{value:e,enumerable:!0}):r,e)),Xn=e=>ke(W({},"__esModule",{value:!0}),e);var Be=c((Yo,Me)=>{Me.exports=Le;Le.sync=Kn;var _e=require("fs");function Hn(e,t){var r=t.pathExt!==void 0?t.pathExt:process.env.PATHEXT;if(!r||(r=r.split(";"),r.indexOf("")!==-1))return!0;for(var n=0;n<r.length;n++){var o=r[n].toLowerCase();if(o&&e.substr(-o.length).toLowerCase()===o)return!0}return!1}function Fe(e,t,r){return!e.isSymbolicLink()&&!e.isFile()?!1:Hn(t,r)}function Le(e,t,r){_e.stat(e,function(n,o){r(n,n?!1:Fe(o,e,t))})}function Kn(e,t){return Fe(_e.statSync(e),e,t)}});var Xe=c((Qo,We)=>{We.exports=Ue;Ue.sync=zn;var je=require("fs");function Ue(e,t,r){je.stat(e,function(n,o){r(n,n?!1:De(o,t))})}function zn(e,t){return De(je.statSync(e),t)}function De(e,t){return e.isFile()&&Vn(e,t)}function Vn(e,t){var r=e.mode,n=e.uid,o=e.gid,s=t.uid!==void 0?t.uid:process.getuid&&process.getuid(),i=t.gid!==void 0?t.gid:process.getgid&&process.getgid(),a=parseInt("100",8),u=parseInt("010",8),l=parseInt("001",8),f=a|u,h=r&l||r&u&&o===i||r&a&&n===s||r&f&&s===0;return h}});var Ke=c((Jo,He)=>{var Zo=require("fs"),H;process.platform==="win32"||global.TESTING_WINDOWS?H=Be():H=Xe();He.exports=de;de.sync=Yn;function de(e,t,r){if(typeof t=="function"&&(r=t,t={}),!r){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(n,o){de(e,t||{},function(s,i){s?o(s):n(i)})})}H(e,t||{},function(n,o){n&&(n.code==="EACCES"||t&&t.ignoreErrors)&&(n=null,o=!1),r(n,o)})}function Yn(e,t){try{return H.sync(e,t||{})}catch(r){if(t&&t.ignoreErrors||r.code==="EACCES")return!1;throw r}}});var et=c((es,Je)=>{var T=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys",ze=require("path"),Qn=T?";":":",Ve=Ke(),Ye=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),Qe=(e,t)=>{let r=t.colon||Qn,n=e.match(/\//)||T&&e.match(/\\/)?[""]:[...T?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(r)],o=T?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",s=T?o.split(r):[""];return T&&e.indexOf(".")!==-1&&s[0]!==""&&s.unshift(""),{pathEnv:n,pathExt:s,pathExtExe:o}},Ze=(e,t,r)=>{typeof t=="function"&&(r=t,t={}),t||(t={});let{pathEnv:n,pathExt:o,pathExtExe:s}=Qe(e,t),i=[],a=l=>new Promise((f,h)=>{if(l===n.length)return t.all&&i.length?f(i):h(Ye(e));let p=n[l],g=/^".*"$/.test(p)?p.slice(1,-1):p,y=ze.join(g,e),S=!g&&/^\.[\\\/]/.test(e)?e.slice(0,2)+y:y;f(u(S,l,0))}),u=(l,f,h)=>new Promise((p,g)=>{if(h===o.length)return p(a(f+1));let y=o[h];Ve(l+y,{pathExt:s},(S,v)=>{if(!S&&v)if(t.all)i.push(l+y);else return p(l+y);return p(u(l,f,h+1))})});return r?a(0).then(l=>r(null,l),r):a(0)},Zn=(e,t)=>{t=t||{};let{pathEnv:r,pathExt:n,pathExtExe:o}=Qe(e,t),s=[];for(let i=0;i<r.length;i++){let a=r[i],u=/^".*"$/.test(a)?a.slice(1,-1):a,l=ze.join(u,e),f=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;for(let h=0;h<n.length;h++){let p=f+n[h];try{if(Ve.sync(p,{pathExt:o}))if(t.all)s.push(p);else return p}catch{}}}if(t.all&&s.length)return s;if(t.nothrow)return null;throw Ye(e)};Je.exports=Ze;Ze.sync=Zn});var me=c((ts,fe)=>{"use strict";var tt=(e={})=>{let t=e.env||process.env;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(t).reverse().find(n=>n.toUpperCase()==="PATH")||"Path"};fe.exports=tt;fe.exports.default=tt});var st=c((ns,ot)=>{"use strict";var nt=require("path"),Jn=et(),er=me();function rt(e,t){let r=e.options.env||process.env,n=process.cwd(),o=e.options.cwd!=null,s=o&&process.chdir!==void 0&&!process.chdir.disabled;if(s)try{process.chdir(e.options.cwd)}catch{}let i;try{i=Jn.sync(e.command,{path:r[er({env:r})],pathExt:t?nt.delimiter:void 0})}catch{}finally{s&&process.chdir(n)}return i&&(i=nt.resolve(o?e.options.cwd:"",i)),i}function tr(e){return rt(e)||rt(e,!0)}ot.exports=tr});var it=c((rs,he)=>{"use strict";var pe=/([()\][%!^"`<>&|;, *?])/g;function nr(e){return e=e.replace(pe,"^$1"),e}function rr(e,t){return e=`${e}`,e=e.replace(/(\\*)"/g,'$1$1\\"'),e=e.replace(/(\\*)$/,"$1$1"),e=`"${e}"`,e=e.replace(pe,"^$1"),t&&(e=e.replace(pe,"^$1")),e}he.exports.command=nr;he.exports.argument=rr});var ct=c((os,at)=>{"use strict";at.exports=/^#!(.*)/});var lt=c((ss,ut)=>{"use strict";var or=ct();ut.exports=(e="")=>{let t=e.match(or);if(!t)return null;let[r,n]=t[0].replace(/#! ?/,"").split(" "),o=r.split("/").pop();return o==="env"?n:n?`${o} ${n}`:o}});var ft=c((is,dt)=>{"use strict";var ge=require("fs"),sr=lt();function ir(e){let r=Buffer.alloc(150),n;try{n=ge.openSync(e,"r"),ge.readSync(n,r,0,150,0),ge.closeSync(n)}catch{}return sr(r.toString())}dt.exports=ir});var gt=c((as,ht)=>{"use strict";var ar=require("path"),mt=st(),pt=it(),cr=ft(),ur=process.platform==="win32",lr=/\.(?:com|exe)$/i,dr=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function fr(e){e.file=mt(e);let t=e.file&&cr(e.file);return t?(e.args.unshift(e.file),e.command=t,mt(e)):e.file}function mr(e){if(!ur)return e;let t=fr(e),r=!lr.test(t);if(e.options.forceShell||r){let n=dr.test(t);e.command=ar.normalize(e.command),e.command=pt.command(e.command),e.args=e.args.map(s=>pt.argument(s,n));let o=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${o}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function pr(e,t,r){t&&!Array.isArray(t)&&(r=t,t=null),t=t?t.slice(0):[],r=Object.assign({},r);let n={command:e,args:t,options:r,file:void 0,original:{command:e,args:t}};return r.shell?n:mr(n)}ht.exports=pr});var wt=c((cs,St)=>{"use strict";var ye=process.platform==="win32";function Se(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function hr(e,t){if(!ye)return;let r=e.emit;e.emit=function(n,o){if(n==="exit"){let s=yt(o,t,"spawn");if(s)return r.call(e,"error",s)}return r.apply(e,arguments)}}function yt(e,t){return ye&&e===1&&!t.file?Se(t.original,"spawn"):null}function gr(e,t){return ye&&e===1&&!t.file?Se(t.original,"spawnSync"):null}St.exports={hookChildProcess:hr,verifyENOENT:yt,verifyENOENTSync:gr,notFoundError:Se}});var Et=c((us,P)=>{"use strict";var xt=require("child_process"),we=gt(),xe=wt();function bt(e,t,r){let n=we(e,t,r),o=xt.spawn(n.command,n.args,n.options);return xe.hookChildProcess(o,n),o}function yr(e,t,r){let n=we(e,t,r),o=xt.spawnSync(n.command,n.args,n.options);return o.error=o.error||xe.verifyENOENTSync(o.status,n),o}P.exports=bt;P.exports.spawn=bt;P.exports.sync=yr;P.exports._parse=we;P.exports._enoent=xe});var vt=c((ls,It)=>{"use strict";It.exports=e=>{let t=typeof e=="string"?`
`:`
`.charCodeAt(),r=typeof e=="string"?"\r":"\r".charCodeAt();return e[e.length-1]===t&&(e=e.slice(0,e.length-1)),e[e.length-1]===r&&(e=e.slice(0,e.length-1)),e}});var Ct=c((ds,_)=>{"use strict";var k=require("path"),Tt=me(),Pt=e=>{e={cwd:process.cwd(),path:process.env[Tt()],execPath:process.execPath,...e};let t,r=k.resolve(e.cwd),n=[];for(;t!==r;)n.push(k.join(r,"node_modules/.bin")),t=r,r=k.resolve(r,"..");let o=k.resolve(e.cwd,e.execPath,"..");return n.push(o),n.concat(e.path).join(k.delimiter)};_.exports=Pt;_.exports.default=Pt;_.exports.env=e=>{e={env:process.env,...e};let t={...e.env},r=Tt({env:t});return e.path=t[r],t[r]=_.exports(e),t}});var At=c((fs,be)=>{"use strict";var Gt=(e,t)=>{for(let r of Reflect.ownKeys(t))Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r));return e};be.exports=Gt;be.exports.default=Gt});var Rt=c((ms,z)=>{"use strict";var Sr=At(),K=new WeakMap,Ot=(e,t={})=>{if(typeof e!="function")throw new TypeError("Expected a function");let r,n=0,o=e.displayName||e.name||"<anonymous>",s=function(...i){if(K.set(s,++n),n===1)r=e.apply(this,i),e=null;else if(t.throw===!0)throw new Error(`Function \`${o}\` can only be called once`);return r};return Sr(s,e),K.set(s,n),s};z.exports=Ot;z.exports.default=Ot;z.exports.callCount=e=>{if(!K.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return K.get(e)}});var Nt=c(V=>{"use strict";Object.defineProperty(V,"__esModule",{value:!0});V.SIGNALS=void 0;var wr=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}];V.SIGNALS=wr});var Ee=c(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.SIGRTMAX=C.getRealtimeSignals=void 0;var xr=function(){let e=$t-qt+1;return Array.from({length:e},br)};C.getRealtimeSignals=xr;var br=function(e,t){return{name:`SIGRT${t+1}`,number:qt+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}},qt=34,$t=64;C.SIGRTMAX=$t});var kt=c(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.getSignals=void 0;var Er=require("os"),Ir=Nt(),vr=Ee(),Tr=function(){let e=(0,vr.getRealtimeSignals)();return[...Ir.SIGNALS,...e].map(Pr)};Y.getSignals=Tr;var Pr=function({name:e,number:t,description:r,action:n,forced:o=!1,standard:s}){let{signals:{[e]:i}}=Er.constants,a=i!==void 0;return{name:e,number:a?i:t,description:r,supported:a,action:n,forced:o,standard:s}}});var Ft=c(G=>{"use strict";Object.defineProperty(G,"__esModule",{value:!0});G.signalsByNumber=G.signalsByName=void 0;var Cr=require("os"),_t=kt(),Gr=Ee(),Ar=function(){return(0,_t.getSignals)().reduce(Or,{})},Or=function(e,{name:t,number:r,description:n,supported:o,action:s,forced:i,standard:a}){return{...e,[t]:{name:t,number:r,description:n,supported:o,action:s,forced:i,standard:a}}},Rr=Ar();G.signalsByName=Rr;var Nr=function(){let e=(0,_t.getSignals)(),t=Gr.SIGRTMAX+1,r=Array.from({length:t},(n,o)=>qr(o,e));return Object.assign({},...r)},qr=function(e,t){let r=$r(e,t);if(r===void 0)return{};let{name:n,description:o,supported:s,action:i,forced:a,standard:u}=r;return{[e]:{name:n,number:e,description:o,supported:s,action:i,forced:a,standard:u}}},$r=function(e,t){let r=t.find(({name:n})=>Cr.constants.signals[n]===e);return r!==void 0?r:t.find(n=>n.number===e)},kr=Nr();G.signalsByNumber=kr});var Mt=c((Ss,Lt)=>{"use strict";var{signalsByName:_r}=Ft(),Fr=({timedOut:e,timeout:t,errorCode:r,signal:n,signalDescription:o,exitCode:s,isCanceled:i})=>e?`timed out after ${t} milliseconds`:i?"was canceled":r!==void 0?`failed with ${r}`:n!==void 0?`was killed with ${n} (${o})`:s!==void 0?`failed with exit code ${s}`:"failed",Lr=({stdout:e,stderr:t,all:r,error:n,signal:o,exitCode:s,command:i,escapedCommand:a,timedOut:u,isCanceled:l,killed:f,parsed:{options:{timeout:h}}})=>{s=s===null?void 0:s,o=o===null?void 0:o;let p=o===void 0?void 0:_r[o].description,g=n&&n.code,S=`Command ${Fr({timedOut:u,timeout:h,errorCode:g,signal:o,signalDescription:p,exitCode:s,isCanceled:l})}: ${i}`,v=Object.prototype.toString.call(n)==="[object Error]",U=v?`${S}
${n.message}`:S,D=[U,t,e].filter(Boolean).join(`
`);return v?(n.originalMessage=n.message,n.message=D):n=new Error(D),n.shortMessage=U,n.command=i,n.escapedCommand=a,n.exitCode=s,n.signal=o,n.signalDescription=p,n.stdout=e,n.stderr=t,r!==void 0&&(n.all=r),"bufferedData"in n&&delete n.bufferedData,n.failed=!0,n.timedOut=!!u,n.isCanceled=l,n.killed=f&&!u,n};Lt.exports=Lr});var jt=c((ws,Ie)=>{"use strict";var Q=["stdin","stdout","stderr"],Mr=e=>Q.some(t=>e[t]!==void 0),Bt=e=>{if(!e)return;let{stdio:t}=e;if(t===void 0)return Q.map(n=>e[n]);if(Mr(e))throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${Q.map(n=>`\`${n}\``).join(", ")}`);if(typeof t=="string")return t;if(!Array.isArray(t))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);let r=Math.max(t.length,Q.length);return Array.from({length:r},(n,o)=>t[o])};Ie.exports=Bt;Ie.exports.node=e=>{let t=Bt(e);return t==="ipc"?"ipc":t===void 0||typeof t=="string"?[t,t,t,"ipc"]:t.includes("ipc")?t:[...t,"ipc"]}});var Ut=c((xs,Z)=>{Z.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&Z.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&Z.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var Kt=c((bs,R)=>{var d=global.process,E=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};E(d)?(Dt=require("assert"),A=Ut(),Wt=/^win/i.test(d.platform),F=require("events"),typeof F!="function"&&(F=F.EventEmitter),d.__signal_exit_emitter__?m=d.__signal_exit_emitter__:(m=d.__signal_exit_emitter__=new F,m.count=0,m.emitted={}),m.infinite||(m.setMaxListeners(1/0),m.infinite=!0),R.exports=function(e,t){if(!E(global.process))return function(){};Dt.equal(typeof e,"function","a callback must be provided for exit handler"),O===!1&&ve();var r="exit";t&&t.alwaysLast&&(r="afterexit");var n=function(){m.removeListener(r,e),m.listeners("exit").length===0&&m.listeners("afterexit").length===0&&J()};return m.on(r,e),n},J=function(){!O||!E(global.process)||(O=!1,A.forEach(function(t){try{d.removeListener(t,ee[t])}catch{}}),d.emit=te,d.reallyExit=Te,m.count-=1)},R.exports.unload=J,I=function(t,r,n){m.emitted[t]||(m.emitted[t]=!0,m.emit(t,r,n))},ee={},A.forEach(function(e){ee[e]=function(){if(E(global.process)){var r=d.listeners(e);r.length===m.count&&(J(),I("exit",null,e),I("afterexit",null,e),Wt&&e==="SIGHUP"&&(e="SIGINT"),d.kill(d.pid,e))}}}),R.exports.signals=function(){return A},O=!1,ve=function(){O||!E(global.process)||(O=!0,m.count+=1,A=A.filter(function(t){try{return d.on(t,ee[t]),!0}catch{return!1}}),d.emit=Ht,d.reallyExit=Xt)},R.exports.load=ve,Te=d.reallyExit,Xt=function(t){E(global.process)&&(d.exitCode=t||0,I("exit",d.exitCode,null),I("afterexit",d.exitCode,null),Te.call(d,d.exitCode))},te=d.emit,Ht=function(t,r){if(t==="exit"&&E(global.process)){r!==void 0&&(d.exitCode=r);var n=te.apply(this,arguments);return I("exit",d.exitCode,null),I("afterexit",d.exitCode,null),n}else return te.apply(this,arguments)}):R.exports=function(){return function(){}};var Dt,A,Wt,F,m,J,I,ee,O,ve,Te,Xt,te,Ht});var Vt=c((Es,zt)=>{"use strict";var Br=require("os"),jr=Kt(),Ur=1e3*5,Dr=(e,t="SIGTERM",r={})=>{let n=e(t);return Wr(e,t,r,n),n},Wr=(e,t,r,n)=>{if(!Xr(t,r,n))return;let o=Kr(r),s=setTimeout(()=>{e("SIGKILL")},o);s.unref&&s.unref()},Xr=(e,{forceKillAfterTimeout:t},r)=>Hr(e)&&t!==!1&&r,Hr=e=>e===Br.constants.signals.SIGTERM||typeof e=="string"&&e.toUpperCase()==="SIGTERM",Kr=({forceKillAfterTimeout:e=!0})=>{if(e===!0)return Ur;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e},zr=(e,t)=>{e.kill()&&(t.isCanceled=!0)},Vr=(e,t,r)=>{e.kill(t),r(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))},Yr=(e,{timeout:t,killSignal:r="SIGTERM"},n)=>{if(t===0||t===void 0)return n;let o,s=new Promise((a,u)=>{o=setTimeout(()=>{Vr(e,r,u)},t)}),i=n.finally(()=>{clearTimeout(o)});return Promise.race([s,i])},Qr=({timeout:e})=>{if(e!==void 0&&(!Number.isFinite(e)||e<0))throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`)},Zr=async(e,{cleanup:t,detached:r},n)=>{if(!t||r)return n;let o=jr(()=>{e.kill()});return n.finally(()=>{o()})};zt.exports={spawnedKill:Dr,spawnedCancel:zr,setupTimeout:Yr,validateTimeout:Qr,setExitHandler:Zr}});var Qt=c((Is,Yt)=>{"use strict";var w=e=>e!==null&&typeof e=="object"&&typeof e.pipe=="function";w.writable=e=>w(e)&&e.writable!==!1&&typeof e._write=="function"&&typeof e._writableState=="object";w.readable=e=>w(e)&&e.readable!==!1&&typeof e._read=="function"&&typeof e._readableState=="object";w.duplex=e=>w.writable(e)&&w.readable(e);w.transform=e=>w.duplex(e)&&typeof e._transform=="function";Yt.exports=w});var Jt=c((vs,Zt)=>{"use strict";var{PassThrough:Jr}=require("stream");Zt.exports=e=>{e={...e};let{array:t}=e,{encoding:r}=e,n=r==="buffer",o=!1;t?o=!(r||n):r=r||"utf8",n&&(r=null);let s=new Jr({objectMode:o});r&&s.setEncoding(r);let i=0,a=[];return s.on("data",u=>{a.push(u),o?i=a.length:i+=u.length}),s.getBufferedValue=()=>t?a:n?Buffer.concat(a,i):a.join(""),s.getBufferedLength=()=>i,s}});var en=c((Ts,L)=>{"use strict";var{constants:eo}=require("buffer"),to=require("stream"),{promisify:no}=require("util"),ro=Jt(),oo=no(to.pipeline),ne=class extends Error{constructor(){super("maxBuffer exceeded"),this.name="MaxBufferError"}};async function Pe(e,t){if(!e)throw new Error("Expected a stream");t={maxBuffer:1/0,...t};let{maxBuffer:r}=t,n=ro(t);return await new Promise((o,s)=>{let i=a=>{a&&n.getBufferedLength()<=eo.MAX_LENGTH&&(a.bufferedData=n.getBufferedValue()),s(a)};(async()=>{try{await oo(e,n),o()}catch(a){i(a)}})(),n.on("data",()=>{n.getBufferedLength()>r&&i(new ne)})}),n.getBufferedValue()}L.exports=Pe;L.exports.buffer=(e,t)=>Pe(e,{...t,encoding:"buffer"});L.exports.array=(e,t)=>Pe(e,{...t,array:!0});L.exports.MaxBufferError=ne});var nn=c((Ps,tn)=>{"use strict";var{PassThrough:so}=require("stream");tn.exports=function(){var e=[],t=new so({objectMode:!0});return t.setMaxListeners(0),t.add=r,t.isEmpty=n,t.on("unpipe",o),Array.prototype.slice.call(arguments).forEach(r),t;function r(s){return Array.isArray(s)?(s.forEach(r),this):(e.push(s),s.once("end",o.bind(null,s)),s.once("error",t.emit.bind(t,"error")),s.pipe(t,{end:!1}),this)}function n(){return e.length==0}function o(s){e=e.filter(function(i){return i!==s}),!e.length&&t.readable&&t.end()}}});var an=c((Cs,sn)=>{"use strict";var on=Qt(),rn=en(),io=nn(),ao=(e,t)=>{t===void 0||e.stdin===void 0||(on(t)?t.pipe(e.stdin):e.stdin.end(t))},co=(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;let r=io();return e.stdout&&r.add(e.stdout),e.stderr&&r.add(e.stderr),r},Ce=async(e,t)=>{if(e){e.destroy();try{return await t}catch(r){return r.bufferedData}}},Ge=(e,{encoding:t,buffer:r,maxBuffer:n})=>{if(!(!e||!r))return t?rn(e,{encoding:t,maxBuffer:n}):rn.buffer(e,{maxBuffer:n})},uo=async({stdout:e,stderr:t,all:r},{encoding:n,buffer:o,maxBuffer:s},i)=>{let a=Ge(e,{encoding:n,buffer:o,maxBuffer:s}),u=Ge(t,{encoding:n,buffer:o,maxBuffer:s}),l=Ge(r,{encoding:n,buffer:o,maxBuffer:s*2});try{return await Promise.all([i,a,u,l])}catch(f){return Promise.all([{error:f,signal:f.signal,timedOut:f.timedOut},Ce(e,a),Ce(t,u),Ce(r,l)])}},lo=({input:e})=>{if(on(e))throw new TypeError("The `input` option cannot be a stream in sync mode")};sn.exports={handleInput:ao,makeAllStream:co,getSpawnedResult:uo,validateInputSync:lo}});var un=c((Gs,cn)=>{"use strict";var fo=(async()=>{})().constructor.prototype,mo=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(fo,e)]),po=(e,t)=>{for(let[r,n]of mo){let o=typeof t=="function"?(...s)=>Reflect.apply(n.value,t(),s):n.value.bind(t);Reflect.defineProperty(e,r,{...n,value:o})}return e},ho=e=>new Promise((t,r)=>{e.on("exit",(n,o)=>{t({exitCode:n,signal:o})}),e.on("error",n=>{r(n)}),e.stdin&&e.stdin.on("error",n=>{r(n)})});cn.exports={mergePromise:po,getSpawnedPromise:ho}});var fn=c((As,dn)=>{"use strict";var ln=(e,t=[])=>Array.isArray(t)?[e,...t]:[e],go=/^[\w.-]+$/,yo=/"/g,So=e=>typeof e!="string"||go.test(e)?e:`"${e.replace(yo,'\\"')}"`,wo=(e,t)=>ln(e,t).join(" "),xo=(e,t)=>ln(e,t).map(r=>So(r)).join(" "),bo=/ +/g,Eo=e=>{let t=[];for(let r of e.trim().split(bo)){let n=t[t.length-1];n&&n.endsWith("\\")?t[t.length-1]=`${n.slice(0,-1)} ${r}`:t.push(r)}return t};dn.exports={joinCommand:wo,getEscapedCommand:xo,parseCommand:Eo}});var wn=c((Os,N)=>{"use strict";var Io=require("path"),Ae=require("child_process"),vo=Et(),To=vt(),Po=Ct(),Co=Rt(),re=Mt(),pn=jt(),{spawnedKill:Go,spawnedCancel:Ao,setupTimeout:Oo,validateTimeout:Ro,setExitHandler:No}=Vt(),{handleInput:qo,getSpawnedResult:$o,makeAllStream:ko,validateInputSync:_o}=an(),{mergePromise:mn,getSpawnedPromise:Fo}=un(),{joinCommand:hn,parseCommand:gn,getEscapedCommand:yn}=fn(),Lo=1e3*1e3*100,Mo=({env:e,extendEnv:t,preferLocal:r,localDir:n,execPath:o})=>{let s=t?{...process.env,...e}:e;return r?Po.env({env:s,cwd:n,execPath:o}):s},Sn=(e,t,r={})=>{let n=vo._parse(e,t,r);return e=n.command,t=n.args,r=n.options,r={maxBuffer:Lo,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:r.cwd||process.cwd(),execPath:process.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0,...r},r.env=Mo(r),r.stdio=pn(r),process.platform==="win32"&&Io.basename(e,".exe")==="cmd"&&t.unshift("/q"),{file:e,args:t,options:r,parsed:n}},M=(e,t,r)=>typeof t!="string"&&!Buffer.isBuffer(t)?r===void 0?void 0:"":e.stripFinalNewline?To(t):t,oe=(e,t,r)=>{let n=Sn(e,t,r),o=hn(e,t),s=yn(e,t);Ro(n.options);let i;try{i=Ae.spawn(n.file,n.args,n.options)}catch(g){let y=new Ae.ChildProcess,S=Promise.reject(re({error:g,stdout:"",stderr:"",all:"",command:o,escapedCommand:s,parsed:n,timedOut:!1,isCanceled:!1,killed:!1}));return mn(y,S)}let a=Fo(i),u=Oo(i,n.options,a),l=No(i,n.options,u),f={isCanceled:!1};i.kill=Go.bind(null,i.kill.bind(i)),i.cancel=Ao.bind(null,i,f);let p=Co(async()=>{let[{error:g,exitCode:y,signal:S,timedOut:v},U,D,Ln]=await $o(i,n.options,l),Re=M(n.options,U),Ne=M(n.options,D),qe=M(n.options,Ln);if(g||y!==0||S!==null){let $e=re({error:g,exitCode:y,signal:S,stdout:Re,stderr:Ne,all:qe,command:o,escapedCommand:s,parsed:n,timedOut:v,isCanceled:f.isCanceled,killed:i.killed});if(!n.options.reject)return $e;throw $e}return{command:o,escapedCommand:s,exitCode:0,stdout:Re,stderr:Ne,all:qe,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return qo(i,n.options.input),i.all=ko(i,n.options),mn(i,p)};N.exports=oe;N.exports.sync=(e,t,r)=>{let n=Sn(e,t,r),o=hn(e,t),s=yn(e,t);_o(n.options);let i;try{i=Ae.spawnSync(n.file,n.args,n.options)}catch(l){throw re({error:l,stdout:"",stderr:"",all:"",command:o,escapedCommand:s,parsed:n,timedOut:!1,isCanceled:!1,killed:!1})}let a=M(n.options,i.stdout,i.error),u=M(n.options,i.stderr,i.error);if(i.error||i.status!==0||i.signal!==null){let l=re({stdout:a,stderr:u,error:i.error,signal:i.signal,exitCode:i.status,command:o,escapedCommand:s,parsed:n,timedOut:i.error&&i.error.code==="ETIMEDOUT",isCanceled:!1,killed:i.signal!==null});if(!n.options.reject)return l;throw l}return{command:o,escapedCommand:s,exitCode:0,stdout:a,stderr:u,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}};N.exports.command=(e,t)=>{let[r,...n]=gn(e);return oe(r,n,t)};N.exports.commandSync=(e,t)=>{let[r,...n]=gn(e);return oe.sync(r,n,t)};N.exports.node=(e,t,r={})=>{t&&!Array.isArray(t)&&typeof t=="object"&&(r=t,t=[]);let n=pn.node(r),o=process.execArgv.filter(a=>!a.startsWith("--inspect")),{nodePath:s=process.execPath,nodeOptions:i=o}=r;return oe(s,[...i,e,...Array.isArray(t)?t:[]],{...r,stdin:void 0,stdout:void 0,stderr:void 0,stdio:n,shell:!1})}});var zo={};Wn(zo,{default:()=>Fn});module.exports=Xn(zo);var le=require("react");var ue=require("@raycast/api");var b=require("react");var xn=X(require("node:process"),1),bn=X(wn(),1);async function En(e,{humanReadableOutput:t=!0}={}){if(xn.default.platform!=="darwin")throw new Error("macOS only");let r=t?[]:["-ss"],{stdout:n}=await(0,bn.default)("osascript",["-e",e,r]);return n}var B="commandWindow",Bo=()=>`
  if windows of application "iTerm" is {} then 
    set ${B} to (create window with default profile)
  else
    set ${B} to current window
  end if
  `,jo=()=>`set ${B} to (create window with default profile)`,Uo=()=>`tell ${B} to create tab with default profile`,Do=({command:e,location:t})=>{let r=e.replace(/"/g,'\\"');return`
  tell application "iTerm"
    launch
    repeat until application "iTerm" is running
      delay 0.1
    end repeat

    ${t==="new-window"?jo():Bo()}
    ${t==="new-tab"?Uo():""}

    tell current session of ${B}
        write text "${r}"
    end tell
    activate
  end tell`},In=e=>{let[t,r]=(0,b.useState)(!0),[n,o]=(0,b.useState)(),[s,i]=(0,b.useState)(!1),a=(0,b.useMemo)(()=>Do(e),[e]);return(0,b.useEffect)(()=>{En(a).then(()=>i(!0)).catch(u=>o(u))},[a]),(0,b.useEffect)(()=>{(n||s)&&r(!1)},[n,s]),{loading:t,error:n,success:s}};var x=require("@raycast/api"),Tn=X(require("path"));var vn=X(require("path"),1);function Oe(e,t={}){if(typeof e!="string")throw new TypeError(`Expected a string, got ${typeof e}`);let{resolve:r=!0}=t,n=e;return r&&(n=vn.default.resolve(e)),n=n.replace(/\\/g,"/"),n[0]!=="/"&&(n=`/${n}`),encodeURI(`file://${n}`).replace(/[?#]/g,encodeURIComponent)}var q=require("react/jsx-runtime"),Wo=()=>(0,q.jsx)(x.Action.Open,{title:"Open System Preferences",icon:x.Icon.Gear,target:"x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"}),Xo=()=>(0,q.jsx)(x.ActionPanel,{children:(0,q.jsx)(Wo,{})}),Ho=`## Raycast needs automation access to iTerm.

1. Open **System Settings**
1. Open the **Privacy & Security** Preferences pane 
1. Then select the **Automation** tab
1. Expand **Raycast** from the list of applications
1. Ensure the **iTerm**  toggle is enabled as shown in the image below
1. When prompted enter your password

![Full Disk Access Preferences Pane](${Oe(Tn.default.join(x.environment.assetsPath,"permission-raycast-automation.png"))})
`,Pn=e=>e.indexOf("Command failed with exit code 1: osascript -e")!==-1,Cn=()=>(0,q.jsx)(x.Detail,{markdown:Ho,navigationTitle:"Permission Issue with Raycast",actions:(0,q.jsx)(Xo,{})});var Gn=require("react"),se=require("@raycast/api"),ie=({error:e})=>((0,Gn.useEffect)(()=>{(async()=>await(0,se.showToast)({style:se.Toast.Style.Failure,title:"Error",message:e.message}))()},[]),null);var Rn=require("react");var ae=require("@raycast/api"),An=require("react"),On=({message:e})=>((0,An.useEffect)(()=>{(async()=>await(0,ae.showToast)({style:ae.Toast.Style.Animated,title:"Loading",message:e}))()},[]),null);var ce=require("react/jsx-runtime"),Nn=({loadingMessage:e="Sending iTerm command...",location:t="new-window",...r})=>{let{loading:n,success:o,error:s}=In({...r,location:t});return(0,Rn.useEffect)(()=>{o&&(async()=>(await(0,ue.closeMainWindow)(),await(0,ue.popToRoot)()))()},[o]),n?(0,ce.jsx)(On,{message:e}):s?Pn(s.message)?(0,ce.jsx)(Cn,{}):(0,ce.jsx)(ie,{error:s}):null};var qn=require("@raycast/api"),j=require("react"),$n=()=>{let[e,t]=(0,j.useState)([]),[r,n]=(0,j.useState)();return(0,j.useEffect)(()=>{(0,qn.getSelectedFinderItems)().then(o=>o.length===0?n(new Error("No files selected")):t(o)).catch(o=>n(o))},[]),{items:e,error:r}};var kn=require("path"),_n=require("fs"),$=require("react/jsx-runtime"),Ko=e=>(0,_n.statSync)(e.path).isDirectory()?e.path:(0,kn.dirname)(e.path);function Fn(){let{items:e,error:t}=$n(),[r,n]=(0,le.useState)(new Set);return(0,le.useEffect)(()=>{if(e.length){let o=new Set;e.forEach(s=>o.add(Ko(s))),n(o)}},[e]),t?(0,$.jsx)(ie,{error:t}):r.size?(0,$.jsx)($.Fragment,{children:[...r].map(o=>(0,$.jsx)(Nn,{command:`cd "${o}"`,loadingMessage:"Getting selected file(s)...",location:"new-window"},o))}):null}
