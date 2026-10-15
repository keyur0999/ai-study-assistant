/**
 * AI Study Assistant - Unified Multi-Page & Dashboard Controller
 * Seamlessly manages all 6 pages (Dashboard, Courses, PDF Workspace, Quiz Hub, Analytics, Settings)
 * with real-time backend API integration and robust offline fallbacks.
 */

// --- FALLBACK DATA ---
const FALLBACK_QUIZ_DATA = {
    python: {
        title: "🐍 Python Core & OOP Quiz",
        badge: "Medium",
        questions: [
            {
                q: "What will `print(type(lambda: None))` output in Python 3?",
                options: ["<class 'function'>", "<class 'lambda'>", "<class 'NoneType'>", "<class 'object'>"],
                correct: 0,
                explanation: "Lambdas in Python are anonymous functions and instances of the standard `<class 'function'>` type."
            },
            {
                q: "Which of the following creates a shallow copy of a list `nums`?",
                options: ["copy_nums = nums", "copy_nums = nums[:]", "copy_nums = nums.copy_deep()", "copy_nums = nums.shallow()"],
                correct: 1,
                explanation: "Slice notation `nums[:]` or `nums.copy()` creates a new shallow copy of the list."
            },
            {
                q: "What is the primary difference between a list and a tuple in Python?",
                options: ["Lists can hold multiple types; tuples cannot", "Lists are mutable; tuples are immutable", "Tuples are indexed from 1; lists from 0", "Tuples cannot be iterated with a for-loop"],
                correct: 1,
                explanation: "Lists are mutable (can be modified in-place), while tuples are immutable fixed sequences."
            },
            {
                q: "In Python, which dunder method is invoked by the `len()` function?",
                options: ["__size__()", "__count__()", "__len__()", "__length__()"],
                correct: 2,
                explanation: "The `__len__()` method is called when `len(obj)` is executed on an object."
            },
            {
                q: "What does the `@property` decorator achieve on a class method?",
                options: ["Makes the method private", "Allows the method to be accessed like an attribute without parentheses", "Caches the method return value permanently", "Converts the method to a static method"],
                correct: 1,
                explanation: "`@property` defines a getter method that can be read just like a normal attribute."
            }
        ]
    },
    cpp: {
        title: "⚡ C++ OOP & STL Quiz",
        badge: "Hard",
        questions: [
            {
                q: "Which smart pointer in C++11 provides exclusive ownership of a dynamic resource?",
                options: ["std::shared_ptr", "std::unique_ptr", "std::weak_ptr", "std::auto_ptr"],
                correct: 1,
                explanation: "`std::unique_ptr` ensures single, non-copyable ownership of a dynamically allocated object."
            },
            {
                q: "What is the worst-case time complexity of lookup in `std::unordered_map`?",
                options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                correct: 2,
                explanation: "While average lookup is O(1), worst-case lookup is O(N) due to hash collisions."
            },
            {
                q: "What happens if a class with virtual functions lacks a virtual destructor?",
                options: ["Compilation error", "Undefined behavior / memory leak when deleting derived objects via base pointer", "Virtual function table (vtable) is disabled", "Multiple inheritance is prohibited"],
                correct: 1,
                explanation: "Deleting a derived class object through a base pointer with a non-virtual destructor causes undefined behavior."
            },
            {
                q: "Which keyword prevents a virtual function from being overridden in a derived class?",
                options: ["const", "override", "final", "sealed"],
                correct: 2,
                explanation: "`final` specifies that a virtual function cannot be overridden in a child class."
            },
            {
                q: "What is RAII in modern C++?",
                options: ["Random Array Index Iterator", "Resource Acquisition Is Initialization", "Reference Allocation In Instance", "Runtime Address Identification Interface"],
                correct: 1,
                explanation: "RAII binds resource lifecycle (memory, file handles, sockets) to object lifetime via constructors and destructors."
            }
        ]
    },
    sql: {
        title: "🗄️ SQL & Relational Databases Quiz",
        badge: "Easy",
        questions: [
            {
                q: "Which SQL clause is used to filter rows after a `GROUP BY` aggregation?",
                options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
                correct: 1,
                explanation: "`HAVING` filters aggregated group results, whereas `WHERE` filters individual rows before grouping."
            },
            {
                q: "What does the 'I' in ACID database transactions stand for?",
                options: ["Indexation", "Integrity", "Isolation", "Iteration"],
                correct: 2,
                explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
            },
            {
                q: "Which JOIN returns all rows from the left table and matching rows from the right table?",
                options: ["INNER JOIN", "FULL OUTER JOIN", "LEFT JOIN", "CROSS JOIN"],
                correct: 2,
                explanation: "A `LEFT JOIN` returns all records from the left table and matched records from the right table (or NULL)."
            },
            {
                q: "What is the primary function of a database Index (e.g., B-Tree)?",
                options: ["Encrypt table columns", "Accelerate data search and retrieval speed", "Enforce foreign key cascade rules", "Automatically backup table data"],
                correct: 1,
                explanation: "Indexes speed up data retrieval operations at the cost of additional storage and write overhead."
            },
            {
                q: "Which command permanently deletes a table structure along with its data?",
                options: ["DELETE TABLE", "TRUNCATE TABLE", "DROP TABLE", "REMOVE TABLE"],
                correct: 2,
                explanation: "`DROP TABLE` removes both the table definition and all its stored rows permanently."
            }
        ]
    }
};

