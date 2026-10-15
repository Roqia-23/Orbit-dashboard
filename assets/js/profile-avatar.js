
//ORBIT - Profile Avatar Generator
  
// 1. GENERATE AVATAR INITIAL

function getAvatarInitial(name) {
  if (!name) return "?";

  // Trim and get first letter
  const trimmed = name.trim();
  if (trimmed.length === 0) return "?";

  // Get first character (support unicode)
  return trimmed.charAt(0).toUpperCase();
}


// 2. GENERATE AVATAR COLOR (unique per name)

function getAvatarColor(name) {
  if (!name) return "#6C8EFF";

  // Predefined beautiful gradient colors
  const colors = [
    "#6C8EFF", 
    "#FFB86B", 
    "#22C55E", 
    "#EF4444", 
    "#A78BFA", 
    "#EC4899", 
    "#F59E0B", 
    "#06B6D4", 
    "#8B5CF6", 
    "#14B8A6", 
  ];

  // Hash the name to get consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}


// 3. GET CURRENT USER

function getCurrentUser() {
  const userStr = sessionStorage.getItem("orbit-current-user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}


// 4. UPDATE SIDEBAR PROFILE

function updateSidebarProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const profileAvatar = document.getElementById("profileAvatar");
  const userName = document.getElementById("userName");
  const userStatus = document.getElementById("userStatus");

  // Update avatar
  if (profileAvatar) {
    const initial = getAvatarInitial(user.name);
    const color = getAvatarColor(user.name);

    profileAvatar.innerHTML = `<span>${initial}</span>`;
    profileAvatar.style.background = color;
    profileAvatar.style.color = "white";
    profileAvatar.style.fontWeight = "700";
    profileAvatar.style.fontSize = "18px";
    profileAvatar.style.boxShadow = `0 4px 16px ${color}40`;
  }

  // Update name
  if (userName) {
    userName.textContent = user.name;
  }

  // Update status
  if (userStatus) {
    userStatus.textContent = user.email;
  }
}


// 5. UPDATE DASHBOARD WELCOME

function updateDashboardWelcome() {
  const welcomeTitle = document.getElementById("welcomeTitle");
  if (!welcomeTitle) return;

  const user = getCurrentUser();
  if (!user) return;

  // Get first name only
  const firstName = user.name.split(" ")[0];

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = "Welcome back";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  welcomeTitle.innerHTML = `${greeting}, ${firstName}! 👋`;
}


// 6. MAKE PROFILE CLICKABLE (go to profile.html)

function makeProfileClickable() {
  const profile = document.getElementById("userProfile");
  if (!profile) return;

  profile.style.cursor = "pointer";
  profile.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
}


// 7. INITIALIZE

document.addEventListener("DOMContentLoaded", () => {
  updateSidebarProfile();
  updateDashboardWelcome();
  makeProfileClickable();

  console.log("👤 Profile avatar initialized");
});
