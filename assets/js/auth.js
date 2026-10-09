/* ============================================
   ORBIT AUTH - Login & Signup Logic
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const tabIndicator = document.getElementById("tabIndicator");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// ============================================
// TAB SWITCHING
// ============================================
function switchTab(tab) {
  console.log("🔄 Switching to tab:", tab);

  if (tab === "signup") {
    // Tabs
    tabLogin.classList.remove("active");
    tabSignup.classList.add("active");
    tabIndicator.classList.add("right");

    // Forms
    loginForm.classList.remove("active");
    signupForm.classList.add("active");

    // Focus
    setTimeout(() => {
      const nameInput = document.getElementById("signupName");
      if (nameInput) nameInput.focus();
    }, 400);
  } else {
    // Tabs
    tabSignup.classList.remove("active");
    tabLogin.classList.add("active");
    tabIndicator.classList.remove("right");

    // Forms
    signupForm.classList.remove("active");
    loginForm.classList.add("active");

    // Focus
    setTimeout(() => {
      const emailInput = document.getElementById("loginEmail");
      if (emailInput) emailInput.focus();
    }, 400);
  }

  // Clear errors
  clearAllErrors();
}

// Tab click events
if (tabLogin) {
  tabLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("login");
  });
}

if (tabSignup) {
  tabSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("signup");
  });
}

// Switch links (bottom of forms)
document.querySelectorAll("[data-switch]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab(link.dataset.switch);
  });
});

// ============================================
// PASSWORD TOGGLE (Show/Hide)
// ============================================
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

// ============================================
// PASSWORD STRENGTH
// ============================================
const signupPasswordInput = document.getElementById("signupPassword");
const passwordStrengthEl = document.getElementById("passwordStrength");
const strengthTextEl = document.getElementById("strengthText");

if (signupPasswordInput) {
  signupPasswordInput.addEventListener("input", () => {
    const password = signupPasswordInput.value;

    // Reset
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

// ============================================
// ERROR HELPERS
// ============================================
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

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  input.classList.remove("error", "success");
  error.textContent = "";
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

// ============================================
// VALIDATION
// ============================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name) {
  return name.trim().length >= 2;
}

function isValidPassword(password) {
  return password.length >= 6;
}

// ============================================
// SIGNUP HANDLER
// ============================================
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  clearAllErrors();
  let hasError = false;

  // Name
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
  }

  // Email
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

  // Password
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

  // Confirm
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

  // Terms
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

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fix the errors above",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  // Loading
  const btn = document.getElementById("signupBtn");
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");

    // New user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: name,
      email: email,
      password: password,
      createdAt: Date.now(),
    };

    users.push(newUser);
    localStorage.setItem("orbit-users", JSON.stringify(users));

    // Save current user in SESSION
    sessionStorage.setItem(
      "orbit-current-user",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }),
    );

    btn.classList.remove("loading");
    btn.disabled = false;

    Swal.fire({
      icon: "success",
      title: `Welcome, ${name}! 🚀`,
      text: "Your account has been created",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  }, 800);
});

// ============================================
// LOGIN HANDLER
// ============================================
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  clearAllErrors();
  let hasError = false;

  // Email
  if (!email) {
    showError("loginEmail", "loginEmailError", "Email is required");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError("loginEmail", "loginEmailError", "Please enter a valid email");
    hasError = true;
  }

  // Password
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

  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
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

    // Save in session
    sessionStorage.setItem("orbit-current-user", JSON.stringify(userData));

    // Remember me
    if (rememberMe) {
      localStorage.setItem("orbit-remember-user", JSON.stringify(userData));
    }

    btn.classList.remove("loading");
    btn.disabled = false;

    Swal.fire({
      icon: "success",
      title: `Welcome back, ${user.name}! 👋`,
      text: "Redirecting to your dashboard...",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  }, 800);
});

// ============================================
// FORGOT PASSWORD
// ============================================
const forgotLink = document.getElementById("forgotPasswordLink");
if (forgotLink) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Forgot Password?",
      text: "This feature will be available soon!",
      confirmButtonText: "OK",
    });
  });
}

// ============================================
// SHAKE ANIMATION (injected)
// ============================================
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    .shake {
        animation: shake 0.4s ease;
    }
`;
document.head.appendChild(shakeStyle);

// ============================================
// AUTO-FILL FROM REMEMBER ME
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("orbit-remember-user");
  if (remembered) {
    const user = JSON.parse(remembered);
    const emailInput = document.getElementById("loginEmail");
    const rememberCheckbox = document.getElementById("rememberMe");

    if (emailInput) emailInput.value = user.email;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  setTimeout(() => {
    const emailInput = document.getElementById("loginEmail");
    if (emailInput) emailInput.focus();
  }, 300);

  console.log("🔐 Auth page loaded");
});

console.log("🌌 ORBIT — Auth page ready");
