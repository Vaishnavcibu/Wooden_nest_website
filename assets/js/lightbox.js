/* ============================================================
   WOODEN NEST — photo lightbox (home gallery, stay pages)
   Every [data-lb] figure on the page becomes a slide, in page order.
   [data-lb-go="n"] opens slide n; .js-lb-open opens the first.
   The top bar shows <body data-lb-title="…">.
   Load after assets/js/site.js.
   ============================================================ */
(()=>{
  const figs=$$("[data-lb]");
  if(!figs.length)return;
  const items=figs.map(f=>{
    const img=$("img",f), cap=$("figcaption",f), text=cap?cap.textContent.trim():img.alt;
    return {src:img.getAttribute("src"), alt:img.alt||text, cap:text};
  });
  const title=document.body.dataset.lbTitle||"Wooden Nest";
  const arrow=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="${d}"/></svg>`;

  const lb=document.createElement("div");
  lb.className="lb";lb.id="lb";
  lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-hidden","true");
  lb.setAttribute("aria-label",title+" photo gallery");
  lb.innerHTML=`
    <div class="lb-top"><span class="lb-num"></span><span class="lb-title"></span>
      <button type="button" class="circle-btn lb-close" aria-label="Close gallery">${arrow("M6 6l12 12M18 6 6 18")}</button></div>
    <div class="lb-stage">
      <button type="button" class="circle-btn lb-prev" aria-label="Previous photo">${arrow("M19 12H5M11 6l-6 6 6 6")}</button>
      <figure><img alt=""/><figcaption></figcaption></figure>
      <button type="button" class="circle-btn lb-next" aria-label="Next photo">${arrow("M5 12h14M13 6l6 6-6 6")}</button>
    </div>
    <div class="lb-thumbs">${items.map((p,i)=>`<button type="button" aria-label="Photo ${i+1}: ${p.cap}"><img src="${p.src}" alt="" loading="lazy"></button>`).join("")}</div>`;
  $(".lb-title",lb).textContent=title;
  document.body.appendChild(lb);

  const big=$(".lb-stage img",lb), cap=$(".lb-stage figcaption",lb), num=$(".lb-num",lb), thumbs=$$(".lb-thumbs button",lb);
  let idx=0, returnTo=null;

  function show(i){
    idx=(i+items.length)%items.length;
    const p=items[idx];
    big.style.opacity=0;
    big.onload=()=>{big.style.opacity=1};
    big.src=p.src;big.alt=p.alt;
    cap.textContent=p.cap;
    num.textContent=String(idx+1).padStart(2,"0")+" / "+String(items.length).padStart(2,"0");
    thumbs.forEach((b,k)=>b.classList.toggle("on",k===idx));
    thumbs[idx].scrollIntoView({block:"nearest",inline:"center"});
  }
  function open(i){
    returnTo=document.activeElement;
    show(i);
    lb.classList.add("open");lb.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow="hidden";if(lenis)lenis.stop();
    $(".lb-close",lb).focus();
  }
  function close(){
    lb.classList.remove("open");lb.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow="";if(lenis)lenis.start();
    if(returnTo)returnTo.focus();
  }

  // every photo opens the lightbox, by mouse or keyboard
  $$("[data-lb], [data-lb-go]").forEach(f=>{
    const i=f.hasAttribute("data-lb-go")?+f.dataset.lbGo:figs.indexOf(f);
    f.setAttribute("role","button");f.tabIndex=0;f.setAttribute("aria-label","Open photo: "+(items[i]?items[i].cap:""));
    f.addEventListener("click",()=>open(i));
    f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open(i)}});
  });
  $$(".js-lb-open").forEach(b=>b.addEventListener("click",()=>open(0)));
  thumbs.forEach((b,k)=>b.addEventListener("click",()=>show(k)));
  $(".lb-prev",lb).addEventListener("click",()=>show(idx-1));
  $(".lb-next",lb).addEventListener("click",()=>show(idx+1));
  $(".lb-close",lb).addEventListener("click",close);
  lb.addEventListener("click",e=>{if(e.target===lb||e.target.classList.contains("lb-stage"))close()});

  document.addEventListener("keydown",e=>{
    if(!lb.classList.contains("open"))return;
    if(e.key==="Escape")close();
    else if(e.key==="ArrowLeft")show(idx-1);
    else if(e.key==="ArrowRight")show(idx+1);
    else if(e.key==="Tab"){ // keep focus inside the lightbox
      const f=$$("button",lb), first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });

  // swipe on touch screens
  let touchX=null;
  lb.addEventListener("touchstart",e=>{touchX=e.touches[0].clientX},{passive:true});
  lb.addEventListener("touchend",e=>{
    if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;
    if(Math.abs(dx)>50)show(idx+(dx<0?1:-1));
  });
})();
