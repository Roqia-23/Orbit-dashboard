
// ORBIT - Guard (Page Protection)
   

(function guardPages() {
  
  const protectedPages = [
    "dashboard.html",
    "tasks.html",
    "notes.html",
    "habits.html",
    "profile.html",
  ];


  const currentPage = window.location.pathname.split("/").pop() || "index.html";


  if (protectedPages.includes(currentPage)) {
  
    const currentUser = sessionStorage.getItem("orbit-current-user");

    if (!currentUser) {
  
      console.log("🚫 Not logged in, redirecting to auth...");
      window.location.href = "auth.html";
      return;
    }

    console.log("✅ User logged in:", JSON.parse(currentUser).name);
  }

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

  sessionStorage.removeItem("orbit-current-user");
  localStorage.removeItem("orbit-remember-user");


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
  
    window.location.href = "auth.html";
  }
}
