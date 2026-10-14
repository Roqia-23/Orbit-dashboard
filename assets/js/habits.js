
//ORBIT HABITS 
    
// GLOBAL VARIABLES
let currentFilter = "all";
let editingHabitId = null;
let deletingHabitId = null;
let selectedIcon = "fa-dumbbell";
let selectedColor = "#6C8EFF";

// Day keys (Monday to Sunday)
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 1. LOAD HABITS FROM LOCALSTORAGE
function loadHabits() {
  const user = getCurrentUser();
  if (!user) return;

  const key = `orbit-habits-${user.id}`;
  habits = JSON.parse(localStorage.getItem(key) || "[]");
  console.log(`📦 Habits loaded for ${user.name}:`, habits.length);
}

// 2. SAVE HABITS TO LOCALSTORAGE
function saveHabits() {
  const user = getCurrentUser();
  if (!user) return;

  const key = `orbit-habits-${user.id}`;
  localStorage.setItem(key, JSON.stringify(habits));
  console.log(`💾 Habits saved for ${user.name}:`, habits.length);
}

// 3. GENERATE UNIQUE ID
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// 4. GET TODAY'S DAY KEY
function getTodayKey() {
  const dayIndex = new Date().getDay(); // 0=Sunday, 1=Monday...
  // Convert to Monday-first: 0=Mon, 1=Tue, ..., 6=Sun
  const mondayIndex = (dayIndex + 6) % 7;
  return DAY_KEYS[mondayIndex];
}

// 5. GET TODAY'S FULL DATE
function getTodayDate() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// 6. GET WEEK DATES (Monday to Sunday)
function getWeekDates(offset = 0) {
  const today = new Date();
  const dayIndex = today.getDay();
  const mondayIndex = (dayIndex + 6) % 7;

  // Calculate Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayIndex + offset * 7);
  monday.setHours(0, 0, 0, 0);

  // Build array of 7 dates
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }

  return dates;
}

