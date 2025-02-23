(()=>{var e={};e.id=219,e.ids=[219],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},34798:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>d,serverHooks:()=>y,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{GET:()=>c});var o=r(42706),a=r(28203),n=r(45994),p=r(39187);let u=require("os");var i=r.n(u);async function c(){try{let e=i().cpus()[0],t=i().totalmem(),r=i().freemem(),s=function(e){let t=0,r=[];e.cpuCores>=8?t+=30:e.cpuCores>=4?t+=20:t+=10,e.cpuSpeed>=3e3?t+=20:e.cpuSpeed>=2e3?t+=15:t+=10,e.totalMemoryGB>=32?t+=30:e.totalMemoryGB>=16?t+=20:e.totalMemoryGB>=8&&(t+=10),e.cpuCores>=8&&e.cpuSpeed>=3e3&&r.push("Suitable for parallel processing tasks"),e.totalMemoryGB>=16&&r.push("Good for memory-intensive workloads"),e.memoryUsagePercent>80&&r.push("Consider freeing up memory for better performance");let s="Balanced";e.cpuCores>=8&&e.cpuSpeed>=3e3&&(s="CPU");let o=e.cpuModel.toLowerCase();return(o.includes("nvidia")||o.includes("radeon")||o.includes("gpu"))&&(s="GPU",r.push("Integrated graphics detected - suitable for basic GPU tasks")),{score:t,bestFor:s,recommendations:r}}({cpuModel:e.model,cpuCores:i().cpus().length,totalMemoryGB:t/0x40000000,memoryUsagePercent:(t-r)/t*100,cpuSpeed:e.speed}),o={cpu_usage:function(){let e=i().cpus(),t=0,r=0;return e.forEach(e=>{for(let t in e.times)r+=e.times[t];t+=e.times.idle}),Math.round((1-t/r)*100)}(),memory_total:t,memory_used:t-r,cpu_info:e.model,cpu_cores:i().cpus().length,cpu_speed:e.speed,platform:i().platform(),architecture:i().arch(),hostname:i().hostname(),uptime:i().uptime(),capabilities:s,last_updated:new Date().toISOString()};return p.NextResponse.json(o)}catch(e){return p.NextResponse.json({error:"Failed to get system stats"},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/system-stats/route",pathname:"/api/system-stats",filename:"route",bundlePath:"app/api/system-stats/route"},resolvedPagePath:"/Users/vidyootsenthil/Documents/projects/hacklytics25/frontend/app/api/system-stats/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:m,serverHooks:y}=d;function h(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:m})}},96487:()=>{},78335:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,452],()=>r(34798));module.exports=s})();