/* ============================================================
   1. Falling cubes, puzzles, laptops & math symbols (Canvas)
      Visible only while the hero section is in view.
   ============================================================ */
(function () {
  var canvas = document.getElementById('bg-canvas');
  var hero = document.getElementById('hero');
  if (!canvas || !hero) return;
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var items = [];
  var MAX = 38;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLORS = ['#f59e0b', '#fb923c', '#fcd34d', '#f5efe9', '#a89b91'];
  var MATH_SYMBOLS = ['√', 'π', '∞', 'Σ', '∫', 'λ', 'θ', '∂'];
  var TYPES = ['cube3', 'cube5', 'pyraminx', 'megaminx', 'laptop', 'math'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function spawn() {
    var size = 16 + Math.random() * 30;
    items.push({
      x: Math.random() * window.innerWidth,
      y: -40 - Math.random() * 200,
      size: size,
      type: pick(TYPES),
      symbol: pick(MATH_SYMBOLS),
      vy: 0.35 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.018,
      color: pick(COLORS),
      alpha: 0.5 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.3 + Math.random() * 0.6
    });
  }

  /* --- 3x3 cube --- */
  function drawCube3(s, color, alpha) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    var h = s / 2;
    ctx.strokeRect(-h, -h, s, s);
    ctx.beginPath();
    ctx.moveTo(-h, -h);
    ctx.lineTo(-h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h, -h);
    ctx.moveTo(h, -h);
    ctx.lineTo(h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h + h * 0.42, h - h * 0.42);
    ctx.lineTo(h, h);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.5;
    ctx.beginPath();
    var step = s / 3;
    for (var i = 1; i < 3; i++) {
      ctx.moveTo(-h + step * i, -h);
      ctx.lineTo(-h + step * i, h);
      ctx.moveTo(-h, -h + step * i);
      ctx.lineTo(h, -h + step * i);
    }
    ctx.stroke();
  }

  /* --- 5x5 cube --- */
  function drawCube5(s, color, alpha) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    var h = s / 2;
    ctx.strokeRect(-h, -h, s, s);
    ctx.beginPath();
    ctx.moveTo(-h, -h);
    ctx.lineTo(-h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h, -h);
    ctx.moveTo(h, -h);
    ctx.lineTo(h + h * 0.42, -h - h * 0.42);
    ctx.lineTo(h + h * 0.42, h - h * 0.42);
    ctx.lineTo(h, h);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.45;
    ctx.beginPath();
    var step = s / 5;
    for (var i = 1; i < 5; i++) {
      ctx.moveTo(-h + step * i, -h);
      ctx.lineTo(-h + step * i, h);
      ctx.moveTo(-h, -h + step * i);
      ctx.lineTo(h, -h + step * i);
    }
    ctx.stroke();
  }

  /* --- Pyraminx (tetrahedron front face) --- */
  function drawPyraminx(s, color, alpha) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    var h = s / 2;
    // outer triangle
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(h, h * 0.7);
    ctx.lineTo(-h, h * 0.7);
    ctx.closePath();
    ctx.stroke();
    // inner edges (3 faces meeting at center)
    ctx.globalAlpha = alpha * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(0, h * 0.7);
    ctx.moveTo(h, h * 0.7);
    ctx.lineTo(0, h * 0.05);
    ctx.moveTo(-h, h * 0.7);
    ctx.lineTo(0, h * 0.05);
    ctx.stroke();
  }

  /* --- Megaminx (pentagon) --- */
  function drawMegaminx(s, color, alpha) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    var r = s / 2;
    var pts = [];
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var j = 1; j < 5; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.closePath();
    ctx.stroke();
    // inner star lines
    ctx.globalAlpha = alpha * 0.5;
    ctx.beginPath();
    for (var k = 0; k < 5; k++) {
      ctx.moveTo(pts[k][0], pts[k][1]);
      ctx.lineTo(pts[(k + 2) % 5][0], pts[(k + 2) % 5][1]);
    }
    ctx.stroke();
  }

  /* --- Laptop --- */
  function drawLaptop(s, color, alpha) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    var w = s * 1.3;
    var h = s * 0.85;
    ctx.strokeRect(-w / 2, -h, w, h);
    ctx.globalAlpha = alpha * 0.4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 4, -h + 4);
    ctx.lineTo(w / 2 - 4, -h + 4);
    ctx.stroke();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(-w / 2 - 4, 0);
    ctx.lineTo(w / 2 + 4, 0);
    ctx.lineTo(w / 2 + 8, 4);
    ctx.lineTo(-w / 2 - 8, 4);
    ctx.closePath();
    ctx.stroke();
  }

  /* --- Math symbol --- */
  function drawMath(s, color, alpha, symbol) {
    ctx.fillStyle = color;
    ctx.font = '700 ' + s + 'px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 0, 0);
  }

  function step() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    while (items.length < MAX) spawn();

    for (var i = items.length - 1; i >= 0; i--) {
      var it = items[i];
      it.sway += 0.01;
      it.x += it.vx + Math.sin(it.sway) * it.swayAmp * 0.3;
      it.y += it.vy;
      it.rot += it.vrot;

      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.rot);
      ctx.globalAlpha = it.alpha;

      switch (it.type) {
        case 'cube3':     drawCube3(it.size, it.color, it.alpha); break;
        case 'cube5':     drawCube5(it.size, it.color, it.alpha); break;
        case 'pyraminx':  drawPyraminx(it.size, it.color, it.alpha); break;
        case 'megaminx':  drawMegaminx(it.size, it.color, it.alpha); break;
        case 'laptop':    drawLaptop(it.size, it.color, it.alpha); break;
        case 'math':      drawMath(it.size, it.color, it.alpha, it.symbol); break;
      }

      ctx.restore();

      if (it.y > window.innerHeight + 60) {
        items.splice(i, 1);
      }
    }

    if (!reduced) requestAnimationFrame(step);
  }

  /* --- Visibility: only show while hero is in view --- */
  function updateVisibility() {
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    var scrolled = window.scrollY || window.pageYOffset;
    // Fade out as the user scrolls past the hero
    var fade = Math.max(0, Math.min(1, (heroBottom - scrolled) / heroBottom));
    canvas.style.opacity = (0.22 * fade).toFixed(3);
    canvas.style.pointerEvents = 'none';
  }

  resize();
  updateVisibility();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', updateVisibility, { passive: true });
  step();
})();

