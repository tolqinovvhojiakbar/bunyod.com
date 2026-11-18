/* Bunyod — tayyor loyihalar ma’lumoti va reja chizmasi (uy-tanlash.html va loyiha.html uchun umumiy) */
(()=>{
const P=[
{n:1,name:"Navro‘z",type:"Zamonaviy uy",area:96,fl:1,beds:2,mo:6},
{n:2,name:"Sanam",type:"Kottej",area:128,fl:2,beds:3,mo:9},
{n:3,name:"Chinor",type:"An’anaviy hovli",area:180,fl:1,beds:4,mo:12},
{n:4,name:"Orzu",type:"Zamonaviy uy",area:165,fl:2,beds:3,mo:9},
{n:5,name:"Bahor",type:"Kottej",area:84,fl:1,beds:2,mo:6},
{n:6,name:"Sharq",type:"An’anaviy hovli",area:240,fl:2,beds:5,mo:15},
{n:7,name:"Oltin",type:"Villa",area:320,fl:3,beds:5,mo:15},
{n:8,name:"Zarafshon",type:"Villa",area:286,fl:2,beds:4,mo:12},
{n:9,name:"Xonadon",type:"Zamonaviy uy",area:118,fl:2,beds:3,mo:9},
{n:10,name:"Lola",type:"Kottej",area:110,fl:1,beds:3,mo:9},
{n:11,name:"Registon",type:"Villa",area:410,fl:3,beds:6,mo:15},
{n:12,name:"Ayvon",type:"An’anaviy hovli",area:150,fl:1,beds:3,mo:9}
];
// ---- reja chizmasi (SVG) ----
/* Uy konturi to'rtburchak emas: L, U (ichki hovli bilan), T, zinapoyasimon va ayvonli shakllar.
   Har bir shakl — to'rtburchak "qanotlar"dan yig'ilgan ko'pburchak (pts) va qanotlar ro'yxati (wg). Koordinatalar 0..1. */
const SH={
 L:{ar:1.3,pts:[[0,0],[1,0],[1,.45],[.42,.45],[.42,1],[0,1]],wg:[[0,0,1,.45],[0,.45,.42,.55]]},
 U:{ar:1.25,pts:[[0,0],[1,0],[1,1],[.68,1],[.68,.42],[.32,.42],[.32,1],[0,1]],wg:[[0,0,1,.42],[0,.42,.32,.58],[.68,.42,.32,.58]],yard:[.32,.42,.36,.58]},
 T:{ar:1.35,pts:[[0,0],[1,0],[1,.4],[.7,.4],[.7,1],[.3,1],[.3,.4],[0,.4]],wg:[[0,0,1,.4],[.3,.4,.4,.6]]},
 Z:{ar:1.3,pts:[[0,0],[.7,0],[.7,.3],[1,.3],[1,1],[.3,1],[.3,.7],[0,.7]],wg:[[0,0,.7,.3],[0,.3,1,.4],[.3,.7,.7,.3]]},
 P:{ar:1.3,pts:[[0,0],[1,0],[1,.82],[.62,.82],[.62,1],[.36,1],[.36,.82],[0,.82]],wg:[[0,0,1,.82],[.36,.82,.26,.18]],porch:1}
};
const PICK={"Zamonaviy uy":["L","Z"],"Kottej":["P","T"],"An’anaviy hovli":["U"],"Villa":["Z","T"]};
const sum=a=>a.reduce((s,x)=>s+x.a,0);
function lay(it,x,y,w,h,o){if(!it.length)return;if(it.length==1){o.push({...it[0],x,y,w,h});return}
 const t=sum(it);let k=1,acc=it[0].a;while(k<it.length-1&&acc+it[k].a/2<t/2){acc+=it[k].a;k++}
 const g1=it.slice(0,k),g2=it.slice(k),r=sum(g1)/t;
 if(w>=h){lay(g1,x,y,w*r,h,o);lay(g2,x+w*r,y,w*(1-r),h,o)}else{lay(g1,x,y,w,h*r,o);lay(g2,x,y+h*r,w,h*(1-r),o)}}
function planFull(p){
 const A=p.area/p.fl,b=p.beds,hovli=p.type==="An’anaviy hovli",K=PICK[p.type]||["L"],sh=SH[K[p.n%K.length]];
 const R=[["Mehmonxona",5,0],["Oshxona",3,0]];
 R.push(["Yotoqxona",3.6,0]);for(let i=1;i<b;i++)R.push(["Yotoqxona",3,0]);
 R.push(["Yo‘lak",1.8,0],["Hammom",1.2,1]);if(b>=4)R.push(["Kabinet",2.2,0],["Hammom",1.2,1]);if(b>=3)R.push(["Garderob",1,0]);
 const T=R.reduce((s,r)=>s+r[1],0),it=R.map(r=>({nm:r[0],wet:r[2],a:r[1]/T*A*.92})).sort((x,y)=>y.a-x.a);
 /* o'lchamlar */
 const f=sh.wg.reduce((s,q)=>s+q[2]*q[3],0),W0=Math.sqrt(A/f*sh.ar),H0=W0/sh.ar,s=Math.min(250/W0,185/H0),w=W0*s,h=H0*s,ox=(300-w)/2,oy=(230-h)/2;
 const X=u=>ox+u*w,Y=v=>oy+v*h;
 /* xonalarni qanotlarga taqsimlash: har safar eng bo'sh qanotga */
 const WR=sh.wg.map(q=>({q,cap:q[2]*q[3]*W0*H0*.92,L:[]}));
 it.forEach(r=>{WR.sort((x,y)=>(y.cap-y.L.reduce((s,z)=>s+z.a,0))-(x.cap-x.L.reduce((s,z)=>s+z.a,0)));WR[0].L.push(r)});
 WR.sort((x,y)=>sh.wg.indexOf(x.q)-sh.wg.indexOf(y.q));
 WR.forEach(x=>{if(!x.L.length){const d=WR.slice().sort((m,n)=>n.L.length-m.L.length)[0];x.L.push(d.L.pop())}});
 const o=[];
 WR.forEach((x,j)=>{const L=x.L.slice().sort((m,n)=>n.a-m.a);if(sh.porch&&j===1)L.forEach(r=>{r.nm="Dahliz";r.wet=0});
  lay(L,X(x.q[0]),Y(x.q[1]),x.q[2]*w,x.q[3]*h,o)});
 const m2=r=>(r.w*r.h/(s*s)*.92).toFixed(1);
 let g='<svg class="pl" viewBox="0 0 300 230" role="img" aria-label="'+BN.t(p.name)+' — '+BN.t("birinchi qavat rejasi")+'">';
 /* ichki hovli (U shakli): maysazor, daraxtlar va ayvon */
 if(sh.yard){const y=sh.yard,yx=X(y[0]),yy=Y(y[1]),yw=y[2]*w,yh=y[3]*h;
  g+='<rect x="'+yx.toFixed(1)+'" y="'+yy.toFixed(1)+'" width="'+yw.toFixed(1)+'" height="'+yh.toFixed(1)+'" fill="#eef0e4"><title>'+BN.t("Hovli")+'</title></rect>';
  g+='<rect x="'+yx.toFixed(1)+'" y="'+yy.toFixed(1)+'" width="'+yw.toFixed(1)+'" height="'+Math.min(11,yh*.2).toFixed(1)+'" fill="#f7f3ea" stroke="#2a2623" stroke-width="1.2" stroke-dasharray="4 3"><title>'+BN.t("Ayvon")+'</title></rect>';
  [[.34,.64],[.7,.8]].forEach(c=>{g+='<circle cx="'+(yx+yw*c[0]).toFixed(1)+'" cy="'+(yy+yh*c[1]).toFixed(1)+'" r="'+Math.min(6,yw*.11).toFixed(1)+'" fill="#d9e2c8" stroke="#8d9b74" stroke-width="1.2"/>'});
  if(yw>44)g+='<text x="'+(yx+yw/2).toFixed(1)+'" y="'+(yy+yh*.93).toFixed(1)+'" text-anchor="middle" font-size="8" letter-spacing="1.2" fill="#8d9b74" font-family="Hanken Grotesk,sans-serif">'+BN.t("Hovli").toUpperCase()+'</text>'}
 /* xonalar */
 o.forEach(r=>{g+='<rect x="'+r.x.toFixed(1)+'" y="'+r.y.toFixed(1)+'" width="'+r.w.toFixed(1)+'" height="'+r.h.toFixed(1)+'" fill="'+(r.wet?"#e9e1d5":"#fbf8f3")+'" stroke="#2a2623" stroke-width="2"><title>'+BN.t(r.nm)+'</title></rect>';
  if(r.w>26&&r.h>16)g+='<text x="'+(r.x+r.w/2).toFixed(1)+'" y="'+(r.y+r.h/2+4).toFixed(1)+'" text-anchor="middle" font-size="11" fill="#6b625a" font-family="Hanken Grotesk,sans-serif">'+m2(r)+'</text>'});
 /* tashqi devor — uy konturi */
 const P=sh.pts.map(q=>[X(q[0]),Y(q[1])]);
 g+='<path d="M'+P.map(q=>q[0].toFixed(1)+" "+q[1].toFixed(1)).join("L")+'Z" fill="none" stroke="#2a2623" stroke-width="6" stroke-linejoin="miter"/>';
 /* eshik: eng pastdagi gorizontal devorda */
 let di=-1,dy=-1,dl=0;P.forEach((q,i)=>{const n=P[(i+1)%P.length];if(Math.abs(q[1]-n[1])<.01){const l=Math.abs(n[0]-q[0]);if(q[1]>dy+.01||(Math.abs(q[1]-dy)<.01&&l>dl)){di=i;dy=q[1];dl=l}}});
 /* derazalar: har bir tashqi devorda */
 P.forEach((q,i)=>{const n=P[(i+1)%P.length],hz=Math.abs(q[1]-n[1])<.01,L=Math.hypot(n[0]-q[0],n[1]-q[1]);if(L<34)return;
  const c=L>120?3:L>64?2:1;
  for(let k=1;k<=c;k++){const t=k/(c+1),cx=q[0]+(n[0]-q[0])*t,cy=q[1]+(n[1]-q[1])*t;
   if(i===di){if(Math.abs(t-.5)<.2)continue}
   g+=hz?'<rect x="'+(cx-8).toFixed(1)+'" y="'+(cy-4).toFixed(1)+'" width="16" height="8" fill="#fbf8f3"/><path d="M'+(cx-8).toFixed(1)+' '+(cy-2.2).toFixed(1)+'h16M'+(cx-8).toFixed(1)+' '+(cy+2.2).toFixed(1)+'h16" stroke="#2a2623" stroke-width="1"/>'
    :'<rect x="'+(cx-4).toFixed(1)+'" y="'+(cy-8).toFixed(1)+'" width="8" height="16" fill="#fbf8f3"/><path d="M'+(cx-2.2).toFixed(1)+' '+(cy-8).toFixed(1)+'v16M'+(cx+2.2).toFixed(1)+' '+(cy-8).toFixed(1)+'v16" stroke="#2a2623" stroke-width="1"/>'}});
 if(di>-1){const q=P[di],n=P[(di+1)%P.length],cx=(q[0]+n[0])/2,cy=q[1];
  g+='<rect x="'+(cx-7).toFixed(1)+'" y="'+(cy-4).toFixed(1)+'" width="14" height="8" fill="#fbf8f3"/><path d="M'+(cx+7).toFixed(1)+' '+cy.toFixed(1)+'v-13A13 13 0 0 0 '+(cx-6).toFixed(1)+' '+cy.toFixed(1)+'" fill="none" stroke="#2a2623" stroke-width="1.1"/>'}
 return{svg:g+'</svg>',rooms:o.map(r=>({nm:r.nm,a:+m2(r),wet:r.wet}))}}
const plan=p=>planFull(p).svg;

window.BNP={P,plan,planFull};
})();
