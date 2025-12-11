// API service for frontend
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

const requestCache = new Map();
const requestDedup = new Map();

class ApiService {
  static getAuthToken() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.token || localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  static async makeFetch(url, options = {}) {
    const cacheKey = `${options.method || 'GET'}:${url}`;
    
    if (requestDedup.has(cacheKey)) {
      return requestDedup.get(cacheKey);
    }

    const fetchPromise = fetch(url, options).then(async response => {
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });

    if (options.method === 'GET' || !options.method) {
      requestDedup.set(cacheKey, fetchPromise);
      fetchPromise.finally(() => requestDedup.delete(cacheKey));
    }

    return fetchPromise;
  }

  static async getConfig() {
    try {
      const cached = requestCache.get('config');
      if (cached) return cached;

      const result = await this.makeFetch(`${API_BASE_URL}/api/config`);
      requestCache.set('config', result);
      return result;
    } catch (error) {
      console.error('Error fetching config:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userData = await this.makeFetch(`${API_BASE_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  static async makeAuthFetch(url, options = {}) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.makeFetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  static async getTickets() {
    try {
      return await this.makeAuthFetch(`${API_BASE_URL}/api/tickets`);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  }

  static async replyToTicket(ticketId, content) {
    try {
      return await this.makeAuthFetch(`${API_BASE_URL}/api/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Error replying to ticket:', error);
      throw error;
    }
  }

  static async closeTicket(ticketId) {
    try {
      return await this.makeAuthFetch(`${API_BASE_URL}/api/tickets/${ticketId}/close`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw error;
    }
  }

  static async deleteTicket(ticketId) {
    try {
      return await this.makeAuthFetch(`${API_BASE_URL}/api/tickets/${ticketId}/delete`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }
}

export default ApiService;