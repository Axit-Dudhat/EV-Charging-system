<template>
  <div>
    <!-- Sidebar Overlay for mobile screen backdrop -->
    <div 
      class="sidebar-overlay" 
      @click="closeMobileSidebar"
    ></div>

    <aside 
      class="sidebar" 
      :class="{ 
        'collapsed': store.sidebarCollapsed,
        'mobile-open': isMobileOpen
      }"
    >
      <!-- Sidebar Header / Logo -->
      <div class="sidebar-header">
        <a href="#" class="logo-container" @click.prevent="navigate('stations')">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span class="logo-text">VoltCharge</span>
        </a>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-menu">
        <!-- Charging Stations List -->
        <li>
          <a 
            class="sidebar-item-link" 
            :class="{ 'active': store.currentPage === 'stations' || store.currentPage === 'add-charger' || store.currentPage === 'edit-charger' }"
            @click.prevent="navigate('stations')"
            title="Charging Stations"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3m-3.07-19.141a4.5 4.5 0 115.38 5.38c-.9.18-1.7.64-2.3 1.3L9 12m0 0l-1.574-2.1c-.6-.66-1.4-1.12-2.3-1.3a4.5 4.5 0 115.38-5.38z" />
            </svg>
            <span class="menu-label">Charging Stations</span>
          </a>
        </li>

        <!-- Map View -->
        <li>
          <a 
            class="sidebar-item-link" 
            :class="{ 'active': store.currentPage === 'map' }"
            @click.prevent="navigate('map')"
            title="Map View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.446l6.002-3.001a1.125 1.125 0 00.597-1.002V3.75a1.125 1.125 0 00-1.722-.96l-6.284 3.142a1.125 1.125 0 01-1.002 0L7.022 3.75a1.125 1.125 0 00-1.002 0l-5.422 2.71a1.125 1.125 0 00-.598 1.001v11.196c0 .532.378.992.898 1.1l6.284 1.257a1.125 1.125 0 001.002 0l5.803-2.901z" />
            </svg>
            <span class="menu-label">Map View</span>
          </a>
        </li>
      </nav>

      <!-- Sidebar Footer (Logout) -->
      <div class="sidebar-footer">
        <a 
          class="sidebar-item-link" 
          @click.prevent="logout"
          title="Sign Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span class="menu-label">Sign Out</span>
        </a>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { store } from '../store';
import '../assets/css/layout.css';

const router = useRouter();

const props = defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close-mobile']);

const navigate = (page) => {
  store.navigate(page);
  emit('close-mobile');
};

const logout = () => {
  store.logout();
  emit('close-mobile');
  router.push('/');
};

const closeMobileSidebar = () => {
  emit('close-mobile');
};
</script>
