<template>
  <header class="navbar">
    <div class="navbar-left">
      <!-- Sidebar Desktop Collapse & Mobile Menu Toggles -->
      <button 
        class="sidebar-toggle-btn" 
        @click="toggleSidebar"
        aria-label="Toggle Sidebar"
      >
        <!-- Standard burger icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <!-- Active Page Title -->
      <h1 class="page-title-display">{{ pageTitle }}</h1>
    </div>

    <div class="navbar-right">
      <!-- Profile Section -->       
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store';
import '../assets/css/layout.css';

const emit = defineEmits(['toggle-mobile']);

const pageTitle = computed(() => {
  switch (store.currentPage) {
    case 'dashboard':
      return 'Overview Dashboard';
    case 'stations':
      return 'Charging Stations';
    case 'add-charger':
      return 'Register New Charger';
    case 'edit-charger':
      return 'Modify Station Profile';
    case 'map':
      return 'Grid Live Map View';
    case 'settings':
      return 'System Settings';
    default:
      return 'VoltCharge Management';
  }
});

const unreadCount = computed(() => {
  return store.notifications.filter(n => !n.read).length;
});

const userInitials = computed(() => {
  if (!store.currentUser?.name) return 'AD';
  return store.currentUser.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
});

const toggleSidebar = () => {
  // Toggle desktop layout collapse, or emit event to show mobile overlay drawer
  if (window.innerWidth <= 1024) {
    emit('toggle-mobile');
  } else {
    store.sidebarCollapsed = !store.sidebarCollapsed;
  }
};

const toggleNotifications = () => {
  store.showNotificationsDropdown = !store.showNotificationsDropdown;
};

const markAllAsRead = () => {
  store.markAllNotificationsAsRead();
};

const markAsRead = (item) => {
  item.read = true;
};

const getNotificationBgClass = (type) => {
  switch (type) {
    case 'success': return 'bg-success-light';
    case 'warning': return 'bg-warning-light';
    case 'danger': return 'bg-danger-light';
    default: return 'bg-primary-light';
  }
};
</script>
