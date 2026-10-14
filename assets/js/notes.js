


let currentFilter = "all";
let currentSort = "newest";
let editingNoteId = null;
let deletingNoteId = null;
let viewingNoteId = null;

// 1. LOAD NOTES FROM LOCALSTORAGE
function loadNotes() {
  const user = getCurrentUser();
  if (!user) return;

  const key = `orbit-notes-${user.id}`;
  notes = JSON.parse(localStorage.getItem(key) || "[]");
  console.log(`📦 Notes loaded for ${user.name}:`, notes.length);
}

// 2. SAVE NOTES TO LOCALSTORAGE
function saveNotes() {
  const user = getCurrentUser();
  if (!user) return;

  const key = `orbit-notes-${user.id}`;
  localStorage.setItem(key, JSON.stringify(notes));
  console.log(`💾 Notes saved for ${user.name}:`, notes.length);
}

// 3. GENERATE UNIQUE ID
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// 4. ESCAPE HTML (Security)
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 5. FORMAT DATE
function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Time ago
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Older
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// 6. UPDATE STATS
function updateStats() {
  const total = notes.length;
  const pinned = notes.filter((n) => n.pinned).length;

  // This week (last 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = notes.filter((n) => n.createdAt > oneWeekAgo).length;

  document.getElementById("totalNotesStat").textContent = total;
  document.getElementById("pinnedNotesStat").textContent = pinned;
  document.getElementById("weekNotesStat").textContent = thisWeek;

  // Update sidebar count
  const sidebarCount = document.getElementById("notesCount");
  if (sidebarCount) sidebarCount.textContent = total;
}

// 7. GET FILTERED AND SORTED NOTES
function getFilteredNotes() {
  let filtered = [...notes];

  // Filter
  if (currentFilter === "pinned") {
    filtered = filtered.filter((n) => n.pinned);
  } else if (currentFilter === "recent") {
    // Last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((n) => n.createdAt > oneWeekAgo);
  }

  // Sort (pinned always first)
  filtered.sort((a, b) => {
    // Pinned first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Then by selected sort
    switch (currentSort) {
      case "newest":
        return b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "az":
        return (a.title || "").localeCompare(b.title || "");
      case "za":
        return (b.title || "").localeCompare(a.title || "");
      default:
        return b.createdAt - a.createdAt;
    }
  });

  return filtered;
}

