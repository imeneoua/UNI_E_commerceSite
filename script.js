const $ = (selector) => document.querySelector(selector);
//PAGES 
const loginPage = $("#logpg");
const signPage  = $("#singpg");

signPage.style.display = "none";
//FORMS
const loginForm = $("#logpg form");
const signForm  = $("#singpg form");
//SIGNUP INPUTS
const signEmail    = $("#singpg input[type='email']");
const signPassword = $("#singpg input[type='password']");
const signBtn      = $("#singpg input[type='submit']");
// ACCOUNTS STORAGE
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

// SWITCH PAGES (with slide)
$("#logpg p a").onclick = (e) => { e.preventDefault(); showPage(loginPage, signPage, 'left'); };
$("#singpg p a").onclick = (e) => { e.preventDefault(); showPage(signPage, loginPage, 'right'); };
document.querySelectorAll(".back-arrow").forEach(btn => {
    btn.onclick = () => showPage(signPage, loginPage, 'right');
});

function showPage(hide, show, dir) {
    slideOut(hide, dir);
    slideIn(show, dir);
}

function slideOut(el, dir) {
    el.style.transition = 'transform 0.45s cubic-bezier(0.77,0,0.18,1), opacity 0.35s ease';
    el.style.transform  = `translateX(${dir === 'left' ? '-120%' : '120%'}) translateY(-50%)`;
    el.style.opacity    = '0';
    setTimeout(() => { el.style.display = 'none'; el.style.transform = 'translate(-50%,-50%)'; }, 450);
}

function slideIn(el, dir) {
    el.style.display    = 'block';
    el.style.transform  = `translateX(${dir === 'left' ? '120%' : '-120%'}) translateY(-50%)`;
    el.style.opacity    = '0';
    el.style.transition = 'none';
    el.getBoundingClientRect();
    el.style.transition = 'transform 0.45s cubic-bezier(0.77,0,0.18,1), opacity 0.35s ease';
    el.style.transform  = 'translate(-50%,-50%)';
    el.style.opacity    = '1';
}
// ADD CONFIRM PASSWORD FIELD
signPassword.insertAdjacentHTML("afterend", `
    <label style="display:block;color:white;font-size:15px;font-weight:600;margin:20px 0 8px">Confirm Password</label>
    <div class="input-wrapper">
        <input type="password" id="confirmPass" placeholder="Confirm your password"
            style="width:100%;padding:14px 45px 14px 16px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:12px;color:white;font-size:14px;outline:none;">
        <i class="bx bx-lock" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.7);font-size:18px;"></i>
    </div>
    <p id="msg" style="margin-top:8px;font-size:13px;font-weight:600;display:none;"></p>
`);

const confirmPass = $("#confirmPass");
const msg         = $("#msg");

setButton(false);
// PASSWORD CHECK
function checkPasswords() {
    const pass1 = signPassword.value.trim();
    const pass2 = confirmPass.value.trim();

    if (!pass1 || !pass2) { msg.style.display = 'none'; setButton(false); return; }

    const match = pass1 === pass2;
    msg.style.display   = 'block';
    msg.textContent     = match ? '✓ Passwords match' : '✗ Passwords do not match';
    msg.style.color     = match ? '#8DC373' : 'tomato';
    setButton(match);
}

signPassword.oninput = checkPasswords;
confirmPass.oninput  = checkPasswords;
// ENABLE / DISABLE BUTTON
function setButton(state) {
    signBtn.disabled      = !state;
    signBtn.style.opacity = state ? '1'       : '0.5';
    signBtn.style.cursor  = state ? 'pointer' : 'not-allowed';
}
// SIGNUP
signForm.onsubmit = (e) => {
    e.preventDefault();
    const email= signEmail.value.trim();
    const password = signPassword.value.trim();

    if (!email || !password) { toast("Fill all fields", "error"); return; }

    if (accounts.find(acc => acc.email === email)) {
    toast("Email already exists", "error");
    return;
    }

    accounts.push({ email, password });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    toast("Account created successfully", "success");

    setTimeout(() => {
    showPage(signPage, loginPage, 'right');
    signForm.reset();
    msg.style.display = 'none';
    setButton(false);
    }, 1500);
};
// LOGIN

loginForm.onsubmit = (e) => {
    e.preventDefault();

    const email = $("#logpg input[type='email']").value.trim();
    const password = $("#logpg input[type='password']").value.trim();
    const user = accounts.find(acc => acc.email === email && acc.password === password);
    /*if (user) 
        {
        toast("Login successful", "success");
        localStorage.setItem("currentUser", JSON.stringify(user));
        setTimeout(() => {
            window.location.href = "main.html"; 
        }, 1500);
    } else {
        toast("Wrong email or password", "error");
    }
        */
    toast(user ? "Login successful" : "Wrong email or password", user ? "success" : "error");
};
// TOAST MESSAGE
function toast(text, type) {
    $("#toast")?.remove();

    const icons = {
    success: `<circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
    error:   `<circle cx="12" cy="12" r="12" fill="#ef4444"/><path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2.2" stroke-linecap="round"/>`
    };

    const div = document.createElement("div");
    div.id = "toast";
    div.innerHTML = `
    <div class="toast-icon"><svg viewBox="0 0 24 24" fill="none">${icons[type]}</svg></div>
    <span class="toast-msg">${text}</span>
    <div class="toast-bar" style="background:${type === 'success' ? '#22c55e' : '#ef4444'}"></div>
    `;

    document.body.appendChild(div);
    setTimeout(() => div.classList.add("toast-hide"), 2500);
    setTimeout(() => div.remove(), 3000);
}