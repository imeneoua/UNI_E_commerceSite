
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("logpg"))         return initLoginPage();
  if (document.getElementById("mnpart"))        return initMainPage();
  if (document.querySelector(".items-display")) return initCategoryPage();
});

/*SHARED CART STATE  (used by all pages)*/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(product) {
  // product: { id, title, price, emoji }
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
}
function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}
function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
}
function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

/* ============================================================
   TOAST  — works on every page
   ============================================================ */
function showToast(text, type = "success") {
  document.getElementById("toast")?.remove();
  const color = type === "success" ? "#22c55e" : "#ef4444";
  const icon  = type === "success"
    ? `<circle cx="12" cy="12" r="12" fill="${color}"/>
       <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="12" cy="12" r="12" fill="${color}"/>
       <path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2.2" stroke-linecap="round"/>`;
  const div = document.createElement("div");
  div.id = "toast";
  div.innerHTML = `
    <div class="toast-icon"><svg viewBox="0 0 24 24" fill="none">${icon}</svg></div>
    <span class="toast-msg">${text}</span>
    <div class="toast-bar" style="background:${color}"></div>
  `;
  document.body.appendChild(div);
  setTimeout(() => div.classList.add("toast-hide"), 2500);
  setTimeout(() => div.remove(), 3000);
}

/* ============================================================
   LOGIN PAGE  (index.html)
   ============================================================ */
function initLoginPage() 
{
  const loginPage = document.getElementById("logpg");
  const signPage  = document.getElementById("singpg");
  if (!loginPage || !signPage) return;

  signPage.style.display = "none";

  let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  function slideOut(el, dir) {
    el.style.transition = "transform 0.45s cubic-bezier(0.77,0,0.18,1), opacity 0.35s ease";
    el.style.transform  = `translateX(${dir === "left" ? "-120%" : "120%"}) translateY(-50%)`;
    el.style.opacity    = "0";
    setTimeout(() => { el.style.display = "none"; el.style.transform = "translate(-50%,-50%)"; }, 450);
  }
  function slideIn(el, dir) {
    el.style.display    = "block";
    el.style.transform  = `translateX(${dir === "left" ? "120%" : "-120%"}) translateY(-50%)`;
    el.style.opacity    = "0";
    el.style.transition = "none";
    el.getBoundingClientRect();
    el.style.transition = "transform 0.45s cubic-bezier(0.77,0,0.18,1), opacity 0.35s ease";
    el.style.transform  = "translate(-50%,-50%)";
    el.style.opacity    = "1";
  }
  function goToSign()  { slideOut(loginPage, "left");  slideIn(signPage,  "left");  }
  function goToLogin() { slideOut(signPage,  "right"); slideIn(loginPage, "right"); }

  loginPage.querySelector("p a")?.addEventListener("click", (e) => { e.preventDefault(); goToSign(); });
  signPage.querySelector("p a")?.addEventListener("click",  (e) => { e.preventDefault(); goToLogin(); });
  document.querySelectorAll(".back-arrow").forEach(el => el.addEventListener("click", goToLogin));

  const signPassword = signPage.querySelector("input[type='password']");
  if (signPassword) {
    signPassword.insertAdjacentHTML("afterend", `
      <label style="display:block;color:white;font-size:14px;font-weight:600;margin:16px 0 6px">Confirm Password</label>
      <div class="input-wrapper">
        <input type="password" id="confirmPass" placeholder="Confirm your password" />
        <i class="bx bx-lock"></i>
      </div>
      <p id="passMsg" style="margin-top:6px;font-size:13px;font-weight:600;display:none;"></p>
    `);
  }

  const confirmPass = document.getElementById("confirmPass");
  const passMsg     = document.getElementById("passMsg");
  const signBtn     = signPage.querySelector("input[type='submit']");
  const signEmail   = signPage.querySelector("input[type='email']");

  setSignBtn(false);
  function setSignBtn(on) {
    if (!signBtn) return;
    signBtn.disabled = !on;
    signBtn.style.opacity = on ? "1" : "0.5";
    signBtn.style.cursor  = on ? "pointer" : "not-allowed";
  }
  function checkPasswords() {
    const p1 = signPassword?.value.trim();
    const p2 = confirmPass?.value.trim();
    if (!p1 || !p2) { if (passMsg) passMsg.style.display = "none"; setSignBtn(false); return; }
    const ok = p1 === p2;
    if (passMsg) {
      passMsg.style.display = "block";
      passMsg.textContent   = ok ? "✓ Passwords match" : "✗ Passwords do not match";
      passMsg.style.color   = ok ? "#8DC373" : "tomato";
    }
    setSignBtn(ok);
  }
  signPassword?.addEventListener("input", checkPasswords);
  confirmPass?.addEventListener("input",  checkPasswords);

  signPage.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signEmail?.value.trim(), password = signPassword?.value.trim();
    if (!email || !password) { showToast("Fill all fields", "error"); return; }
    if (accounts.find(a => a.email === email)) { showToast("Email already exists", "error"); return; }
    accounts.push({ email, password });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    showToast("Account created successfully!", "success");
    setTimeout(() => {
      goToLogin();
      signPage.querySelector("form").reset();
      if (passMsg) passMsg.style.display = "none";
      setSignBtn(false);
    }, 1500);
  });

  loginPage.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email    = loginPage.querySelector("input[type='email']")?.value.trim();
    const password = loginPage.querySelector("input[type='password']")?.value.trim();
    const user     = accounts.find(a => a.email === email && a.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      showToast("Login successful!", "success");
      setTimeout(() => { window.location.href = "main.html"; }, 1500);
    } else {
      showToast("Wrong email or password", "error");
    }
  });
}

