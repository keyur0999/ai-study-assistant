/**
 * AI Study Assistant - Comprehensive Dashboard Module
 * Handles UI interactions, route protection, live search, quizzes, PDF assistant, and learning tracks.
 */

// --- DATA STRUCTURES ---

// Quiz Question Bank
const QUIZ_DATA = {
    python: {
        title: "🐍 Python Core & OOP Quiz",
        badge: "Medium",
        questions: [
            {
                q: "What will `print(type(lambda: None))` output in Python 3?",
                options: [
                    "<class 'function'>",
                    "<class 'lambda'>",
                    "<class 'NoneType'>",
                    "<class 'object'>"
                ],
                correct: 0,
                explanation: "Lambdas in Python are anonymous functions and instances of the standard `<class 'function'>` type."
            },
            {
                q: "Which of the following creates a shallow copy of a list `nums`?",
                options: [
                    "copy_nums = nums",
                    "copy_nums = nums[:]",
                    "copy_nums = nums.copy_deep()",
                    "copy_nums = nums.shallow()"
                ],
                correct: 1,
                explanation: "Slice notation `nums[:]` or `nums.copy()` creates a new shallow copy of the list."
            },
            {
                q: "What is the primary difference between a list and a tuple in Python?",
                options: [
                    "Lists can hold multiple types; tuples cannot",
                    "Lists are mutable; tuples are immutable",
                    "Tuples are indexed from 1; lists from 0",
                    "Tuples cannot be iterated with a for-loop"
                ],
                correct: 1,
                explanation: "Lists are mutable (can be modified in-place), while tuples are immutable fixed sequences."
            },
            {
                q: "In Python, which dunder method is invoked by the `len()` function?",
                options: [
                    "__size__()",
                    "__count__()",
                    "__len__()",
                    "__length__()"
                ],
                correct: 2,
                explanation: "The `__len__()` method is called when `len(obj)` is executed on an object."
            },
            {
                q: "What does the `@property` decorator achieve on a class method?",
                options: [
                    "Makes the method private",
                    "Allows the method to be accessed like an attribute without parentheses",
                    "Caches the method return value permanently",
                    "Converts the method to a static method"
                ],
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
                options: [
                    "std::shared_ptr",
                    "std::unique_ptr",
                    "std::weak_ptr",
                    "std::auto_ptr"
                ],
                correct: 1,
                explanation: "`std::unique_ptr` ensures single, non-copyable ownership of a dynamically allocated object."
            },
            {
                q: "What is the worst-case time complexity of lookup in `std::unordered_map`?",
                options: [
                    "O(1)",
                    "O(log N)",
                    "O(N)",
                    "O(N log N)"
                ],
                correct: 2,
                explanation: "While average lookup is O(1), worst-case lookup is O(N) due to hash collisions."
            },
            {
                q: "What happens if a class with virtual functions lacks a virtual destructor?",
                options: [
                    "Compilation error",
                    "Undefined behavior / memory leak when deleting derived objects via base pointer",
                    "Virtual function table (vtable) is disabled",
                    "Multiple inheritance is prohibited"
                ],
                correct: 1,
                explanation: "Deleting a derived class object through a base pointer with a non-virtual destructor causes undefined behavior."
            },
            {
                q: "Which keyword prevents a virtual function from being overridden in a derived class?",
                options: [
                    "const",
                    "override",
                    "final",
                    "sealed"
                ],
                correct: 2,
                explanation: "`final` specifies that a virtual function cannot be overridden in a child class."
            },
            {
                q: "What is RAII in modern C++?",
                options: [
                    "Random Array Index Iterator",
                    "Resource Acquisition Is Initialization",
                    "Reference Allocation In Instance",
                    "Runtime Address Identification Interface"
                ],
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
                options: [
                    "WHERE",
                    "HAVING",
                    "ORDER BY",
                    "FILTER"
                ],
                correct: 1,
                explanation: "`HAVING` filters aggregated group results, whereas `WHERE` filters individual rows before grouping."
            },
            {
                q: "What does the 'I' in ACID database transactions stand for?",
                options: [
                    "Indexation",
                    "Integrity",
                    "Isolation",
                    "Iteration"
                ],
                correct: 2,
                explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
            },
            {
                q: "Which JOIN returns all rows from the left table and matching rows from the right table?",
                options: [
                    "INNER JOIN",
                    "FULL OUTER JOIN",
                    "LEFT JOIN",
                    "CROSS JOIN"
                ],
                correct: 2,
                explanation: "A `LEFT JOIN` returns all records from the left table and matched records from the right table (or NULL)."
            },
            {
                q: "What is the primary function of a database Index (e.g., B-Tree)?",
                options: [
                    "Encrypt table columns",
                    "Accelerate data search and retrieval speed",
                    "Enforce foreign key cascade rules",
                    "Automatically backup table data"
                ],
                correct: 1,
                explanation: "Indexes speed up data retrieval operations at the cost of additional storage and write overhead."
            },
            {
                q: "Which command permanently deletes a table structure along with its data?",
                options: [
                    "DELETE TABLE",
                    "TRUNCATE TABLE",
                    "DROP TABLE",
                    "REMOVE TABLE"
                ],
                correct: 2,
                explanation: "`DROP TABLE` removes both the table definition and all its stored rows permanently."
            }
        ]
    }
};

