/* ============================================================
   WOODEN NEST — shared script for every page
   (load after gsap / ScrollTrigger / lenis / anime, before the page script)
   ============================================================ */

/* ============================================================
   CONFIG — edit these with your real details
   ============================================================ */
const CONFIG = {
  phoneDisplay: "+91 97784 77936",
  phoneIntl:    "919778477936",          // WhatsApp number, digits only with country code
  email:        "woodennesthomestayaruvithura@gmail.com",
  instagram:    "https://www.instagram.com/wooden_nest__homestay/",
  facebook:     "https://www.facebook.com/people/Wooden-Nest/61587497518499/",
  googleReview: "https://g.page/r/CSlyylPqw2SdEBE/review", // "Ask for reviews" link from Google Business Profile; empty = open the Maps listing
  mapsQuery:    "Wooden Nest Homestay, Aruvithura, Erattupetta, Kerala 686121",
  originForDirections: "Aruvithura, Erattupetta, Kerala 686121"
};

/* ============================================================ */
const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const hasGSAP = typeof window.gsap !== "undefined";
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- contact wiring ---- */
$$(".js-phone").forEach(a=>{a.textContent=CONFIG.phoneDisplay;a.href="tel:+"+CONFIG.phoneIntl});
// the <wbr> lets the long address wrap at the "@" instead of mid-word
$$(".js-email").forEach(a=>{const [user,domain]=CONFIG.email.split("@");a.replaceChildren(user,document.createElement("wbr"),"@"+domain);a.href="mailto:"+CONFIG.email});
$$(".js-wa").forEach(a=>{a.href="https://wa.me/"+CONFIG.phoneIntl;a.target="_blank"});
$$(".js-ig").forEach(a=>{a.href=CONFIG.instagram;a.target="_blank";a.rel="noopener"});
$$(".js-fb").forEach(a=>{a.href=CONFIG.facebook;a.target="_blank";a.rel="noopener"});
$$(".js-review").forEach(a=>{a.href=CONFIG.googleReview||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CONFIG.mapsQuery);a.target="_blank";a.rel="noopener"});
if($("#mapLink"))$("#mapLink").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CONFIG.mapsQuery);
if($("#yr"))$("#yr").textContent=new Date().getFullYear();
if($("#todayDate"))$("#todayDate").textContent=new Date().toLocaleDateString("en-IN",{month:"long",day:"numeric",year:"numeric"});

/* ---- date inputs: no past dates ---- */
if($("#fIn")){const t=new Date().toISOString().split("T")[0];$("#fIn").min=t;$("#fOut").min=t;
 $("#fIn").addEventListener("change",e=>{$("#fOut").min=e.target.value||t})}

/* ---- toast ---- */
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),3200)}

/* ---- menu ---- */
$("#menuBtn").addEventListener("click",()=>document.body.classList.toggle("menu-open"));
$$("#overlayMenu a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("menu-open")));

/* ---- nav scroll state (data-solid keeps it light, for pages without a photo hero) ---- */
const nav=$("#nav");
const onScroll=()=>nav.classList.toggle("scrolled",nav.hasAttribute("data-solid")||window.scrollY>window.innerHeight*0.6);
window.addEventListener("scroll",onScroll,{passive:true});onScroll();

/* ---- pick stay from cards ---- */
$$(".js-pick").forEach(b=>b.addEventListener("click",()=>{
  const v=b.dataset.stay;const r=$$('#staySeg input').find(i=>i.value===v);if(r)r.checked=true;
}));

/* ---- enquiry → WhatsApp ---- */
if($("#enquiryForm"))$("#enquiryForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f=e.target, d=Object.fromEntries(new FormData(f).entries());
  if(!d.name||!d.phone){toast("Please add your name and phone number.");(d.name?f.phone:f.name).focus();return}
  const lines=[
    "Hello Wooden Nest! I'd like to enquire.",
    "• Interested in: "+d.stay,
    "• Name: "+d.name,
    "• Phone: "+d.phone,
    d.checkin?"• Date / Check-in: "+d.checkin:"",
    d.checkout?"• Check-out: "+d.checkout:"",
    d.guests?"• Guests: "+d.guests:"",
    d.msg?"• Notes: "+d.msg:""
  ].filter(Boolean).join("\n");
  window.open("https://wa.me/"+CONFIG.phoneIntl+"?text="+encodeURIComponent(lines),"_blank");
  toast("Opening WhatsApp with your details…");
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
let lenis=null;
if(typeof Lenis!=="undefined"&&!reduce){
  lenis=new Lenis({lerp:.09,smoothWheel:true});
  if(hasGSAP){lenis.on("scroll",ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  else{const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
}
// anchor links through Lenis
$$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const id=a.getAttribute("href");if(id.length<2)return;const t=$(id);if(!t)return;
  e.preventDefault();lenis?lenis.scrollTo(t,{offset:-70,duration:1.4}):t.scrollIntoView({behavior:"smooth"});
}));

/* ============================================================
   SHARED SCROLL ANIMATIONS — each page calls this once it starts
   ============================================================ */
function initSiteAnimations(){
  if(!hasGSAP||reduce)return;
  gsap.registerPlugin(ScrollTrigger);

  // generic reveal-ups
  $$(".reveal-up").forEach(el=>{
    gsap.from(el,{y:60,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%"}});
  });

  // section headings
  $$(".h2, .od-top h2, .gal-head h2, .foot-center h2").forEach(h=>{
    gsap.from(h,{y:50,opacity:0,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:h,start:"top 88%"}});
  });

  // stays arch clip reveal
  $$(".arch").forEach(a=>{
    gsap.from(a,{clipPath:"inset(100% 0 0 0 round 120px 120px 70px 70px)",duration:1.4,ease:"power4.out",scrollTrigger:{trigger:a,start:"top 85%"}});
  });

  // footer zoom
  gsap.from(".foot .bg img",{scale:1.25,ease:"none",scrollTrigger:{trigger:".foot",start:"top bottom",end:"bottom bottom",scrub:true}});

  // magnetic buttons
  $$(".arrow-btn, .circle-btn, .foot-center .btn").forEach(b=>{
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();
      gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.25,duration:.4})});
    b.addEventListener("mouseleave",()=>gsap.to(b,{x:0,y:0,duration:.6,ease:"elastic.out(1,.4)"}));
  });

  // feature icons gentle float (anime.js)
  if(typeof anime!=="undefined"){
    anime({targets:".feature .ico svg",translateY:[-2,2],direction:"alternate",loop:true,duration:1800,delay:anime.stagger(220),easing:"easeInOutSine"});
  }

  window.addEventListener("load",()=>ScrollTrigger.refresh());
}
