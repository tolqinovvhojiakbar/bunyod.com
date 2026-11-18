(()=>{
const d=document,H=d.documentElement,RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const EZ="cubic-bezier(.16,1,.3,1)",INK="#17130f",SEC="#ece5da";
const go=()=>{if(H.classList.contains("go"))return;H.classList.add("go");d.dispatchEvent(new Event("ptgo"))};
const make=(n,t)=>{const o=d.createElement("div");o.className="pt";o.setAttribute("aria-hidden","true");
 const a=d.createElement("span"),b=d.createElement("span");a.className="n";b.className="t";a.textContent=n||"";b.textContent=t||"";o.append(a,b);return o};

/* ---- KIRISH: o'tish qatlami yuqoriga ochiladi ---- */
let raw=null;try{raw=sessionStorage.getItem("pt");sessionStorage.removeItem("pt")}catch(e){}
let info=null;try{info=raw&&JSON.parse(raw)}catch(e){}
if(info&&!RM){
 const o=make(info[0],info[1]);H.append(o);
 let fin=0;const end=()=>{if(fin)return;fin=1;o.remove();go()};
 const start=()=>{
  o.querySelectorAll("span").forEach((s,i)=>s.animate([{opacity:1,transform:"none"},{opacity:0,transform:"translateY(-28px)"}],{duration:600,delay:i*70,easing:EZ,fill:"forwards"}));
  setTimeout(go,420);
  const an=o.animate([{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 0 100% 0)"}],{duration:1000,delay:260,easing:EZ,fill:"forwards"});
  an.onfinish=end};
 Promise.race([d.fonts?d.fonts.ready:0,new Promise(r=>setTimeout(r,800))]).then(()=>setTimeout(start,300));
 setTimeout(end,5000);
}else if(!RM&&fresh())intro();else go();

/* ---- SAYTGA KIRISH: logo chiziladi, so'ng parda yuqoriga ochiladi ---- */
function fresh(){
 try{const t=(performance.getEntriesByType("navigation")[0]||{}).type;if(t==="back_forward")return false;if(t==="reload")return true}catch(e){}
 try{return !d.referrer||new URL(d.referrer).origin!==location.origin}catch(e){return true}
}
function intro(){
 const o=d.createElement("div");o.className="pt bi";o.setAttribute("aria-hidden","true");
 o.innerHTML='<svg class="bl" viewBox="0 0 32 32" fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="p1" pathLength="1" d="M3 15 16 4l13 11"/><path class="p2" pathLength="1" d="M7 12v16h18V12"/><path class="p3" pathLength="1" d="M13 28v-8h6v8"/></svg><div class="bw"><span class="bb">Bunyod</span></div><i class="bk"></i><small class="bs">Arxitektura &amp; Qurilish</small>';
 H.append(o);const ov=H.style.overflow;H.style.overflow="hidden";
 const q=s=>o.querySelector(s),an=(el,kf,op)=>el.animate(kf,Object.assign({easing:EZ,fill:"both"},op));
 let done=0,lifted=0;
 const end=()=>{if(done)return;done=1;o.remove();H.style.overflow=ov;go()};
 const lift=()=>{if(lifted)return;lifted=1;
  o.querySelectorAll(".bl,.bw,.bk,.bs").forEach((e,i)=>an(e,[{opacity:1},{opacity:0,transform:"translateY(-24px)"}],{duration:600,delay:i*60,fill:"forwards"}));
  setTimeout(go,520);
  an(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 0 100% 0)"}],{duration:1100,delay:380,fill:"forwards"}).onfinish=end};
 const play=()=>{
  an(q(".bl"),[{transform:"scale(.9)"},{transform:"scale(1)"}],{duration:2200});
  an(q(".p1"),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1000,delay:100});
  an(q(".p2"),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1000,delay:600});
  an(q(".p3"),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:800,delay:1100});
  an(q(".bb"),[{transform:"translateY(115%)"},{transform:"none"}],{duration:1100,delay:1250});
  an(q(".bk"),[{transform:"scaleX(0)"},{transform:"scaleX(1)"}],{duration:1000,delay:1500});
  an(q(".bs"),[{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"none"}],{duration:900,delay:1800});
  setTimeout(lift,3500)};
 o.addEventListener("click",lift);
 Promise.race([d.fonts?d.fonts.ready:0,new Promise(r=>setTimeout(r,700))]).then(play);
 setTimeout(end,8000);
}

/* ---- CHIQISH: kartochka joyidan butun ekranga kengayadi ---- */
let leaving=0;
d.addEventListener("click",e=>{
 const a=e.target.closest&&e.target.closest("a[data-pt]");
 if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||RM)return;
 e.preventDefault();if(leaving)return;leaving=1;
 const n=a.dataset.n||"",t=a.dataset.t||"",r=(a.closest(".svc,.nx,.pj")||a).getBoundingClientRect();
 const w=H.clientWidth,h=H.clientHeight;
 const from=`inset(${Math.max(0,r.top)}px ${Math.max(0,w-r.right)}px ${Math.max(0,h-r.bottom)}px ${Math.max(0,r.left)}px)`;
 const o=make(n,t);o.style.clipPath=from;o.style.background=SEC;d.body.append(o);
 const an=o.animate([{clipPath:from,background:SEC},{clipPath:"inset(0px)",background:INK}],{duration:900,easing:EZ,fill:"forwards"});
 o.querySelectorAll("span").forEach((s,i)=>s.animate([{opacity:0,transform:"translateY(26px)"},{opacity:1,transform:"none"}],{duration:700,delay:380+i*90,easing:EZ,fill:"both"}));
 let gone=0;const nav=()=>{if(gone)return;gone=1;try{sessionStorage.setItem("pt",JSON.stringify([n,t]))}catch(x){}location.href=a.href};
 an.onfinish=()=>setTimeout(nav,320);setTimeout(nav,2000);
});
addEventListener("pageshow",e=>{if(e.persisted){d.querySelectorAll(".pt").forEach(x=>x.remove());leaving=0;go()}});
})();
