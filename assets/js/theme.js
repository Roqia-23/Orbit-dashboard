/* ORBIT DASHBOARD - Theme Manager */

// Get DOM elements
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

// Get saved theme from localStorage
let currentTheme = localStorage.getItem("orbit-theme") || "dark";

// Apply theme
document.body.classList.toggle("light-mode", currentTheme === "light");
updateIcon(currentTheme);

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  const theme = isLight ? "light" : "dark";

  // Save to localStorage
  localStorage.setItem("orbit-theme", theme);
  updateIcon(theme);
});

// Update icon based on theme
function updateIcon(theme) {
  if (theme === "light") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// Auto-detect system preference
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches
) {
  if (!localStorage.getItem("orbit-theme")) {
    document.body.classList.add("light-mode");
    updateIcon("light");
  }
}
