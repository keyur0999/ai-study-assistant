/**
 * AI Study Assistant - API Client Adapter
 * Seamlessly connects Frontend to Backend API with offline fallback.
 */

const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        if (window.API_BASE_URL) return window.API_BASE_URL;
        if (window.location.port === '5000' || window.location.port === '8000') {
            return `${window.location.origin}/api`;
        }
    }
    return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = {
    baseUrl: API_BASE_URL,
    isOnline: false,

    getToken() {
        return localStorage.getItem('ai_study_token');
    },

    setToken(token) {
        if (token) {
            localStorage.setItem('ai_study_token', token);
        } else {
            localStorage.removeItem('ai_study_token');
        }
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { ...(options.headers || {}) };

        const token = this.getToken();
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
        if (!isFormData && options.body !== undefined && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const res = await fetch(url, {
                ...options,
                headers
            });

            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : { message: await res.text().catch(() => '') };
            if (!res.ok) {
                const detail = data.detail;
                const message = data.error || data.message || (typeof detail === 'string' ? detail : Array.isArray(detail) ? detail.map(item => item.msg || String(item)).join(', ') : '') || `HTTP error ${res.status}`;
                throw new Error(message);
            }
            this.isOnline = true;
            return data;
        } catch (err) {
            console.warn(`API request to ${endpoint} failed:`, err.message);
            throw err;
        }
    },

    async checkHealth() {
        try {
            const data = await this.request('/health', { method: 'GET' });
            this.isOnline = (data && data.status === 'online');
            return this.isOnline;
        } catch (e) {
            this.isOnline = false;
            return false;
        }
    },

    // Authentication Endpoints
    auth: {
        async login(email, password) {
            const data = await api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            const token = data.token || data.access_token;
            if (token) api.setToken(token);
            return data;
        },

        async register(name, email, password) {
            const data = await api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            const token = data.token || data.access_token;
            if (token) api.setToken(token);
            return data;
        },

        async getMe() {
            return api.request('/auth/me', { method: 'GET' });
        },

        async updateProfile(profileData) {
            const data = await api.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            if (data.token) api.setToken(data.token);
            return data;
        },

        async forgotPassword(email) {
            return api.request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }
    },

    // Dashboard & Analytics Endpoints
    dashboard: {
        async getStats() {
            return api.request('/dashboard/stats', { method: 'GET' });
        },

        async getAnalytics() {
            return api.request('/dashboard/analytics', { method: 'GET' });
        },

        async getActivity() {
            return api.request('/dashboard/activity', { method: 'GET' });
        },

        async getChecklist() {
            return api.request('/dashboard/checklist', { method: 'GET' });
        },

        async updateChecklistItem(id, is_completed) {
            return api.request(`/dashboard/checklist/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ is_completed })
            });
        },

        async getNotifications() {
            return api.request('/dashboard/notifications', { method: 'GET' });
        },

        async markNotificationsRead() {
            return api.request('/dashboard/notifications/mark-read', { method: 'POST' });
        }
    },

    // Skills Quiz Endpoints
    quiz: {
        async getTopics() {
            return api.request('/quizzes', { method: 'GET' });
        },

        async getQuestions(topic) {
            return api.request(`/quizzes/${topic}`, { method: 'GET' });
        },

        async submitQuiz(topic, answers, timeSpentSec) {
            return api.request(`/quizzes/${topic}/submit`, {
                method: 'POST',
                body: JSON.stringify({
                    answers,
                    time_spent_sec: timeSpentSec
                })
            });
        },

        async getHistory() {
            return api.request('/quizzes/history', { method: 'GET' });
        }
    },

    // Course & Code Runner Endpoints
    courses: {
        async getAll() {
            return api.request('/courses', { method: 'GET' });
        },

        async getDetails(courseId) {
            return api.request(`/courses/${courseId}`, { method: 'GET' });
        },

        async runCode(language, code) {
            return api.request('/courses/run-code', {
                method: 'POST',
                body: JSON.stringify({ language, code })
            });
        },

        async updateProgress(courseId, progressPct) {
            return api.request(`/courses/${courseId}/progress`, {
                method: 'POST',
                body: JSON.stringify({ progress_pct: progressPct })
            });
        }
    },

    // PDF & AI Document Assistant Endpoints
    pdf: {
        async uploadDocument(file) {
            const formData = new FormData();
            formData.append('file', file);
            return api.request('/pdf/upload', {
                method: 'POST',
                body: formData
            });
        },

        async getDocuments() {
            return api.request('/pdf/documents', { method: 'GET' });
        },

        async chat(query, docKey, docId) {
            return api.request('/pdf/chat', {
                method: 'POST',
                body: JSON.stringify({ query, doc_key: docKey, doc_id: docId })
            });
        },

        async generateQuiz(docKey, docId) {
            return api.request('/pdf/generate-quiz', {
                method: 'POST',
                body: JSON.stringify({ doc_key: docKey, doc_id: docId })
            });
        }
    }
};

window.api = api;
