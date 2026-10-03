
// Generate Starfield 
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


// 1. بارگذاری داده‌ها
function loadData() {
    tasks = JSON.parse(localStorage.getItem('orbit-tasks') || '[]');
    notes = JSON.parse(localStorage.getItem('orbit-notes') || '[]');
    habits = JSON.parse(localStorage.getItem('orbit-habits') || '[]');
    console.log('📦 Data loaded:', { tasks: tasks.length, notes: notes.length, habits: habits.length });
}

// 2. به‌روزرسانی آمار
function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(task => task.completed).length;
    const pending = total - done;
    
    const totalEl = document.getElementById('totalTasksCount');
    const doneEl = document.getElementById('doneTasksCount');
    const pendingEl = document.getElementById('pendingTasksCount');
    
    if (totalEl) totalEl.textContent = total;
    if (doneEl) doneEl.textContent = done;
    if (pendingEl) pendingEl.textContent = pending;
}

// 3. نمایش تسک‌های اخیر
function renderRecentTasks() {
    const container = document.getElementById('recentTasksList');
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
    container.innerHTML = recent.map(task => `
        <div class="widget-item" onclick="window.location.href='tasks.html'">
            <i class="fas fa-${task.completed ? 'check-circle text-success' : 'circle text-secondary'}"></i>
            <div class="item-content">
                <span class="item-title ${task.completed ? 'text-decoration-line-through text-secondary' : ''}">
                    ${task.title}
                </span>
                <span class="item-meta">${task.completed ? 'Completed' : 'Pending'}</span>
            </div>
        </div>
    `).join('');
}

// 4. نمایش یادداشت‌های اخیر
function renderRecentNotes() {
    const container = document.getElementById('recentNotesList');
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
    container.innerHTML = recent.map(note => `
        <div class="widget-item" onclick="window.location.href='notes.html'">
            <i class="fas fa-sticky-note text-warning"></i>
            <div class="item-content">
                <span class="item-title">${note.title || 'Untitled'}</span>
                <span class="item-meta">${note.content ? note.content.substring(0, 40) + '...' : 'No content'}</span>
            </div>
        </div>
    `).join('');
}

