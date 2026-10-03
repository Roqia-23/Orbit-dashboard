

// ============================================
// GLOBAL VARIABLES
// ============================================
// let tasks = [];
let currentFilter = "all";
let currentSort = "newest";
let editingTaskId = null;
let deletingTaskId = null;

// ============================================
// 1. LOAD TASKS FROM LOCALSTORAGE
// ============================================
function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("orbit-tasks") || "[]");
  console.log("📦 Tasks loaded:", tasks.length);
}

// ============================================
// 2. SAVE TASKS TO LOCALSTORAGE
// ============================================
function saveTasks() {
  localStorage.setItem("orbit-tasks", JSON.stringify(tasks));
  console.log("💾 Tasks saved:", tasks.length);
}

// ============================================
// 3. GENERATE UNIQUE ID
// ============================================
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ============================================
// 4. UPDATE STATS
// ============================================
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;

  document.getElementById("totalStat").textContent = total;
  document.getElementById("doneStat").textContent = done;
  document.getElementById("pendingStat").textContent = pending;

  // Update sidebar count
  const sidebarCount = document.getElementById("tasksCount");
  if (sidebarCount) sidebarCount.textContent = total;
}

// ============================================
// 5. FORMAT DATE
// ============================================
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return "Today";
  if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

  // Check if overdue
  if (date < today) {
    return `Overdue: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ============================================
// 6. ESCAPE HTML (Security)
// ============================================
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 7. GET FILTERED AND SORTED TASKS
// ============================================
function getFilteredTasks() {
  let filtered = [...tasks];

  // Filter
  if (currentFilter === "pending") {
    filtered = filtered.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filtered = filtered.filter((t) => t.completed);
  }

  // Sort
  switch (currentSort) {
    case "newest":
      filtered.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "oldest":
      filtered.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case "az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "za":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
}

// ============================================
// 8. RENDER TASKS
// ============================================
function renderTasks() {
  const list = document.getElementById("tasksList");
  if (!list) return;

  const filtered = getFilteredTasks();

  // Empty state
  if (filtered.length === 0) {
    let message = 'No tasks yet. Click "Add Task" to create your first task';
    let icon = "fa-clipboard-list";

    if (currentFilter === "pending") {
      message = "No pending tasks. Great job!";
      icon = "fa-check-circle";
    } else if (currentFilter === "completed") {
      message = "No completed tasks yet";
      icon = "fa-hourglass";
    }

    list.innerHTML = `
            <div class="empty-state" id="tasksEmptyState">
                <i class="fas ${icon}"></i>
                <h3>${currentFilter === "all" ? "No tasks yet" : "No tasks found"}</h3>
                <p>${message}</p>
            </div>
        `;
    return;
  }

  // Render each task
  list.innerHTML = filtered
    .map((task) => {
      const isOverdue =
        task.dueDate &&
        !task.completed &&
        new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

      return `
            <div class="task-item priority-${task.priority} ${task.completed ? "completed" : ""}" 
                 data-id="${task.id}">
                
                <label class="task-checkbox">
                    <input type="checkbox" 
                           ${task.completed ? "checked" : ""} 
                           onchange="toggleTask(${task.id})" />
                    <span></span>
                </label>
                
                <div class="task-content">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    
                    ${
                      task.description
                        ? `
                        <span class="task-description">${escapeHtml(task.description)}</span>
                    `
                        : ""
                    }
                    
                    <div class="task-meta">
                        <span class="priority-badge ${task.priority}">
                            ${task.priority}
                        </span>
                        
                        ${
                          task.dueDate
                            ? `
                            <span style="${isOverdue ? "color: #EF4444;" : ""}">
                                <i class="fas fa-calendar"></i>
                                ${formatDate(task.dueDate)}
                            </span>
                        `
                            : ""
                        }
                        
                        <span>
                            <i class="fas fa-clock"></i>
                            ${new Date(task.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                        </span>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="task-action-btn edit" 
                            onclick="openEditModal(${task.id})" 
                            title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="task-action-btn delete" 
                            onclick="openDeleteConfirm(${task.id})" 
                            title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    })
    .join("");
}

// ============================================
// 9. TOGGLE TASK COMPLETE
// ============================================
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  updateStats();
  renderTasks();

  console.log(
    `✅ Task ${task.completed ? "completed" : "uncompleted"}:`,
    task.title,
  );
}

// ============================================
// 10. OPEN ADD MODAL
// ============================================
function openAddModal() {
  editingTaskId = null;

  document.getElementById("modalTitle").textContent = "Add New Task";
  document.getElementById("saveBtnText").textContent = "Save Task";
  document.getElementById("taskForm").reset();
  document.getElementById("titleError").textContent = "";

  // Default priority: medium
  document.getElementById("priorityMedium").checked = true;

  // Default due date: today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("taskDueDate").value = today;

  document.getElementById("taskModal").classList.add("show");

  // Focus on title
  setTimeout(() => {
    document.getElementById("taskTitle").focus();
  }, 300);
}

