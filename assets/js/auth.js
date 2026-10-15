
  // ORBIT AUTH 
  //WITH SHA-256 Password Hashing 

// HASH FUNCTIONS (SHA-256 via Web Crypto API)
async function hashPassword(password) {
  
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ORBIT_SALT_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password, hashedPassword) {
  const newHash = await hashPassword(password);
  return newHash === hashedPassword;
}

// DOM ELEMENTS
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const tabIndicator = document.getElementById("tabIndicator");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// TAB SWITCHING
function switchTab(tab) {
  console.log("🔄 Tab:", tab);

  if (tab === "signup") {
    tabLogin.classList.remove("active");
    tabSignup.classList.add("active");
    tabIndicator.classList.add("right");
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    setTimeout(() => document.getElementById("signupName")?.focus(), 400);
  } else {
    tabSignup.classList.remove("active");
    tabLogin.classList.add("active");
    tabIndicator.classList.remove("right");
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
    setTimeout(() => document.getElementById("loginEmail")?.focus(), 400);
  }

  clearAllErrors();
}

tabLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  switchTab("login");
});

tabSignup?.addEventListener("click", (e) => {
  e.preventDefault();
  switchTab("signup");
});

document.querySelectorAll("[data-switch]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab(link.dataset.switch);
  });
});

// PASSWORD TOGGLE (Show/Hide)
document.querySelectorAll(".password-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.className = "fas fa-eye-slash";
    } else {
      input.type = "password";
      icon.className = "fas fa-eye";
    }
  });
});

// PASSWORD STRENGTH
const signupPasswordInput = document.getElementById("signupPassword");
const passwordStrengthEl = document.getElementById("passwordStrength");
const strengthTextEl = document.getElementById("strengthText");

if (signupPasswordInput) {
  signupPasswordInput.addEventListener("input", () => {
    const password = signupPasswordInput.value;

    passwordStrengthEl.classList.remove(
      "weak",
      "medium",
      "strong",
      "very-strong",
    );
    strengthTextEl.classList.remove("weak", "medium", "strong", "very-strong");

    if (password.length === 0) {
      strengthTextEl.textContent = "";
      return;
    }

    const score = calculateStrength(password);

    if (score <= 1) {
      passwordStrengthEl.classList.add("weak");
      strengthTextEl.classList.add("weak");
      strengthTextEl.textContent = "Weak password";
    } else if (score === 2) {
      passwordStrengthEl.classList.add("medium");
      strengthTextEl.classList.add("medium");
      strengthTextEl.textContent = "Medium password";
    } else if (score === 3) {
      passwordStrengthEl.classList.add("strong");
      strengthTextEl.classList.add("strong");
      strengthTextEl.textContent = "Strong password";
    } else {
      passwordStrengthEl.classList.add("very-strong");
      strengthTextEl.classList.add("very-strong");
      strengthTextEl.textContent = "Very strong! 💪";
    }
  });
}

function calculateStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

// ERROR HELPERS
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  input.classList.add("error");
  input.classList.remove("success");
  error.textContent = message;
  error.classList.add("show");
}

function showSuccess(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  input.classList.add("success");
  input.classList.remove("error");
  error.classList.remove("show");
}

function clearAllErrors() {
  document.querySelectorAll(".input-wrapper input").forEach((input) => {
    input.classList.remove("error", "success");
  });
  document.querySelectorAll(".error-msg").forEach((err) => {
    err.textContent = "";
    err.classList.remove("show");
  });
}

// VALIDATION
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name) {
  return name.trim().length >= 2;
}

function isValidPassword(password) {
  return password.length >= 6;
}