// Course Tracks Data
const COURSE_MODULES = {
    python: {
        title: "Python 3.12 - Modern Foundations",
        description: "Master clean code, functions, list comprehensions, decorators, and object-oriented paradigms.",
        code: `# Interactive Python Example
def calculate_grade(scores):
    average = sum(scores) / len(scores)
    status = "Pass" if average >= 75 else "Needs Improvement"
    return f"Average: {average:.1f}% ({status})"

student_scores = [88, 92, 79, 95]
print(calculate_grade(student_scores))`,
        output: `Average: 88.5% (Pass)\nProcess finished with exit code 0`
    },
    c: {
        title: "C Programming - Memory & Pointers",
        description: "Deep dive into pointer arithmetic, stack vs heap allocation with malloc/free, and structs.",
        code: `// C Pointer Manipulation
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("Swapped: x=%d, y=%d\\n", x, y);
    return 0;
}`,
        output: `Swapped: x=20, y=10\nProcess finished with exit code 0`
    },
    cpp: {
        title: "C++ Modern Standards & STL",
        description: "Master std::vector, std::map, lambda expressions, RAII, and smart pointers.",
        code: `// Modern C++ STL Algorithms
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 9, 1, 7};
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted: ";
    for(int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    return 0;
}`,
        output: `Sorted: 1 2 5 7 9 \nProcess finished with exit code 0`
    },
    sql: {
        title: "SQL & Relational DB Systems",
        description: "Complex multi-table joins, subqueries, window functions, and indexing strategies.",
        code: `-- SQL Query Example
SELECT 
    s.student_name,
    COUNT(q.quiz_id) AS total_quizzes,
    ROUND(AVG(q.score_pct), 2) AS average_score
FROM students s
JOIN quiz_results q ON s.student_id = q.student_id
GROUP BY s.student_id, s.student_name
HAVING AVG(q.score_pct) >= 80;`,
        output: `student_name | total_quizzes | average_score\nAlex Morgan  | 8             | 86.50%\n(1 row affected)`
    }
};

// Document AI Pre-canned Responses
const AI_RESPONSES = {
    acid: "The **ACID** properties guarantee reliable database transactions:\n\n1. **Atomicity:** All operations succeed or none do (All-or-Nothing). Example: In an ATM transfer, debiting Account A and crediting Account B must either both happen or both fail.\n2. **Consistency:** Database transitions from one valid state to another, respecting all constraints.\n3. **Isolation:** Concurrent transactions don't interfere with each other.\n4. **Durability:** Once committed, changes survive system crashes.",
    quiz: "Here are 3 flash questions from this PDF:\n\n1. **Q:** What is the normal form that removes transitive dependencies?\n   **A:** 3NF (Third Normal Form).\n2. **Q:** Why do relational databases use B+ trees instead of binary search trees?\n   **A:** B+ trees have high branching factors, minimizing expensive disk I/O reads.\n3. **Q:** What is a foreign key constraint?\n   **A:** A column linking child rows to valid parent primary keys.",
    btree: "**B+ Tree Indexing Summary:**\n\n• **All Data in Leaves:** Internal nodes only store keys for routing; actual record pointers reside in leaf nodes.\n• **Linked Leaves:** Leaf nodes are connected via a doubly-linked list, making range queries (`WHERE age BETWEEN 20 AND 30`) extremely fast.\n• **Balanced Depth:** Guarantees O(log N) operations regardless of insertion sequence.",
    default: "Based on the uploaded document, this topic is detailed in Chapter 2. The key takeaway is structuring your schema to eliminate update anomalies while indexing high-cardinality columns for rapid lookups. Let me know if you want a code implementation or quiz!"
};

