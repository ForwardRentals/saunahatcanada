/* Sauna Hats Canada — store logic
   Paste each product's Stripe Payment Link into stripeLink below.
   Until a link is set, the Buy button falls back to an email order. */

const PRODUCTS = {
  bucket: {
    name: "Bucket Sauna Hat",
    price: 2999,
    stripeLink: "", // e.g. https://buy.stripe.com/xxxx
  },
  belltop: {
    name: "Belltop 100% Wool Sauna Hat",
    price: 2299,
    stripeLink: "",
  },
  merino: {
    name: "100% Merino Wool Sauna Hat",
    price: 3999,
    stripeLink: "",
  },
};

const ORDER_EMAIL = "saunahatscanada@gmail.com";

function buy(id) {
  const p = PRODUCTS[id];
  if (!p) return;
  if (p.stripeLink) {
    window.location.href = p.stripeLink;
    return;
  }
  // Fallback until Stripe links are live: email order
  const colorEl = document.querySelector(`[data-color-for="${id}"]`);
  const color = colorEl ? ` (Colour: ${colorEl.textContent})` : "";
  const subject = encodeURIComponent(`Order: ${p.name}${color}`);
  const body = encodeURIComponent(
    `Hi! I'd like to order the ${p.name}${color} — $${(p.price / 100).toFixed(2)} CAD.\n\nName:\nShipping address:\nQuantity:\n\nThanks!`
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

/* Mobile nav */
document.addEventListener("DOMContentLoaded", () => {
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