const COURSE_TEMPLATES = {
    python: {
        title: "Python 3.12 - Foundations & OOP",
        badge: "Core Track",
        icon: "🐍",
        langName: "Python 3",
        description: "Master clean code, functions, list comprehensions, decorators, and object-oriented paradigms.",
        code: `# Interactive Python Example\ndef calculate_grade(scores):\n    average = sum(scores) / len(scores)\n    status = "Pass" if average >= 75 else "Needs Improvement"\n    return f"Average: {average:.1f}% ({status})"\n\nstudent_scores = [88, 92, 79, 95]\nprint(calculate_grade(student_scores))`,
        templates: {
            default: `# Interactive Python Example\ndef calculate_grade(scores):\n    average = sum(scores) / len(scores)\n    status = "Pass" if average >= 75 else "Needs Improvement"\n    return f"Average: {average:.1f}% ({status})"\n\nstudent_scores = [88, 92, 79, 95]\nprint(calculate_grade(student_scores))`,
            custom: `# Python 3 Scratchpad\n# Write your code here and click "Run Code"\n\n`,
            fibonacci: `# Fibonacci Generator\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint("First 8 Fibonacci numbers:", list(fib(8)))`,
            quicksort: `# QuickSort Algorithm\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nnums = [38, 27, 43, 3, 9, 82, 10]\nprint("Sorted Array:", quicksort(nums))`
        }
    },
    c: {
        title: "C Programming - Memory & Pointers",
        badge: "Systems Track",
        icon: "⚙️",
        langName: "C (GCC)",
        description: "Deep dive into pointer arithmetic, stack vs heap allocation with malloc/free, and structs.",
        code: `// C Pointer Manipulation\n#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    swap(&x, &y);\n    printf("Swapped: x=%d, y=%d\\n", x, y);\n    return 0;\n}`
    },
    cpp: {
        title: "C++ (OOP & STL Data Structures)",
        badge: "High Performance",
        icon: "⚡",
        langName: "C++ 20",
        description: "Master std::vector, std::map, lambda expressions, RAII, and smart pointers.",
        code: `// Modern C++ STL Algorithms\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> numbers = {5, 2, 9, 1, 7};\n    std::sort(numbers.begin(), numbers.end());\n    \n    std::cout << "Sorted: ";\n    for(int n : numbers) std::cout << n << " ";\n    std::cout << std::endl;\n    return 0;\n}`
    },
    java: {
        title: "Java Core (Multithreading & Collections)",
        badge: "Enterprise",
        icon: "☕",
        langName: "Java 21",
        description: "Master OOP design principles, Streams API, concurrency, Collections framework, and JVM memory.",
        code: `// Java Streams & Lambdas Example\nimport java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = Arrays.asList("Alex", "Bob", "Charlie", "David");\n        List<String> filtered = names.stream()\n                                     .filter(n -> n.length() > 3)\n                                     .collect(Collectors.toList());\n        System.out.println("Long Names: " + filtered);\n    }\n}`
    },
    sql: {
        title: "SQL & Relational Databases",
        badge: "Database",
        icon: "🗄️",
        langName: "SQL (PostgreSQL / SQLite)",
        description: "Complex multi-table joins, subqueries, window functions, and indexing strategies.",
        code: `-- SQL Query Example\nSELECT \n    s.student_name,\n    COUNT(q.quiz_id) AS total_quizzes,\n    ROUND(AVG(q.score_pct), 2) AS average_score\nFROM students s\nJOIN quiz_results q ON s.student_id = q.student_id\nGROUP BY s.student_id, s.student_name\nHAVING AVG(q.score_pct) >= 80;`
    }
};

let activeDocKey = 'dbms';
let activeDocId = null;

// --- INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Protect Route
    if (typeof isUserLoggedIn !== 'function' || !isUserLoggedIn()) {
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
        return;
    }

    // 2. Initialize Backend Status & Health
    await checkBackendStatus();

    // 3. Initialize User Profile
    await initUserProfile();

    // 4. Setup Navigation & Dropdowns
    setupNavigation();
    setupDropdowns();
    setupLiveSearch();

    // 5. Initialize Page-Specific Components
    const path = window.location.pathname.toLowerCase();

    if (path.includes('courses.html')) {
        setupCodeStudio();
    } else if (path.includes('pdf-workspace.html')) {
        setupDedicatedPdfWorkspace();
    } else if (path.includes('quiz.html')) {
        setupDedicatedQuizPage();
    } else if (path.includes('analytics.html')) {
        setupDedicatedAnalyticsPage();
    } else if (path.includes('settings.html')) {
        setupDedicatedSettingsPage();
    } else {
        // Main Dashboard (dashboard.html)
        await loadDashboardData();
        setupQuizEngine();
        setupPdfWorkspace();
        setupCourseExplorer();
        setupSettingsModal();
    }

    // 6. Theme Toggle (Global)
    if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }
});

// --- BACKEND HEALTH STATUS CHECK ---
async function checkBackendStatus() {
    const badge = document.getElementById('backendStatusBadge');
    const text = document.getElementById('backendStatusText');

    if (window.api && typeof window.api.checkHealth === 'function') {
        const isOnline = await window.api.checkHealth();
        if (badge && text) {
            if (isOnline) {
                badge.classList.remove('offline');
                text.textContent = 'API Connected';
            } else {
                badge.classList.add('offline');
                text.textContent = 'Local Mode';
            }
        }
    }
}

// --- USER PROFILE INITIALIZATION ---
async function initUserProfile() {
    let user = typeof getCurrentUser === 'function' ? getCurrentUser() : { name: 'Student', email: 'student@example.com' };

    if (window.api && typeof window.api.auth?.getMe === 'function') {
        try {
            const meRes = await window.api.auth.getMe();
            if (meRes && meRes.success && meRes.user) {
                user = meRes.user;
                localStorage.setItem('ai_study_user_name', user.name);
                localStorage.setItem('ai_study_user_email', user.email);
            }
        } catch (e) {}
    }

    const firstLetter = (user.name || 'S').charAt(0).toUpperCase();

    // Populate all user name & email elements across pages
    document.querySelectorAll('#topNavUserName, #sidebarUserName, #menuUserName, #settingsProfileNameDisplay').forEach(el => {
        el.textContent = user.name;
    });

    document.querySelectorAll('#menuUserEmail, #settingsProfileEmailDisplay').forEach(el => {
        el.textContent = user.email;
    });

    const welcomeGreeting = document.getElementById('welcomeGreeting');
    if (welcomeGreeting) welcomeGreeting.textContent = `Welcome back, ${user.name}! 👋`;

    document.querySelectorAll('#topNavAvatar, #sidebarAvatar, #menuAvatar, #settingsAvatarPreview').forEach(av => {
        av.textContent = firstLetter;
    });
}

