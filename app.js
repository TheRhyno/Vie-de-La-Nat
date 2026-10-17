import { SITE } from "./config.js";
import { db, collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit, serverTimestamp, increment } from "./firebase.js";

const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, ...kids) => { // création sûre (pas d'innerHTML => pas de XSS)
  const n = Object.assign(document.createElement(tag), attrs);
  kids.forEach((k) => n.append(k)); return n;
};
const safe = (fn) => { try { fn(); } catch (e) { console.warn("Firebase non configuré ?", e); } };

/* ---------- Thème ---------- */
const root = document.documentElement;
root.dataset.theme = localStorage.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
$("#theme").onclick = () => { root.dataset.theme = localStorage.theme = root.dataset.theme === "dark" ? "light" : "dark"; };
$("#nom").textContent = SITE.nom;

/* ---------- Semaine A / B ---------- */
function weekAB() {
  const monday = (d) => { d = new Date(d); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
  const now = new Date(), weekend = [0, 6].includes(now.getDay());
  let w = Math.round((monday(now) - monday(SITE.semaineAReference)) / 6048e5) + (weekend ? 1 : 0);
  return { l: ((w % 2) + 2) % 2 === 0 ? "A" : "B", weekend };
}
const ab = weekAB();
$("#week").textContent = ab.weekend ? `Prochaine semaine : ${ab.l}` : `Semaine ${ab.l}`;

/* ---------- Accès rapides ---------- */
SITE.liens.forEach((l) => $("#links").append(
  el("a", { href: l.url, target: "_blank", rel: "noopener" }, el("span", { textContent: l.icone }), l.nom)));

/* ---------- Compte à rebours ---------- */
function countdown() {
  const next = SITE.evenements.map((e) => ({ ...e, t: new Date(e.date) })).filter((e) => e.t > Date.now()).sort((a, b) => a.t - b.t)[0];
  if (!next) { $("#countdown").textContent = "—"; return; }
  const s = Math.floor((next.t - Date.now()) / 1000);
  $("#countdown").textContent = `${Math.floor(s / 86400)} j ${Math.floor(s % 86400 / 3600)} h ${Math.floor(s % 3600 / 60)} min`;
  $("#cd-name").textContent = `avant : ${next.nom}`;
}
countdown(); setInterval(countdown, 30000);

/* ---------- Menu de la cantine (PDF) ---------- */
const pdfUrl = SITE.menuPdf + "?d=" + new Date().toISOString().slice(0, 10); // évite l'ancien PDF en cache
$("#menu-pdf").src = pdfUrl; $("#menu-link").href = pdfUrl;

/* ---------- Roue ---------- */
const cv = $("#wheel"), ctx = cv.getContext("2d"), n = SITE.lieux.length, step = 360 / n;
const colors = ["#6c8cff", "#ffd23f", "#ff7a6b", "#4fd1a5", "#b48cff", "#ff9f43"];
SITE.lieux.forEach((name, i) => {
  const a0 = -Math.PI / 2 + (i * step * Math.PI) / 180, a1 = a0 + (step * Math.PI) / 180;
  ctx.fillStyle = colors[i % colors.length]; ctx.beginPath(); ctx.moveTo(150, 150); ctx.arc(150, 150, 150, a0, a1); ctx.fill();
  ctx.save(); ctx.translate(150, 150); ctx.rotate((a0 + a1) / 2); ctx.fillStyle = "#10142b";
  ctx.font = "bold 16px sans-serif"; ctx.textAlign = "right"; ctx.fillText(name, 135, 6); ctx.restore();
});
let rot = 0;
$("#spin").onclick = () => {
  rot += 1440 + Math.random() * 360;
  cv.style.transform = `rotate(${rot}deg)`; $("#spin-result").textContent = "…";
  setTimeout(() => { $("#spin-result").textContent = "👉 " + SITE.lieux[Math.floor(((360 - (rot % 360)) % 360) / step)]; }, 4100);
};

/* ---------- Sondage ---------- */
const P = SITE.sondage, pollKey = "poll-" + P.id;
$("#poll-q").textContent = P.question;
function renderPoll(votes = {}) {
  const total = P.options.reduce((s, _, i) => s + (votes[i] || 0), 0) || 1, done = localStorage.getItem(pollKey) !== null;
  $("#poll").replaceChildren(...P.options.map((o, i) => {
    const pct = Math.round(((votes[i] || 0) / total) * 100);
    const b = el("button", { className: "opt", disabled: done }, el("i", { style: `width:${pct}%` }), el("span", {}, o, `${pct} %`));
    b.onclick = () => safe(async () => {
      localStorage.setItem(pollKey, i);
      await setDoc(doc(db, "sondages", P.id), { votes: { [i]: increment(1) } }, { merge: true });
    });
    return b;
  }));
}
renderPoll();
safe(() => onSnapshot(doc(db, "sondages", P.id), (s) => renderPoll(s.data()?.votes)));

/* ---------- Annonces ---------- */
const sel = (node, first) => { node.replaceChildren(...[first, ...SITE.matieres].filter(Boolean).map((m) => el("option", { textContent: m, value: m === first ? "" : m }))); };
sel($("#ad-matiere")); sel($("#filter"), "Toutes les matières");
let ads = [];
function renderAds() {
  const f = $("#filter").value, q = $("#search").value.toLowerCase();
  const list = ads.filter((a) => (!f || a.matiere === f) && a.titre.toLowerCase().includes(q));
  $("#ads").replaceChildren(...(list.length ? list.map((a) => el("article", { className: "card" },
    el("h3", { textContent: a.titre }), el("span", { className: "tag", textContent: a.matiere }),
    el("p", { textContent: "💰 " + a.prix }), el("p", { textContent: "✉️ " + a.contact })))
    : [el("p", { className: "hint", textContent: "Aucune annonce. Publie la première !" })]));
}
$("#filter").onchange = $("#search").oninput = renderAds;
$("#ad-form").onsubmit = (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  safe(async () => { await addDoc(collection(db, "annonces"), { ...d, createdAt: serverTimestamp() }); e.target.reset(); });
};
safe(() => onSnapshot(query(collection(db, "annonces"), orderBy("createdAt", "desc"), limit(50)),
  (s) => { ads = s.docs.map((d) => d.data()); renderAds(); }));
renderAds();

/* ---------- Conseils / aides / fiches ---------- */
const fill = (node, items, first) => node.replaceChildren(...[first, ...items].filter(Boolean).map((m) => el("option", { textContent: m, value: m === first ? "" : m })));
fill($("#tip-type"), SITE.typesConseil); fill($("#tip-matiere"), SITE.matieres);
fill($("#tip-filter-type"), SITE.typesConseil, "Tous les types"); fill($("#tip-filter-mat"), SITE.matieres, "Toutes les matières");
let tips = [];
function renderTips() {
  const t = $("#tip-filter-type").value, m = $("#tip-filter-mat").value;
  const list = tips.filter((x) => (!t || x.type === t) && (!m || x.matiere === m));
  $("#tips").replaceChildren(...(list.length ? list.map((x) => {
    const card = el("article", { className: "card" }, el("h3", { textContent: x.titre }),
      el("span", { className: "tag", textContent: `${x.type} · ${x.matiere}` }), el("p", { textContent: x.texte }));
    if (/^https?:\/\//.test(x.lien || "")) card.append(el("a", { href: x.lien, target: "_blank", rel: "noopener noreferrer", textContent: "Ouvrir la ressource" }));
    return card;
  }) : [el("p", { className: "hint", textContent: "Rien pour l'instant. Partage le premier conseil !" })]));
}
$("#tip-filter-type").onchange = $("#tip-filter-mat").onchange = renderTips;
$("#tip-form").onsubmit = (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  safe(async () => { await addDoc(collection(db, "conseils"), { ...d, createdAt: serverTimestamp() }); e.target.reset(); });
};
safe(() => onSnapshot(query(collection(db, "conseils"), orderBy("createdAt", "desc"), limit(50)),
  (s) => { tips = s.docs.map((d) => d.data()); renderTips(); }));
renderTips();

/* ---------- Clubs ---------- */
SITE.clubs.forEach((c) => $("#clubs").append(el("article", { className: "card" },
  el("h3", { textContent: c.nom }), el("p", { textContent: "🕒 " + c.horaire }),
  el("p", { textContent: "📍 " + c.salle }), el("p", { textContent: c.desc }))));
