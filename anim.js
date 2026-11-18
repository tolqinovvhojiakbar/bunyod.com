/* Animatsiyasi yo'q sahifalar uchun: elementlar ketma-ket paydo bo'ladi (.rv + IntersectionObserver).
   Dinamik yaratiladigan bloklar (loyiha, buyurtmalar) uchun MutationObserver ham ishlaydi. */
(()=>{
const RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const SEL={
 "kirish.html":[".au-v>div>*",".au-v li",".au-c>*"],
 "profil.html":[".pf-h>div>*",".pf-h>button",".pf>.w>h2",".od>*"],
 "loyiha.html":["#root .bc","#root .plc","#root .ldi>*","#root .ls>*","#root .rt li","#root .inc li","#root .ot","#ord .ob>*"]
};
const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
const list=SEL[page]||SEL[document.body.dataset.anim]||[];
if(!list.length||RM)return;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{rootMargin:"0px 0px -6% 0px",threshold:.08});
const seen=new WeakSet();
const scan=()=>{
 const groups=new Map();
 list.forEach(s=>document.querySelectorAll(s).forEach(el=>{
  if(seen.has(el)||el.classList.contains("rv"))return;
  seen.add(el);const k=el.parentElement;(groups.get(k)||groups.set(k,[]).get(k)).push(el)}));
 groups.forEach(els=>els.forEach((el,i)=>{el.classList.add("rv");el.style.setProperty("--d",Math.min(i,8)*.09+"s");io.observe(el)}));
};
const start=()=>{scan();new MutationObserver(()=>scan()).observe(document.querySelector("main")||document.body,{childList:true,subtree:true})};
document.documentElement.classList.contains("go")?start():document.addEventListener("ptgo",start,{once:true});
})();