// --- NAVIGATION & DROPDOWNS ---
function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // Logout
    const handleLogout = (e) => {
        e.preventDefault();
        if (typeof logoutUser === 'function') logoutUser();
    };

    document.querySelectorAll('#logoutBtn, #menuLogoutBtn, #settingsSignOutBtn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            closeAllDropdowns();
            closeAllModals();
        }
    });
}

function setupDropdowns() {
    const notifBtn = document.getElementById('notificationBtn');
    const notifDropdown = document.getElementById('notificationDropdown');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const unreadBadge = document.getElementById('unreadBadge');
    const profileThemeToggle = document.getElementById('profileThemeToggle');

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = notifDropdown.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) notifDropdown.classList.add('active');
        });
    }

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = profileDropdown.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) profileDropdown.classList.add('active');
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async () => {
            document.querySelectorAll('#notificationList li.unread').forEach(item => item.classList.remove('unread'));
            if (unreadBadge) unreadBadge.style.display = 'none';

            if (window.api && typeof window.api.dashboard?.markNotificationsRead === 'function') {
                try { await window.api.dashboard.markNotificationsRead(); } catch (e) {}
            }

            if (typeof showToast === 'function') showToast('All notifications marked as read', 'info');
        });
    }

    if (profileThemeToggle) {
        profileThemeToggle.addEventListener('click', () => {
            const themeBtn = document.getElementById('themeToggleBtn');
            if (themeBtn) themeBtn.click();
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-wrapper')) {
            closeAllDropdowns();
        }
    });

    // Load initial notifications
    loadNotifications();
}

async function loadNotifications() {
    if (window.api && typeof window.api.dashboard?.getNotifications === 'function') {
        try {
            const res = await window.api.dashboard.getNotifications();
            if (res && res.success) {
                const badge = document.getElementById('unreadBadge');
                const list = document.getElementById('notificationList');

                if (badge) {
                    if (res.unread_count > 0) {
                        badge.style.display = 'flex';
                        badge.textContent = res.unread_count;
                    } else {
                        badge.style.display = 'none';
                    }
                }

                if (list && Array.isArray(res.notifications)) {
                    list.innerHTML = '';
                    res.notifications.forEach(n => {
                        const li = document.createElement('li');
                        if (n.is_unread) li.classList.add('unread');
                        li.innerHTML = `
                            <div class="notif-icon">${n.icon || '🔔'}</div>
                            <div class="notif-body">
                                <p><strong>${escapeHtml(n.title)}</strong> ${escapeHtml(n.message)}</p>
                                <span class="notif-time">${escapeHtml(n.time_ago || 'Recently')}</span>
                            </div>
                        `;
                        list.appendChild(li);
                    });
                }
            }
        } catch (e) {}
    }
}

