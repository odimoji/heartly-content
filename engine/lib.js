// Heartly content engine: shared drawing helpers for 1080x1920 canvas scenes.
// A scene file defines window.SCENE = { duration: seconds, render(t) }.
const W = 1080, H = 1920;
const C = {
  INK: '#2A2420', PAPER: '#F3EDE3', EMBER: '#D9643A', LEAF: '#5E7F4E',
  NIGHT: '#14100D', CREAM: '#F1E6D6', MUTED: '#5A4E45'
};
const cx = document.getElementById('c').getContext('2d');

function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R = rng(1);
function boil(t, fps=10){ R = rng(Math.floor(t*fps)*7+3); } // hand-drawn line boil
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const easeOut=k=>1-Math.pow(1-k,3);
const seg=(t,a,b)=>clamp((t-a)/(b-a));

function paper(bg=C.PAPER, grain='rgba(60,45,30,.035)'){
  cx.fillStyle=bg;cx.fillRect(0,0,W,H);
  const g=rng(99);cx.fillStyle=grain;for(let i=0;i<900;i++)cx.fillRect(g()*W,g()*H,2,2);
}
// wobbly polyline; frac<1 draws only the first part of it (stroke reveal)
function wline(pts,amp=2.4,w=7,col=C.INK,frac=1){
  if(frac<=0)return;
  const lens=[];let tot=0;
  for(let i=0;i<pts.length-1;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);lens.push(l);tot+=l}
  let left=tot*frac;
  cx.strokeStyle=col;cx.lineWidth=w;cx.lineCap='round';cx.lineJoin='round';cx.beginPath();
  for(let i=0;i<pts.length-1&&left>0;i++){
    let [x1,y1]=pts[i],[x2,y2]=pts[i+1];const L0=lens[i];
    if(left<L0){const k=left/L0;x2=lerp(x1,x2,k);y2=lerp(y1,y2,k)}
    const segL=Math.min(left,L0);left-=L0;
    const n=Math.max(2,Math.round(segL/22));const nx=-(y2-y1),ny=x2-x1,L=Math.hypot(nx,ny)||1;
    for(let j=(i?1:0);j<=n;j++){const k=j/n,o=(j===0||j===n)?0:(R()-.5)*2*amp;
      const x=lerp(x1,x2,k)+nx/L*o,y=lerp(y1,y2,k)+ny/L*o;(i===0&&j===0)?cx.moveTo(x,y):cx.lineTo(x,y)}
  }
  cx.stroke();
}
function wcircle(x,y,r,w=7,col=C.INK,amp=2.2,frac=1){
  const n=Math.max(18,Math.round(r/3));const pts=[];const st=R()*6.28;
  for(let i=0;i<=(n+2)*frac;i++){const a=st+i/n*6.4;const rr=r+(R()-.5)*2*amp;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr])}
  cx.strokeStyle=col;cx.lineWidth=w;cx.lineCap='round';cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke();
}
function text(s,x,y,size,alpha=1,font='Caveat',weight=700,col=C.INK,align='center'){
  cx.save();cx.globalAlpha=alpha;cx.fillStyle=col;cx.font=`${weight} ${size}px ${font}`;cx.textAlign=align;cx.textBaseline='middle';cx.fillText(s,x,y);cx.restore();
}
// timed captions: [[start,end,'line'],...]
function captions(t,list,y=560,size=92,col=C.INK,font='Caveat',weight=700){
  for(const [a,b,s] of list){if(t<a||t>b)continue;const fi=seg(t,a,a+.35),fo=1-seg(t,b-.3,b);
    s.split('\n').forEach((ln,i)=>text(ln,W/2,y+(1-ease(fi))*18+i*size*1.05,size,Math.min(fi,fo),font,weight,col))}
}
function endCard(t,start,dark=false){
  const k=seg(t,start,start+.6);if(k<=0)return;
  const col=dark?C.CREAM:C.INK, sub=dark?'#B9A995':C.MUTED;
  text('heartly',W/2,800,150,k,'Caveat',700,col);
  text('for the thing you can’t stop thinking about',W/2,905,40,seg(t,start+.3,start+.9),'Inter',500,sub);
}
// stick figure. s: 0 standing..1 sitting, ph: walk phase, lean: px, writing: bool
function figure(x,s=0,ph=0,lean=0,writing=false,G=1330,col=C.INK,hands=null,smile=0){
  const hip=[x,lerp(G-160,G-28,s)];const top=[hip[0]+lean*(1-s),hip[1]-200];
  const headR=36,head=[top[0]+lean*.25*(1-s),top[1]-headR-8];const legs=[];
  for(const side of [-1,1]){const p=ph+(side>0?Math.PI:0);const sw=Math.sin(p)*.42*(1-s);
    const kneeS=[hip[0]+Math.sin(sw)*80+(Math.cos(p)>0?14:4)*(1-s),G-80],footS=[hip[0]+Math.sin(sw)*160,G];
    const knee=[lerp(kneeS[0],x+70+side*6,s),lerp(kneeS[1],G-120,s)],foot=[lerp(footS[0],x+140+side*14,s),lerp(footS[1],G,s)];
    wline([hip,knee,foot],2.4,7,col);legs.push(foot)}
  wline([hip,top],2.4,7,col);wcircle(head[0],head[1],headR,7,col);
  const sh=[top[0],top[1]+26];
  if(smile>0){cx.save();cx.strokeStyle=col;cx.lineWidth=4;cx.lineCap='round';cx.beginPath();cx.arc(head[0]+4,head[1]+6,14,0.35*Math.PI,(0.35+0.3*smile)*Math.PI);cx.stroke();cx.restore()}
  if(hands){for(const h of hands){const mid=[(sh[0]+h[0])/2+(h[0]>sh[0]?-10:10),(sh[1]+h[1])/2+22];wline([sh,mid,h],2.4,7,col)}}
  else if(writing){wline([sh,[sh[0]+70,sh[1]+70],[x+120,G-160]],2.4,7,col);wline([sh,[sh[0]+40,sh[1]+90],[x+95,G-150]],2.4,7,col)}
  else{const a1=Math.sin(ph)*.45*(1-s);for(const [a,sg] of [[a1,-1],[-a1,1]]){
    wline([sh,[sh[0]+sg*26+Math.sin(a)*55-lean*.1,sh[1]+66],[sh[0]+sg*38+Math.sin(a)*100-lean*.2,sh[1]+128]],2.4,7,col)}}
  return {foot:legs[0],head,top};
}
function ball(bx,r,label='them',G=1330,alpha=1){
  if(r<=0)return;cx.save();cx.globalAlpha=alpha;const by=G-r;
  cx.save();cx.beginPath();cx.arc(bx,by,r-4,0,6.29);cx.clip();
  for(let i=-r*2;i<r*2;i+=Math.max(16,r/7))wline([[bx+i-r,by+r],[bx+i+r,by-r]],1.6,3.2,'rgba(42,36,32,.55)');
  cx.restore();wcircle(bx,by,r,8);if(r>40)text(label,bx,by+4,Math.min(r*.62,120));cx.restore();
}
function chain(a,b,sag,alpha=1){
  cx.save();cx.globalAlpha=alpha;const n=Math.max(4,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/26));
  for(let i=0;i<n;i++){const k=(i+.5)/n;const x=lerp(a[0],b[0],k),y=lerp(a[1],b[1],k)+Math.sin(k*Math.PI)*sag;
    cx.save();cx.translate(x,y);cx.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));cx.strokeStyle=C.INK;cx.lineWidth=4.5;cx.beginPath();cx.ellipse(0,0,15,i%2?4:9,0,0,6.29);cx.stroke();cx.restore()}
  cx.restore();
}
function bubble(x,y,msg,k,size=50){
  if(k<=0)return;const sc=k<1?ease(k):1;cx.save();cx.translate(x,y);cx.scale(sc,sc);
  cx.font=`600 ${size}px Caveat`;const w=cx.measureText(msg).width+80;const pts=[];
  for(let i=0;i<=29;i++){const a=i/28*6.29;pts.push([Math.cos(a)*(w/2)+(R()-.5)*3,Math.sin(a)*46+(R()-.5)*3])}
  cx.fillStyle=C.PAPER;cx.beginPath();cx.ellipse(0,0,w/2,46,0,0,6.29);cx.fill();wline(pts,0,5);
  text(msg,0,2,size,1,'Caveat',600);cx.restore();
}
window.render=function(t){window.SCENE.render(t)};
