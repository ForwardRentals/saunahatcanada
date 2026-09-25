/* Sauna Hats Canada — store logic
   Cart lives in localStorage; checkout posts it to the Cloudflare Worker
   (ForwardRentals/saunahatcanada-checkout), which prices it server-side and
   returns a Stripe Checkout URL. Until CHECKOUT_URL is set, checkout falls back
   to an email order. Prices here are for display only. */

const CHECKOUT_URL = ""; // e.g. https://saunahatcanada-checkout.<account>.workers.dev/checkout
const XMAS_OPEN = false; // flip to true in December (and XMAS_OPEN in wrangler.toml)

const PRODUCTS = {
  bucket: { name: "Bucket Sauna Hat", price: 2999, img: "img/bucket-sauna-hat-1.png" },
  belltop: { name: "Belltop 100% Wool Sauna Hat", price: 2299, img: "img/belltop-100-wool-sauna-hat-1.png" },
  merino: { name: "100% Merino Wool Sauna Hat", price: 3999, img: "img/100-merino-wool-sauna-hats-1.png" },
  xmas: { name: "Free Christmas Hat (Grey Bucket)", price: 2999, img: "img/bucket-sauna-hat-1.png", xmas: true },
};
const SHIP = { xmasPerHat: 2299, xmasMax: 5, regular: 1299, freeOver: 7500 };

const ORDER_EMAIL = "saunahatscanada@gmail.com";
const CART_KEY = "shc_cart";
const money = (c) => "$" + (c / 100).toFixed(2);