function setupLiveSearch() {
    const searchInput = document.getElementById('dashboardSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        // Filter cards/items on current page
        document.querySelectorAll('.quiz-card, .progress-item, .module-nav-item, #activityList li').forEach(item => {
            const terms = (item.getAttribute('data-search') || '') + ' ' + item.textContent.toLowerCase();
            item.style.display = !query || terms.includes(query) ? (item.classList.contains('quiz-card') ? 'flex' : '') : 'none';
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
}

function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

// =========================================================================
// PAGE 1: COURSES & LIVE CODE STUDIO (courses.html)
// =========================================================================
function setupCodeStudio() {
    const trackItems = document.querySelectorAll('#courseTrackSelector .module-nav-item');
    const editor = document.getElementById('codeEditorInput');
    const templateSelect = document.getElementById('codeTemplateSelect');
    const runBtn = document.getElementById('runCodeStudioBtn');
    const resetBtn = document.getElementById('resetCodeBtn');
    const terminalOutput = document.getElementById('codeTerminalOutput');
    const terminalStatus = document.getElementById('terminalStatus');

    let currentTrack = 'python';

    function loadTrack(trackKey) {
        currentTrack = trackKey;
        const data = COURSE_TEMPLATES[trackKey] || COURSE_TEMPLATES.python;

        const titleEl = document.getElementById('lessonTitle');
        const badgeEl = document.getElementById('lessonBadge');
        const descEl = document.getElementById('lessonDesc');
        const iconEl = document.getElementById('editorLangIcon');
        const langNameEl = document.getElementById('editorLangName');

        if (titleEl) titleEl.textContent = data.title;
        if (badgeEl) badgeEl.textContent = data.badge;
        if (descEl) descEl.textContent = data.description;
        if (iconEl) iconEl.textContent = data.icon;
        if (langNameEl) langNameEl.textContent = data.langName;

        if (editor) editor.value = data.code;
        if (terminalStatus) {
            terminalStatus.textContent = 'Ready';
            terminalStatus.style.color = '#10b981';
        }
        if (terminalOutput) terminalOutput.textContent = `Click "▶ Run Code" to execute ${data.langName} on the backend engine...`;
    }

    trackItems.forEach(item => {
        item.addEventListener('click', () => {
            trackItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const key = item.getAttribute('data-course') || 'python';
            loadTrack(key);
        });
    });

    if (templateSelect) {
        templateSelect.addEventListener('change', () => {
            const val = templateSelect.value;
            const data = COURSE_TEMPLATES[currentTrack] || COURSE_TEMPLATES.python;
            if (data.templates && data.templates[val] !== undefined) {
                if (editor) editor.value = data.templates[val];
            } else if (val === 'custom') {
                if (editor) editor.value = `# Write custom ${data.langName} code here:\n\n`;
            } else {
                if (editor) editor.value = data.code;
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const data = COURSE_TEMPLATES[currentTrack] || COURSE_TEMPLATES.python;
            if (editor) editor.value = data.code;
            if (typeof showToast === 'function') showToast('Code reset to default', 'info');
        });
    }

    if (runBtn && editor && terminalOutput) {
        runBtn.addEventListener('click', async () => {
            const codeToRun = editor.value;
            if (!codeToRun.trim()) {
                if (typeof showToast === 'function') showToast('Please write code before running', 'error');
                return;
            }

            if (terminalStatus) {
                terminalStatus.textContent = 'Executing...';
                terminalStatus.style.color = '#f59e0b';
            }
            terminalOutput.textContent = 'Sending code to backend execution engine...';
            runBtn.disabled = true;

            if (window.api && typeof window.api.courses?.runCode === 'function') {
                try {
                    const res = await window.api.courses.runCode(currentTrack, codeToRun);
                    terminalOutput.textContent = res.output || 'Process executed successfully with no output.';
                    if (terminalStatus) {
                        terminalStatus.textContent = `Completed in ${res.execution_time || '0.12s'}`;
                        terminalStatus.style.color = '#10b981';
                    }
                    if (typeof showToast === 'function') showToast('Execution finished!', 'success');
                } catch (err) {
                    terminalOutput.textContent = `Execution Error:\n${err.message}`;
                    if (terminalStatus) {
                        terminalStatus.textContent = 'Failed';
                        terminalStatus.style.color = '#ef4444';
                    }
                }
            } else {
                setTimeout(() => {
                    terminalOutput.textContent = `Average: 88.5% (Pass)\nProcess finished with exit code 0`;
                    if (terminalStatus) terminalStatus.textContent = 'Finished (Sandbox)';
                }, 300);
            }

            runBtn.disabled = false;
        });
    }

    // Initial load
    loadTrack('python');
}

// =========================================================================
// PAGE 2: DEDICATED PDF & AI STUDY WORKSPACE (pdf-workspace.html)
// =========================================================================
function setupDedicatedPdfWorkspace() {
    const docChips = document.querySelectorAll('#docChipsList .doc-chip');
    const dropZone = document.getElementById('pdfDropZone');
    const fileInput = document.getElementById('pdfFileInput');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const chatForm = document.getElementById('pdfChatForm');
    const chatInput = document.getElementById('pdfChatInput');
    const chatMessages = document.getElementById('pdfChatMessages');
    const flashcards = document.querySelectorAll('.flashcard-item');
    const refreshFlashcardsBtn = document.getElementById('refreshFlashcardsBtn');

    docChips.forEach(chip => {
        chip.addEventListener('click', () => {
            docChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeDocKey = chip.getAttribute('data-doc') || 'dbms';
            if (typeof showToast === 'function') showToast(`Active document: ${chip.textContent.trim()}`, 'info');
        });
    });

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                dropZone.querySelector('p strong').textContent = `Uploading: ${file.name}...`;

                if (window.api && typeof window.api.pdf?.uploadDocument === 'function') {
                    try {
                        const res = await window.api.pdf.uploadDocument(file);
                        if (res && res.success && res.document) {
                            const doc = res.document;
                            activeDocKey = doc.doc_key;
                            activeDocId = doc.id;
                            dropZone.querySelector('p strong').textContent = `Loaded: ${doc.file_name} (${doc.page_count} pages)`;

                            if (doc.summary_bullets && doc.summary_bullets.length > 0) {
                                const list = document.getElementById('docSummaryBullets');
                                if (list) {
                                    list.replaceChildren();
                                    doc.summary_bullets.forEach(bullet => {
                                        const item = document.createElement('li');
                                        item.textContent = String(bullet);
                                        list.appendChild(item);
                                    });
                                }
                            }

                            appendPdfMsg('ai', `I have indexed ${doc.file_name}. Ask me any technical question or request a summary!`);
                            if (typeof showToast === 'function') showToast(`AI indexed ${doc.file_name}!`, 'success');
                            return;
                        }
                    } catch (err) {}
                }

                dropZone.querySelector('p strong').textContent = `Loaded: ${file.name}`;
                appendPdfMsg('ai', `The file ${file.name} was selected. Connect the backend to extract and index its contents, then ask questions about it.`);
            }
        });
    }

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            if (query) {
                appendPdfMsg('user', query);
                processAiQuery(query);
            }
        });
    });

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            appendPdfMsg('user', text);
            chatInput.value = '';
            processAiQuery(text);
        });
    }

    function appendPdfMsg(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        const content = document.createElement('div');
        content.className = 'msg-content';
        const paragraph = document.createElement('p');
        paragraph.textContent = String(text ?? '');
        paragraph.style.whiteSpace = 'pre-line';
        content.appendChild(paragraph);
        msgDiv.append(avatar, content);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function processAiQuery(query) {
        if (window.api && typeof window.api.pdf?.chat === 'function') {
            try {
                const res = await window.api.pdf.chat(query, activeDocKey, activeDocId);
                if (res && res.success && res.answer) {
                    appendPdfMsg('ai', res.answer);
                    return;
                }
            } catch (e) {}
        }

        setTimeout(() => {
            appendPdfMsg('ai', 'The AI backend is not connected, so I cannot answer from your document yet. Start the FastAPI server and configure API_BASE_URL to enable document-grounded answers.');
        }, 250);
    }

    // Flashcards click to reveal
    document.querySelectorAll('.flashcard-item').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('revealed');
        });
    });

    if (refreshFlashcardsBtn) {
        refreshFlashcardsBtn.addEventListener('click', async () => {
            if (window.api && typeof window.api.pdf?.generateQuiz === 'function') {
                try {
                    const res = await window.api.pdf.generateQuiz(activeDocKey, activeDocId);
                    if (res && res.success && Array.isArray(res.questions)) {
                        const deck = document.getElementById('flashcardDeck');
                        if (deck) {
                            deck.innerHTML = res.questions.map(q => `
                                <div class="flashcard-item">
                                    <span class="flashcard-hint">💡 Tap to reveal answer</span>
                                    <div class="flashcard-q">${escapeHtml(q.question)}</div>
                                    <div class="flashcard-a"><strong>Answer:</strong> ${escapeHtml(q.answer)}</div>
                                </div>
                            `).join('');

                            deck.querySelectorAll('.flashcard-item').forEach(c => {
                                c.addEventListener('click', () => c.classList.toggle('revealed'));
                            });

                            if (typeof showToast === 'function') showToast('New flashcards generated!', 'success');
                        }
                    }
                } catch (e) {}
            }
        });
    }
}

