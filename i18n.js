/* Bunyod — 3 tilli (UZ / RU / EN) tarjima tizimi.
   Manba til: o‘zbekcha (HTML'dagi matn). Tarjimalar i18n-data.js ichida.
   Til almashtirilganda sahifa qayta yuklanadi (animatsiyalar va dinamik matnlar to‘g‘ri ishlashi uchun). */
(function(){
"use strict";
var D=window.BN_DICT||{d:{},h:{}},LS="bn_lang",LANGS=["uz","ru","en"],lang="uz";
try{
  var q=new URLSearchParams(location.search).get("lang");
  if(LANGS.indexOf(q)>-1){localStorage.setItem(LS,q);
    var u=new URL(location.href);u.searchParams.delete("lang");history.replaceState(null,"",u.pathname+u.search+u.hash)}
  var s=localStorage.getItem(LS);if(LANGS.indexOf(s)>-1)lang=s;
}catch(e){}
var li=lang==="ru"?0:1;
var norm=function(s){return s.replace(/\s+/g," ").trim()};

/* ---- qoidalar: raqamli / andozali matnlar ---- */
var ruPl=function(n,a,b,c){n=Math.abs(n)%100;var k=n%10;if(n>10&&n<20)return c;if(k>1&&k<5)return b;if(k===1)return a;return c};
var UNIT={
  kun:{ru:["день","дня","дней"],en:["day","days"]},
  hafta:{ru:["неделя","недели","недель"],en:["week","weeks"]},
  oy:{ru:["месяц","месяца","месяцев"],en:["month","months"]},
  yil:{ru:["год","года","лет"],en:["year","years"]}
};
var W={
  xizmat:["Услуга","Service"],
  prev:["Предыдущая","Previous"],next:["Следующая","Next"],
  prevP:["Предыдущий проект","Previous project"],nextP:["Следующий проект","Next project"],
  proj:["Проект","Project"]
};
function rule(k){
  var m;
  if((m=k.match(/^(.+) — Bunyod$/))){var x=t(m[1]);return x!==m[1]?x+" — Bunyod":null}
  if((m=k.match(/^(\d+(?:–\d+)?) (kun|hafta|oy|yil)$/))){
    var n=+m[1].split("–").pop(),u=UNIT[m[2]];
    return m[1]+" "+(li===0?ruPl(n,u.ru[0],u.ru[1],u.ru[2]):(n===1?u.en[0]:u.en[1]));
  }
  if((m=k.match(/^Xizmat (\d+ \/ \d+)$/)))return W.xizmat[li]+" "+m[1];
  if((m=k.match(/^(Oldingi|Keyingi) · (\d+)$/)))return W[m[1]==="Oldingi"?"prev":"next"][li]+" · "+m[2];
  if((m=k.match(/^(Oldingi|Keyingi) loyiha · (\d+)$/)))return W[m[1]==="Oldingi"?"prevP":"nextP"][li]+" · "+m[2];
  if((m=k.match(/^Loyiha (\d+ \/ \d+) · (.+)$/)))return W.proj[li]+" "+m[1]+" · "+t(m[2]);
  return null;
}
function t(s){
  if(lang==="uz"||typeof s!=="string")return s;
  var k=norm(s),e=D.d[k];
  if(e&&e[li])return e[li];
  var r=rule(k);
  return r!==null&&r!==undefined?r:s;
}
function f(s,a){return t(s).replace(/\{(\d+)\}/g,function(_,i){return a[i]})}

/* ---- DOM'ga qo‘llash ---- */
function apply(){
  var root=document.body,i,n,el;
  /* 1) ichki teglari bor bloklar (sarlavha ichida <em> va h.k.) — oddiy matn kaliti bo‘yicha */
  var all=root.querySelectorAll("*");
  for(i=0;i<all.length;i++){
    el=all[i];
    if(el instanceof SVGElement||el.tagName==="SCRIPT"||el.tagName==="STYLE"||!el.children.length)continue;
    if(el.parentElement&&el.parentElement.closest("[data-ih]"))continue;
    var has=false;for(n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&n.nodeValue.trim()){has=true;break}
    if(!has)continue;
    var e=D.h[norm(el.textContent)];
    if(e&&e[li]){el.innerHTML=e[li];el.setAttribute("data-ih","1")}
  }
  /* 2) oddiy matn tugunlari */
  var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(x){
    var p=x.parentNode;
    if(!x.nodeValue.trim())return NodeFilter.FILTER_REJECT;
    if(p.nodeType!==1)return NodeFilter.FILTER_REJECT;
    if(p instanceof SVGElement||p.tagName==="SCRIPT"||p.tagName==="STYLE"||p.tagName==="NOSCRIPT")return NodeFilter.FILTER_REJECT;
    if(p.closest("[data-ih]"))return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT}}),list=[];
  while((n=tw.nextNode()))list.push(n);
  list.forEach(function(x){
    var v=x.nodeValue,lead=v.match(/^\s*/)[0],trail=v.match(/\s*$/)[0],core=v.trim(),r=t(core);
    if(r!==core)x.nodeValue=lead+r+trail;
  });
  /* 3) atributlar */
  root.querySelectorAll("[alt],[placeholder],[title],[aria-label],[data-t]").forEach(function(x){
    ["alt","placeholder","title","aria-label","data-t"].forEach(function(a){
      var v=x.getAttribute(a);if(v){var r=t(v);if(r!==v)x.setAttribute(a,r)}})});
  /* 4) sarlavha va meta */
  document.title=t(document.title);
  document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[property="og:title"]').forEach(function(m){
    var v=m.getAttribute("content");if(v)m.setAttribute("content",t(v))});
}

