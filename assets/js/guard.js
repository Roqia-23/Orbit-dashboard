
// ORBIT - Guard (Page Protection)
   

(function guardPages() {
  // صفحاتی که نیاز به لاگین دارن
  const protectedPages = [
    "dashboard.html",
    "tasks.html",
    "notes.html",
    "habits.html",
    "profile.html",
  ];

  // صفحه فعلی
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // چک کن آیا صفحه محافظت‌شده هست
  if (protectedPages.includes(currentPage)) {
    // چک کن کاربر لاگین هست
    const currentUser = sessionStorage.getItem("orbit-current-user");

    if (!currentUser) {
      // کاربر لاگین نیست → برو به auth.html
      console.log("🚫 Not logged in, redirecting to auth...");
      window.location.href = "auth.html";
      return;
    }

    console.log("✅ User logged in:", JSON.parse(currentUser).name);
  }

  // اگه کاربر لاگین هست و توی auth.html هست، ببرش داشبورد
  if (currentPage === "auth.html") {
    const currentUser = sessionStorage.getItem("orbit-current-user");
    if (currentUser) {
      console.log("✅ Already logged in, redirecting to dashboard...");
      window.location.href = "dashboard.html";
    }
  }
})();


// GET CURRENT USER (Helper for other pages)

function getCurrentUser() {
  const user = sessionStorage.getItem("orbit-current-user");
  return user ? JSON.parse(user) : null;
}


// LOGOUT (Helper)

function logout() {
  // پاک کردن session
  sessionStorage.removeItem("orbit-current-user");
  localStorage.removeItem("orbit-remember-user");

  // اگه SweetAlert موجوده، استفاده کن
  if (typeof Swal !== "undefined") {
    Swal.fire({
      icon: "success",
      title: "Logged out",
      text: "See you soon! 👋",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "auth.html";
    });
  } else {
    // اگه SweetAlert نبود، مستقیم برو
    window.location.href = "auth.html";
  }
}
