
   //ORBIT DASHBOARD - Main Application
  
// ---------- Generate Starfield ----------
(function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;

  const starCount = 60;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random size between 1px and 3px
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    // Random position
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";

    // Random animation delay
    star.style.animationDelay = Math.random() * 4 + "s";

    // Random opacity
    star.style.opacity = Math.random() * 0.6 + 0.2;

    container.appendChild(star);
  }
})();

// ---------- Console Welcome ----------
console.log("🌌 ORBIT — Welcome to the productivity orbit!");
console.log("🚀 Built with ❤️ and JavaScript");
console.log("📊 Features: Tasks | Notes | Habits");
