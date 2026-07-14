//cart helper (localstorage)
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, title, price, emoji, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  item ? item.qty += qty : cart.push({ id, title, price, emoji, qty });
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = Math.max(1, item.qty + delta); saveCart(cart); }
}

function cartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

//toast

function showToast(text, type = "success") {
  document.getElementById("toast")?.remove();
  const color = type === "success" ? "#22c55e" : "#ef4444";
  const icon  = type === "success"
    ? `<circle cx="12" cy="12" r="12" fill="${color}"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="12" cy="12" r="12" fill="${color}"/><path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2.2" stroke-linecap="round"/>`;
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

//page detection, run the right init on load

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("logpg"))              initLogin();
  else if (document.querySelector(".hero-section"))  initMain();
  else if (document.querySelector(".items-display")) initCategory();
});


//login page  (index.html)

function initLogin() {
  const loginPage = document.getElementById("logpg");
  const signPage  = document.getElementById("singpg");

  loginPage.classList.add("active");
  signPage.classList.remove("active");

  // slide animation between panels 
  function goTo(show, hide, fromRight) {
    hide.classList.remove("active");
    show.style.transform  = `translateX(${fromRight ? "120%" : "-120%"}) translateY(-50%)`;
    show.style.opacity    = "0";
    show.style.transition = "none";
    show.classList.add("active");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      show.style.transition = "transform 0.42s ease, opacity 0.3s ease";
      show.style.transform  = "translate(-50%,-50%)";
      show.style.opacity    = "1";
    }));
  }

  loginPage.querySelector("p a").onclick = e => { e.preventDefault(); goTo(signPage, loginPage, true);  };
  signPage.querySelector("p a").onclick  = e => { e.preventDefault(); goTo(loginPage, signPage, false); };
  document.querySelectorAll(".back-arrow").forEach(el => {
    el.onclick = () => {
        // if we're on the sign page, go back to login
        if (signPage.classList.contains("active")) {
            goTo(loginPage, signPage, false);
        } else {
            // if we're on the login page, go back to main
            window.location.href = "main.html";
        }
    };
});

  // inject confirm password field into sign-up form 
  if (!document.getElementById("confirmPass")) {
    signPage.querySelector("input[type='password']")
      .closest(".input-wrapper")
      .insertAdjacentHTML("afterend", `
        <label style="color:white;font-size:15px;font-weight:700;margin-top:14px;display:block;">Confirm Password</label>
        <div class="input-wrapper">
          <input type="password" id="confirmPass" name="confirm_password" placeholder="Repeat your password" />
          <i class="bx bx-lock-alt"></i>
        </div>
        <p id="passMsg" style="margin-top:6px;font-size:13px;font-weight:600;display:none;"></p>
      `);
  }

  //set action & method on login form so it reaches PHP
  loginPage.querySelector("form").setAttribute("action", "login.php");
  loginPage.querySelector("form").setAttribute("method", "POST");
  loginPage.querySelector("form").removeAttribute("onsubmit");

  //give the login submit button name="login" so PHP can detect it
  loginPage.querySelector("input[type='submit']").setAttribute("name", "login");

  //set action + method on sign-up form 
  signPage.querySelector("form").setAttribute("action", "login.php");
  signPage.querySelector("form").setAttribute("method", "POST");
  signPage.querySelector("form").removeAttribute("onsubmit");

  /*hidden input so PHP knows this is a registration request */
  if (!signPage.querySelector("input[name='action']")) {
    const hidden = document.createElement("input");
    hidden.type  = "hidden";
    hidden.name  = "action";
    hidden.value = "register";
    signPage.querySelector("form").appendChild(hidden);
  }

  /*add name attributes so PHP receives email + password */
  loginPage.querySelector("input[type='email']").setAttribute("name", "email");
  loginPage.querySelector("input[type='password']").setAttribute("name", "password");
  signPage.querySelector("input[type='email']").setAttribute("name", "email");
  signPage.querySelector("input[type='password']").setAttribute("name", "password");

  /* client-side password match check */
  const signPass    = signPage.querySelector("input[type='password']");
  const confirmPass = document.getElementById("confirmPass");
  const passMsg     = document.getElementById("passMsg");
  const signBtn     = signPage.querySelector("input[type='submit']");

  signBtn.disabled      = true;
  signBtn.style.opacity = "0.5";

  function checkPasswords() {
    const match = signPass.value && signPass.value === confirmPass.value;
    passMsg.style.display = (signPass.value && confirmPass.value) ? "block" : "none";
    passMsg.textContent   = match ? "✓ Passwords match" : "✗ Passwords do not match";
    passMsg.style.color   = match ? "#8DC373" : "tomato";
    signBtn.disabled      = !match;
    signBtn.style.opacity = match ? "1" : "0.5";
  }

  signPass.addEventListener("input", checkPasswords);
  confirmPass.addEventListener("input", checkPasswords);

  /* prevent sign-up submit if passwords don't match */
  signPage.querySelector("form").addEventListener("submit", e => {
    if (signPass.value !== confirmPass.value) {
      e.preventDefault();
      showToast("Passwords do not match", "error");
    }
  });

  /* show PHP error messages passed via URL (?error=...) */
  const params = new URLSearchParams(window.location.search);
  const error  = params.get("error");
  const errorMessages = {
    invalid_login:       "Wrong email or password ❌",
    wrong_password:      "Wrong email or password ❌",
    email_exists:        "Email already registered ❌",
    missing_fields:      "Please fill all fields ❌",
    invalid_email:       "Invalid email format ❌",      
    short_password:      "Password must be 8+ characters ❌", 
    registration_failed: "Registration failed, try again ❌", 
    server_error:        "Something went wrong, try again ❌",
  };
  if (error && errorMessages[error]) {
    showToast(errorMessages[error], "error");
  }
}


