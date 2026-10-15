// 1. STARFIELD
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

// 2. ORBIT MODAL SYSTEM (unique names)
function showOrbitModal(title, content) {
  const existing = document.getElementById("orbitModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "orbitModal";
  modal.className = "orbit-modal-overlay";
  modal.innerHTML = `
        <div class="orbit-modal">
            <div class="orbit-modal-header">
                <h3>${title}</h3>
                <button type="button" class="orbit-modal-close" onclick="closeOrbitModal()" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="orbit-modal-body">
                ${content}
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeOrbitModal();
  });

  // Animation
  requestAnimationFrame(() => modal.classList.add("show"));
}

function closeOrbitModal() {
  const modal = document.getElementById("orbitModal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  }
}

// 3. close with escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOrbitModal();
});

//  CLEAR ALL DATA
function clearAllData() {
  if (confirm("⚠️ Are you sure?...")) {
    const user = getCurrentUser();
    if (!user) return;

    localStorage.removeItem(`orbit-tasks-${user.id}`);
    localStorage.removeItem(`orbit-notes-${user.id}`);
    localStorage.removeItem(`orbit-habits-${user.id}`);
    alert("✅ All data cleared!");
    location.reload();
  }
}

// 4. SIDEBAR TOGGLE
document.addEventListener("DOMContentLoaded", () => {
  const sidebarCheckbox = document.getElementById("sidebarCheckbox");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!sidebarCheckbox || !sidebar) return;

  sidebarCheckbox.addEventListener("change", () => {
    if (sidebarCheckbox.checked) {
      sidebar.classList.add("show");
      if (overlay) overlay.classList.add("show");
    } else {
      sidebar.classList.remove("show");
      if (overlay) overlay.classList.remove("show");
    }
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebarCheckbox.checked = false;
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    });
  }

  document.querySelectorAll(".sidebar-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 991) {
        sidebarCheckbox.checked = false;
        sidebar.classList.remove("show");
        if (overlay) overlay.classList.remove("show");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      sidebarCheckbox.checked = false;
      sidebar.classList.remove("show");
      if (overlay) overlay.classList.remove("show");
    }
  });
});

// 5. SIDEBAR MODALS (Settings/Help/Stats/Profile/Notifications)
document.addEventListener("DOMContentLoaded", () => {
  // SETTINGS
  const settingsBtn = document.getElementById("navSettings");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const user = getCurrentUser();
      if (!user) return; 
      
      const tasks = JSON.parse(
        localStorage.getItem(`orbit-tasks-${user.id}`) || "[]",
      );
      const notes = JSON.parse(
        localStorage.getItem(`orbit-notes-${user.id}`) || "[]",
      );
      const habits = JSON.parse(
        localStorage.getItem(`orbit-habits-${user.id}`) || "[]",
      );
      const isLight = document.body.classList.contains("light-mode");

      showOrbitModal(
        "⚙️ Settings",
        `
                <div class="modal-section">
                    <h6>Profile</h6>
                    <p><strong>Name:</strong> Guest User</p>
                    <p><strong>Theme:</strong> ${isLight ? "Light" : "Dark"}</p>
                </div>
                <div class="modal-section">
                    <h6>Data</h6>
                    <p>Tasks: ${tasks.length}</p>
                    <p>Notes: ${notes.length}</p>
                    <p>Habits: ${habits.length}</p>
                </div>
                <div class="modal-section">
                    <h6>Actions</h6>
                    <button type="button" class="btn-modal danger" onclick="clearAllData()">
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
            `,
      );
    });
  }

  // ---------- HELP ----------
  const helpBtn = document.getElementById("navHelp");
  if (helpBtn) {
    helpBtn.addEventListener("click", (e) => {
      e.preventDefault();

      showOrbitModal(
        "❓ Help & Shortcuts",
        `
                <div class="modal-section">
                    <h6>About ORBIT</h6>
                    <p>ORBIT is your personal productivity dashboard. Manage your tasks, notes, and habits — all in one place.</p>
                </div>
                <div class="modal-section">
                    <h6>Keyboard Shortcuts</h6>
                    <p><kbd>Ctrl</kbd> + <kbd>D</kbd> → Dashboard</p>
                    <p><kbd>Ctrl</kbd> + <kbd>T</kbd> → Tasks</p>
                    <p><kbd>Ctrl</kbd> + <kbd>N</kbd> → Notes</p>
                    <p><kbd>Ctrl</kbd> + <kbd>H</kbd> → Habits</p>
                    <p><kbd>Ctrl</kbd> + <kbd>K</kbd> → Search</p>
                </div>
                <div class="modal-section">
                    <h6>Tips</h6>
                    <p>💡 Use the search bar to find anything quickly.</p>
                    <p>💡 Toggle dark/light theme with the moon/sun button.</p>
                </div>
            `,
      );
    });
  }

  // ---------- STATISTICS ----------
  const statsBtn = document.getElementById("navStats");
  if (statsBtn) {
    statsBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const user = getCurrentUser();
      const tasks = JSON.parse(
        localStorage.getItem(`orbit-tasks-${user.id}`) || "[]",
      );
      const notes = JSON.parse(
        localStorage.getItem(`orbit-notes-${user.id}`) || "[]",
      );
      const habits = JSON.parse(
        localStorage.getItem(`orbit-habits-${user.id}`) || "[]",
      );

      const totalTasks = tasks.length;
      const doneTasks = tasks.filter((t) => t.completed).length;
      const pendingTasks = totalTasks - doneTasks;
      const completionRate =
        totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      const totalHabits = habits.length;
      const doneHabits = habits.filter((h) => h.doneToday).length;
      const habitRate =
        totalHabits > 0 ? Math.round((doneHabits / totalHabits) * 100) : 0;

      showOrbitModal(
        "📊 Statistics",
        `
                <div class="modal-section">
                    <h6>📋 Tasks Overview</h6>
                    <div class="stat-row">
                        <span>Total Tasks</span>
                        <strong>${totalTasks}</strong>
                    </div>
                    <div class="stat-row">
                        <span>Completed</span>
                        <strong class="text-success">${doneTasks}</strong>
                    </div>
                    <div class="stat-row">
                        <span>Pending</span>
                        <strong class="text-warning">${pendingTasks}</strong>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completionRate}%"></div>
                    </div>
                    <p class="text-center">${completionRate}% Complete</p>
                </div>
                
                <div class="modal-section">
                    <h6>❤️ Habits</h6>
                    <div class="stat-row">
                        <span>Total Habits</span>
                        <strong>${totalHabits}</strong>
                    </div>
                    <div class="stat-row">
                        <span>Done Today</span>
                        <strong class="text-success">${doneHabits}</strong>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${habitRate}%"></div>
                    </div>
                    <p class="text-center">${habitRate}% Complete</p>
                </div>
                
                <div class="modal-section">
                    <h6>📝 Notes</h6>
                    <div class="stat-row">
                        <span>Total Notes</span>
                        <strong>${notes.length}</strong>
                    </div>
                </div>
            `,
      );
    });
  }

  // ---------- PROFILE ----------
  const profile = document.getElementById("userProfile");
  if (profile) {
    profile.addEventListener("click", () => {
      const user = getCurrentUser();
      const tasks = JSON.parse(
        localStorage.getItem(`orbit-tasks-${user.id}`) || "[]",
      );
      const notes = JSON.parse(
        localStorage.getItem(`orbit-notes-${user.id}`) || "[]",
      );
      const habits = JSON.parse(
        localStorage.getItem(`orbit-habits-${user.id}`) || "[]",
      );

      showOrbitModal(
        "👤 Profile",
        `
                <div class="modal-section">
                    <h6>Account</h6>
                    <p><strong>Name:</strong> Guest User</p>
                    <p><strong>Status:</strong> Welcome to ORBIT</p>
                    <p><strong>Member since:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="modal-section">
                    <h6>Activity</h6>
                    <p>📋 ${tasks.length} tasks</p>
                    <p>📝 ${notes.length} notes</p>
                    <p>❤️ ${habits.length} habits</p>
                </div>
            `,
      );
    });
  }

  // ---------- FOCUS WIDGET ----------
  const focusWidget = document.getElementById("focusWidget");
  if (focusWidget) {
    focusWidget.addEventListener("click", () => {
      showOrbitModal(
        "⏰ Focus Timer",
        `
                <div class="modal-section">
                    <p>This feature will be available soon!</p>
                    <p>Start a 25-minute focus session to boost productivity.</p>
                </div>
            `,
      );
    });
  }

  // ---------- NOTIFICATIONS ----------
  const notifBtn = document.getElementById("notificationsBtn");
  if (notifBtn) {
    notifBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      const tasks = JSON.parse(
        localStorage.getItem(`orbit-tasks-${user.id}`) || "[]",
      );
      const notes = JSON.parse(
        localStorage.getItem(`orbit-notes-${user.id}`) || "[]",
      );
      const habits = JSON.parse(
        localStorage.getItem(`orbit-habits-${user.id}`) || "[]",
      );

      const pendingTasks = tasks.filter((t) => !t.completed).length;
      const doneHabits = habits.filter((h) => h.doneToday).length;

      let content = "";

      if (pendingTasks > 0) {
        content += `<p>⏳ You have ${pendingTasks} pending task${pendingTasks > 1 ? "s" : ""}.</p>`;
      } else {
        content += `<p>✅ All tasks completed! Great job!</p>`;
      }

      if (habits.length > 0) {
        content += `<p>❤️ Habits: ${doneHabits}/${habits.length} done today.</p>`;
      } else {
        content += `<p>❤️ No habits yet. Add one!</p>`;
      }

      showOrbitModal(
        "📬 Notifications",
        `
                <div class="modal-section">
                    ${content}
                </div>
            `,
      );
    });
  }
});

// 6. KEYBOARD SHORTCUTS
document.addEventListener("keydown", (e) => {
  if (!e.ctrlKey) return;

  switch (e.key.toLowerCase()) {
    case "d":
      e.preventDefault();
      window.location.href = "dashboard.html";
      break;
    case "t":
      e.preventDefault();
      window.location.href = "tasks.html";
      break;
    case "n":
      e.preventDefault();
      window.location.href = "notes.html";
      break;
    case "h":
      e.preventDefault();
      window.location.href = "habits.html";
      break;
    case "k":
      e.preventDefault();
      const searchInput = document.getElementById("globalSearch");
      if (searchInput) searchInput.focus();
      break;
  }
});

// 7. DASHBOARD-ONLY LOGIC (with checks)

 let tasks = [];
 let notes = [];
 let habits = [];
 
function loadData() {
  const user = getCurrentUser();
  if (!user) return;

  tasks = JSON.parse(localStorage.getItem(`orbit-tasks-${user.id}`) || "[]");
  notes = JSON.parse(localStorage.getItem(`orbit-notes-${user.id}`) || "[]");
  habits = JSON.parse(localStorage.getItem(`orbit-habits-${user.id}`) || "[]");
}

function updateStats() {
  const totalEl = document.getElementById("totalTasksCount");
  const doneEl = document.getElementById("doneTasksCount");
  const pendingEl = document.getElementById("pendingTasksCount");

  if (!totalEl && !doneEl && !pendingEl) return;

  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = total - done;

  if (totalEl) totalEl.textContent = total;
  if (doneEl) doneEl.textContent = done;
  if (pendingEl) pendingEl.textContent = pending;
}

function renderRecentTasks() {
  const container = document.getElementById("recentTasksList");
  if (!container) return;

  if (tasks.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No tasks yet. Create one!</p>
            </div>
        `;
    return;
  }

  const recent = tasks.slice(-3).reverse();
  container.innerHTML = recent
    .map(
      (task) => `
        <div class="widget-item" onclick="window.location.href='tasks.html'">
            <i class="fas fa-${task.completed ? "check-circle text-success" : "circle text-secondary"}"></i>
            <div class="item-content">
                <span class="item-title ${task.completed ? "text-decoration-line-through text-secondary" : ""}">
                    ${task.title}
                </span>
                <span class="item-meta">${task.completed ? "Completed" : "Pending"}</span>
            </div>
        </div>
    `,
    )
    .join("");
}

