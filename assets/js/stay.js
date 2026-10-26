/* ============================================================
   WOODEN NEST — stay pages (3bhk.html, 4bhk.html)
   Load after assets/js/site.js.
   ============================================================ */

/* ============================================================
   LIGHTBOX — every [data-lb] figure on the page, in page order.
   [data-lb-go="n"] opens photo n; .js-lb-open opens the first.
   ============================================================ */
const lb=$("#lb"), lbImg=$("#lbImg"), lbCap=$("#lbCap"), lbNum=$("#lbNum"), lbThumbs=$("#lbThumbs");
const lbItems=$$("[data-lb]").map(f=>{
  const img=$("img",f), cap=$("figcaption",f);
  return {src:img.getAttribute("src"), alt:img.alt, cap:cap?cap.textContent:img.alt};
});
let lbIdx=0, lbReturn=null;

lbThumbs.innerHTML=lbItems.map((p,i)=>`<button type="button" aria-label="Photo ${i+1}: ${p.cap}"><img src="${p.src}" alt="" loading="lazy"></button>`).join("");
const lbThumbBtns=$$("button",lbThumbs);

function lbShow(i){
  lbIdx=(i+lbItems.length)%lbItems.length;
  const p=lbItems[lbIdx];
  lbImg.style.opacity=0;
  lbImg.onload=()=>{lbImg.style.opacity=1};
  lbImg.src=p.src;lbImg.alt=p.alt;
  lbCap.textContent=p.cap;
  lbNum.textContent=String(lbIdx+1).padStart(2,"0")+" / "+String(lbItems.length).padStart(2,"0");
  lbThumbBtns.forEach((b,k)=>b.classList.toggle("on",k===lbIdx));
  lbThumbBtns[lbIdx].scrollIntoView({block:"nearest",inline:"center"});
}
function lbOpen(i){
  lbReturn=document.activeElement;
  lbShow(i);
  lb.classList.add("open");lb.setAttribute("aria-hidden","false");
  document.documentElement.style.overflow="hidden";if(lenis)lenis.stop();
  $(".lb-close",lb).focus();
}
function lbClose(){
  lb.classList.remove("open");lb.setAttribute("aria-hidden","true");
  document.documentElement.style.overflow="";if(lenis)lenis.start();
  if(lbReturn)lbReturn.focus();
}

// make every photo open the lightbox, by mouse or keyboard
$$("[data-lb], [data-lb-go]").forEach(f=>{
  const i=f.hasAttribute("data-lb-go")?+f.dataset.lbGo:$$("[data-lb]").indexOf(f);
  const cap=lbItems[i]?lbItems[i].cap:"";
  f.setAttribute("role","button");f.tabIndex=0;f.setAttribute("aria-label","Open photo: "+cap);
  f.addEventListener("click",()=>lbOpen(i));
  f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();lbOpen(i)}});
});
$$(".js-lb-open").forEach(b=>b.addEventListener("click",()=>lbOpen(0)));
lbThumbBtns.forEach((b,k)=>b.addEventListener("click",()=>lbShow(k)));
$(".lb-prev",lb).addEventListener("click",()=>lbShow(lbIdx-1));
$(".lb-next",lb).addEventListener("click",()=>lbShow(lbIdx+1));
$(".lb-close",lb).addEventListener("click",lbClose);
lb.addEventListener("click",e=>{if(e.target===lb||e.target.classList.contains("lb-stage"))lbClose()});

document.addEventListener("keydown",e=>{
  if(!lb.classList.contains("open"))return;
  if(e.key==="Escape")lbClose();
  else if(e.key==="ArrowLeft")lbShow(lbIdx-1);
  else if(e.key==="ArrowRight")lbShow(lbIdx+1);
  else if(e.key==="Tab"){ // keep focus inside the lightbox
    const f=$$("button",lb), first=f[0], last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});

// swipe on touch screens
let lbTouchX=null;
lb.addEventListener("touchstart",e=>{lbTouchX=e.touches[0].clientX},{passive:true});
lb.addEventListener("touchend",e=>{
  if(lbTouchX===null)return;const dx=e.changedTouches[0].clientX-lbTouchX;lbTouchX=null;
  if(Math.abs(dx)>50)lbShow(lbIdx+(dx<0?1:-1));
});

/* ============================================================
   PAGE ANIMATIONS
   ============================================================ */
function startStayPage(){
  initSiteAnimations();
  if(!hasGSAP||reduce)return;

  // hero entrance
  gsap.timeline()
    .from(".nav > *",{y:-20,opacity:0,duration:.7,stagger:.08})
    .from(".crumbs, .sp-hero .pill",{y:16,opacity:0,duration:.6,stagger:.08},"<.1")
    .from(".sp-title .line > span",{yPercent:115,duration:1.1,stagger:.12,ease:"power4.out"},"<.1")
    .from(".sp-hero .lede, .sp-cta",{y:20,opacity:0,duration:.8,stagger:.1},"-=.7")
    .fromTo(".sp-arch",{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:1.4,ease:"power4.out",clearProps:"clipPath"},.2)
    .from(".sp-arch img",{scale:1.25,duration:2,ease:"power3.out"},"<")
    .from(".sp-float",{y:60,opacity:0,duration:1,ease:"power3.out"},"<.5")
    .from(".sp-stamp",{scale:0,rotate:-90,duration:1,ease:"back.out(1.6)"},"<.2");

  // hero photo drifts as you scroll away
  gsap.fromTo(".sp-arch img",{yPercent:-6},{yPercent:6,ease:"none",scrollTrigger:{trigger:".sp-hero",start:"top top",end:"bottom top",scrub:true}});

  // at-a-glance icons
  gsap.from(".sp-facts .feature",{y:30,opacity:0,duration:.8,stagger:.07,ease:"power3.out",scrollTrigger:{trigger:".sp-facts",start:"top 92%"}});

  // room photos wipe in from the bottom
  $$(".room-media figure").forEach(f=>{
    gsap.fromTo(f,{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:1.3,ease:"power4.out",clearProps:"clipPath",scrollTrigger:{trigger:f,start:"top 90%"}});
  });
  $$(".room-text").forEach(t=>{
    gsap.from(t.children,{y:30,opacity:0,duration:.9,stagger:.08,ease:"power3.out",scrollTrigger:{trigger:t,start:"top 85%"}});
  });
}
startStayPage();