// 8. RENDER NOTES
function renderNotes() {
  const grid = document.getElementById("notesGrid");
  if (!grid) return;

  const filtered = getFilteredNotes();

  // Empty state
  if (filtered.length === 0) {
    let message = 'Click "New Note" to write your first note';
    let icon = "fa-sticky-note";
    let title = "No notes yet";

    if (currentFilter === "pinned") {
      message = "Pin notes to see them here";
      icon = "fa-thumbtack";
      title = "No pinned notes";
    } else if (currentFilter === "recent") {
      message = "Notes from the last 7 days appear here";
      icon = "fa-clock";
      title = "No recent notes";
    }

    grid.innerHTML = `
            <div class="empty-state" id="notesEmptyState">
                <i class="fas ${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    return;
  }

  // Render each note
  grid.innerHTML = filtered
    .map((note) => {
      // Truncate content for preview
      const preview =
        note.content.length > 150
          ? note.content.substring(0, 150) + "..."
          : note.content;

      return `
            <div class="note-card ${note.pinned ? "pinned" : ""}" 
                 data-id="${note.id}"
                 onclick="openViewModal(${note.id})">
                
                <div class="note-header">
                    <span class="note-category ${note.category}">
                        ${getCategoryIcon(note.category)}
                        ${note.category}
                    </span>
                    ${
                      note.pinned
                        ? `
                        <i class="fas fa-thumbtack pin-indicator"></i>
                    `
                        : ""
                    }
                </div>
                
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <p class="note-preview">${escapeHtml(preview)}</p>
                
                <div class="note-footer">
                    <span class="note-date">
                        <i class="fas fa-clock"></i>
                        ${formatDate(note.createdAt)}
                    </span>
                    
                    <div class="note-actions" onclick="event.stopPropagation()">
                        <button class="note-action-btn pin ${note.pinned ? "active" : ""}" 
                                onclick="togglePin(${note.id})" 
                                title="${note.pinned ? "Unpin" : "Pin"}">
                            <i class="fas fa-thumbtack"></i>
                        </button>
                        <button class="note-action-btn edit" 
                                onclick="openEditModal(${note.id})" 
                                title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="note-action-btn delete" 
                                onclick="openDeleteConfirm(${note.id})" 
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

// 9. GET CATEGORY ICON
function getCategoryIcon(category) {
  const icons = {
    personal: "👤",
    work: "💼",
    ideas: "💡",
    study: "📚",
    other: "📌",
  };
  return icons[category] || "📌";
}

// 10. TOGGLE PIN
function togglePin(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  note.pinned = !note.pinned;
  saveNotes();
  updateStats();
  renderNotes();

  console.log(`📌 Note ${note.pinned ? "pinned" : "unpinned"}:`, note.title);
}

// 11. OPEN ADD MODAL
function openAddModal() {
  editingNoteId = null;

  document.getElementById("modalTitle").textContent = "New Note";
  document.getElementById("saveBtnText").textContent = "Save Note";
  document.getElementById("noteForm").reset();
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";
  document.getElementById("charCounter").textContent = "0 / 2000";

  document.getElementById("noteModal").classList.add("show");

  setTimeout(() => {
    document.getElementById("noteTitle").focus();
  }, 300);
}

// 12. OPEN EDIT MODAL
function openEditModal(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  editingNoteId = id;

  document.getElementById("modalTitle").textContent = "Edit Note";
  document.getElementById("saveBtnText").textContent = "Update Note";
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  document.getElementById("noteCategory").value = note.category || "personal";
  document.getElementById("notePinned").checked = note.pinned || false;
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";
  document.getElementById("charCounter").textContent =
    `${note.content.length} / 2000`;

  document.getElementById("noteModal").classList.add("show");

  setTimeout(() => {
    document.getElementById("noteTitle").focus();
  }, 300);
}

// 13. CLOSE MODAL
function closeModal() {
  document.getElementById("noteModal").classList.remove("show");
  editingNoteId = null;
}

// 14. HANDLE FORM SUBMIT
function handleSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  const category = document.getElementById("noteCategory").value;
  const pinned = document.getElementById("notePinned").checked;

  // Reset errors
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";

  // Validation
  let hasError = false;

  if (!title) {
    document.getElementById("titleError").textContent = "Title is required";
    hasError = true;
  } else if (title.length < 2) {
    document.getElementById("titleError").textContent =
      "Title must be at least 2 characters";
    hasError = true;
  }

  if (!content) {
    document.getElementById("contentError").textContent = "Content is required";
    hasError = true;
  } else if (content.length < 3) {
    document.getElementById("contentError").textContent =
      "Content must be at least 3 characters";
    hasError = true;
  }

  if (hasError) return;

  if (editingNoteId) {
    // Update existing note
    const note = notes.find((n) => n.id === editingNoteId);
    if (note) {
      note.title = title;
      note.content = content;
      note.category = category;
      note.pinned = pinned;
      note.updatedAt = Date.now();
      console.log("✏️ Note updated:", note.title);
    }
  } else {
    // Create new note
    const newNote = {
      id: generateId(),
      title: title,
      content: content,
      category: category,
      pinned: pinned,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    console.log("➕ Note created:", newNote.title);
  }

  saveNotes();
  updateStats();
  renderNotes();
  closeModal();
}

// 15. OPEN DELETE CONFIRM
function openDeleteConfirm(id) {
  deletingNoteId = id;
  document.getElementById("deleteConfirmModal").classList.add("show");
}

// 16. CLOSE DELETE CONFIRM
function closeDeleteConfirm() {
  document.getElementById("deleteConfirmModal").classList.remove("show");
  deletingNoteId = null;
}

// 17. CONFIRM DELETE
function confirmDelete() {
  if (!deletingNoteId) return;

  const note = notes.find((n) => n.id === deletingNoteId);
  notes = notes.filter((n) => n.id !== deletingNoteId);

  saveNotes();
  updateStats();
  renderNotes();
  closeDeleteConfirm();

  console.log("🗑️ Note deleted:", note ? note.title : "Unknown");
}

// 18. OPEN VIEW MODAL
function openViewModal(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  viewingNoteId = id;

  document.getElementById("viewTitle").textContent = note.title;
  document.getElementById("viewContent").textContent = note.content;

  // Category
  const categoryEl = document.getElementById("viewCategory");
  categoryEl.innerHTML = `
        <i class="fas fa-folder"></i>
        <span>${note.category || "personal"}</span>
    `;
  categoryEl.className = `category-badge ${note.category || "personal"}`;

  // Date
  document.getElementById("viewDate").textContent = new Date(
    note.createdAt,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("viewNoteModal").classList.add("show");
}

// 19. CLOSE VIEW MODAL
function closeViewModal() {
  document.getElementById("viewNoteModal").classList.remove("show");
  viewingNoteId = null;
}

// 20. EDIT FROM VIEW MODAL
function editFromView() {
  if (!viewingNoteId) return;

  const id = viewingNoteId;
  closeViewModal();

  setTimeout(() => {
    openEditModal(id);
  }, 300);
}

// 21. INIT FILTERS
function initFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;
      renderNotes();
      console.log("🔍 Filter:", currentFilter);
    });
  });

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderNotes();
      console.log("🔀 Sort:", currentSort);
    });
  }
}

