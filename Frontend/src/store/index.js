import { reactive, watch } from 'vue';

const API_BASE = 'https://ev-charging-system-production.up.railway.app/api';

// Load authentication credentials from local storage
const savedToken = localStorage.getItem('ev_token') || localStorage.getItem('token');
const savedUser = localStorage.getItem('ev_user') || (savedToken ? JSON.stringify({ name: 'Administrator', role: 'Grid Manager' }) : null);
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

// Application Settings Defaults
const defaultSettings = {
  systemName: 'VoltCharge Pro',
  refreshInterval: '30s',
  enableNotifications: true,
  themeMode: 'light',
  maintenanceMode: false
};
const savedSettings = localStorage.getItem('ev_settings');
const parsedSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

export const store = reactive({
  // Auth state
  currentUser: parsedUser,
  apiToken: savedToken,
  
  // Navigation State
  currentPage: parsedUser ? 'stations' : 'login',
  sidebarCollapsed: false,
  
  // Charging Stations State
  stations: [], // Retrieved dynamically from database endpoints
  editingStation: null,
  deletingStation: null,
  
  // Loading & Network Error states
  isLoading: false,
  errorMessage: '',
  
  // Filters for charging station lists and map
  filters: {
    search: '',
    status: 'All',
    connector: 'All',
    power: 'All',
  },
  
  // Application Settings State
  settings: parsedSettings,
  
  // Mock Notifications for dashboard events
  notifications: [
    { id: 1, title: 'Power Surge Alert', message: 'Station "Downtown Hub EV-01" experienced a minor power fluctuation.', time: '5 mins ago', type: 'warning', read: false },
    { id: 2, title: 'Maintenance Complete', message: 'Station "Westside Mall Station 3" routine inspection finished.', time: '1 hour ago', type: 'success', read: false },
    { id: 3, title: 'New Station Added', message: 'Airport Express Charger is now online.', time: '2 hours ago', type: 'info', read: true },
  ],
  showNotificationsDropdown: false,

  // Helper utility to construct authorization headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`
    };
  },

  // Auth actions linking with REST endpoints
  async login(email, password, rememberMe) {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const resData = await response.json();
      
      if (response.ok && resData.success) {
        this.currentUser = resData.user;
        this.apiToken = resData.token;
        
        if (rememberMe) {
          localStorage.setItem('ev_token', resData.token);
          localStorage.setItem('ev_user', JSON.stringify(resData.user));
        }
        
        this.currentPage = 'stations';
        this.addNotification('Login Successful', `Welcome back, ${resData.user.name}!`, 'success');
        
        // Load station records on successful auth
        await this.fetchStations();
        return true;
      } else {
        this.errorMessage = resData.message || 'Authentication failed. Please verify credentials.';
        return false;
      }
    } catch (error) {
      console.error('Authentication login error:', error);
      this.errorMessage = 'Network connection failure. Verify backend server is running.';
      return false;
    } finally {
      this.isLoading = false;
    }
  },
  
  async register(name, email, password) {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const resData = await response.json();
      
      if (response.ok && resData.success) {
        this.currentUser = resData.user;
        this.apiToken = resData.token;
        
        // Auto-login and create persistence session
        localStorage.setItem('ev_token', resData.token);
        localStorage.setItem('ev_user', JSON.stringify(resData.user));
        
        this.currentPage = 'stations';
        this.addNotification('Account Created', `Registration successful! Welcome, ${resData.user.name}!`, 'success');
        
        await this.fetchStations();
        return true;
      } else {
        this.errorMessage = resData.message || 'Registration failed. Verify input details.';
        return false;
      }
    } catch (error) {
      console.error('Authentication registration error:', error);
      this.errorMessage = 'Network connection failure. Verify backend server is running.';
      return false;
    } finally {
      this.isLoading = false;
    }
  },
  
  logout() {
    this.currentUser = null;
    this.apiToken = null;
    this.stations = [];
    this.currentPage = 'login';
    localStorage.removeItem('ev_token');
    localStorage.removeItem('ev_user');
    localStorage.removeItem('token');
    this.showNotificationsDropdown = false;
  },

  // Navigation action
  navigate(page) {
    if (!this.currentUser && page !== 'login') {
      this.currentPage = 'login';
    } else {
      this.currentPage = page;
    }
  },

  // Mongoose CRUD interface integrations
  async fetchStations() {
    if (!this.apiToken) return;
    this.isLoading = true;
    this.errorMessage = '';
    try {
      // Build query filters (search, status, connector) to pass to backend Mongoose queries
      const queryParams = new URLSearchParams();
      if (this.filters.search) queryParams.append('search', this.filters.search);
      if (this.filters.status && this.filters.status !== 'All') queryParams.append('status', this.filters.status);
      if (this.filters.connector && this.filters.connector !== 'All') queryParams.append('connector', this.filters.connector);

      const response = await fetch(`${API_BASE}/stations?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        this.stations = resData.stations || resData.data || [];
      } else {
        this.errorMessage = resData.message || 'Failed to fetch stations list.';
      }
    } catch (error) {
      console.error('Fetch charging stations database failure:', error);
      this.errorMessage = 'Network connection failure. Verify database state.';
    } finally {
      this.isLoading = false;
    }
  },

  async addStation(stationData) {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/stations`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(stationData)
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        this.addNotification('Station Created', `"${stationData.name}" onboarded successfully.`, 'success');
        await this.fetchStations(); // Reload items
        return true;
      } else {
        this.errorMessage = resData.message || 'Failed to onboard charging station.';
        return false;
      }
    } catch (error) {
      console.error('Create station error:', error);
      this.errorMessage = 'Network connection failure. Could not register charger.';
      return false;
    } finally {
      this.isLoading = false;
    }
  },

  async updateStation(id, stationData) {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/stations/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(stationData)
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        this.addNotification('Station Updated', `"${stationData.name}" has been updated.`, 'success');
        await this.fetchStations(); // Reload items
        return true;
      } else {
        this.errorMessage = resData.message || 'Failed to update charging station.';
        return false;
      }
    } catch (error) {
      console.error('Update station error:', error);
      this.errorMessage = 'Network connection failure. Could not update charger.';
      return false;
    } finally {
      this.isLoading = false;
    }
  },

  async deleteStation(id) {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const response = await fetch(`${API_BASE}/stations/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        this.addNotification('Station Deleted', 'Charging station removed successfully.', 'danger');
        await this.fetchStations(); // Reload items
        return true;
      } else {
        this.errorMessage = resData.message || 'Failed to delete charging station.';
        return false;
      }
    } catch (error) {
      console.error('Delete station error:', error);
      this.errorMessage = 'Network connection failure. Could not remove charger.';
      return false;
    } finally {
      this.isLoading = false;
    }
  },

  // Settings management actions
  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('ev_settings', JSON.stringify(this.settings));
    this.addNotification('Settings Saved', 'Application preferences updated successfully.', 'success');
  },

  // Notification actions
  addNotification(title, message, type = 'info') {
    const newId = this.notifications.length > 0 ? Math.max(...this.notifications.map(n => n.id)) + 1 : 1;
    this.notifications.unshift({
      id: newId,
      title,
      message,
      time: 'Just now',
      type,
      read: false
    });
  },

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
  },

  clearNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
});

// Watch settings theme and apply dynamically to document body
watch(() => store.settings.themeMode, (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
}, { immediate: true });