// 5. نمایش عادت‌های امروز
function renderTodayHabits() {
    const container = document.getElementById('todayHabitsList');
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
            ${habits.map(habit => `
                <div class="habit-chip ${habit.doneToday ? 'done' : ''}" 
                     onclick="window.location.href='habits.html'">
                    <i class="fas fa-${habit.doneToday ? 'check-circle' : 'circle'}"></i>
                    ${habit.name}
                </div>
            `).join('')}
        </div>
    `;
}

// 6. شمارنده‌های سایدبار
function updateSidebarCounts() {
    const tasksCount = document.getElementById('tasksCount');
    const notesCount = document.getElementById('notesCount');
    const habitsCount = document.getElementById('habitsCount');
    
    if (tasksCount) tasksCount.textContent = tasks.length;
    if (notesCount) notesCount.textContent = notes.length;
    if (habitsCount) habitsCount.textContent = habits.length;
}

// 7. SEARCH - جستجوی زنده
function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            // اگه خالی بود، همه رو نشون بده
            renderRecentTasks();
            renderRecentNotes();
            renderTodayHabits();
            return;
        }
        
        // فیلتر تسک‌ها
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(query)
        );
        
        // فیلتر یادداشت‌ها
        const filteredNotes = notes.filter(note => 
            (note.title || '').toLowerCase().includes(query) ||
            (note.content || '').toLowerCase().includes(query)
        );
        
        // فیلتر عادت‌ها
        const filteredHabits = habits.filter(habit => 
            habit.name.toLowerCase().includes(query)
        );
        
        // نمایش نتایج
        renderSearchResults(filteredTasks, filteredNotes, filteredHabits, query);
    });
}

function renderSearchResults(filteredTasks, filteredNotes, filteredHabits, query) {
    // تسک‌ها
    const tasksContainer = document.getElementById('recentTasksList');
    if (tasksContainer) {
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `<p class="empty-state">No tasks match "${query}"</p>`;
        } else {
            tasksContainer.innerHTML = filteredTasks.map(task => `
                <div class="widget-item" onclick="window.location.href='tasks.html'">
                    <i class="fas fa-${task.completed ? 'check-circle text-success' : 'circle text-secondary'}"></i>
                    <div class="item-content">
                        <span class="item-title">${task.title}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // یادداشت‌ها
    const notesContainer = document.getElementById('recentNotesList');
    if (notesContainer) {
        if (filteredNotes.length === 0) {
            notesContainer.innerHTML = `<p class="empty-state">No notes match "${query}"</p>`;
        } else {
            notesContainer.innerHTML = filteredNotes.map(note => `
                <div class="widget-item" onclick="window.location.href='notes.html'">
                    <i class="fas fa-sticky-note text-warning"></i>
                    <div class="item-content">
                        <span class="item-title">${note.title || 'Untitled'}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // عادت‌ها
    const habitsContainer = document.getElementById('todayHabitsList');
    if (habitsContainer) {
        if (filteredHabits.length === 0) {
            habitsContainer.innerHTML = `<p class="empty-state">No habits match "${query}"</p>`;
        } else {
            habitsContainer.innerHTML = `
                <div class="habits-row">
                    ${filteredHabits.map(habit => `
                        <div class="habit-chip ${habit.doneToday ? 'done' : ''}">
                            <i class="fas fa-${habit.doneToday ? 'check-circle' : 'circle'}"></i>
                            ${habit.name}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// 8. NOTIFICATIONS
function initNotifications() {
    const btn = document.getElementById('notificationsBtn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const pendingTasks = tasks.filter(t => !t.completed).length;
        const totalHabits = habits.length;
        const doneHabits = habits.filter(h => h.doneToday).length;
        
        let message = '📬 Notifications:\n\n';
        
        if (pendingTasks > 0) {
            message += `⏳ You have ${pendingTasks} pending task${pendingTasks > 1 ? 's' : ''}.\n`;
        } else {
            message += `✅ All tasks completed! Great job!\n`;
        }
        
        if (totalHabits > 0) {
            message += `❤️ Habits: ${doneHabits}/${totalHabits} done today.`;
        } else {
            message += `❤️ No habits yet. Add one!`;
        }
        
        alert(message);
    });
}

// 9. SETTINGS MODAL
function initSettings() {
    const btn = document.getElementById('navSettings');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('⚙️ Settings', `
            <div class="modal-section">
                <h6>Profile</h6>
                <p><strong>Name:</strong> Guest User</p>
                <p><strong>Theme:</strong> ${document.body.classList.contains('light-mode') ? 'Light' : 'Dark'}</p>
            </div>
            <div class="modal-section">
                <h6>Data</h6>
                <p>Tasks: ${tasks.length}</p>
                <p>Notes: ${notes.length}</p>
                <p>Habits: ${habits.length}</p>
            </div>
            <div class="modal-section">
                <h6>Actions</h6>
                <button class="btn-modal danger" onclick="clearAllData()">
                    <i class="fas fa-trash"></i> Clear All Data
                </button>
            </div>
        `);
    });
}

function clearAllData() {
    if (confirm('⚠️ Are you sure? This will delete ALL tasks, notes, and habits.')) {
        localStorage.removeItem('orbit-tasks');
        localStorage.removeItem('orbit-notes');
        localStorage.removeItem('orbit-habits');
        alert('✅ All data cleared!');
        location.reload();
    }
}

// 10. HELP MODAL
function initHelp() {
    const btn = document.getElementById('navHelp');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('❓ Help & Shortcuts', `
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
        `);
    });
}

// 11. STATISTICS MODAL
function initStatistics() {
    const btn = document.getElementById('navStats');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - doneTasks;
        const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        
        const totalHabits = habits.length;
        const doneHabits = habits.filter(h => h.doneToday).length;
        const habitRate = totalHabits > 0 ? Math.round((doneHabits / totalHabits) * 100) : 0;
        
        showModal('📊 Statistics', `
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
                <h6>❤️ Habits Today</h6>
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
        `);
    });
}

// 12. USER PROFILE
function initProfile() {
    const profile = document.getElementById('userProfile');
    if (!profile) return;
    
    profile.addEventListener('click', () => {
        showModal('👤 Profile', `
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
        `);
    });
}

// 13. FOCUS WIDGET
function initFocusWidget() {
    const widget = document.getElementById('focusWidget');
    if (!widget) return;
    
    widget.addEventListener('click', () => {
        alert('⏰ Focus Timer\n\nThis feature will be available soon!\n\nStart a 25-minute focus session to boost productivity.');
    });
}

// 14. KEYBOARD SHORTCUTS
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!e.ctrlKey) return;
        
        switch(e.key.toLowerCase()) {
            case 'd':
                e.preventDefault();
                window.location.href = 'dashboard.html';
                break;
            case 't':
                e.preventDefault();
                window.location.href = 'tasks.html';
                break;
            case 'n':
                e.preventDefault();
                window.location.href = 'notes.html';
                break;
            case 'h':
                e.preventDefault();
                window.location.href = 'habits.html';
                break;
            case 'k':
                e.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) searchInput.focus();
                break;
        }
    });
}

// 15. MODAL SYSTEM
function showModal(title, content) {
    // حذف modal قبلی
    const existing = document.getElementById('orbitModal');
    if (existing) existing.remove();
    
    // ساخت modal جدید
    const modal = document.createElement('div');
    modal.id = 'orbitModal';
    modal.className = 'orbit-modal-overlay';
    modal.innerHTML = `
        <div class="orbit-modal">
            <div class="orbit-modal-header">
                <h3>${title}</h3>
                <button class="orbit-modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="orbit-modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن با کلیک روی overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // انیمیشن
    requestAnimationFrame(() => modal.classList.add('show'));
}

function closeModal() {
    const modal = document.getElementById('orbitModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// بستن با Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// شروع
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Dashboard starting...');
    
    loadData();
    updateStats();
    renderRecentTasks();
    renderRecentNotes();
    renderTodayHabits();
    updateSidebarCounts();
    
    // فعال‌سازی المان‌ها
    initSearch();
    initNotifications();
    initSettings();
    initHelp();
    initStatistics();
    initProfile();
    initFocusWidget();
    initKeyboardShortcuts();
    
    console.log('✅ Dashboard loaded!');
});