// ============================================
// 11. OPEN EDIT MODAL
// ============================================
function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;

  document.getElementById("modalTitle").textContent = "Edit Task";
  document.getElementById("saveBtnText").textContent = "Update Task";
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskDueDate").value = task.dueDate || "";

  // Set priority
  const priorityRadio = document.getElementById(
    `priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`,
  );
  if (priorityRadio) priorityRadio.checked = true;

  document.getElementById("titleError").textContent = "";
  document.getElementById("taskModal").classList.add("show");

  setTimeout(() => {
    document.getElementById("taskTitle").focus();
  }, 300);
}

// ============================================
// 12. CLOSE MODAL
// ============================================
function closeModal() {
  document.getElementById("taskModal").classList.remove("show");
  editingTaskId = null;
}

// ============================================
// 13. HANDLE FORM SUBMIT
// ============================================
function handleSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.querySelector(
    'input[name="priority"]:checked',
  ).value;

  // Validation
  if (!title) {
    document.getElementById("titleError").textContent = "Title is required";
    document.getElementById("taskTitle").focus();
    return;
  }

  if (title.length < 3) {
    document.getElementById("titleError").textContent =
      "Title must be at least 3 characters";
    document.getElementById("taskTitle").focus();
    return;
  }

  if (editingTaskId) {
    // Update existing task
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
      console.log("✏️ Task updated:", task.title);
    }
  } else {
    // Create new task
    const newTask = {
      id: generateId(),
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      completed: false,
      createdAt: Date.now(),
    };
    tasks.push(newTask);
    console.log("➕ Task created:", newTask.title);
  }

  saveTasks();
  updateStats();
  renderTasks();
  closeModal();
}

// ============================================
// 14. OPEN DELETE CONFIRM
// ============================================
function openDeleteConfirm(id) {
  deletingTaskId = id;
  document.getElementById("deleteConfirmModal").classList.add("show");
}

// ============================================
// 15. CLOSE DELETE CONFIRM
// ============================================
function closeDeleteConfirm() {
  document.getElementById("deleteConfirmModal").classList.remove("show");
  deletingTaskId = null;
}

// ============================================
// 16. CONFIRM DELETE
// ============================================
function confirmDelete() {
  if (!deletingTaskId) return;

  const task = tasks.find((t) => t.id === deletingTaskId);
  tasks = tasks.filter((t) => t.id !== deletingTaskId);

  saveTasks();
  updateStats();
  renderTasks();
  closeDeleteConfirm();

  console.log("🗑️ Task deleted:", task ? task.title : "Unknown");
}

// ============================================
// 17. INIT FILTERS
// ============================================
function initFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      renderTasks();
      console.log("🔍 Filter:", currentFilter);
    });
  });

  // Sort
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderTasks();
      console.log("🔀 Sort:", currentSort);
    });
  }
}

// ============================================
// 18. INIT SEARCH
// ============================================
function initSearch() {
  const searchInput = document.getElementById("globalSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const list = document.getElementById("tasksList");

    if (query === "") {
      renderTasks();
      return;
    }

    const filtered = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        (t.description || "").toLowerCase().includes(query),
    );

    if (filtered.length === 0) {
      list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No results</h3>
                    <p>No tasks match "${query}"</p>
                </div>
            `;
      return;
    }

    // Render search results
    const originalRender = renderTasks;
    list.innerHTML = filtered
      .map(
        (task) => `
            <div class="task-item priority-${task.priority} ${task.completed ? "completed" : ""}" 
                 data-id="${task.id}">
                <label class="task-checkbox">
                    <input type="checkbox" 
                           ${task.completed ? "checked" : ""} 
                           onchange="toggleTask(${task.id})" />
                    <span></span>
                </label>
                <div class="task-content">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    ${task.description ? `<span class="task-description">${escapeHtml(task.description)}</span>` : ""}
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="openEditModal(${task.id})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="task-action-btn delete" onclick="openDeleteConfirm(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("");
  });
}

// ============================================
// 19. INIT KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Escape to close modals
    if (e.key === "Escape") {
      closeModal();
      closeDeleteConfirm();
    }
  });
}

// ============================================
// 20. INIT EVENT LISTENERS
// ============================================
function initEventListeners() {
  // Add task button
  const addBtn = document.getElementById("addTaskBtn");
  if (addBtn) addBtn.addEventListener("click", openAddModal);

  // Close modal button
  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Cancel button
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Form submit
  const form = document.getElementById("taskForm");
  if (form) form.addEventListener("submit", handleSubmit);

  // Modal overlay click
  const modal = document.getElementById("taskModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Delete confirm
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

// ============================================
// 21. INITIALIZE PAGE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌌 Tasks page starting...");

  loadTasks();
  updateStats();
  renderTasks();

  initFilters();
  initSearch();
  initEventListeners();
  initKeyboardShortcuts();

  console.log("✅ Tasks page loaded!");
});