// =========================================================================
// PAGE 3: SKILLS ASSESSMENT & PRACTICE HUB (quiz.html)
// =========================================================================
function setupDedicatedQuizPage() {
    const filterBtns = document.querySelectorAll('#quizFilterBar .quiz-filter-btn');
    const quizCards = document.querySelectorAll('#quizCardsGrid .quiz-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter') || 'all';

            quizCards.forEach(card => {
                const diff = card.getAttribute('data-diff') || 'all';
                card.style.display = (filter === 'all' || diff === filter) ? 'flex' : 'none';
            });
        });
    });

    // Attach quiz modal engine
    setupQuizEngine();

    // Load Quiz History from backend
    loadQuizHistory();
}

async function loadQuizHistory() {
    const tbody = document.getElementById('quizHistoryTableBody');
    if (!tbody) return;

    let history = [];
    if (window.api && typeof window.api.quiz?.getHistory === 'function') {
        try {
            const res = await window.api.quiz.getHistory();
            if (res && res.success && Array.isArray(res.history)) history = res.history;
        } catch (error) {
            console.info('Showing this device’s quiz history because the backend is unavailable.');
        }
    }

    // The local copy keeps the prototype useful before a backend/database is connected.
    if (!history.length) history = getLocalQuizHistory();
    tbody.replaceChildren();

    if (!history.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'quiz-history-empty';
        cell.textContent = 'No quiz attempts yet. Complete a quiz to see your progress here.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    history.slice().sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).forEach(item => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border)';
        const scorePct = Math.max(0, Math.min(100, Number(item.score_pct) || 0));
        const badgeClass = scorePct >= 80 ? 'badge-easy' : scorePct >= 50 ? 'badge-medium' : 'badge-hard';
        const title = item.topic_title || item.topic_id || item.topic || 'Skills Quiz';
        const score = Number(item.score) || 0;
        const total = Number(item.total_questions) || 0;
        const time = Number(item.time_spent_sec) || 0;
        row.innerHTML = `
            <td style="padding: 0.75rem 1rem;">📝 ${escapeHtml(title)}</td>
            <td style="padding: 0.75rem 1rem;">${score} / ${total}</td>
            <td style="padding: 0.75rem 1rem;"><span class="badge ${badgeClass}">${scorePct}%</span></td>
            <td style="padding: 0.75rem 1rem;">${time}s</td>
            <td style="padding: 0.75rem 1rem; color: var(--text-muted);">${formatTimeAgo(item.created_at)}</td>
        `;
        tbody.appendChild(row);
    });
}

function getLocalQuizHistory() {
    const email = (localStorage.getItem('ai_study_user_email') || 'guest').toLowerCase();
    try {
        const all = JSON.parse(localStorage.getItem('ai_study_quiz_history') || '{}');
        return Array.isArray(all[email]) ? all[email] : [];
    } catch (error) {
        return [];
    }
}

function saveLocalQuizResult(result) {
    const email = (localStorage.getItem('ai_study_user_email') || 'guest').toLowerCase();
    try {
        const all = JSON.parse(localStorage.getItem('ai_study_quiz_history') || '{}');
        const history = Array.isArray(all[email]) ? all[email] : [];
        history.push(result);
        all[email] = history.slice(-100);
        localStorage.setItem('ai_study_quiz_history', JSON.stringify(all));
    } catch (error) {
        console.warn('Could not save local quiz progress.', error);
    }
}

function normalizeQuizQuestion(question, index) {
    const source = question || {};
    const options = Array.isArray(source.options) ? source.options : Array.isArray(source.choices) ? source.choices : [];
    let correct = source.correct ?? source.correct_index ?? source.correct_answer_index;
    if (typeof correct === 'string' && /^\d+$/.test(correct)) correct = Number(correct);
    if (!Number.isInteger(correct) && typeof source.correct_answer === 'string') {
        correct = options.findIndex(option => String(option) === source.correct_answer);
    }
    return {
        ...source,
        id: source.id ?? index,
        q: source.q || source.question || source.text || `Question ${index + 1}`,
        options,
        correct: Number.isInteger(correct) && correct >= 0 && correct < options.length ? correct : null,
        explanation: source.explanation || source.explanation_text || ''
    };
}

// =========================================================================
// PAGE 4: LEARNING ANALYTICS & PROGRESS HUB (analytics.html)
// =========================================================================
async function setupDedicatedAnalyticsPage() {
    if (!window.api) return;

    try {
        const res = await window.api.dashboard.getAnalytics();
        if (res && res.success && res.analytics) {
            const a = res.analytics;
            
            const hoursEl = document.getElementById('analyticsTotalHours');
            const skillsEl = document.getElementById('analyticsSkillsAvg');
            const quizEl = document.getElementById('analyticsQuizAvg');
            const streakEl = document.getElementById('analyticsStreak');

            if (hoursEl) hoursEl.textContent = `${a.total_hours.toFixed(1)} hrs`;
            if (skillsEl) skillsEl.textContent = `${a.skills_mastery_avg}%`;
            if (quizEl) quizEl.textContent = `${a.quiz_accuracy_avg}%`;
            if (streakEl) streakEl.textContent = `${a.streak_days} days`;

            // Render Weekly Bars
            const chartContainer = document.getElementById('weeklyChartBars');
            if (chartContainer && Array.isArray(a.weekly_distribution)) {
                chartContainer.innerHTML = '';
                const maxH = Math.max(...a.weekly_distribution.map(d => d.hours), 3.0);
                a.weekly_distribution.forEach(d => {
                    const heightPct = Math.round((d.hours / maxH) * 100);
                    const col = document.createElement('div');
                    col.className = 'chart-column';
                    col.innerHTML = `
                        <div class="chart-bar-fill" style="height: ${heightPct}%;" data-val="${d.hours}h"></div>
                        <span class="chart-day-label">${d.day}</span>
                    `;
                    chartContainer.appendChild(col);
                });
            }

            // Render Streak Heatmap
            const heatmap = document.getElementById('streakHeatmap');
            if (heatmap) {
                heatmap.innerHTML = '';
                for (let i = 1; i <= 28; i++) {
                    const dot = document.createElement('div');
                    const intensity = i > 21 ? '#10B981' : i > 14 ? 'rgba(16, 185, 129, 0.6)' : i % 3 === 0 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)';
                    dot.style.cssText = `height: 28px; border-radius: 6px; background: ${intensity}; display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 600; color: #fff;`;
                    dot.textContent = i;
                    heatmap.appendChild(dot);
                }
            }
        }
    } catch (e) {}
}