/* main page (main.html)*/

let promoDiscount = 0;
let promoUsed     = false;

function initMain() {

  /* Email avatar on Sign In button */
fetch('get_session.php')
  .then(res => res.json())
  .then(data => {
    const signinBtn    = document.querySelector(".btn-signin");
    const profileBtn   = document.querySelector(".profile-btn");

    if (data.logged_in) {
      const firstLetter = data.email[0].toUpperCase();

      // hide the Sign In button completely
      if (signinBtn) signinBtn.style.display = "none";

      // replace profile icon with first letter circle
      if (profileBtn) {
        profileBtn.querySelector("i").style.display = "none";
        profileBtn.insertAdjacentHTML("afterbegin", `
          <span style="
            display:inline-flex;align-items:center;justify-content:center;
            width:34px;height:34px;border-radius:50%;
            background:white;color:#B95071;
            font-size:15px;font-weight:800;line-height:1;
            pointer-events:none;
          ">${firstLetter}</span>
        `);
      }

    } else {
      //not logged in =Sign In goes to login page
      if (signinBtn) {
        signinBtn.addEventListener("click", () => window.location.href = "index.html");
      }
    }
  });

  /* nav links smooth scroll */
  document.querySelectorAll(".header-nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".header-nav a").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const targets = {
        "home":       () => window.scrollTo({ top: 0, behavior: "smooth" }),
        "categories": () => document.querySelector(".categories-grid")?.scrollIntoView({ behavior: "smooth" }),
        "features":   () => document.querySelector(".products-grid")?.scrollIntoView({ behavior: "smooth" }),
        "contact us": () => document.querySelector(".comment-section")?.scrollIntoView({ behavior: "smooth" }),
      };
      targets[link.textContent.trim().toLowerCase()]?.();
    });
  });

  /* shop Now button */
  document.querySelector(".btn-shopnow")?.addEventListener("click", () => {
    document.querySelector(".categories-grid")?.scrollIntoView({ behavior: "smooth" });
  });

  /* category cards → page navigation */
  document.querySelectorAll(".category-card").forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const pages = { books: "books.html", flowers: "flowers.html", study: "study-product.html" };
      const name  = card.querySelector("h3")?.textContent.trim().toLowerCase();
      if (pages[name]) window.location.href = pages[name];
    });
  });

  /* best seller cards → navigate to category page */
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.classList.contains("cart-btn")) return;
      const src = card.querySelector("img")?.src || "";
      if      (src.includes("flower")) window.location.href = "flowers.html";
      else if (src.includes("book"))   window.location.href = "books.html";
      else                             window.location.href = "study-product.html";
    });
  });

  /* best seller "Add to cart" buttons */
  document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card  = btn.closest(".product-card");
      const title = card.querySelector(".prd-title")?.textContent.trim() || "Item";
      const price = parseInt(card.querySelector(".prd-price")?.textContent.replace(/[^\d]/g, "") || "0");
      const src   = card.querySelector("img")?.src || "";
      const emoji = src.includes("flower") ? "💐" : src.includes("book") ? "📚" : "✨";
      addToCart(slugify(title), title, price, emoji);
      renderCart();
      showToast(`"${title}" added to cart 🛒`);
    });
  });
  //profile dropdown toggle on click
  const profileBtn = document.querySelector('.profile-btn');
  const profileDropdown = document.querySelector('.profile-dropdown');

  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('show');
  });

  // close when clicking anywhere else
  document.addEventListener('click', () => {
    profileDropdown?.classList.remove('show');
  });
  
  renderCart();

  /*checkout button submits cart to save_order.php */
  document.querySelector('.checkout-btn')?.addEventListener('click', () => {
    const cart = getCart();

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    const form  = document.createElement('form');
    form.method = 'POST';
    form.action = 'save_order.php';

    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = 'cart_data';
    input.value = JSON.stringify(cart);

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  });
}

