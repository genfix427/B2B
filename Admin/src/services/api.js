class API {
  constructor() {
    // Use relative path - Vite proxy will handle forwarding to backend
    this.baseURL = 'http://localhost:5000/api';
    
    // For debugging, you can log which base URL is being used
    console.log('API Service initialized with baseURL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    // Clean up undefined parameters
    if (endpoint.includes('undefined')) {
      endpoint = endpoint.replace(/undefined/g, '');
      endpoint = endpoint.replace('?&', '?').replace('&&', '&');
      if (endpoint.endsWith('?') || endpoint.endsWith('&')) {
        endpoint = endpoint.slice(0, -1);
      }
    }

    const defaultOptions = {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add the full URL
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      console.log(`✅ API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP Error: ${response.status} ${response.statusText}`
        }));
        throw new Error(error.message || 'Request failed');
      }

      const data = await response.json();
      console.log(`📊 API Data received:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Admin
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getPendingVendors() {
    return this.request('/admin/vendors/pending');
  }

  async getAllVendors(params = {}) {
    // Clean up params to remove undefined values
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== 'undefined') {
        cleanParams[key] = params[key];
      }
    });
    
    const queryParams = new URLSearchParams(cleanParams).toString();
    const endpoint = queryParams ? `/admin/vendors?${queryParams}` : '/admin/vendors';
    return this.request(endpoint);
  }

  async getVendorById(id) {
    return this.request(`/admin/vendors/${id}`);
  }

  async verifyVendor(id, status, notes = '') {
    return this.request(`/admin/vendors/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ 
        verificationStatus: status, 
        verificationNotes: notes 
      }),
    });
  }

  async updateVendorStatus(id, status, notes = '') {
    return this.request(`/admin/vendors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status, 
        notes 
      }),
    });
  }

  async reviewVendorDocuments(id, status, reviewNotes = '') {
    return this.request(`/admin/vendors/${id}/documents`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status, 
        reviewNotes 
      }),
    });
  }

  async getRecentActivities(limit = 10) {
    return this.request(`/admin/activities?limit=${limit}`);
  }
}

export default new API();