/* Bunyod — kirish / ro‘yxatdan o‘tish (DEMO: ma’lumotlar brauzer localStorage'ida saqlanadi).
   Haqiqiy saytda bu qism server (backend) bilan almashtirilishi kerak. */
(function(){
"use strict";
var U="bn_users",S="bn_session",O="bn_orders";
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function normPhone(p){var d=String(p||"").replace(/\D/g,"");if(d.length===9)d="998"+d;return /^998\d{9}$/.test(d)?d:""}
function fmtPhone(d){return d&&d.length===12?"+"+d.slice(0,3)+" "+d.slice(3,5)+" "+d.slice(5,8)+" "+d.slice(8,10)+" "+d.slice(10):d||""}
function rnd(n){var a=new Uint8Array(n);(window.crypto||{getRandomValues:function(x){for(var i=0;i<x.length;i++)x[i]=Math.random()*256}}).getRandomValues(a);return Array.prototype.map.call(a,function(b){return("0"+b.toString(16)).slice(-2)}).join("")}
function hash(pw,salt){
  if(window.crypto&&crypto.subtle&&window.TextEncoder){
    var enc=new TextEncoder();
    return crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveBits"]).then(function(k){
      return crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(salt),iterations:100000,hash:"SHA-256"},k,256)}).then(function(b){
      return Array.prototype.map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")});
  }
  var h=5381,s=salt+pw;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;
  return Promise.resolve("f"+(h>>>0).toString(16));
}
function current(){var s=jget(S,null);if(!s||!s.phone)return null;var u=jget(U,[]).filter(function(x){return x.phone===s.phone})[0];return u?{name:u.name,phone:u.phone}:null}
function register(name,phone,pw){
  name=String(name||"").trim();var ph=normPhone(phone);
  if(name.length<2)return Promise.resolve({ok:false,f:"name",err:"Ismingizni kiriting"});
  if(!ph)return Promise.resolve({ok:false,f:"phone",err:"Telefon raqamini to‘g‘ri kiriting"});
  if(String(pw||"").length<6)return Promise.resolve({ok:false,f:"pw",err:"Parol kamida 6 belgidan iborat bo‘lsin"});
  var us=jget(U,[]);
  if(us.some(function(x){return x.phone===ph}))return Promise.resolve({ok:false,f:"phone",err:"Bu raqam ro‘yxatdan o‘tgan. Tizimga kiring"});
  var salt=rnd(8);
  return hash(pw,salt).then(function(h){
    us.push({name:name,phone:ph,salt:salt,hash:h,ts:Date.now()});
    if(!jset(U,us)||!jset(S,{phone:ph}))return{ok:false,f:"",err:"Brauzer ma’lumot saqlashga ruxsat bermadi"};
    return{ok:true}});
}
function login(phone,pw){
  var ph=normPhone(phone);
  if(!ph)return Promise.resolve({ok:false,f:"phone",err:"Telefon raqamini to‘g‘ri kiriting"});
  if(!pw)return Promise.resolve({ok:false,f:"pw",err:"Parolni kiriting"});
  var u=jget(U,[]).filter(function(x){return x.phone===ph})[0];
  if(!u)return Promise.resolve({ok:false,f:"phone",err:"Bu raqam ro‘yxatdan o‘tmagan"});
  return hash(pw,u.salt).then(function(h){
    if(h!==u.hash)return{ok:false,f:"pw",err:"Parol noto‘g‘ri"};
    jset(S,{phone:ph});return{ok:true}});
}
function logout(){try{localStorage.removeItem(S)}catch(e){}}
function addOrder(o){var a=jget(O,[]);o.id="BN-"+new Date().getFullYear()+"-"+(1000+a.length+1+Math.floor(Math.random()*8));o.ts=Date.now();o.status="Qabul qilindi";a.push(o);return jset(O,a)?o:null}
function orders(phone){return jget(O,[]).filter(function(o){return o.owner===phone}).sort(function(a,b){return b.ts-a.ts})}
function safeNext(n){n=String(n||"");return /^[\w\-]+\.html(\?[\w\-=&%.]*)?(#[\w\-]*)?$/.test(n)?n:""}
function loginUrl(next){return"kirish.html"+(next?"?next="+encodeURIComponent(next):"")}
window.BNAuth={current:current,register:register,login:login,logout:logout,addOrder:addOrder,orders:orders,safeNext:safeNext,loginUrl:loginUrl,normPhone:normPhone,fmtPhone:fmtPhone};

/* ---- sarlavhaga "Kirish" / ism havolasi ---- */
function inject(){
  var nav=document.querySelector("header nav.top");if(!nav)return;
  var me=current(),page=location.pathname.split("/").pop()||"index.html";
  var here=page+location.search;
  var href=me?"profil.html":loginUrl(/^(kirish|profil)\.html/.test(page)?"":here);
  var label=me?me.name.split(/\s+/)[0]:"Kirish";
  var cur=/^(kirish|profil)\.html/.test(page)?' aria-current="page"':"";
  var st=document.createElement("style");
  st.textContent=".acc{display:none;align-items:center;gap:.5rem;font-size:.8rem;font-weight:500;letter-spacing:.03em;margin-right:.9rem;white-space:nowrap;max-width:9rem}.acc span{overflow:hidden;text-overflow:ellipsis}.acc svg{width:1.25rem;height:1.25rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex:none}.acc:hover,.acc[aria-current=page]{color:var(--bronze)}@media(min-width:1024px){.acc{display:inline-flex}.acc span{display:none}.acc.in span{display:inline}}@media(min-width:1280px){.acc span{display:inline}}.mo.acm{font-size:2.25rem}";
  document.head.appendChild(st);
  var a=document.createElement("a");a.className="acc"+(me?" in":"");a.href=href;
  if(cur)a.setAttribute("aria-current","page");
  a.setAttribute("aria-label",me?"Shaxsiy kabinet":"Kirish");
  a.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span>'+(me?label.replace(/</g,"&lt;"):label)+'</span>';
  var cta=nav.querySelector(".cta"),ref=cta;while(ref&&ref.parentNode!==nav)ref=ref.parentNode;nav.insertBefore(a,ref||nav.querySelector("#mb")||null);
  var mm=document.querySelector("#mm ul");
  if(mm){var li=document.createElement("li"),n=mm.children.length+1;
    li.innerHTML='<a class="mo acm" href="'+href+'"'+cur+'>'+(me?label.replace(/</g,"&lt;"):label)+'<span class="ey">'+(n<10?"0"+n:n)+'</span></a>';mm.appendChild(li)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject);else inject();
})();