/* open/close cart — called from HTML onclick */
function openCart() {
  renderCart();
  document.getElementById("cartSidebar")?.classList.add("open");
  document.getElementById("cartOverlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartSidebar")?.classList.remove("open");
  document.getElementById("cartOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* open/close auth modal */
function openAuth() {
  const o = document.getElementById("authOverlay");
  if (o) { o.style.display = "flex"; document.body.style.overflow = "hidden"; }
}

function closeAuth() {
  const o = document.getElementById("authOverlay");
  if (o) { o.style.display = "none"; document.body.style.overflow = ""; }
}

/* promo code */
function applyPromo() {
  if (promoUsed) return showToast("Promo already applied", "error");
  const input = document.getElementById("promoInput");
  const codes = { SAVE10: 0.10, BLOOM20: 0.20, WELCOME: 0.05 };
  const disc  = codes[input?.value.trim().toUpperCase()];
  if (!disc) return showToast("Invalid promo code", "error");
  promoDiscount = disc;
  promoUsed     = true;
  input.disabled      = true;
  input.style.opacity = "0.6";
  showToast(`${Math.round(disc * 100)}% discount applied! 🎉`);
  updateSummary();
}

/* render all cart items into the sidebar */
function renderCart() {
  const sidebar = document.getElementById("cartSidebar");
  if (!sidebar) return;

  sidebar.querySelectorAll(".cart-item").forEach(el => el.remove());

  const cart = getCart();
  let ref    = sidebar.querySelector(".table-head") || sidebar.querySelector(".cart-divider");

  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-item";
    empty.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px;color:rgba(255,255,255,0.6);font-size:15px;";
    empty.innerHTML = `<span style="font-size:48px">🛒</span><span>Your cart is empty</span>`;
    ref?.after(empty);
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="item-img-placeholder">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.title}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
            <span class="qty-box">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="item-price">${item.price.toLocaleString()} DA</div>
        <div class="item-total">${(item.price * item.qty).toLocaleString()} DA</div>
        <button onclick="deleteItem('${item.id}')"
          style="background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.5);font-size:20px;padding:0 4px;"
          onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='rgba(255,255,255,0.5)'"
          title="Remove">×</button>
      `;
      ref?.after(div);
      ref = div;
    });
  }

  updateSummary();
  updateBadge();
}

function updateQty(id, delta) { changeQty(id, delta); renderCart(); }
function deleteItem(id)        { removeFromCart(id);   renderCart(); }

function updateSummary() {
  const count = cartCount();
  const total = Math.round(cartTotal() * (1 - promoDiscount));
  const el    = id => document.getElementById(id);
  if (el("totalItems"))   el("totalItems").textContent   = count + (count === 1 ? " item" : " items");
  if (el("summaryItems")) el("summaryItems").textContent = count;
  if (el("totalCost"))    el("totalCost").textContent    = total.toLocaleString() + " DA";
}

function updateBadge() {
  const count = cartCount();
  const btn   = document.querySelector(".btn-icon[title='Cart']");
  if (!btn) return;
  let badge = btn.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className   = "cart-badge";
    badge.style.cssText = "position:absolute;top:-6px;right:-6px;background:#ef4444;color:white;border-radius:50%;font-size:11px;font-weight:700;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;pointer-events:none;";
    btn.style.position = "relative";
    btn.appendChild(badge);
  }
  badge.textContent   = count || "";
  badge.style.display = count ? "flex" : "none";
}


/*category page(books/flowers/study-product)*/

function initCategory() {

  /* slider arrows */
  document.querySelectorAll(".slider-left-arrow .arrow-btn, .slider-right-arrow .arrow-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const slider = btn.closest(".slider-wrapper")?.querySelector(".items-display");
      const card   = slider?.querySelector(".product-card");
      const gap    = parseFloat(getComputedStyle(slider).gap) || 16;
      const amount = ((card?.offsetWidth || 240) + gap) * 2;
      const dir    = btn.closest(".slider-left-arrow") ? -amount : amount;
      slider?.scrollBy({ left: dir, behavior: "smooth" });
    });
  });

  const popup   = document.getElementById("popup");
  const countEl = popup?.querySelector(".count");

  /* open popup on card click */
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".add-to-cart-btn")) return;
      if (!popup) return;
      popup.querySelector(".popup-image").src                  = card.querySelector(".item-image img")?.src || "";
      popup.querySelector(".popup-title").textContent          = card.querySelector(".item-title")?.textContent  || "";
      popup.querySelector(".popup-subdescription").textContent = card.querySelector(".item-description")?.textContent || "";
      popup.querySelector(".popup-description").textContent    = card.querySelector(".full-description")?.textContent || "";
      popup.querySelector(".popup-rating").textContent         = card.querySelector(".rating")?.textContent || "";
      popup.querySelector(".popup-price").textContent          = card.querySelector(".price")?.textContent  || "";
      if (countEl) countEl.textContent = "1";

      /*store the product's numeric id on the popup so addFromPopup() can use it */
      popup.dataset.productId = card.dataset.id || slugify(card.querySelector(".item-title")?.textContent);

      popup.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closePopup() {
    popup?.classList.remove("active");
    document.body.style.overflow = "";
  }

  popup?.querySelector(".close-btn")?.addEventListener("click", closePopup);
  popup?.addEventListener("click", e => { if (e.target === popup) closePopup(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePopup(); });

  popup?.querySelector(".minus")?.addEventListener("click", () => {
    if (countEl && parseInt(countEl.textContent) > 1) countEl.textContent--;
  });
  popup?.querySelector(".plus")?.addEventListener("click", () => {
    if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
  });

  function addFromPopup() {
    const title = popup.querySelector(".popup-title").textContent.trim();
    const price = parseInt(popup.querySelector(".popup-price").textContent.replace(/[^\d]/g, ""));
    const qty   = parseInt(countEl?.textContent) || 1;
    /*uses the real product id stored when popup opened */
    addToCart(popup.dataset.productId, title, price, "🛍️", qty);
    showToast(`${qty}× "${title}" added to cart 🛒`);
    closePopup();
  }

  popup?.querySelector(".add-btn")?.addEventListener("click",  addFromPopup);
  popup?.querySelector(".card-btn")?.addEventListener("click", addFromPopup);

  /* inline add-to-cart buttons on cards */
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      e.preventDefault();
      const card      = btn.closest(".product-card");
      const title     = card.querySelector(".item-title")?.textContent.trim() || "Item";
      const price     = parseInt(card.querySelector(".price")?.textContent.replace(/[^\d]/g, "") || "0");
      /*now uses data-id from the card HTML */
      const productId = card.dataset.id || slugify(title);
      addToCart(productId, title, price, "🛍️");
      showToast(`"${title}" added to cart 🛒`);
    });
  });
}