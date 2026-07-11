/* =====================================================================
   Sauna Hats Canada — main.js
   Renders products, powers filters + product modal, mobile nav,
   and wires every product to the Snipcart cart (the "backend").
   ===================================================================== */

/* ----- site config (edit these) ------------------------------------ */
window.SHC = {
  // Your live domain once deployed. Snipcart uses this to validate prices.
  // While testing on github.io, set this to your Pages URL.
  siteUrl: "https://saunahatcanada.com",
  currency: "cad",
  freeShipOver: 75,
  email: "saunahatscanada@gmail.com",
  phone: "604 849 8898",
  phoneHref: "+16048498898"
};

/* ----- inline SVG placeholder (shows if a photo file is missing) ---- */
function placeholderSVG(label) {
  const txt = (label || "Sauna Hats Canada").replace(/&/g, "&amp;");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
         <stop offset='0' stop-color='#3a342e'/><stop offset='1' stop-color='#b5651d'/>
       </linearGradient></defs>
       <rect width='600' height='600' fill='url(#g)'/>
       <g fill='none' stroke='#f6efe6' stroke-width='8' opacity='.85'>
         <path d='M180 360 q120 -150 240 0' />
         <ellipse cx='300' cy='372' rx='150' ry='34'/>
       </g>
       <text x='300' y='470' fill='#f6efe6' font-family='Georgia,serif'
         font-size='30' text-anchor='middle' opacity='.92'>${txt}</text>
       <text x='300' y='508' fill='#f6efe6' font-family='Arial' font-size='15'
         text-anchor='middle' opacity='.6' letter-spacing='3'>ADD YOUR PHOTO</text>
     </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function imgFallback(img, label) {
  img.onerror = null;
  img.src = placeholderSVG(label);
}

/* ----- money ------------------------------------------------------- */
const money = (n) => "$" + Number(n).toFixed(2).replace(/\.00$/, "");

/* ----- product card ------------------------------------------------ */
function badgeClass(b) {
  if (!b) return "";
  const k = b.toLowerCase();
  if (k.includes("sale")) return "ember";
  if (k.includes("best")) return "cedar";
  return "";
}

function productCard(p) {
  const swatches = (p.colors || [])
    .map((c) => `<span class="swatch" title="${c.name}" style="background:${c.hex}"></span>`)
    .join("");
  const compare = p.compareAt ? `<span class="was">${money(p.compareAt)}</span>` : "";
  const badge = p.badge
    ? `<span class="card-tag ${badgeClass(p.badge)}">${p.badge}</span>` : "";

  return `
  <article class="card" data-category="${p.category}" id="p-${p.id}">
    <div class="card-media">
      ${badge}
      <img src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="imgFallback(this,'${p.name.replace(/'/g, "")}')">
    </div>
    <div class="card-body">
      <span class="card-cat">${p.category === "Custom" ? "Custom" : p.category + " Wool"}</span>
      <h3>${p.name}</h3>
      <p class="desc">${p.blurb}</p>
      ${swatches ? `<div class="swatches">${swatches}</div>` : ""}
      <div class="card-foot">
        <span class="price">${money(p.price)}${compare}</span>
        <button class="btn btn--light btn--sm" data-open="${p.id}">Details</button>
      </div>
      <div style="margin-top:10px">${snipcartButton(p, "btn btn--primary btn--sm btn--block")}</div>
    </div>
  </article>`;
}

/* ----- Snipcart add-to-cart button --------------------------------- */
/* Snipcart reads these data-attributes to build the cart + checkout.   */
function snipcartButton(p, cls) {
  const label = p.category === "Custom" ? "Add &amp; personalise" : "Add to cart";
  return `<button
    class="snipcart-add-item ${cls}"
    data-item-id="${p.id}"
    data-item-name="${p.name}"
    data-item-price="${Number(p.price).toFixed(2)}"
    data-item-url="${window.SHC.siteUrl}/shop.html"
    data-item-description="${p.blurb}"
    data-item-image="${p.image}"
    data-item-categories="${p.category}"
    ${customField(p)}
  >${label}</button>`;
}
/* Custom products get a free-text field for the personalisation note.  */
function customField(p) {
  if (p.category !== "Custom") return "";
  return `data-item-custom1-name="Personalisation / notes" data-item-custom1-type="textarea"`;
}

/* ----- render the shop grid ---------------------------------------- */
function renderShop() {
  const grid = document.getElementById("product-grid");
  if (!grid || !window.SAUNA_PRODUCTS) return;
  grid.innerHTML = window.SAUNA_PRODUCTS.map(productCard).join("");
  wireModalTriggers();
}

/* ----- render a "featured" subset on the homepage ------------------ */
function renderFeatured(ids) {
  const grid = document.getElementById("featured-grid");
  if (!grid || !window.SAUNA_PRODUCTS) return;
  const pick = ids && ids.length
    ? ids.map((id) => window.SAUNA_PRODUCTS.find((p) => p.id === id)).filter(Boolean)
    : window.SAUNA_PRODUCTS.slice(0, 3);
  grid.innerHTML = pick.map(productCard).join("");
  wireModalTriggers();
}

/* ----- category filter (shop page) --------------------------------- */
function wireFilters() {
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      document.querySelectorAll(".card[data-category]").forEach((card) => {
        const show = f === "all" || card.dataset.category === f;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

/* ----- product modal ----------------------------------------------- */
function wireModalTriggers() {
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.open));
  });
}
function openModal(id) {
  const p = window.SAUNA_PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const back = document.getElementById("modal");
  const compare = p.compareAt ? `<span class="was">${money(p.compareAt)}</span>` : "";
  const specs = Object.entries(p.specs || {})
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  const swatches = (p.colors || [])
    .map((c) => `<span class="swatch" title="${c.name}" style="background:${c.hex}"></span>`).join("");

  back.querySelector(".modal").innerHTML = `
    <button class="m-close" aria-label="Close" data-close>&times;</button>
    <div class="m-media">
      <img src="${p.image}" alt="${p.name}"
           onerror="imgFallback(this,'${p.name.replace(/'/g, "")}')">
    </div>
    <div class="m-body">
      <span class="m-cat">${p.category === "Custom" ? "Custom" : p.category + " Wool"}</span>
      <h3>${p.name}</h3>
      <div class="m-price">${money(p.price)}${compare}</div>
      ${swatches ? `<div class="swatches" style="margin-top:12px">${swatches}</div>` : ""}
      <p class="m-desc">${p.desc}</p>
      <div class="m-spec"><dl>${specs}</dl></div>
      <div class="m-actions">
        ${snipcartButton(p, "btn btn--primary")}
        <a class="btn btn--ghost" href="custom.html">Need it customised?</a>
      </div>
      <p class="mini" style="margin-top:14px">Free shipping on orders over $${window.SHC.freeShipOver} · Ships Canada-wide from Squamish, BC</p>
    </div>`;
  back.classList.add("open");
  document.body.style.overflow = "hidden";
  back.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
}
function closeModal() {
  const back = document.getElementById("modal");
  if (!back) return;
  back.classList.remove("open");
  document.body.style.overflow = "";
}

/* ----- mobile nav -------------------------------------------------- */
function wireNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));
}

/* ----- year + global wiring ---------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  wireNav();
  wireFilters();
  renderShop();
  if (window.SHC_FEATURED) renderFeatured(window.SHC_FEATURED);

  const back = document.getElementById("modal");
  if (back) back.addEventListener("click", (e) => { if (e.target === back) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
});