/* ---------- cart state ---------- */
function loadCart() {
  try {
    const c = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(c) ? c.filter((l) => PRODUCTS[l.id]) : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  renderCart();
}
function xmasCount(cart) {
  return cart.filter((l) => PRODUCTS[l.id].xmas).reduce((n, l) => n + l.qty, 0);
}

function addToCart(id, color, qty = 1) {
  const cart = loadCart();
  if (PRODUCTS[id].xmas) qty = Math.min(qty, SHIP.xmasMax - xmasCount(cart));
  if (qty < 1) return openCart(`Maximum ${SHIP.xmasMax} free Christmas hats per order.`);
  const line = cart.find((l) => l.id === id && l.color === color);
  if (line) line.qty = Math.min(line.qty + qty, 10);
  else cart.push({ id, color, qty });
  saveCart(cart);
  openCart();
}

function setQty(i, qty) {
  const cart = loadCart();
  if (!cart[i]) return;
  if (qty < 1) cart.splice(i, 1);
  else {
    const others = xmasCount(cart) - (PRODUCTS[cart[i].id].xmas ? cart[i].qty : 0);
    cart[i].qty = PRODUCTS[cart[i].id].xmas ? Math.min(qty, SHIP.xmasMax - others) : Math.min(qty, 10);
  }
  saveCart(cart);
}

/* Buy buttons on product cards */
function buy(id) {
  const colorEl = document.querySelector(`[data-color-for="${id}"]`);
  addToCart(id, colorEl ? colorEl.textContent : "Grey");
}

function addXmas() {
  const sel = document.getElementById("xmas-qty");
  addToCart("xmas", "Grey", sel ? Number(sel.value) : 1);
}

/* ---------- cart drawer ---------- */
function estimate(cart) {
  let regular = 0;
  let xmas = 0;
  for (const l of cart) {
    if (PRODUCTS[l.id].xmas) xmas += l.qty;
    else regular += PRODUCTS[l.id].price * l.qty;
  }
  const ship = xmas * SHIP.xmasPerHat + (regular && regular < SHIP.freeOver ? SHIP.regular : 0);
  return { regular, xmas, ship };
}

function buildCartUI() {
  const nav = document.querySelector(".nav");
  if (nav && !document.querySelector(".cart-btn")) {
    const b = document.createElement("button");
    b.className = "cart-btn";
    b.setAttribute("aria-label", "Open cart");
    b.innerHTML = '🛒 <span class="cart-count">0</span>';
    b.addEventListener("click", () => openCart());
    nav.insertBefore(b, nav.querySelector(".hamburger"));
  }
  const d = document.createElement("div");
  d.className = "cart";
  d.innerHTML = `
    <div class="cart-overlay"></div>
    <aside class="cart-panel" role="dialog" aria-label="Your cart">
      <div class="cart-head"><h3>Your cart</h3><button class="cart-close" aria-label="Close cart">✕</button></div>
      <p class="cart-msg" hidden></p>
      <div class="cart-lines"></div>
      <div class="cart-foot"></div>
    </aside>`;
  document.body.appendChild(d);
  d.querySelector(".cart-overlay").addEventListener("click", closeCart);
  d.querySelector(".cart-close").addEventListener("click", closeCart);
  d.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const i = Number(t.dataset.i);
    const cart = loadCart();
    if (t.dataset.act === "inc") setQty(i, cart[i].qty + 1);
    if (t.dataset.act === "dec") setQty(i, cart[i].qty - 1);
    if (t.dataset.act === "rm") setQty(i, 0);
    if (t.dataset.act === "checkout") checkout(t);
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
}

function renderCart() {
  const cart = loadCart();
  const count = cart.reduce((n, l) => n + l.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = count));
  const lines = document.querySelector(".cart-lines");
  const foot = document.querySelector(".cart-foot");
  if (!lines) return;

  if (!cart.length) {
    lines.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    foot.innerHTML = '<a href="shop.html" class="btn ghost">Browse hats</a>';
    return;
  }
  lines.innerHTML = cart
    .map((l, i) => {
      const p = PRODUCTS[l.id];
      const unit = p.xmas ? '<span class="sale">FREE*</span>' : money(p.price);
      return `<div class="cart-line">
        <img src="${p.img}" alt="">
        <div>
          <div class="cl-name">${p.name}</div>
          <div class="cl-meta">${p.xmas ? "Grey" : l.color} · ${unit}</div>
          <div class="cl-qty">
            <button data-act="dec" data-i="${i}" aria-label="Fewer">−</button><span>${l.qty}</span><button data-act="inc" data-i="${i}" aria-label="More">+</button>
            <button class="cl-rm" data-act="rm" data-i="${i}">Remove</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  const e = estimate(cart);
  foot.innerHTML = `
    <div class="cart-row"><span>Hats</span><span>${money(e.regular)}${e.xmas ? ` + ${e.xmas} free` : ""}</span></div>
    <div class="cart-row"><span>Shipping</span><span>${e.ship ? money(e.ship) : "Free"}</span></div>
    <div class="cart-row total"><span>Total</span><span>${money(e.regular + e.ship)} CAD</span></div>
    ${e.xmas ? '<p class="cart-note">*Enter your free-hat code at checkout. Each free hat ships separately ($22.99 each).</p>' : ""}
    ${e.regular && e.regular < SHIP.freeOver ? `<p class="cart-note">Add ${money(SHIP.freeOver - e.regular)} more for free shipping on regular hats.</p>` : ""}
    <p class="cart-note">Taxes calculated at checkout.</p>
    <button class="btn cart-checkout" data-act="checkout">Checkout</button>`;
}

function openCart(msg) {
  const c = document.querySelector(".cart");
  if (!c) return;
  const m = c.querySelector(".cart-msg");
  m.hidden = !msg;
  m.textContent = msg || "";
  renderCart();
  c.classList.add("open");
}
function closeCart() {
  const c = document.querySelector(".cart");
  if (c) c.classList.remove("open");
}

async function checkout(btn) {
  const cart = loadCart();
  if (!cart.length) return;
  if (!CHECKOUT_URL) return emailOrder(cart);
  btn.disabled = true;
  btn.textContent = "Starting checkout…";
  try {
    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart.map(({ id, color, qty }) => ({ id, color, qty })) }),
    });
    const data = await res.json();
    if (data.url) return (window.location.href = data.url);
    openCart(data.error || "Couldn't start checkout — please try again.");
  } catch {
    openCart("Couldn't reach checkout — check your connection and try again.");
  }
  btn.disabled = false;
  btn.textContent = "Checkout";
}

/* Fallback until the checkout Worker is live: email order */
function emailOrder(cart) {
  const e = estimate(cart);
  const list = cart.map((l) => `- ${l.qty} x ${PRODUCTS[l.id].name} (${l.color})`).join("\n");
  const subject = encodeURIComponent("Order from saunahatcanada.com");
  const body = encodeURIComponent(
    `Hi! I'd like to order:\n${list}\n\nEstimated total: ${money(e.regular + e.ship)} CAD incl. shipping\n\nName:\nShipping address:\n\nThanks!`
  );
  window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
}

/* Colour swatch switching (merino + belltop) */
document.addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (!sw) return;
  const wrap = sw.closest("[data-product]");
  if (!wrap) return;
  wrap.querySelectorAll(".swatch").forEach((s) => s.classList.remove("on"));
  sw.classList.add("on");
  const img = wrap.querySelector(".thumb img");
  if (sw.dataset.img && img) img.src = sw.dataset.img;
  const label = document.querySelector(`[data-color-for="${wrap.dataset.product}"]`);
  if (label && sw.dataset.name) label.textContent = sw.dataset.name;
});

document.addEventListener("DOMContentLoaded", () => {
  buildCartUI();
  renderCart();
  if (/[?&]checkout=cancelled/.test(location.search) && loadCart().length) {
    openCart("Checkout cancelled — your cart is still here.");
  }
  if (document.body.dataset.clearCart !== undefined) saveCart([]);
  if (XMAS_OPEN) document.querySelectorAll("[data-xmas-open]").forEach((el) => (el.hidden = false));

  // Mobile nav
  const burger = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => links.classList.toggle("open"));
  }
  // Snow on the christmas page
  const snow = document.querySelector(".snow");
  if (snow) {
    const flakes = ["❄", "❅", "❆"];
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("span");
      s.textContent = flakes[i % 3];
      s.style.left = ((i * 37) % 100) + "%";
      s.style.fontSize = 8 + ((i * 7) % 14) + "px";
      s.style.animationDuration = 7 + ((i * 3) % 9) + "s";
      s.style.animationDelay = -((i * 1.3) % 10) + "s";
      snow.appendChild(s);
    }
  }
});
