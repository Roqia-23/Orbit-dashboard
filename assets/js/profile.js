
//ORBIT PROFILE - Page Logic
   
// LOAD PROFILE DATA

function loadProfile() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  // Big avatar
  const bigAvatar = document.getElementById("bigAvatar");
  if (bigAvatar) {
    const initial = getAvatarInitial(user.name);
    const color = getAvatarColor(user.name);

    bigAvatar.innerHTML = `<span>${initial}</span>`;
    bigAvatar.style.background = `linear-gradient(135deg, ${color}, ${color}CC)`;
    bigAvatar.style.boxShadow = `0 8px 32px ${color}60`;
  }

  // Display name + email
  const displayName = document.getElementById("profileDisplayName");
  const displayEmail = document.getElementById("profileDisplayEmail");

  if (displayName) displayName.textContent = user.name;
  if (displayEmail) displayEmail.textContent = user.email;

  // Member since
  const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");
  const fullUser = users.find((u) => u.id === user.id);
  const memberSince = document.getElementById("memberSince");

  if (memberSince && fullUser && fullUser.createdAt) {
    memberSince.textContent = new Date(fullUser.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  // Edit form
  const editName = document.getElementById("editName");
  const editEmail = document.getElementById("editEmail");

  if (editName) editName.value = user.name;
  if (editEmail) editEmail.value = user.email;

  // Load stats
  loadStats(user.id);
}


// LOAD STATS

function loadStats(userId) {
  const tasks = JSON.parse(
    localStorage.getItem(`orbit-tasks-${userId}`) || "[]",
  );
  const notes = JSON.parse(
    localStorage.getItem(`orbit-notes-${userId}`) || "[]",
  );
  const habits = JSON.parse(
    localStorage.getItem(`orbit-habits-${userId}`) || "[]",
  );

  const statTasks = document.getElementById("statTasks");
  const statNotes = document.getElementById("statNotes");
  const statHabits = document.getElementById("statHabits");

  if (statTasks) statTasks.textContent = tasks.length;
  if (statNotes) statNotes.textContent = notes.length;
  if (statHabits) statHabits.textContent = habits.length;
}


// SAVE PROFILE

const profileForm = document.getElementById("profileForm");

if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) return;

    const newName = document.getElementById("editName").value.trim();
    const nameError = document.getElementById("editNameError");

    // Clear error
    nameError.textContent = "";
    nameError.classList.remove("show");

    // Validation
    if (!newName) {
      nameError.textContent = "Name is required";
      nameError.classList.add("show");
      return;
    }

    if (newName.length < 2) {
      nameError.textContent = "Name must be at least 2 characters";
      nameError.classList.add("show");
      return;
    }

    if (newName === user.name) {
      Swal.fire({
        icon: "info",
        title: "No changes",
        text: "You haven't made any changes",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (/[<>\/\\{}[\]()]/.test(newName)) {
      nameError.textContent = "Name contains invalid characters";
      nameError.classList.add("show");
      return;
    }

    // Update in users list
    const users = JSON.parse(localStorage.getItem("orbit-users") || "[]");
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex].name = newName;
      localStorage.setItem("orbit-users", JSON.stringify(users));
    }

    // Update session
    user.name = newName;
    sessionStorage.setItem("orbit-current-user", JSON.stringify(user));

    // Update UI
    loadProfile();

    Swal.fire({
      icon: "success",
      title: "Profile Updated! ✨",
      text: "Your changes have been saved",
      timer: 1500,
      showConfirmButton: false,
    });
  });
}


// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Logout?",
      text: "You will need to sign in again",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // from guard.js
      }
    });
  });
}


// INIT

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  console.log("👤 Profile page loaded");
});