/* ============================================================
   MAIN PAGE  (main.html)
   ============================================================ */
function initMainPage() {

  /* ─── HEADER BUTTONS ─────────────────────────────────────── */
  const headerBtns = document.querySelectorAll("header td:last-child button");
  const signInBtn  = headerBtns[0];
  const cartBtn    = headerBtns[1];
  const profileBtn = headerBtns[2];

  signInBtn?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  /* ─── NAV LINKS ──────────────────────────────────────────── */
  document.querySelectorAll("header nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll("header nav a").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const txt = link.textContent.trim().toLowerCase();
      const allH2 = document.querySelectorAll("#mnpart h2");
      if      (txt === "home")       window.scrollTo({ top: 0, behavior: "smooth" });
      else if (txt === "categories") allH2[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (txt === "features")   allH2[1]?.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (txt === "contact us") document.querySelector(".Comentprt")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ─── "SHOP NOW" BUTTON ──────────────────────────────────── */
  document.querySelector("#mnpart table td button")?.addEventListener("click", () => {
    document.querySelectorAll("#mnpart h2")[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ─── CATEGORY CARDS ─────────────────────────────────────── */
  document.querySelectorAll("#mnpart > table:nth-of-type(2) td").forEach(td => {
    td.style.cursor = "pointer";
    td.addEventListener("click", () => {
      const name = td.querySelector("h3")?.textContent.trim().toLowerCase();
      if      (name === "books")        window.location.href = "books.html";
      else if (name === "flowers")      window.location.href = "flowers.html";
      else if (name === "decorations")  window.location.href = "study-product.html";
    });
  });

  /* ─── BEST SELLER PRODUCT CARDS ─────────────────────────── */
  document.querySelectorAll(".products-grid td").forEach(td => {
    td.addEventListener("click", (e) => {
      if (e.target.classList.contains("cart-btn")) return;
      const src = td.querySelector("img")?.src || "";
      if      (src.includes("flower")) window.location.href = "flowers.html";
      else if (src.includes("book"))   window.location.href = "books.html";
      else                             window.location.href = "decor.html";
    });
  });

  /* ─── "ADD TO CART" buttons on best-seller grid ─────────── */
  document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const td      = btn.closest("td");
      const title   = td?.querySelector(".prd-title")?.textContent?.trim() || "Item";
      const priceStr= td?.querySelector(".prd-price")?.textContent?.replace(/[^\d]/g, "") || "0";
      const price   = parseInt(priceStr, 10);
      const imgSrc  = td?.querySelector("img")?.src || "";

      // Pick an emoji based on category
      let emoji = "🛍️";
      if (imgSrc.includes("flower")) emoji = "💐";
      else if (imgSrc.includes("book")) emoji = "📚";
      else emoji = "✨";

      // Use the title as a stable ID (slug it)
      const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

      addToCart({ id, title, price, emoji });
      renderCart();
      updateCartBadge();
      showToast(`"${title}" added to cart 🛒`, "success");
    });
  });

  /* ─── CART SIDEBAR ───────────────────────────────────────── */
  const cartWrapper = document.querySelector(".cart-wrapper");
  const backLink    = document.querySelector(".back-link");

  if (cartWrapper) {
    cartWrapper.style.display    = "none";
    cartWrapper.style.opacity    = "0";
    cartWrapper.style.transform  = "translateX(100%)";
    cartWrapper.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  }

  function openCart() {
    if (!cartWrapper) return;
    renderCart();
    cartWrapper.style.display = "flex";
    requestAnimationFrame(() => {
      cartWrapper.style.opacity   = "1";
      cartWrapper.style.transform = "translateX(0)";
    });
  }
  function closeCart() {
    if (!cartWrapper) return;
    cartWrapper.style.opacity   = "0";
    cartWrapper.style.transform = "translateX(100%)";
    setTimeout(() => { cartWrapper.style.display = "none"; }, 300);
  }

  cartBtn?.addEventListener("click", openCart);
  backLink?.addEventListener("click", closeCart);
  cartWrapper?.addEventListener("click", (e) => { if (e.target === cartWrapper) closeCart(); });

  /* ─── RENDER CART ITEMS DYNAMICALLY ─────────────────────── */
  function renderCart() {
    const cart         = getCart();
    const cartLeft     = document.querySelector(".cart-left");
    const cartRight    = document.querySelector(".cart-right");
    if (!cartLeft) return;

    // Remove old dynamic items (keep header, divider, table-head)
    cartLeft.querySelectorAll(".cart-item").forEach(el => el.remove());

    if (cart.length === 0) {
      const empty = document.createElement("div");
      empty.className = "cart-item";
      empty.id = "cart-empty";
      empty.style.cssText = "justify-content:center;padding:40px 20px;font-size:15px;color:#aaa;flex-direction:column;align-items:center;gap:8px;";
      empty.innerHTML = `<span style="font-size:40px">🛒</span><span>Your cart is empty</span>`;
      cartLeft.appendChild(empty);
    } else {
      cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.id = "cart-item-" + item.id;
        div.innerHTML = `
          <div class="item-img-placeholder">${item.emoji}</div>
          <div style="flex:1;min-width:0;">
            <div class="item-name">${item.title}</div>
            <div class="qty-control">
              <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
              <span class="qty-box" id="qty-${item.id}">${item.qty}</span>
              <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
            </div>
          </div>
          <div class="item-price">${item.price.toLocaleString()} DA</div>
          <div class="item-total" id="total-${item.id}">${(item.price * item.qty).toLocaleString()} DA</div>
          <button class="remove-btn" data-id="${item.id}" title="Remove" style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:18px;padding:0 4px;line-height:1;">×</button>
        `;
        cartLeft.appendChild(div);
      });
    }

    // Bind qty buttons
    cartLeft.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id    = btn.dataset.id;
        const delta = parseInt(btn.dataset.delta, 10);
        changeCartQty(id, delta);
        renderCart();
        updateCartSummary();
        updateCartBadge();
      });
    });

    // Bind remove buttons
    cartLeft.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromCart(btn.dataset.id);
        renderCart();
        updateCartSummary();
        updateCartBadge();
      });
    });

    updateCartSummary();
  }

  /* ─── CART SUMMARY ───────────────────────────────────────── */
  function updateCartSummary() {
    const count = getCartCount();
    const total = getCartTotal();
    const g = id => document.getElementById(id);

    // Apply promo discount if active
    const discountedTotal = Math.round(total * (1 - currentDiscount));

    if (g("totalItems"))   g("totalItems").textContent   = count + (count === 1 ? " item" : " items");
    if (g("summaryItems")) g("summaryItems").textContent = count;
    if (g("totalCost"))    g("totalCost").textContent    = discountedTotal.toLocaleString() + " DA";
  }

  /* ─── CART BADGE on cart button ─────────────────────────── */
  function updateCartBadge() {
    const count = getCartCount();
    let badge = cartBtn?.querySelector(".cart-badge");
    if (!badge && cartBtn) {
      badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.style.cssText = `
        position:absolute; top:-6px; right:-6px;
        background:#ef4444; color:white; border-radius:50%;
        font-size:11px; font-weight:700; min-width:18px; height:18px;
        display:flex; align-items:center; justify-content:center;
        pointer-events:none;
      `;
      if (cartBtn.style.position !== "relative") cartBtn.style.position = "relative";
      cartBtn.appendChild(badge);
    }
    if (badge) {
      badge.textContent = count > 0 ? count : "";
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  /* ─── PROMO CODE ─────────────────────────────────────────── */
  const PROMOS = { "SAVE10": 0.10, "BLOOM20": 0.20, "WELCOME": 0.05 };
  let currentDiscount = 0;
  let promoUsed = false;

  function applyPromo() {
    if (promoUsed) { showToast("Promo already applied", "error"); return; }
    const input    = document.getElementById("promoInput");
    const code     = input?.value.trim().toUpperCase();
    if (!code) { showToast("Enter a promo code", "error"); return; }
    const discount = PROMOS[code];
    if (!discount) { showToast("Invalid promo code", "error"); return; }
    promoUsed       = true;
    currentDiscount = discount;
    updateCartSummary();
    showToast(`${Math.round(discount * 100)}% discount applied!`, "success");
    if (input) { input.disabled = true; input.style.opacity = "0.6"; }
  }
  window.applyPromo = applyPromo;

  /* ─── PROFILE DROPDOWN ───────────────────────────────────── */
  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const aside = profileBtn.querySelector("aside");
    if (aside) aside.style.display = aside.style.display === "flex" ? "none" : "flex";
  });
  document.addEventListener("click", () => {
    const aside = profileBtn?.querySelector("aside");
    if (aside) aside.style.display = "none";
  });

  // Init badge on page load
  updateCartBadge();
}