// =========================================================================
// PAGE 5: SETTINGS & PROFILE PREFERENCES (settings.html)
// =========================================================================
function setupDedicatedSettingsPage() {
    const nameInput = document.getElementById('settingsName');
    const emailInput = document.getElementById('settingsEmail');
    const weeklyHoursInput = document.getElementById('settingsWeeklyHours');
    const profileForm = document.getElementById('profileSettingsForm');
    const saveGoalsBtn = document.getElementById('saveGoalsBtn');
    const themeSelectBtns = document.querySelectorAll('.theme-select-btn');
    const exportBtn = document.getElementById('exportDataBtn');

    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : { name: 'Student', email: 'student@example.com' };
    if (nameInput) nameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;

    if (profileForm && nameInput) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = nameInput.value.trim();
            if (!newName) return;

            localStorage.setItem('ai_study_user_name', newName);

            if (window.api && typeof window.api.auth?.updateProfile === 'function') {
                try {
                    await window.api.auth.updateProfile({ name: newName });
                } catch (err) {}
            }

            await initUserProfile();
            if (typeof showToast === 'function') showToast('Profile details updated!', 'success');
        });
    }

    if (saveGoalsBtn && weeklyHoursInput) {
        saveGoalsBtn.addEventListener('click', async () => {
            const hours = Number(weeklyHoursInput.value) || 15;
            if (window.api && typeof window.api.auth?.updateProfile === 'function') {
                try {
                    await window.api.auth.updateProfile({ study_target_hours: hours });
                } catch (e) {}
            }
            if (typeof showToast === 'function') showToast(`Weekly target updated to ${hours} hours!`, 'success');
        });
    }

    themeSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeVal = btn.getAttribute('data-theme-val');
            document.documentElement.setAttribute('data-theme', themeVal);
            localStorage.setItem('ai_study_theme', themeVal);
            if (typeof updateThemeIcon === 'function') updateThemeIcon(themeVal);
            if (typeof showToast === 'function') showToast(`Switched to ${themeVal} mode`, 'info');
        });
    });

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = {
                user: getCurrentUser(),
                theme: localStorage.getItem('ai_study_theme') || 'light',
                exportDate: new Date().toISOString(),
                stats: { study_hours: 12.5, streak: 7, quiz_avg: 82 }
            };
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `study_ai_export_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            if (typeof showToast === 'function') showToast('Study data exported successfully!', 'success');
        });
    }
}

// =========================================================================
// GLOBAL MODALS & QUIZ ENGINE (Used across dashboard.html and quiz.html)
// =========================================================================
function setupQuizEngine() {
    const quizModal = document.getElementById('quizModal');
    const closeQuizModal = document.getElementById('closeQuizModal');
    const quitQuizBtn = document.getElementById('quitQuizBtn');
    const quizNextBtn = document.getElementById('quizNextBtn');
    const quizTriggers = document.querySelectorAll('.start-quiz-trigger');

    if (!quizModal) return;

    let currentTopic = 'python';
    let currentQuestions = [];
    let currentIndex = 0;
    let userAnswers = {};
    let localScore = 0;
    let timerInterval = null;
    let timeRemaining = 120;
    let quizFinished = false;
    let hasUnscoredQuestions = false;
    let quizStartedAt = null;
    let activeTopicTitle = 'Skills Quiz';

    quizTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.getAttribute('data-topic') || 'python';
            startQuiz(topic);
        });
    });

    async function startQuiz(topicKey) {
        currentTopic = topicKey;
        userAnswers = {};
        localScore = 0;
        currentIndex = 0;
        timeRemaining = 120;
        quizFinished = false;
        hasUnscoredQuestions = false;

        let topicTitle = topicKey.toUpperCase() + ' Quiz';
        let topicBadge = 'Assessment';

        if (window.api && typeof window.api.quiz?.getQuestions === 'function') {
            try {
                const res = await window.api.quiz.getQuestions(topicKey);
                if (res && res.success && Array.isArray(res.questions) && res.questions.length > 0) {
                    currentQuestions = res.questions.map((question, index) => normalizeQuizQuestion(question, index));
                    topicTitle = res.topic?.title || topicTitle;
                    topicBadge = res.topic?.badge || topicBadge;
                } else {
                    useFallbackQuestions(topicKey);
                }
            } catch (e) {
                useFallbackQuestions(topicKey);
            }
        } else {
            useFallbackQuestions(topicKey);
        }

        activeTopicTitle = topicTitle;
        quizStartedAt = Date.now();
        const titleEl = document.getElementById('quizModalTitle');
        const badgeEl = document.getElementById('quizTopicBadge');
        if (titleEl) titleEl.textContent = topicTitle;
        if (badgeEl) badgeEl.textContent = topicBadge;

        const qView = document.getElementById('quizQuestionView');
        const rView = document.getElementById('quizResultsView');
        const footer = document.getElementById('quizModalFooter');

        if (qView) qView.style.display = 'block';
        if (rView) rView.style.display = 'none';
        if (footer) footer.style.display = 'flex';
        if (quizNextBtn) {
            quizNextBtn.textContent = 'Next Question →';
            quizNextBtn.disabled = true;
        }

        startTimer();
        renderQuestion();
        quizModal.classList.add('active');
    }

    function useFallbackQuestions(topicKey) {
        const topicData = FALLBACK_QUIZ_DATA[topicKey] || FALLBACK_QUIZ_DATA.python;
        currentQuestions = topicData.questions;
        const titleEl = document.getElementById('quizModalTitle');
        const badgeEl = document.getElementById('quizTopicBadge');
        if (titleEl) titleEl.textContent = topicData.title;
        if (badgeEl) badgeEl.textContent = topicData.badge;
    }

    function startTimer() {
        clearInterval(timerInterval);
        const timerEl = document.getElementById('quizTimer');
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
            const secs = String(timeRemaining % 60).padStart(2, '0');
            if (timerEl) timerEl.textContent = `⏱️ ${mins}:${secs}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                finishQuiz();
            }
        }, 1000);
    }

    function renderQuestion() {
        const qData = currentQuestions[currentIndex];
        const counterEl = document.getElementById('quizQuestionCounter');
        const fillEl = document.getElementById('quizProgressFill');
        const textEl = document.getElementById('quizQuestionText');
        const optionsContainer = document.getElementById('quizOptionsContainer');
        const feedbackBox = document.getElementById('quizFeedbackBox');

        if (counterEl) counterEl.textContent = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
        if (fillEl) fillEl.style.width = `${((currentIndex + 1) / currentQuestions.length) * 100}%`;
        if (textEl) textEl.textContent = qData.q;
        if (feedbackBox) {
            feedbackBox.style.display = 'none';
            feedbackBox.innerHTML = '';
        }
        if (quizNextBtn) quizNextBtn.disabled = true;

        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            qData.options.forEach((optText, index) => {
                const optBtn = document.createElement('button');
                optBtn.className = 'quiz-option-btn';
                optBtn.innerHTML = `<span><strong>${String.fromCharCode(65 + index)}.</strong></span> <span>${escapeHtml(optText)}</span>`;
                optBtn.addEventListener('click', () => handleAnswerSelection(index, qData));
                optionsContainer.appendChild(optBtn);
            });
        }
    }

    function handleAnswerSelection(selectedIndex, qData) {
        document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);
        userAnswers[qData.id || currentIndex] = selectedIndex;

        const correctIndex = Number.isInteger(qData.correct) ? qData.correct : null;
        if (correctIndex === null) hasUnscoredQuestions = true;
        const isCorrect = correctIndex !== null && selectedIndex === correctIndex;
        if (isCorrect) localScore++;

        const optBtns = document.querySelectorAll('.quiz-option-btn');
        if (optBtns[selectedIndex]) optBtns[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (correctIndex !== null && !isCorrect && optBtns[correctIndex]) {
            optBtns[correctIndex].classList.add('correct');
        }

        const feedbackBox = document.getElementById('quizFeedbackBox');
        if (feedbackBox) {
            feedbackBox.style.display = 'block';
            feedbackBox.style.backgroundColor = isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)';
            feedbackBox.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
            const expl = qData.explanation || (isCorrect ? 'Correct choice!' : 'Review this question.');
            if (correctIndex === null) {
                feedbackBox.style.backgroundColor = 'var(--surface-muted, var(--border))';
                feedbackBox.style.color = 'var(--text-primary)';
                feedbackBox.innerHTML = `<strong>📝 Answer recorded.</strong> Final scoring requires the connected backend.`;
            } else {
                feedbackBox.innerHTML = `<strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong> ${escapeHtml(expl)}`;
            }
        }

        if (quizNextBtn) {
            quizNextBtn.disabled = false;
            if (currentIndex === currentQuestions.length - 1) {
                quizNextBtn.textContent = 'Submit & View Results 🏆';
            }
        }
    }

    if (quizNextBtn) {
        quizNextBtn.addEventListener('click', () => {
            if (currentIndex < currentQuestions.length - 1) {
                currentIndex++;
                renderQuestion();
            } else {
                finishQuiz();
            }
        });
    }

    async function finishQuiz() {
        if (quizFinished || !currentQuestions.length) return;
        quizFinished = true;
        clearInterval(timerInterval);
        const qView = document.getElementById('quizQuestionView');
        const rView = document.getElementById('quizResultsView');

        if (qView) qView.style.display = 'none';
        if (rView) rView.style.display = 'flex';

        const timeSpent = Math.max(0, Math.round((Date.now() - (quizStartedAt || Date.now())) / 1000));
        let finalScorePct = Math.round((localScore / currentQuestions.length) * 100);
        let finalScoreFraction = `${localScore} / ${currentQuestions.length} Correct`;

        let savedOnServer = false;
        if (window.api && typeof window.api.quiz?.submitQuiz === 'function') {
            try {
                const subRes = await window.api.quiz.submitQuiz(currentTopic, userAnswers, timeSpent);
                if (subRes && subRes.success) {
                    savedOnServer = true;
                    finalScorePct = Number(subRes.score_pct ?? finalScorePct);
                    finalScoreFraction = `${subRes.score} / ${subRes.total_questions} Correct`;
                    if (subRes.feedback_title) {
                        const t = document.getElementById('resultTitle');
                        if (t) t.textContent = subRes.feedback_title;
                    }
                    if (subRes.feedback_message) {
                        const f = document.getElementById('resultFeedbackText');
                        if (f) f.textContent = subRes.feedback_message;
                    }
                    if (typeof loadDashboardData === 'function') loadDashboardData();
                    if (typeof loadQuizHistory === 'function') loadQuizHistory();
                }
            } catch (e) { console.warn('Quiz result could not be saved to the backend; saving local progress instead.', e); }
        }

        const scoreKnown = savedOnServer || !hasUnscoredQuestions;
        if (scoreKnown) {
            saveLocalQuizResult({
                topic_id: currentTopic, topic_title: activeTopicTitle, score: Math.round((finalScorePct / 100) * currentQuestions.length),
                total_questions: currentQuestions.length, score_pct: finalScorePct, time_spent_sec: timeSpent,
                created_at: new Date().toISOString(), source: savedOnServer ? 'synced' : 'local'
            });
        } else {
            finalScoreFraction = 'Server scoring unavailable offline';
        }

        const scorePctEl = document.getElementById('resultScorePct');
        const fractionEl = document.getElementById('resultScoreFraction');
        const accEl = document.getElementById('resultAccuracy');
        const timeEl = document.getElementById('resultTimeTaken');

        if (scorePctEl) scorePctEl.textContent = scoreKnown ? `${finalScorePct}%` : '—';
        if (fractionEl) fractionEl.textContent = finalScoreFraction;
        if (accEl) accEl.textContent = scoreKnown ? `${finalScorePct}%` : '—';
        if (timeEl) timeEl.textContent = `${timeSpent}s`;

        if (typeof showToast === 'function') {
            if (scoreKnown) showToast(`Quiz submitted! Score: ${finalScorePct}%${savedOnServer ? '' : ' (saved on this device)'}`, 'success');
            else showToast('Quiz completed, but scoring requires the backend. This attempt was not added to score history.', 'error');
        }
        if (scoreKnown && typeof loadQuizHistory === 'function') loadQuizHistory();

        quizNextBtn.textContent = 'Finish';
        quizNextBtn.onclick = () => {
            quizModal.classList.remove('active');
            quizNextBtn.onclick = null;
        };
    }

    const closeQuiz = () => {
        clearInterval(timerInterval);
        quizModal.classList.remove('active');
    };

    if (closeQuizModal) closeQuizModal.addEventListener('click', closeQuiz);
    if (quitQuizBtn) quitQuizBtn.addEventListener('click', closeQuiz);
    quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) closeQuiz();
    });
}