/* ---- til tugmalari ---- */
function setLang(l){
  if(l===lang)return;
  try{localStorage.setItem(LS,l)}catch(e){}
  try{sessionStorage.setItem("bn_scroll",String(window.scrollY||0))}catch(e){}
  location.reload();
}
function buildSwitch(){
  var L=[["uz","UZ","O‘zbekcha"],["ru","RU","Русский"],["en","EN","English"]],cur=L[0],i;
  for(i=0;i<L.length;i++)if(L[i][0]===lang)cur=L[i];
  var box=document.createElement("div");box.className="lg";
  var chk='<svg class="lg-ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  box.innerHTML=
    '<button type="button" class="lg-card" aria-haspopup="listbox" aria-expanded="false" aria-label="Til / Язык / Language">'+
      '<svg class="lg-gl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/></svg>'+
      '<span class="lg-cur">'+cur[1]+'</span>'+
      '<svg class="lg-cv" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'+
    '</button>'+
    '<ul class="lg-pop" role="listbox" aria-label="Til / Язык / Language"></ul>';
  var btn=box.firstChild,pop=box.lastChild,opts=[];
  L.forEach(function(x,k){
    var li=document.createElement("li");li.setAttribute("role","option");li.tabIndex=-1;li.lang=x[0];
    li.setAttribute("aria-selected",x[0]===lang?"true":"false");li.style.setProperty("--k",k);
    li.innerHTML='<b>'+x[1]+'</b><span>'+x[2]+'</span>'+chk;
    li.addEventListener("click",function(){pick(x[0],li)});
    li.addEventListener("keydown",function(e){
      if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(x[0],li)}
      else if(e.key==="ArrowDown"){e.preventDefault();opts[(k+1)%opts.length].focus()}
      else if(e.key==="ArrowUp"){e.preventDefault();opts[(k+opts.length-1)%opts.length].focus()}
    });
    pop.appendChild(li);opts.push(li)});
  function setOpen(o,back){
    box.classList.toggle("open",o);btn.setAttribute("aria-expanded",o?"true":"false");
    if(o){var sel=opts.filter(function(n){return n.getAttribute("aria-selected")==="true"})[0]||opts[0];setTimeout(function(){sel.focus({preventScroll:true})},60)}
    else if(back)btn.focus({preventScroll:true})}
  function pick(l,li){
    if(l===lang){setOpen(false,true);return}
    opts.forEach(function(n){n.setAttribute("aria-selected",n===li?"true":"false")});
    setTimeout(function(){setLang(l)},220)}
  btn.addEventListener("click",function(){setOpen(!box.classList.contains("open"))});
  document.addEventListener("click",function(e){if(!box.contains(e.target))setOpen(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&box.classList.contains("open"))setOpen(false,true)});
  addEventListener("scroll",function(){if(box.classList.contains("open"))setOpen(false)},{passive:true});
  var nav=document.querySelector("header nav.top");
  if(nav){
    var cta=nav.querySelector(".cta");
    if(cta){ /* til kartasi "Loyihani boshlash" tugmasidan oldin turadi */
      var g=document.createElement("div");g.className="nr";
      nav.insertBefore(g,cta);g.appendChild(box);g.appendChild(cta)}
    else nav.insertBefore(box,nav.querySelector("#mb"));
  }else{var w=document.querySelector("header .w");if(w)w.appendChild(box)}
}

document.documentElement.lang=lang;
try{ if(lang!=="uz")apply(); }catch(e){ if(window.console)console.error("i18n:",e) }
buildSwitch();
window.BN={lang:lang,t:t,f:f};
document.documentElement.classList.remove("i18n-w");

try{
  var y=sessionStorage.getItem("bn_scroll");
  if(y){sessionStorage.removeItem("bn_scroll");y=+y;
    var go=function(){scrollTo(0,y)};
    addEventListener("load",function(){go();setTimeout(go,350)})}
}catch(e){}
})();
