const API_URL = 'http://localhost:5000/api';

export const apiService = {
    async login(username: string, password: string) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async getMe(token: string) {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    async getAuditLogs(token: string) {
        const response = await fetch(`${API_URL}/audit`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch audit logs');
        return response.json();
    },

    async deleteAuditLog(token: string, id: number) {
        const response = await fetch(`${API_URL}/audit/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete log');
        return response.json();
    },

    async clearAuditLogs(token: string) {
        const response = await fetch(`${API_URL}/audit`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to clear logs');
        return response.json();
    },

    async updateAuditLog(token: string, id: number, data: any) {
        const response = await fetch(`${API_URL}/audit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update log');
        return response.json();
    },

    // User Management
    async getUsers(token: string) {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async createUser(token: string, userData: any) {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return response.json();
    },

    async updateUser(token: string, id: number, userData: any) {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
        return response.json();
    },

    async deleteUser(token: string, id: number) {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    },

    async toggleReviewAccess(token: string, id: number, canViewReviews: boolean) {
        const response = await fetch(`${API_URL}/users/${id}/permissions`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ canViewReviews })
        });
        if (!response.ok) throw new Error('Failed to update permission');
        return response.json();
    },

    // Reviews Management
    async getReviews(token: string) {
        const response = await fetch(`${API_URL}/reviews`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        return response.json();
    },

    async updateReviewStatus(token: string, id: number, status: string) {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update review');
        return response.json();
    },

    async deleteReview(token: string, id: number) {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete review');
        return response.json();
    },

    async submitReview(reviewData: any) {
        const response = await fetch(`${API_URL}/reviews/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error('Failed to submit review');
        return response.json();
    },

    // File Upload
    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Image upload failed');
        return response.json();
    }
};