function renderRecentNotes() {
  const container = document.getElementById("recentNotesList");
  if (!container) return;

  if (notes.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No notes yet. Write one!</p>
            </div>
        `;
    return;
  }

  const recent = notes.slice(-3).reverse();
  container.innerHTML = recent
    .map(
      (note) => `
        <div class="widget-item" onclick="window.location.href='notes.html'">
            <i class="fas fa-sticky-note text-warning"></i>
            <div class="item-content">
                <span class="item-title">${note.title || "Untitled"}</span>
                <span class="item-meta">${note.content ? note.content.substring(0, 40) + "..." : "No content"}</span>
            </div>
        </div>
    `,
    )
    .join("");
}

function renderTodayHabits() {
  const container = document.getElementById("todayHabitsList");
  if (!container) return;

  if (habits.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <p>No habits yet. Add one!</p>
            </div>
        `;
    return;
  }

  container.innerHTML = `
        <div class="habits-row">
            ${habits
              .map(
                (habit) => `
                <div class="habit-chip ${habit.doneToday ? "done" : ""}" 
                     onclick="window.location.href='habits.html'">
                    <i class="fas fa-${habit.doneToday ? "check-circle" : "circle"}"></i>
                    ${habit.name}
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function updateSidebarCounts() {
  const tasksCount = document.getElementById("tasksCount");
  const notesCount = document.getElementById("notesCount");
  const habitsCount = document.getElementById("habitsCount");

  if (tasksCount) tasksCount.textContent = tasks.length;
  if (notesCount) notesCount.textContent = notes.length;
  if (habitsCount) habitsCount.textContent = habits.length;
}

// 8. START DASHBOARD
document.addEventListener("DOMContentLoaded", () => {
  const isDashboard =
    document.getElementById("statsSection") ||
    document.getElementById("recentTasksList");

  if (!isDashboard) return;

  console.log("🌌 Dashboard starting...");

  loadData();
  updateStats();
  renderRecentTasks();
  renderRecentNotes();
  renderTodayHabits();
  updateSidebarCounts();

  console.log("✅ Dashboard loaded!");
});