/* ============================================================
   CATEGORY PAGES  (books.html / flowers.html / decor.html)
   ============================================================ */
function initCategoryPage() {

  /* ─── SLIDERS ────────────────────────────────────────────── */
  function scrollAmount(slider) {
    const card = slider?.querySelector(".product-card");
    if (!card) return 320;
    return (card.offsetWidth + (parseFloat(getComputedStyle(slider).gap) || 16)) * 4;
  }

  document.querySelectorAll(".slider-left-arrow .arrow-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const slider = btn.closest(".slider-wrapper")?.querySelector(".items-display");
      slider?.scrollBy({ left: -scrollAmount(slider), behavior: "smooth" });
    };
  });
  document.querySelectorAll(".slider-right-arrow .arrow-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const slider = btn.closest(".slider-wrapper")?.querySelector(".items-display");
      slider?.scrollBy({ left: scrollAmount(slider), behavior: "smooth" });
    };
  });

  /* ─── PRODUCT POPUP ──────────────────────────────────────── */
  const popup   = document.getElementById("popup");
  const countEl = popup?.querySelector(".count");

  function openPopup(card) {
    if (!popup) return;
    popup.querySelector(".popup-image").src                  = card.querySelector(".item-image img")?.src || "";
    popup.querySelector(".popup-image").alt                  = card.querySelector(".item-image img")?.alt || "";
    popup.querySelector(".popup-title").textContent          = card.querySelector(".item-title")?.textContent  || "";
    popup.querySelector(".popup-subdescription").textContent = card.querySelector(".item-description")?.textContent || "";
    popup.querySelector(".popup-description").textContent    = card.querySelector(".full-description")?.textContent || "";
    popup.querySelector(".popup-rating").textContent         = card.querySelector(".rating")?.textContent || "";
    popup.querySelector(".popup-price").textContent          = card.querySelector(".price")?.textContent  || "";
    if (countEl) countEl.textContent = "1";
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    popup?.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) return;
      openPopup(card);
    });
  });

  popup?.querySelector(".close-btn")?.addEventListener("click", closePopup);
  popup?.addEventListener("click", (e) => { if (e.target === popup) closePopup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePopup(); });

  /* ─── POPUP QUANTITY ─────────────────────────────────────── */
  popup?.querySelector(".minus")?.addEventListener("click", () => {
    const v = parseInt(countEl?.textContent) || 1;
    if (countEl && v > 1) countEl.textContent = v - 1;
  });
  popup?.querySelector(".plus")?.addEventListener("click", () => {
    if (countEl) countEl.textContent = (parseInt(countEl.textContent) || 1) + 1;
  });

  /* ─── POPUP ADD TO CART ──────────────────────────────────── */
  function addFromPopup() {
    const title    = popup?.querySelector(".popup-title")?.textContent?.trim() || "Item";
    const priceStr = popup?.querySelector(".popup-price")?.textContent?.replace(/[^\d]/g, "") || "0";
    const price    = parseInt(priceStr, 10);
    const qty      = parseInt(countEl?.textContent) || 1;
    const id       = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

    // Add qty times
    for (let i = 0; i < qty; i++) {
      addToCart({ id, title, price, emoji: "🛍️" });
    }

    showToast(`${qty}× "${title}" added to cart 🛒`, "success");
    closePopup();
  }
  popup?.querySelector(".add-btn")?.addEventListener("click",  addFromPopup);
  popup?.querySelector(".card-btn")?.addEventListener("click", addFromPopup);

  /* ─── INLINE ADD TO CART BUTTONS ────────────────────────── */
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card     = btn.closest(".product-card");
      const title    = card?.querySelector(".item-title")?.textContent?.trim() || "Item";
      const priceStr = card?.querySelector(".price")?.textContent?.replace(/[^\d]/g, "") || "0";
      const price    = parseInt(priceStr, 10);
      const id       = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

      addToCart({ id, title, price, emoji: "🛍️" });
      showToast(`"${title}" added to cart 🛒`, "success");
    });
  });
}