/* ============================================================
   2. Header hide-on-scroll-down / show-on-scroll-up
   ============================================================ */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;

  var lastY = 0;
  var threshold = 120;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (y > threshold) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    if (y > lastY && y > threshold) {
      // scrolling down -> hide
      nav.classList.add('nav--hidden');
    } else {
      // scrolling up -> show
      nav.classList.remove('nav--hidden');
    }

    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   3. Hamburger menu toggle
   ============================================================ */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('nav__links--open');
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    links.classList.add('nav__links--open');
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();




/* ============================================================
   4. Contact form feedback (no backend)
   ============================================================ */
(function () {
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('#name').value.trim();
    var email = form.querySelector('#email').value.trim();
    var message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields before sending.';
      status.style.color = 'var(--error)';
      return;
    }

    status.textContent = 'Thanks, ' + name + '! Your message has been queued.';
    status.style.color = 'var(--success)';
    form.reset();
  });
})();
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();


  ////////////////
 // contact us // 
////////////////
function sendMail(){
  let params = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  // var status = document.getElementById('form-status');
  // TODO: test name, email and message before emailjs.send...

  const serviceID = "service_w1inhzg";
  const templateID = "template_5bfe8hj";
  emailjs.send(serviceID, templateID, params).then(
    res => {
      document.getElementById('name').value = "";
      document.getElementById('email').value = "";
      document.getElementById('message').value = "";
      console.log(res);
      alert("your message sent successfully!");
    }
  ).catch(err => console.log(err))
}