// SIGNUP HANDLER (WITH SHA-256 HASHING)
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  clearAllErrors();
  let hasError = false;

  // Name validation
  if (!name) {
    showError("signupName", "signupNameError", "Name is required");
    hasError = true;
  } else if (!isValidName(name)) {
    showError(
      "signupName",
      "signupNameError",
      "Name must be at least 2 characters",
    );
    hasError = true;
  } else if (/[<>\/\\{}[\]()]/.test(name)) {
    showError(
      "signupName",
      "signupNameError",
      "Name contains invalid characters",
    );
    hasError = true;
  }

  // Email validation
  if (!email) {
    showError("signupEmail", "signupEmailError", "Email is required");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError("signupEmail", "signupEmailError", "Please enter a valid email");
    hasError = true;
  } else {
    const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");
    if (users.some((u) => u.email === email)) {
      showError(
        "signupEmail",
        "signupEmailError",
        "This email is already registered",
      );
      hasError = true;
    }
  }

  // Password validation
  if (!password) {
    showError("signupPassword", "signupPasswordError", "Password is required");
    hasError = true;
  } else if (!isValidPassword(password)) {
    showError(
      "signupPassword",
      "signupPasswordError",
      "Password must be at least 6 characters",
    );
    hasError = true;
  }

  // Confirm validation
  if (!confirm) {
    showError(
      "signupConfirm",
      "signupConfirmError",
      "Please confirm your password",
    );
    hasError = true;
  } else if (password !== confirm) {
    showError("signupConfirm", "signupConfirmError", "Passwords do not match");
    hasError = true;
  }

  // Terms validation
  if (!agreeTerms) {
    const err = document.getElementById("agreeTermsError");
    err.textContent = "You must agree to the terms";
    err.classList.add("show");
    hasError = true;
  }

  if (hasError) {
    const card = document.getElementById("authCard");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
    return;
  }

  // Loading
  const btn = document.getElementById("signupBtn");
  btn.classList.add("loading");
  btn.disabled = true;

  Swal.fire({
    title: "Creating your account...",
    html: "🔐 Encrypting your password",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  //  async + await
  setTimeout(async () => {
    try {
      // 1. Hash the password
      const hashedPassword = await hashPassword(password);
      console.log(
        "🔐 Password hashed:",
        hashedPassword.substring(0, 30) + "...",
      );

      // 2. Get existing users
      const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");

      // 3. Create new user
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: Date.now(),
      };

      // 4. Save user
      users.push(newUser);
      localStorage.setItem("orbit-users", JSON.stringify(users));

      // 5. Reset button state
      btn.classList.remove("loading");
      btn.disabled = false;

      // 6. Show success message
      Swal.fire({
        icon: "success",
        title: "Account Created! 🎉",
        html: `
                <p>Welcome to ORBIT, <strong>${name}</strong>!</p>
                <p style="font-size: 13px; color: #8B92AC; margin-top: 8px;">
                    🔒 Your password is encrypted<br>
                    Now please login to continue
                </p>
            `,
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#6C8EFF",
        allowOutsideClick: false,
      }).then(() => {
        
        signupForm.reset();

        // 9. Auto-fill email 
        const loginEmailInput = document.getElementById("loginEmail");
        if (loginEmailInput) {
          loginEmailInput.value = email;
        }

        // 10. Switch to Login tab
        switchTab("login");

        // 11. Focus on password field
        setTimeout(() => {
          const loginPasswordInput = document.getElementById("loginPassword");
          if (loginPasswordInput) loginPasswordInput.focus();
        }, 400);
      });
    } catch (err) {
      console.error("❌ Signup error:", err);
      btn.classList.remove("loading");
      btn.disabled = false;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  }, 800);
});

// LOGIN HANDLER (WITH SHA-256 VERIFICATION)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  clearAllErrors();
  let hasError = false;

  // Email validation
  if (!email) {
    showError("loginEmail", "loginEmailError", "Email is required");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError("loginEmail", "loginEmailError", "Please enter a valid email");
    hasError = true;
  }

  // Password validation
  if (!password) {
    showError("loginPassword", "loginPasswordError", "Password is required");
    hasError = true;
  } else if (!isValidPassword(password)) {
    showError(
      "loginPassword",
      "loginPasswordError",
      "Password must be at least 6 characters",
    );
    hasError = true;
  }

  if (hasError) {
    const card = document.getElementById("authCard");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
    return;
  }

  // Loading
  const btn = document.getElementById("loginBtn");
  btn.classList.add("loading");
  btn.disabled = true;

  Swal.fire({
    title: "Verifying...",
    html: "🔍 Checking your credentials",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  // ⭐ async + await
  setTimeout(async () => {
    try {
      const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");
      const user = users.find((u) => u.email === email);

      let isValid = false;
      if (user) {
        isValid = await verifyPassword(password, user.password);
        console.log("🔍 Verification:", isValid ? "✅ Success" : "❌ Failed");
      }

      if (!user || !isValid) {
        btn.classList.remove("loading");
        btn.disabled = false;

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password",
          confirmButtonText: "Try Again",
        });
        return;
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      // Session
      sessionStorage.setItem("orbit-current-user", JSON.stringify(userData));

      // Remember me
      if (rememberMe) {
        localStorage.setItem("orbit-remember-user", JSON.stringify(userData));
        console.log("💾 Remembered user saved");
      }

      btn.classList.remove("loading");
      btn.disabled = false;

      Swal.fire({
        icon: "success",
        title: `Welcome back, ${user.name}! 👋`,
        html: "Redirecting to your dashboard...",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "dashboard.html";
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      btn.classList.remove("loading");
      btn.disabled = false;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  }, 800);
});

// FORGOT PASSWORD
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Forgot Password?",
      html: "Because passwords are <strong>hashed</strong> and cannot be recovered,<br>please create a new account with a different email.",
      confirmButtonText: "Got it",
    });
  });
}

// SHAKE ANIMATION
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    .shake { animation: shake 0.4s ease; }
`;
document.head.appendChild(shakeStyle);

// AUTO-FILL + INIT
function initAuth() {
  console.log("🌌 Auth page loading...");

  // Auto-fill remembered user
  const remembered = localStorage.getItem("orbit-remember-user");
  if (remembered) {
    try {
      const user = JSON.parse(remembered);
      const emailInput = document.getElementById("loginEmail");
      const rememberCheckbox = document.getElementById("rememberMe");

      if (emailInput && user.email) {
        emailInput.value = user.email;
        console.log("📧 Auto-filled email:", user.email);
      }
      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
    } catch (err) {
      console.error("Auto-fill error:", err);
    }
  }

  // Focus email input
  setTimeout(() => {
    const emailInput = document.getElementById("loginEmail");
    if (emailInput && !emailInput.value) {
      emailInput.focus();
    }
  }, 300);

  console.log("✅ Auth ready");
}

document.addEventListener("DOMContentLoaded", initAuth);

console.log("🌌 ORBIT — Auth page ready with SHA-256");
