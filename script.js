/* ====== SETTINGS: put your WhatsApp number here (country code, digits only, no + or spaces) ====== */
const WHATSAPP_NUMBER = "923224191171"; // +92 322 4191171

/* ---------- Three.js snow (reacts to the mouse) ---------- */
(function () {
  const canvas = document.getElementById("bg");
  if (!window.THREE) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 10;

  // soft round flake sprite
  const cv = document.createElement("canvas"); cv.width = cv.height = 64;
  const g = cv.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(220,225,255,.8)"); gr.addColorStop(1, "rgba(220,225,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);

  const W = 30, H = 20, D = 14, N = 900;
  const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), ph = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * W; pos[i * 3 + 1] = (Math.random() - 0.5) * H; pos[i * 3 + 2] = (Math.random() - 0.5) * D;
    vel[i * 3 + 1] = -(0.4 + Math.random() * 0.9); ph[i] = Math.random() * 6.28;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(cv), size: 0.32, transparent: true, depthWrite: false, opacity: 0.9, color: 0xe8ecff })));

  // mouse -> world position on the z=0 plane
  const m = { x: 999, y: 999 };
  addEventListener("mousemove", e => {
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(30)) * camera.position.z, w = h * camera.aspect;
    m.x = (e.clientX / innerWidth - 0.5) * w; m.y = -(e.clientY / innerHeight - 0.5) * h;
  });
  addEventListener("mouseleave", () => (m.x = m.y = 999));
  function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize); resize();

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  (function loop() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!still) for (let i = 0; i < N; i++) {
      const k = i * 3;
      // push flakes away from the cursor, then let them drift back down
      const dx = pos[k] - m.x, dy = pos[k + 1] - m.y, d2 = dx * dx + dy * dy;
      if (d2 < 6 && pos[k + 2] > -3 && pos[k + 2] < 4) { const f = (6 - d2) * 0.9; const d = Math.sqrt(d2) + 0.001; vel[k] += (dx / d) * f * dt * 6; vel[k + 1] += (dy / d) * f * dt * 6; }
      vel[k] *= 0.97; vel[k + 1] += (-(0.4 + (i % 9) * 0.1) - vel[k + 1]) * dt * 0.8;
      pos[k] += (vel[k] + Math.sin(t * 0.6 + ph[i]) * 0.25) * dt;
      pos[k + 1] += vel[k + 1] * dt;
      if (pos[k + 1] < -H / 2) { pos[k + 1] = H / 2; pos[k] = (Math.random() - 0.5) * W; }
      if (pos[k] > W / 2) pos[k] = -W / 2; else if (pos[k] < -W / 2) pos[k] = W / 2;
    }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
})();

/* ---------- 3D tilt on hover ---------- */
document.querySelectorAll(".tilt").forEach(el => {
  el.addEventListener("mousemove", e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transition = "transform .4s"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 400); });
});

/* ---------- Typing effect ---------- */
(function () {
  const words = [".NET full-stack apps", "clean REST APIs", "React interfaces", "AI-powered features"];
  const out = document.getElementById("typed"); let w = 0, c = 0, del = false;
  (function tick() {
    const word = words[w];
    out.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 40 : 80);
  })();
})();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll(".section").forEach(s => { s.classList.add("reveal"); io.observe(s); });

/* ---------- WhatsApp contact form ---------- */
document.getElementById("waLink").href = `https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById("yr").textContent = new Date().getFullYear();
const form = document.getElementById("contactForm"), note = document.getElementById("formNote");
form.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(form);
  const name = f.get("name").trim(), email = f.get("email").trim(), msg = f.get("message").trim();
  let ok = true;
  form.querySelectorAll("input,textarea").forEach(i => {
    const bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
    i.classList.toggle("bad", bad); if (bad) ok = false;
  });
  if (!ok) { note.style.color = "#ff6b81"; note.textContent = "Fill in your name, a valid email and a message."; return; }
  const text = `Hello Haseeb! 👋\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${msg}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  note.style.color = "#27d8f0"; note.textContent = "WhatsApp opened. Press Send there to deliver your message.";
  form.reset();
});