// --- INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Protect Route
    if (typeof isUserLoggedIn !== 'function' || !isUserLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    // 2. Initialize User Info
    initUserProfile();

    // 3. Setup Navigation & Mobile Sidebar
    setupNavigation();

    // 4. Setup Live Search Filtering
    setupLiveSearch();

    // 5. Setup Dropdown Menus (Notifications & Profile)
    setupDropdowns();

    // 6. Setup Interactive Modals
    setupQuizEngine();
    setupPdfWorkspace();
    setupCourseExplorer();
    setupSettingsModal();

    // 7. Initialize Theme
    if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }
});

// --- USER PROFILE INITIALIZATION ---
function initUserProfile() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { name: 'Student', email: 'student@example.com' };
    const firstLetter = (user.name || 'S').charAt(0).toUpperCase();

    // Populate user names
    const topNavName = document.getElementById('topNavUserName');
    const sidebarName = document.getElementById('sidebarUserName');
    const menuName = document.getElementById('menuUserName');
    const menuEmail = document.getElementById('menuUserEmail');
    const welcomeGreeting = document.getElementById('welcomeGreeting');

    if (topNavName) topNavName.textContent = user.name;
    if (sidebarName) sidebarName.textContent = user.name;
    if (menuName) menuName.textContent = user.name;
    if (menuEmail) menuEmail.textContent = user.email;
    if (welcomeGreeting) welcomeGreeting.textContent = `Welcome back, ${user.name}! 👋`;

    // Populate avatars
    const avatars = document.querySelectorAll('#topNavAvatar, #sidebarAvatar, #menuAvatar');
    avatars.forEach(av => av.textContent = firstLetter);
}

// --- NAVIGATION & MOBILE SIDEBAR SETUP ---
function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navLinks = document.querySelectorAll('#sidebarNavLinks .nav-link');

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

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            closeAllDropdowns();
            closeAllModals();
        }
    });

    // Nav link click handling & smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
                closeSidebar();
            }
        });
    });

    // Logout triggers
    const logoutBtn = document.getElementById('logoutBtn');
    const menuLogoutBtn = document.getElementById('menuLogoutBtn');
    const handleLogout = (e) => {
        e.preventDefault();
        if (typeof logoutUser === 'function') logoutUser();
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (menuLogoutBtn) menuLogoutBtn.addEventListener('click', handleLogout);
}

