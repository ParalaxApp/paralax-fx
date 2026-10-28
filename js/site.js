// ====================================================================
// CHECKOUT LINKS: paste each product's Lemon Squeezy checkout link here.
// Leave a link empty ("") and its button says "Launching soon" instead.
// ====================================================================
const CHECKOUT = {
  kit: "https://paralax-fx.lemonsqueezy.com/checkout/buy/1740667a-b969-4a66-beff-4d409f04cf39",     // HUD Kit (£14), test mode
  studio: "https://paralax-fx.lemonsqueezy.com/checkout/buy/c0512f9c-d492-4b98-8b3e-610cdd9a1506",  // HUD Kit Studio (£24), test mode
  demo: "https://paralax-fx.lemonsqueezy.com/checkout/buy/a2cdfd41-1c01-48ef-a0f2-08877ab79271"     // Free demo kit (£0), test mode
};

// Turns the buy buttons on once a checkout link is filled in above.
(function(){
  var live = false;
  document.querySelectorAll("[data-buy]").forEach(function(a){
    var url = CHECKOUT[a.getAttribute("data-buy")];
    if (!url) return;
    live = true;
    a.href = url;
    a.classList.add("lemonsqueezy-button"); // opens Lemon Squeezy's checkout on top of the page
    a.textContent = a.getAttribute("data-label") || "Buy now";
  });
  if (live){
    var s = document.createElement("script");
    s.src = "https://app.lemonsqueezy.com/js/lemon.js"; s.defer = true;
    s.onload = function(){ if (window.createLemonSqueezy) window.createLemonSqueezy(); };
    document.head.appendChild(s);
  }
})();
// Decode effect for the hero: each line scrambles through glyphs, then locks letter by letter.
(function(){
  var glyphs = "#$%&*+=<>/|[]{}?!@0123456789";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = Array.prototype.slice.call(document.querySelectorAll("[data-decode]"));
  var status = document.getElementById("status");
  if (reduce) return; // text is already in place, nothing to animate

  function play(){
    var start = performance.now();
    var finals = els.map(function(e){ return e.getAttribute("data-final") || e.textContent; });
    els.forEach(function(e, i){ e.setAttribute("data-final", finals[i]); });
    status.textContent = "SCANNING";
    function frame(now){
      var f = (now - start) / 33; // roughly 30 frames per second
      var done = true;
      els.forEach(function(e, i){
        var txt = finals[i], st = [0, 10, 26][i], per = i === 1 ? 2 : 1, scr = 8, out = "";
        for (var k = 0; k < txt.length; k++){
          var rv = st + k * per;
          if (f < rv){ done = false; break; }
          var ch = txt[k];
          if (ch === " ") out += " ";
          else if (f < rv + scr){ done = false; out += glyphs[Math.floor(Math.random() * glyphs.length)]; }
          else out += ch;
        }
        e.textContent = out;
      });
      if (!done) requestAnimationFrame(frame);
      else { status.textContent = "LOCKED"; setTimeout(play, 6000); }
    }
    requestAnimationFrame(frame);
  }
  setTimeout(play, 400);
})();
// Demo cards: videos play only while on screen, and the title demos run their decode loop.
(function(){
  var glyphs = "#$%&*+=<>/|[]{}?!@0123456789";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      var el = en.target;
      if (el.tagName === "VIDEO"){
        if (en.isIntersecting){ if (!el.src) el.src = el.getAttribute("data-src"); if (!reduce) el.play().catch(function(){}); }
        else el.pause();
      } else el._on = en.isIntersecting;
    });
  }, {threshold: 0.3}) : null;
  document.querySelectorAll("video[data-src]").forEach(function(v){
    if (io) io.observe(v); else { v.src = v.getAttribute("data-src"); }
    v.addEventListener("click", function(){ v.paused ? v.play() : v.pause(); });
  });
  var demos = Array.prototype.slice.call(document.querySelectorAll("[data-demo]"));
  demos.forEach(function(d){
    d._lines = Array.prototype.slice.call(d.querySelectorAll("[data-d]")).map(function(e){
      var a = e.getAttribute("data-d").split(","), txt = e.textContent.replace(/\\n/g, "\n");
      e.textContent = txt; return {el: e, txt: txt, st: +a[0], per: +a[1]};
    });
    d._t0 = performance.now(); d._on = !io;
    if (io) io.observe(d);
  });
  if (reduce) return;
  var tape = ""; for (var h = 150; h <= 270; h += 15) tape += ("00" + h).slice(-3) + "  .  |  .  ";
  function tick(now){
    demos.forEach(function(d){
      if (!d._on) return;
      var f = (now - d._t0) / 33;
      if (f > 230) { d._t0 = now; f = 0; }
      d._lines.forEach(function(L){
        var out = "";
        for (var k = 0; k < L.txt.length; k++){
          var rv = L.st + k * L.per; if (f < rv) break;
          var ch = L.txt[k];
          out += (ch === " " || ch === "\n") ? ch : (f < rv + 8 ? glyphs[Math.floor(Math.random() * glyphs.length)] : ch);
        }
        if (f > 200) out = out.split("").map(function(c){ return (c === " " || c === "\n" || Math.random() > (f - 200) / 25) ? c : " "; }).join("");
        L.el.textContent = out;
      });
      var bar = d.querySelector("[data-bar]");
      if (bar) bar.style.width = Math.max(0, Math.min(1, (f - 40) / 14)) * 36 * (f > 200 ? 0 : 1) + "%";
      var blink = d.querySelector("[data-blink]");
      if (blink) blink.style.opacity = Math.floor(f / 15) % 2 ? .25 : 1;
      var ro = d.querySelector("[data-readout]");
      if (ro){
        var n = function(b, a){ return (b + Math.sin(f * .07) * a + Math.random() * .3).toFixed(2); };
        var ls = ["LAT " + n(41, 3), "LON " + n(-12, 3), "SIG " + Math.min(99, Math.max(0, Math.floor((f - 24) * 2))) + "%", "STATUS " + (f > 90 ? "LOCKED" : "SCAN")];
        ro.textContent = f < 24 || f > 200 ? "" : ls.slice(0, Math.floor((f - 24) / 6) + 1).join("\n");
      }
      var cp = d.querySelector("[data-compass]");
      if (cp){ var off = Math.round((Math.sin(f * .03) + 1) * 12); cp.textContent = tape.substr(30 + off, 34); }
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