// Helper methods for Dashboard fallback modals
function setupPdfWorkspace() {
    const pdfModal = document.getElementById('pdfModal');
    const openBtn = document.getElementById('openPdfWorkspaceBtn');
    const closeBtn = document.getElementById('closePdfModal');
    if (openBtn && pdfModal) openBtn.addEventListener('click', () => pdfModal.classList.add('active'));
    if (closeBtn && pdfModal) closeBtn.addEventListener('click', () => pdfModal.classList.remove('active'));
    if (pdfModal) pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) pdfModal.classList.remove('active'); });
}

function setupCourseExplorer() {
    const courseModal = document.getElementById('courseModal');
    const openBtn = document.getElementById('openCourseExplorerBtn');
    const closeBtn = document.getElementById('closeCourseModal');
    const closeBtn2 = document.getElementById('closeCourseBtn');
    if (openBtn && courseModal) openBtn.addEventListener('click', () => courseModal.classList.add('active'));
    if (closeBtn && courseModal) closeBtn.addEventListener('click', () => courseModal.classList.remove('active'));
    if (closeBtn2 && courseModal) closeBtn2.addEventListener('click', () => courseModal.classList.remove('active'));
}

function setupSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    const navBtn = document.getElementById('navSettingsBtn');
    const closeBtn = document.getElementById('closeSettingsModal');
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    if (navBtn && settingsModal) navBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    if (closeBtn && settingsModal) closeBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
    if (cancelBtn && settingsModal) cancelBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
}