// 7. CALCULATE STREAK
function calculateStreak(habit) {
  if (!habit.history) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Check backwards from today
  while (true) {
    const key = currentDate.toISOString().split("T")[0];

    if (habit.history[key]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today is not done, allow checking from yesterday
      if (streak === 0 && key === today.toISOString().split("T")[0]) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}

// 8. UPDATE STATS
function updateStats() {
  const total = habits.length;
  const bestStreak = habits.reduce(
    (max, h) => Math.max(max, calculateStreak(h)),
    0,
  );
  const todayKey = getTodayKey();
  const doneToday = habits.filter((h) => h.days && h.days[todayKey]).length;

  document.getElementById("totalHabitsStat").textContent = total;
  document.getElementById("bestStreakStat").textContent = bestStreak;
  document.getElementById("todayDoneStat").textContent = doneToday;

  // Sidebar count
  const sidebarCount = document.getElementById("habitsCount");
  if (sidebarCount) sidebarCount.textContent = total;

  // Today banner
  const todayDate = document.getElementById("todayDate");
  const todaySubtext = document.getElementById("todaySubtext");
  const todayProgressText = document.getElementById("todayProgressText");
  const todayProgressFill = document.getElementById("todayProgressFill");

  if (todayDate) todayDate.textContent = getTodayDate();

  if (todaySubtext) {
    if (total === 0) {
      todaySubtext.textContent = "Let's add your first habit!";
    } else if (doneToday === total) {
      todaySubtext.textContent = "🎉 Perfect! All habits done today!";
    } else if (doneToday === 0) {
      todaySubtext.textContent = "Let's start! You got this 💪";
    } else {
      todaySubtext.textContent = `${total - doneToday} more to go. Keep going!`;
    }
  }

  if (todayProgressText) {
    todayProgressText.textContent = `${doneToday} / ${total} completed`;
  }

  if (todayProgressFill) {
    const percentage = total > 0 ? (doneToday / total) * 100 : 0;
    todayProgressFill.style.width = percentage + "%";
  }
}

// 9. GET FILTERED HABITS
function getFilteredHabits() {
  let filtered = [...habits];
  const todayKey = getTodayKey();

  if (currentFilter === "today") {
    // All habits (for today view, we show all but focus on today's status)
    filtered = filtered;
  } else if (currentFilter === "done") {
    filtered = filtered.filter((h) => h.days && h.days[todayKey]);
  } else if (currentFilter === "pending") {
    filtered = filtered.filter((h) => !h.days || !h.days[todayKey]);
  }

  return filtered;
}

// 10. RENDER HABITS
function renderHabits() {
  const list = document.getElementById("habitsList");
  if (!list) return;

  const filtered = getFilteredHabits();
  const todayKey = getTodayKey();
  const todayIndex = DAY_KEYS.indexOf(todayKey);

  // Empty state
  if (filtered.length === 0) {
    let message = 'Click "Add Habit" to start tracking your daily habits';
    let title = "No habits yet";
    let icon = "fa-heart-broken";

    if (currentFilter === "done") {
      title = "No habits done today";
      message = "Complete a habit to see it here";
      icon = "fa-check-circle";
    } else if (currentFilter === "pending") {
      title = "No pending habits";
      message = "Great job! You're all caught up";
      icon = "fa-trophy";
    }

    list.innerHTML = `
            <div class="empty-state" id="habitsEmptyState">
                <i class="fas ${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    return;
  }

  // Render each habit
  list.innerHTML = filtered
    .map((habit) => {
      // Ensure days object exists
      if (!habit.days) {
        habit.days = {
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false,
        };
      }

      // Calculate progress
      const doneCount = DAY_KEYS.filter((k) => habit.days[k]).length;
      const progressPercent = Math.round((doneCount / habit.goal) * 100);
      const cappedPercent = Math.min(progressPercent, 100);

      // Calculate streak
      const streak = calculateStreak(habit);

      // Week tracker HTML
      const weekDaysHtml = DAY_KEYS.map((key, index) => {
        const isDone = habit.days[key];
        const isToday = index === todayIndex;
        const isFuture = index > todayIndex;

        let classes = "day-box";
        if (isDone) classes += " done";
        if (isToday) classes += " today";
        if (isFuture) classes += " future";

        return `
                <div class="${classes}" onclick="toggleDay(${habit.id}, '${key}')">
                    <span class="day-label">${DAY_LABELS[index]}</span>
                    <div class="day-check"></div>
                </div>
            `;
      }).join("");

      return `
            <div class="habit-card" 
                 style="--habit-color: ${habit.color};"
                 data-id="${habit.id}">
                
                <!-- Header -->
                <div class="habit-header">
                    <div class="habit-title-wrap">
                        <div class="habit-icon">
                            <i class="fas ${habit.icon}"></i>
                        </div>
                        <div class="habit-name-wrap">
                            <h3 class="habit-name">${escapeHtml(habit.name)}</h3>
                            <div class="habit-meta">
                                <span class="streak">
                                    <i class="fas fa-fire"></i>
                                    ${streak} day streak
                                </span>
                                <span class="goal">
                                    <i class="fas fa-bullseye"></i>
                                    Goal: ${habit.goal}x/week
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="habit-actions">
                        <button class="habit-action-btn edit" 
                                onclick="openEditModal(${habit.id})" 
                                title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="habit-action-btn delete" 
                                onclick="openDeleteConfirm(${habit.id})" 
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Week Tracker -->
                <div class="week-tracker">
                    ${weekDaysHtml}
                </div>
                
                <!-- Progress -->
                <div class="habit-progress">
                    <div class="habit-progress-bar">
                        <div class="habit-progress-fill" 
                             style="width: ${cappedPercent}%"></div>
                    </div>
                    <span class="habit-progress-text">
                        ${doneCount} / ${habit.goal}
                    </span>
                </div>
            </div>
        `;
    })
    .join("");
}

// 11. ESCAPE HTML (Security)
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 12. TOGGLE DAY COMPLETION
function toggleDay(habitId, dayKey) {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;

  // Check if it's a future day
  const todayKey = getTodayKey();
  const todayIndex = DAY_KEYS.indexOf(todayKey);
  const clickedIndex = DAY_KEYS.indexOf(dayKey);

  if (clickedIndex > todayIndex) {
    console.log("⚠️ Cannot toggle future days");
    return;
  }

  // Ensure days object exists
  if (!habit.days) {
    habit.days = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };
  }

  // Toggle
  habit.days[dayKey] = !habit.days[dayKey];

  // Update history (for streak)
  if (!habit.history) habit.history = {};

  const today = new Date();
  const dayIndex = today.getDay();
  const mondayIndex = (dayIndex + 6) % 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - (mondayIndex - clickedIndex));
  targetDate.setHours(0, 0, 0, 0);
  const historyKey = targetDate.toISOString().split("T")[0];

  if (habit.days[dayKey]) {
    habit.history[historyKey] = true;
  } else {
    delete habit.history[historyKey];
  }

  saveHabits();
  updateStats();
  renderHabits();

  console.log(`✅ Toggled ${dayKey} for "${habit.name}":`, habit.days[dayKey]);
}

// 13. OPEN ADD MODAL
function openAddModal() {
  editingHabitId = null;
  selectedIcon = "fa-dumbbell";
  selectedColor = "#6C8EFF";

  document.getElementById("modalTitle").textContent = "Add New Habit";
  document.getElementById("saveBtnText").textContent = "Save Habit";
  document.getElementById("habitForm").reset();
  document.getElementById("nameError").textContent = "";
  document.getElementById("habitGoal").value = 5;
  document.getElementById("goalValue").textContent = "5 days";

  // Reset icon picker
  document
    .querySelectorAll(".icon-option")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById("iconDumbbell").classList.add("active");

  // Reset color picker
  document
    .querySelectorAll(".color-option")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById("colorBlue").classList.add("active");

  document.getElementById("habitModal").classList.add("show");

  setTimeout(() => {
    document.getElementById("habitName").focus();
  }, 300);
}

// 14. OPEN EDIT MODAL
function openEditModal(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;

  editingHabitId = id;
  selectedIcon = habit.icon;
  selectedColor = habit.color;

  document.getElementById("modalTitle").textContent = "Edit Habit";
  document.getElementById("saveBtnText").textContent = "Update Habit";
  document.getElementById("habitName").value = habit.name;
  document.getElementById("nameError").textContent = "";
  document.getElementById("habitGoal").value = habit.goal;
  document.getElementById("goalValue").textContent =
    `${habit.goal} day${habit.goal > 1 ? "s" : ""}`;

  // Set icon
  document.querySelectorAll(".icon-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.icon === habit.icon);
  });

  // Set color
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color === habit.color);
  });

  document.getElementById("habitModal").classList.add("show");

  setTimeout(() => {
    document.getElementById("habitName").focus();
  }, 300);
}

// 15. CLOSE MODAL
function closeModal() {
  document.getElementById("habitModal").classList.remove("show");
  editingHabitId = null;
}

// 16. HANDLE FORM SUBMIT
function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("habitName").value.trim();
  const goal = parseInt(document.getElementById("habitGoal").value);

  // Validation
  if (!name) {
    document.getElementById("nameError").textContent = "Habit name is required";
    document.getElementById("habitName").focus();
    return;
  }

  if (name.length < 2) {
    document.getElementById("nameError").textContent =
      "Name must be at least 2 characters";
    document.getElementById("habitName").focus();
    return;
  }

  if (editingHabitId) {
    // Update existing
    const habit = habits.find((h) => h.id === editingHabitId);
    if (habit) {
      habit.name = name;
      habit.icon = selectedIcon;
      habit.color = selectedColor;
      habit.goal = goal;
      console.log("✏️ Habit updated:", habit.name);
    }
  } else {
    // Create new
    const newHabit = {
      id: generateId(),
      name: name,
      icon: selectedIcon,
      color: selectedColor,
      goal: goal,
      createdAt: Date.now(),
      days: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      },
      history: {},
    };
    habits.push(newHabit);
    console.log("➕ Habit created:", newHabit.name);
  }

  saveHabits();
  updateStats();
  renderHabits();
  closeModal();
}

// 17. OPEN DELETE CONFIRM
function openDeleteConfirm(id) {
  deletingHabitId = id;
  document.getElementById("deleteConfirmModal").classList.add("show");
}

// 18. CLOSE DELETE CONFIRM
function closeDeleteConfirm() {
  document.getElementById("deleteConfirmModal").classList.remove("show");
  deletingHabitId = null;
}

// 19. CONFIRM DELETE
function confirmDelete() {
  if (!deletingHabitId) return;

  const habit = habits.find((h) => h.id === deletingHabitId);
  habits = habits.filter((h) => h.id !== deletingHabitId);

  saveHabits();
  updateStats();
  renderHabits();
  closeDeleteConfirm();

  console.log("🗑️ Habit deleted:", habit ? habit.name : "Unknown");
}

// 20. INIT ICON PICKER
function initIconPicker() {
  document.querySelectorAll(".icon-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".icon-option")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedIcon = btn.dataset.icon;
      console.log("🎨 Icon selected:", selectedIcon);
    });
  });
}

// 21. INIT COLOR PICKER
function initColorPicker() {
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".color-option")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedColor = btn.dataset.color;
      console.log("🎨 Color selected:", selectedColor);
    });
  });
}

// 22. INIT GOAL SLIDER
function initGoalSlider() {
  const slider = document.getElementById("habitGoal");
  const value = document.getElementById("goalValue");

  if (slider && value) {
    slider.addEventListener("input", () => {
      const goal = parseInt(slider.value);
      value.textContent = `${goal} day${goal > 1 ? "s" : ""}`;
    });
  }
}

// 23. INIT FILTERS
function initFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      renderHabits();
      console.log("🔍 Filter:", currentFilter);
    });
  });
}

// 24. INIT WEEK NAVIGATION (visual only for now)
function initWeekNav() {
  const prevBtn = document.getElementById("prevWeekBtn");
  const nextBtn = document.getElementById("nextWeekBtn");
  const label = document.getElementById("weekLabel");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      label.textContent = "Last Week";
      console.log("📅 Previous week (visual only)");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      label.textContent = "Next Week";
      console.log("📅 Next week (visual only)");
    });
  }
}

// 25. INIT SEARCH
function initSearch() {
  const searchInput = document.getElementById("globalSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const list = document.getElementById("habitsList");

    if (query === "") {
      renderHabits();
      return;
    }

    const filtered = habits.filter((h) => h.name.toLowerCase().includes(query));

    if (filtered.length === 0) {
      list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No results</h3>
                    <p>No habits match "${query}"</p>
                </div>
            `;
      return;
    }

    // Simple render of search results
    const todayKey = getTodayKey();
    const todayIndex = DAY_KEYS.indexOf(todayKey);

    list.innerHTML = filtered
      .map((habit) => {
        const streak = calculateStreak(habit);
        const doneCount = DAY_KEYS.filter(
          (k) => habit.days && habit.days[k],
        ).length;
        const cappedPercent = Math.min(
          Math.round((doneCount / habit.goal) * 100),
          100,
        );

        const weekDaysHtml = DAY_KEYS.map((key, index) => {
          const isDone = habit.days && habit.days[key];
          const isToday = index === todayIndex;
          const isFuture = index > todayIndex;

          let classes = "day-box";
          if (isDone) classes += " done";
          if (isToday) classes += " today";
          if (isFuture) classes += " future";

          return `
                    <div class="${classes}" onclick="toggleDay(${habit.id}, '${key}')">
                        <span class="day-label">${DAY_LABELS[index]}</span>
                        <div class="day-check"></div>
                    </div>
                `;
        }).join("");

        return `
                <div class="habit-card" style="--habit-color: ${habit.color};" data-id="${habit.id}">
                    <div class="habit-header">
                        <div class="habit-title-wrap">
                            <div class="habit-icon">
                                <i class="fas ${habit.icon}"></i>
                            </div>
                            <div class="habit-name-wrap">
                                <h3 class="habit-name">${escapeHtml(habit.name)}</h3>
                                <div class="habit-meta">
                                    <span class="streak"><i class="fas fa-fire"></i> ${streak} day streak</span>
                                </div>
                            </div>
                        </div>
                        <div class="habit-actions">
                            <button class="habit-action-btn edit" onclick="openEditModal(${habit.id})">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="habit-action-btn delete" onclick="openDeleteConfirm(${habit.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="week-tracker">${weekDaysHtml}</div>
                    <div class="habit-progress">
                        <div class="habit-progress-bar">
                            <div class="habit-progress-fill" style="width: ${cappedPercent}%"></div>
                        </div>
                        <span class="habit-progress-text">${doneCount} / ${habit.goal}</span>
                    </div>
                </div>
            `;
      })
      .join("");
  });
}

// 26. INIT KEYBOARD SHORTCUTS
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDeleteConfirm();
    }
  });
}

// 27. INIT EVENT LISTENERS
function initEventListeners() {
  const addBtn = document.getElementById("addHabitBtn");
  if (addBtn) addBtn.addEventListener("click", openAddModal);

  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  const form = document.getElementById("habitForm");
  if (form) form.addEventListener("submit", handleSubmit);

  const modal = document.getElementById("habitModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  if (cancelDeleteBtn)
    cancelDeleteBtn.addEventListener("click", closeDeleteConfirm);

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn)
    confirmDeleteBtn.addEventListener("click", confirmDelete);

  const deleteModal = document.getElementById("deleteConfirmModal");
  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) closeDeleteConfirm();
    });
  }
}

// 28. INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", () => {
  console.log("❤️ Habits page starting...");

  loadHabits();
  updateStats();
  renderHabits();

  initIconPicker();
  initColorPicker();
  initGoalSlider();
  initFilters();
  initWeekNav();
  initSearch();
  initEventListeners();
  initKeyboardShortcuts();

  console.log("✅ Habits page loaded!");
});
