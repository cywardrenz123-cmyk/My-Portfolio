/* This file draws the page from data.js. You do not need to edit it. */
(() => {
const $ = (s) => document.querySelector(s);

// Simple picture when an item has no image
const art = (t) => "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5555ff"/><stop offset="1" stop-color="#9a9aff"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="140" font-weight="700" fill="#fff" fill-opacity=".9">${(t.trim()[0] || "P").toUpperCase()}</text></svg>`);

const link = (href, icon, label) => href ? `<a class="btn" href="${href}" target="_blank" rel="noopener"><i class="ph-bold ${icon}"></i>${label}</a>` : "";
const download = (href) => href ? `<a class="btn fill" href="${href}" download><i class="ph-bold ph-download-simple"></i>Download</a>` : "";
const tags = (x) => x.tech ? `<div class="tags">${x.tech.map((t) => `<span>${t}</span>`).join("")}</div>` : "";
const actions = (x) => link(x.demo, "ph-play-circle", "Demo") + link(x.code, "ph-github-logo", "Code") + download(x.file);

// Tech stack
$("#skills").innerHTML = DATA.skills.map((g) =>
  `<div class="grp"><h3>${g.group}</h3><div class="row">${g.items.map(([n, i]) => `<div class="card chip"><i class="ph-bold ico ${i}"></i>${n}</div>`).join("")}</div></div>`).join("");

// Education and experience
const timeline = (list) => `<div class="tl">${list.map((e) => `<div><h4>${e.title}</h4><p>${e.place}</p><small>${e.date}</small></div>`).join("")}</div>`;
$("#edu").innerHTML = timeline(DATA.education);
$("#exp").innerHTML = timeline(DATA.experience);

// Project and certificate cards
function cards(list, el, kind, viewLabel) {
  el.innerHTML = list.map((x, i) =>
    `<article class="card lift item"><img src="${x.image || art(x.title)}" alt="${x.title}" loading="lazy" onerror="this.onerror=null;this.src=art(this.alt)"><div class="body"><h3>${x.title} <small>${x.sub}</small></h3>${tags(x)}<div class="acts"><button class="btn" data-k="${kind}" data-i="${i}"><i class="ph-bold ph-eye"></i>${viewLabel}</button>${actions(x)}</div></div></article>`).join("");
}
cards(DATA.projects, $("#projects"), "p", "View Details");
cards(DATA.certificates, $("#certs"), "c", "View");

// CV buttons
document.querySelectorAll("[data-cv]").forEach((a) => (a.href = DATA.cv));

// Popup
const dialog = $("#dialog");
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-i]");
  if (b) {
    const x = { p: DATA.projects, c: DATA.certificates }[b.dataset.k][b.dataset.i];
    $("#dialogBody").innerHTML =
      `<img src="${x.image || art(x.title)}" alt="${x.title}" onerror="this.onerror=null;this.src=art(this.alt)"><div class="dlg"><h3>${x.title}</h3><small>${x.sub}</small><p>${x.description}</p>${x.features ? `<ul>${x.features.map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}${tags(x)}<div class="acts">${actions(x)}</div></div>`;
    dialog.showModal();
  } else if (e.target === dialog || e.target.closest("#dialogClose")) dialog.close();
});

// Dark / light mode
const root = document.documentElement, toggle = $("#theme");
const label = () => toggle.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
label();
toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  label();
});

// Header line and active menu link
const links = document.querySelectorAll("nav a");
addEventListener("scroll", () => $("header").classList.toggle("scrolled", scrollY > 10));
const seen = new IntersectionObserver((list) => list.forEach((s) => s.isIntersecting &&
  links.forEach((a) => a.classList.toggle("active", a.hash === "#" + s.target.id))), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section").forEach((s) => seen.observe(s));

$("#year").textContent = new Date().getFullYear();
})();