async function loadDashboardData() {
    if (!window.api) return;

    try {
        const statsRes = await window.api.dashboard.getStats();
        if (statsRes && statsRes.success && statsRes.stats) {
            const s = statsRes.stats;
            const timeEl = document.getElementById('statStudyTime');
            const skillsEl = document.getElementById('statSkillsAvg');
            const quizEl = document.getElementById('statQuizAvg');
            const streakEl = document.getElementById('statStreak');

            if (timeEl) timeEl.textContent = s.study_time_formatted || `${s.study_time_hours} hrs`;
            if (skillsEl) skillsEl.textContent = s.skills_avg_formatted || `${s.skills_avg}%`;
            if (quizEl) quizEl.textContent = s.quiz_avg_formatted || `${s.quiz_avg}%`;
            if (streakEl) streakEl.textContent = s.streak_formatted || `${s.streak_days} days`;
        }
    } catch (e) {}

    // Show real local quiz results while the API/database is not connected.
    const localHistory = typeof getLocalQuizHistory === 'function' ? getLocalQuizHistory() : [];
    if (localHistory.length && !window.api?.isOnline) {
        const average = Math.round(localHistory.reduce((sum, item) => sum + (Number(item.score_pct) || 0), 0) / localHistory.length);
        const quizEl = document.getElementById('statQuizAvg');
        const skillsEl = document.getElementById('statSkillsAvg');
        if (quizEl) quizEl.textContent = `${average}%`;
        if (skillsEl) skillsEl.textContent = `${average}%`;
    }

    try {
        const actRes = await window.api.dashboard.getActivity();
        if (actRes && actRes.success && Array.isArray(actRes.activities)) {
            const listEl = document.getElementById('activityList');
            if (listEl) {
                listEl.innerHTML = '';
                actRes.activities.forEach(item => {
                    const li = document.createElement('li');
                    li.className = item.type || 'info';
                    li.innerHTML = `
                        <div class="act-details">
                            <strong>${escapeHtml(item.title)}</strong>
                            <span>${escapeHtml(item.subtitle)}</span>
                        </div>
                        <span class="act-time">${escapeHtml(item.time_ago || 'Recently')}</span>
                    `;
                    listEl.appendChild(li);
                });
            }
        }
    } catch (e) {}

    try {
        const checkRes = await window.api.dashboard.getChecklist();
        if (checkRes && checkRes.success && Array.isArray(checkRes.items)) {
            const container = document.getElementById('studyChecklist');
            if (container) {
                container.innerHTML = '';
                checkRes.items.forEach(item => {
                    const label = document.createElement('label');
                    label.className = 'checkbox-label check-task';
                    label.innerHTML = `
                        <input type="checkbox" ${item.is_completed ? 'checked' : ''} data-id="${item.id}">
                        <span>${escapeHtml(item.text)}</span>
                    `;
                    const checkbox = label.querySelector('input');
                    checkbox.addEventListener('change', async () => {
                        if (window.api && typeof window.api.dashboard?.updateChecklistItem === 'function') {
                            try {
                                await window.api.dashboard.updateChecklistItem(item.id, checkbox.checked);
                                if (typeof showToast === 'function') showToast(checkbox.checked ? 'Goal completed! 🎯' : 'Goal updated', 'info');
                            } catch (e) {}
                        }
                    });
                    container.appendChild(label);
                });
            }
        }
    } catch (e) {}
}

function formatTimeAgo(dateStr) {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}