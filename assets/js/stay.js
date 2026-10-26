/* ============================================================
   WOODEN NEST — stay pages (3bhk.html, 4bhk.html)
   Load after assets/js/site.js and assets/js/lightbox.js.
   ============================================================ */

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
