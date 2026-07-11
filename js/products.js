/* =====================================================================
   Sauna Hats Canada — PRODUCT CATALOG
   ---------------------------------------------------------------------
   👉 THIS is the only file you edit to manage your shop.
   Each product is one object. Copy a block, change the fields, done.

   FIELDS
     id        unique short slug (used for links/anchors) — no spaces
     name      product title
     category  must be one of: "Wool" | "Merino" | "Custom"
                 (these power the Shop page filter buttons)
     price     number in CAD, e.g. 49  (no "$")
     compareAt (optional) original price for a sale, e.g. 65
     badge     (optional) "Bestseller" | "New" | "Sale" | "Made to order" ...
     blurb     one-line teaser shown on the card
     desc      longer description shown in the popup
     colors    array of {name, hex} swatches
     specs     key/value details shown in the popup
     image     path to photo, e.g. "assets/products/black-wool.jpg"
                 (if the file is missing, a tasteful placeholder shows —
                  so the site never looks broken before you add photos)

   ⚠️  PRICES & NAMES BELOW ARE PLACEHOLDERS — swap in your real ones.
   ===================================================================== */

window.SAUNA_PRODUCTS = [
  /* ---------------- 100% WOOL ---------------- */
  {
    id: "classic-black-wool",
    name: "Classic Wool Sauna Hat — Charcoal",
    category: "Wool",
    price: 39,
    badge: "Bestseller",
    blurb: "Thick 100% felted wool. The everyday sauna essential.",
    desc: "Our flagship sauna hat, densely felted from 100% natural wool to insulate your head and protect your hair from the harshest löyly. Roomy enough for most adults, with a soft inner band that sits comfortably without itching. Naturally breathable and odour-resistant.",
    colors: [{ name: "Charcoal", hex: "#3a342e" }, { name: "Black", hex: "#1c1916" }],
    specs: { Material: "100% natural sheep wool felt", Thickness: "~5 mm dense felt", Fit: "One size (adult)", Care: "Hand wash cold, air dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/classic-black-wool.jpg"
  },
  {
    id: "natural-cream-wool",
    name: "Classic Wool Sauna Hat — Natural Cream",
    category: "Wool",
    price: 39,
    blurb: "Undyed, natural wool in a warm birch cream.",
    desc: "The same dense 100% wool felt as our charcoal classic, left undyed for a clean, natural look that pairs with any sauna. Excellent heat insulation and a timeless Nordic feel.",
    colors: [{ name: "Cream", hex: "#efe5d6" }, { name: "Oatmeal", hex: "#d9c7a8" }],
    specs: { Material: "100% undyed sheep wool felt", Thickness: "~5 mm dense felt", Fit: "One size (adult)", Care: "Hand wash cold, air dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/natural-cream-wool.jpg"
  },
  {
    id: "two-tone-wool",
    name: "Two-Tone Wool Sauna Hat",
    category: "Wool",
    price: 45,
    badge: "New",
    blurb: "Contrast felted brim with a hand-finished trim.",
    desc: "A elevated take on the classic, with a contrast-colour brim and tidy hand-finished edge. Same protective 100% wool body. A great gift that still performs in the hottest sauna.",
    colors: [{ name: "Cream / Cedar", hex: "#b5651d" }, { name: "Grey / Black", hex: "#6f655b" }],
    specs: { Material: "100% wool felt, two-tone", Thickness: "~5 mm dense felt", Fit: "One size (adult)", Care: "Hand wash cold, air dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/two-tone-wool.jpg"
  },
  {
    id: "kids-wool",
    name: "Kids Wool Sauna Hat",
    category: "Wool",
    price: 29,
    blurb: "A smaller 100% wool hat sized for younger sauna-goers.",
    desc: "All the heat protection of our adult hats, scaled down for kids. Soft, lightweight, and gentle against the skin so the whole family can enjoy the sauna together.",
    colors: [{ name: "Cream", hex: "#efe5d6" }, { name: "Charcoal", hex: "#3a342e" }],
    specs: { Material: "100% wool felt", Fit: "Child / youth", Care: "Hand wash cold, air dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/kids-wool.jpg"
  },

  /* ---------------- MERINO WOOL ---------------- */
  {
    id: "merino-premium-grey",
    name: "Merino Wool Sauna Hat — Stone Grey",
    category: "Merino",
    price: 55,
    badge: "Premium",
    blurb: "Ultra-soft merino felt — lighter, finer, next-to-skin comfort.",
    desc: "Crafted from premium merino wool for a noticeably softer, finer feel than standard felt while keeping superb heat insulation. Breathable, naturally temperature-regulating, and gentle even on sensitive skin. Our most comfortable hat.",
    colors: [{ name: "Stone Grey", hex: "#8b8178" }, { name: "Charcoal", hex: "#3a342e" }],
    specs: { Material: "100% merino wool felt", Thickness: "~4 mm fine felt", Fit: "One size (adult)", Care: "Hand wash cold, lay flat to dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/merino-premium-grey.jpg"
  },
  {
    id: "merino-natural",
    name: "Merino Wool Sauna Hat — Natural",
    category: "Merino",
    price: 55,
    blurb: "Undyed premium merino in a soft natural tone.",
    desc: "The same luxuriously soft merino felt in a clean undyed finish. Lightweight comfort with excellent insulation — a refined upgrade for regular sauna users.",
    colors: [{ name: "Natural", hex: "#e7d8c2" }, { name: "Cream", hex: "#efe5d6" }],
    specs: { Material: "100% undyed merino wool felt", Thickness: "~4 mm fine felt", Fit: "One size (adult)", Care: "Hand wash cold, lay flat to dry", Origin: "Made for Canadian saunas" },
    image: "assets/products/merino-natural.jpg"
  },
  {
    id: "merino-couple-set",
    name: "Merino Couple's Set (2 Hats)",
    category: "Merino",
    price: 99,
    compareAt: 110,
    badge: "Sale",
    blurb: "Two premium merino hats — perfect his-and-hers gift.",
    desc: "A matched pair of our premium merino sauna hats at a bundle price. A popular gift for sauna-loving couples — qualifies for free Canada-wide shipping.",
    colors: [{ name: "Grey + Natural", hex: "#8b8178" }, { name: "Charcoal + Cream", hex: "#3a342e" }],
    specs: { Includes: "2 × merino sauna hats", Material: "100% merino wool felt", Fit: "One size (adult) ×2", Care: "Hand wash cold, lay flat to dry", Shipping: "Free Canada-wide" },
    image: "assets/products/merino-couple-set.jpg"
  },

  /* ---------------- CUSTOM ---------------- */
  {
    id: "custom-embroidered",
    name: "Custom Embroidered Sauna Hat",
    category: "Custom",
    price: 49,
    badge: "Made to order",
    blurb: "Your name, initials, or logo embroidered on a wool hat.",
    desc: "Add personalised embroidery — a name, initials, a date, or a small logo — to our classic wool hat. Ideal for gifts, weddings, or treating yourself. Choose thread colour and placement; we'll send a proof before stitching.",
    colors: [{ name: "Charcoal", hex: "#3a342e" }, { name: "Cream", hex: "#efe5d6" }, { name: "Cedar", hex: "#b5651d" }],
    specs: { Material: "100% wool felt", Personalisation: "Up to ~20 characters or small logo", Proof: "Digital proof before production", "Lead time": "Approx. 1–2 weeks", "Min. order": "1" },
    image: "assets/products/custom-embroidered.jpg"
  },
  {
    id: "custom-business-logo",
    name: "Custom Business / Branded Hats",
    category: "Custom",
    price: 39,
    badge: "Wholesale",
    blurb: "Branded sauna hats for spas, gyms & sauna businesses.",
    desc: "Outfit your sauna, spa, gym, or retail shelf with hats carrying your own brand. Volume pricing on orders of 10+, with embroidered or printed logos and your choice of colours. Request a quote and we'll tailor a package to your business.",
    colors: [{ name: "Your brand colours", hex: "#b5651d" }],
    specs: { Material: "100% wool or merino felt", "Branding": "Embroidered or printed logo", "Volume pricing": "10+ units", "Lead time": "2–4 weeks for bulk", "Min. order": "Contact for quote" },
    image: "assets/products/custom-business-logo.jpg"
  },
  {
    id: "custom-gift-set",
    name: "Custom Gift Set",
    category: "Custom",
    price: 65,
    blurb: "Personalised hat presented in gift-ready packaging.",
    desc: "A personalised sauna hat finished with a gift box and a hand-written note card — ready to give. Add a name or short message and we'll handle the rest.",
    colors: [{ name: "Charcoal", hex: "#3a342e" }, { name: "Cream", hex: "#efe5d6" }],
    specs: { Includes: "Custom hat + gift box + note card", Material: "100% wool felt", "Lead time": "Approx. 1–2 weeks", "Min. order": "1" },
    image: "assets/products/custom-gift-set.jpg"
  }
];