// --- LIVE SEARCH FILTERING ---
function setupLiveSearch() {
    const searchInput = document.getElementById('dashboardSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }

        // Filter progress items
        const progressItems = document.querySelectorAll('#courseProgressList .progress-item');
        progressItems.forEach(item => {
            const searchTerms = (item.getAttribute('data-search') || '') + ' ' + item.textContent.toLowerCase();
            item.style.display = !query || searchTerms.includes(query) ? 'flex' : 'none';
        });

        // Filter quiz cards
        const quizCards = document.querySelectorAll('#quizCardsGrid .quiz-card');
        quizCards.forEach(card => {
            const searchTerms = (card.getAttribute('data-search') || '') + ' ' + card.textContent.toLowerCase();
            card.style.display = !query || searchTerms.includes(query) ? 'flex' : 'none';
        });

        // Filter activity items
        const activityItems = document.querySelectorAll('#activityList li');
        activityItems.forEach(item => {
            const searchTerms = (item.getAttribute('data-search') || '') + ' ' + item.textContent.toLowerCase();
            item.style.display = !query || searchTerms.includes(query) ? 'flex' : 'none';
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

// --- DROPDOWNS SETUP ---
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
        markAllReadBtn.addEventListener('click', () => {
            const unreadItems = document.querySelectorAll('#notificationList li.unread');
            unreadItems.forEach(item => item.classList.remove('unread'));
            if (unreadBadge) unreadBadge.style.display = 'none';
            if (typeof showToast === 'function') showToast('All notifications marked as read', 'info');
        });
    }

    if (profileThemeToggle) {
        profileThemeToggle.addEventListener('click', () => {
            const themeBtn = document.getElementById('themeToggleBtn');
            if (themeBtn) themeBtn.click();
        });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-wrapper')) {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
}

function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

// --- INTERACTIVE QUIZ ENGINE ---
function setupQuizEngine() {
    const quizModal = document.getElementById('quizModal');
    const closeQuizModal = document.getElementById('closeQuizModal');
    const quitQuizBtn = document.getElementById('quitQuizBtn');
    const quizNextBtn = document.getElementById('quizNextBtn');
    const quizTriggers = document.querySelectorAll('.start-quiz-trigger');

    let currentTopic = 'python';
    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let timerInterval = null;
    let timeRemaining = 120;

    // Start Quiz Triggers
    quizTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.getAttribute('data-topic') || 'python';
            startQuiz(topic);
        });
    });

    function startQuiz(topicKey) {
        currentTopic = topicKey;
        const topicData = QUIZ_DATA[topicKey] || QUIZ_DATA.python;
        currentQuestions = topicData.questions;
        currentIndex = 0;
        score = 0;
        timeRemaining = 120;

        document.getElementById('quizModalTitle').textContent = topicData.title;
        document.getElementById('quizTopicBadge').textContent = topicData.badge;
        
        // Reset Views
        document.getElementById('quizQuestionView').style.display = 'block';
        document.getElementById('quizResultsView').style.display = 'none';
        document.getElementById('quizModalFooter').style.display = 'flex';
        quizNextBtn.textContent = 'Next Question →';
        quizNextBtn.disabled = true;

        startTimer();
        renderQuestion();
        quizModal.classList.add('active');
    }

    function startTimer() {
        clearInterval(timerInterval);
        const timerEl = document.getElementById('quizTimer');
        
        timerInterval = setInterval(() => {
            timeRemaining--;
            const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
            const secs = String(timeRemaining % 60).padStart(2, '0');
            timerEl.textContent = `⏱️ ${mins}:${secs}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                finishQuiz();
            }
        }, 1000);
    }

    function renderQuestion() {
        const qData = currentQuestions[currentIndex];
        document.getElementById('quizQuestionCounter').textContent = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
        
        const progressPct = ((currentIndex + 1) / currentQuestions.length) * 100;
        document.getElementById('quizProgressFill').style.width = `${progressPct}%`;
        
        document.getElementById('quizQuestionText').textContent = qData.q;
        
        const optionsContainer = document.getElementById('quizOptionsContainer');
        optionsContainer.innerHTML = '';

        const feedbackBox = document.getElementById('quizFeedbackBox');
        feedbackBox.style.display = 'none';
        feedbackBox.innerHTML = '';

        quizNextBtn.disabled = true;

        qData.options.forEach((optText, index) => {
            const optBtn = document.createElement('button');
            optBtn.className = 'quiz-option-btn';
            optBtn.innerHTML = `<span><strong>${String.fromCharCode(65 + index)}.</strong></span> <span>${optText}</span>`;
            
            optBtn.addEventListener('click', () => {
                handleAnswerSelection(index, qData);
            });

            optionsContainer.appendChild(optBtn);
        });
    }

    function handleAnswerSelection(selectedIndex, qData) {
        const optionButtons = document.querySelectorAll('.quiz-option-btn');
        optionButtons.forEach(btn => btn.disabled = true);

        const isCorrect = selectedIndex === qData.correct;
        if (isCorrect) score++;

        optionButtons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            optionButtons[qData.correct].classList.add('correct');
        }

        const feedbackBox = document.getElementById('quizFeedbackBox');
        feedbackBox.style.display = 'block';
        feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'toast-success' : 'toast-error'}`;
        feedbackBox.style.backgroundColor = isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)';
        feedbackBox.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
        feedbackBox.innerHTML = `<strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong> ${qData.explanation}`;

        quizNextBtn.disabled = false;
        if (currentIndex === currentQuestions.length - 1) {
            quizNextBtn.textContent = 'View Results 🏆';
        }
    }

    quizNextBtn.addEventListener('click', () => {
        if (currentIndex < currentQuestions.length - 1) {
            currentIndex++;
            renderQuestion();
        } else {
            finishQuiz();
        }
    });

    function finishQuiz() {
        clearInterval(timerInterval);
        document.getElementById('quizQuestionView').style.display = 'none';
        document.getElementById('quizResultsView').style.display = 'flex';
        
        const scorePct = Math.round((score / currentQuestions.length) * 100);
        document.getElementById('resultScorePct').textContent = `${scorePct}%`;
        document.getElementById('resultScoreFraction').textContent = `${score} / ${currentQuestions.length} Correct`;
        document.getElementById('resultAccuracy').textContent = `${scorePct}%`;
        
        const timeSpent = 120 - Math.max(0, timeRemaining);
        document.getElementById('resultTimeTaken').textContent = `${timeSpent}s`;

        // Update Dashboard Stats & Activity
        updateDashboardStats(scorePct);

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

// Update stats after quiz completion
function updateDashboardStats(scorePct) {
    const quizAvgEl = document.getElementById('statQuizAvg');
    if (quizAvgEl) {
        const currentAvg = parseInt(quizAvgEl.textContent) || 80;
        const newAvg = Math.round((currentAvg + scorePct) / 2);
        quizAvgEl.textContent = `${newAvg}%`;
    }

    // Add to activity list
    const activityList = document.getElementById('activityList');
    if (activityList) {
        const li = document.createElement('li');
        li.className = 'success';
        li.innerHTML = `
            <div class="act-details">
                <strong>Completed Skill Assessment</strong>
                <span>Scored ${scorePct}% accuracy</span>
            </div>
            <span class="act-time">Just now</span>
        `;
        activityList.insertBefore(li, activityList.firstChild);
    }

    if (typeof showToast === 'function') {
        showToast(`Quiz completed! Score: ${scorePct}%`, 'success');
    }
}

// --- PDF AI STUDY WORKSPACE ---
function setupPdfWorkspace() {
    const pdfModal = document.getElementById('pdfModal');
    const openBtn = document.getElementById('openPdfWorkspaceBtn');
    const closeBtn = document.getElementById('closePdfModal');
    const dropZone = document.getElementById('pdfDropZone');
    const fileInput = document.getElementById('pdfFileInput');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const docChips = document.querySelectorAll('.doc-chip');
    const chatForm = document.getElementById('pdfChatForm');
    const chatInput = document.getElementById('pdfChatInput');
    const chatMessages = document.getElementById('pdfChatMessages');

    if (openBtn && pdfModal) {
        openBtn.addEventListener('click', () => pdfModal.classList.add('active'));
    }

    if (closeBtn && pdfModal) {
        closeBtn.addEventListener('click', () => pdfModal.classList.remove('active'));
    }

    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) pdfModal.classList.remove('active');
        });
    }

    // Doc chips click
    docChips.forEach(chip => {
        chip.addEventListener('click', () => {
            docChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            if (pdfModal) pdfModal.classList.add('active');
            if (typeof showToast === 'function') showToast(`Loaded ${chip.textContent.trim()}`, 'info');
        });
    });

    // File upload
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const fileName = e.target.files[0].name;
                dropZone.querySelector('p strong').textContent = `Loaded: ${fileName}`;
                if (typeof showToast === 'function') showToast(`AI analyzed ${fileName}!`, 'success');
                appendChatMessage('ai', `I have indexed <strong>${fileName}</strong>. What questions would you like answered?`);
            }
        });
    }

    // Quick Prompt Chips
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            if (query) {
                appendChatMessage('user', query);
                processAiResponse(query);
            }
        });
    });

    // Chat Form Submit
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            
            appendChatMessage('user', text);
            chatInput.value = '';
            processAiResponse(text);
        });
    }

    function appendChatMessage(sender, htmlContent) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
        msgDiv.innerHTML = `
            <div class="msg-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="msg-content"><p>${htmlContent.replace(/\n/g, '<br>')}</p></div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processAiResponse(query) {
        const lower = query.toLowerCase();
        let reply = AI_RESPONSES.default;
        
        if (lower.includes('acid')) reply = AI_RESPONSES.acid;
        else if (lower.includes('quiz') || lower.includes('question')) reply = AI_RESPONSES.quiz;
        else if (lower.includes('tree') || lower.includes('b+')) reply = AI_RESPONSES.btree;

        setTimeout(() => {
            appendChatMessage('ai', reply);
        }, 500);
    }
}

// --- COURSE EXPLORER & CODE RUNNER ---
function setupCourseExplorer() {
    const courseModal = document.getElementById('courseModal');
    const openBtn = document.getElementById('openCourseExplorerBtn');
    const closeBtn = document.getElementById('closeCourseModal');
    const closeBtn2 = document.getElementById('closeCourseBtn');
    const tabs = document.querySelectorAll('#courseTrackTabs .track-tab');
    const lessonView = document.getElementById('courseLessonView');

    if (openBtn && courseModal) {
        openBtn.addEventListener('click', () => {
            renderCourseLesson('python');
            courseModal.classList.add('active');
        });
    }

    const closeCourse = () => {
        if (courseModal) courseModal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeCourse);
    if (closeBtn2) closeBtn2.addEventListener('click', closeCourse);
    if (courseModal) {
        courseModal.addEventListener('click', (e) => {
            if (e.target === courseModal) closeCourse();
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const courseKey = tab.getAttribute('data-course') || 'python';
            renderCourseLesson(courseKey);
        });
    });

    function renderCourseLesson(courseKey) {
        if (!lessonView) return;
        const data = COURSE_MODULES[courseKey] || COURSE_MODULES.python;
        
        lessonView.innerHTML = `
            <div class="lesson-card">
                <div>
                    <h4>${data.title}</h4>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">${data.description}</p>
                </div>
                <div>
                    <label style="font-weight: 600; font-size: 0.8125rem;">Interactive Code Playground</label>
                    <pre class="code-snippet-box"><code>${escapeHtml(data.code)}</code></pre>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <button class="btn btn-primary btn-sm" id="runCodeBtn">▶ Run Code</button>
                    <span id="runStatus" style="font-size: 0.75rem; color: var(--text-muted);">Ready</span>
                </div>
                <div id="codeOutputContainer" style="display: none;">
                    <label style="font-weight: 600; font-size: 0.8125rem;">Console Output</label>
                    <pre class="code-output-box" id="codeOutputText"></pre>
                </div>
            </div>
        `;

        const runBtn = document.getElementById('runCodeBtn');
        const outputContainer = document.getElementById('codeOutputContainer');
        const outputText = document.getElementById('codeOutputText');
        const runStatus = document.getElementById('runStatus');

        if (runBtn) {
            runBtn.addEventListener('click', () => {
                runStatus.textContent = 'Executing...';
                runBtn.disabled = true;
                setTimeout(() => {
                    outputContainer.style.display = 'block';
                    outputText.textContent = data.output;
                    runStatus.textContent = 'Finished in 0.12s';
                    runBtn.disabled = false;
                    if (typeof showToast === 'function') showToast('Code executed successfully!', 'success');
                }, 400);
            });
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

// --- SETTINGS MODAL SETUP ---
function setupSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    const navSettingsBtn = document.getElementById('navSettingsBtn');
    const profileSettingsLink = document.getElementById('profileSettingsLink');
    const closeBtn = document.getElementById('closeSettingsModal');
    const cancelBtn = document.getElementById('cancelSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const nameInput = document.getElementById('settingsNameInput');
    const themeSelectBtns = document.querySelectorAll('.theme-select-btn');

    const openSettings = () => {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { name: 'Student' };
        if (nameInput) nameInput.value = user.name;
        if (settingsModal) settingsModal.classList.add('active');
        closeAllDropdowns();
    };

    const closeSettings = () => {
        if (settingsModal) settingsModal.classList.remove('active');
    };

    if (navSettingsBtn) navSettingsBtn.addEventListener('click', openSettings);
    if (profileSettingsLink) profileSettingsLink.addEventListener('click', openSettings);
    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSettings);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    themeSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeVal = btn.getAttribute('data-theme-val');
            document.documentElement.setAttribute('data-theme', themeVal);
            localStorage.setItem('ai_study_theme', themeVal);
            if (typeof updateThemeIcon === 'function') updateThemeIcon(themeVal);
            if (typeof showToast === 'function') showToast(`Theme updated to ${themeVal}`, 'info');
        });
    });

    if (saveBtn && nameInput) {
        saveBtn.addEventListener('click', () => {
            const newName = nameInput.value.trim();
            if (newName) {
                localStorage.setItem('ai_study_user_name', newName);
                initUserProfile();
                if (typeof showToast === 'function') showToast('Settings updated successfully!', 'success');
            }
            closeSettings();
        });
    }
}