// 22. INIT SEARCH
function initSearch() {
  const searchInput = document.getElementById("globalSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const grid = document.getElementById("notesGrid");

    if (query === "") {
      renderNotes();
      return;
    }

    const filtered = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query),
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No results</h3>
                    <p>No notes match "${query}"</p>
                </div>
            `;
      return;
    }

    // Render search results
    grid.innerHTML = filtered
      .map((note) => {
        const preview =
          note.content.length > 150
            ? note.content.substring(0, 150) + "..."
            : note.content;

        return `
                <div class="note-card ${note.pinned ? "pinned" : ""}" 
                     data-id="${note.id}"
                     onclick="openViewModal(${note.id})">
                    
                    <div class="note-header">
                        <span class="note-category ${note.category}">
                            ${getCategoryIcon(note.category)}
                            ${note.category}
                        </span>
                        ${note.pinned ? `<i class="fas fa-thumbtack pin-indicator"></i>` : ""}
                    </div>
                    
                    <h3 class="note-title">${escapeHtml(note.title)}</h3>
                    <p class="note-preview">${escapeHtml(preview)}</p>
                    
                    <div class="note-footer">
                        <span class="note-date">
                            <i class="fas fa-clock"></i>
                            ${formatDate(note.createdAt)}
                        </span>
                        <div class="note-actions" onclick="event.stopPropagation()">
                            <button class="note-action-btn pin ${note.pinned ? "active" : ""}" 
                                    onclick="togglePin(${note.id})">
                                <i class="fas fa-thumbtack"></i>
                            </button>
                            <button class="note-action-btn edit" 
                                    onclick="openEditModal(${note.id})">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="note-action-btn delete" 
                                    onclick="openDeleteConfirm(${note.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  });
}

// 23. INIT CHARACTER COUNTER
function initCharCounter() {
  const content = document.getElementById("noteContent");
  const counter = document.getElementById("charCounter");

  if (content && counter) {
    content.addEventListener("input", () => {
      const len = content.value.length;
      counter.textContent = `${len} / 2000`;

      if (len > 1800) {
        counter.style.color = "#EF4444";
      } else {
        counter.style.color = "var(--text-secondary)";
      }
    });
  }
}

// 24. INIT KEYBOARD SHORTCUTS
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDeleteConfirm();
      closeViewModal();
    }
  });
}

// 25. INIT EVENT LISTENERS
function initEventListeners() {
  // Add note button
  const addBtn = document.getElementById("addNoteBtn");
  if (addBtn) addBtn.addEventListener("click", openAddModal);

  // Close modal
  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Cancel
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Form submit
  const form = document.getElementById("noteForm");
  if (form) form.addEventListener("submit", handleSubmit);

  // Modal overlay
  const modal = document.getElementById("noteModal");
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

  // View modal
  const closeViewBtn = document.getElementById("closeViewBtn");
  if (closeViewBtn) closeViewBtn.addEventListener("click", closeViewModal);

  const viewCloseBtn = document.getElementById("viewCloseBtn");
  if (viewCloseBtn) viewCloseBtn.addEventListener("click", closeViewModal);

  const viewEditBtn = document.getElementById("viewEditBtn");
  if (viewEditBtn) viewEditBtn.addEventListener("click", editFromView);

  const viewModal = document.getElementById("viewNoteModal");
  if (viewModal) {
    viewModal.addEventListener("click", (e) => {
      if (e.target === viewModal) closeViewModal();
    });
  }
}

// 26. INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", () => {
  console.log("📝 Notes page starting...");

  loadNotes();
  updateStats();
  renderNotes();

  initFilters();
  initSearch();
  initCharCounter();
  initEventListeners();
  initKeyboardShortcuts();

  console.log("✅ Notes page loaded!");
});
