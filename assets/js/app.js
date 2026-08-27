// ORBIT DASHBOARD - Main Application

// ---------- Generate Starfield ----------
(function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;

  const starCount = 80;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 3 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";

    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.opacity = Math.random() * 0.8 + 0.2;

    if (size > 2.5) {
      star.style.opacity = Math.random() * 0.5 + 0.5;
    }

    container.appendChild(star);
  }
})();

// ---------- Console Welcome ----------
console.log("🌌 ORBIT — Welcome to the productivity orbit!");
console.log("🚀 Built with ❤️ and JavaScript");
console.log("📊 Features: Tasks | Notes | Habits");
