<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { store } from '../store/index.js';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import StationListPage from './StationListPage.vue';
import AddChargerPage from './AddChargerPage.vue';
import EditChargerPage from './EditChargerPage.vue';
import MapViewPage from './MapViewPage.vue';

// Sidebar state for mobile layout drawer
const isMobileSidebarOpen = ref(false);

onMounted(() => {
  // Fetch charging stations data on load
  store.fetchStations();

  // If the active page is 'dashboard', redirect to 'stations'
  if (store.currentPage === 'dashboard') {
    store.currentPage = 'stations';
  }
});

// Global delete confirmation modal action handler
const deleteStation = async () => {
  if (!store.deletingStation) return;
  const id = store.deletingStation._id || store.deletingStation.id;
  const success = await store.deleteStation(id);
  if (success) {
    store.deletingStation = null;
  }
};

// Settings action handlers
const updateTheme = (theme: string) => {
  store.saveSettings({ themeMode: theme });
};

const updateSystemName = (name: string) => {
  store.saveSettings({ systemName: name });
};

const updateRefresh = (interval: string) => {
  store.saveSettings({ refreshInterval: interval });
};
</script>

<template>
  <div class="app-container" :class="{ 'sidebar-collapsed-active': store.sidebarCollapsed }">
    
    <!-- Sidebar component -->
    <Sidebar 
      :isMobileOpen="isMobileSidebarOpen" 
      @close-mobile="isMobileSidebarOpen = false" 
    />

    <!-- Main Content Area Wrapper -->
    <div class="main-wrapper">
      
      <!-- Sticky Top Header Navbar -->
      <Navbar @toggle-mobile="isMobileSidebarOpen = true" />

      <!-- Render current active sub-page inside the content-container layout -->
      <main class="content-container">

        <!-- 1. STATIONS LIST SUB-PAGE -->
        <StationListPage v-if="store.currentPage === 'stations'" />

        <!-- 2. ADD CHARGER SUB-PAGE -->
        <AddChargerPage v-else-if="store.currentPage === 'add-charger'" />

        <!-- 3. EDIT CHARGER SUB-PAGE -->
        <EditChargerPage v-else-if="store.currentPage === 'edit-charger'" />

        <!-- 4. LIVE MAP VIEW SUB-PAGE -->
        <MapViewPage v-else-if="store.currentPage === 'map'" />

        <!-- 5. SYSTEM SETTINGS SUB-PAGE -->
        <div v-else-if="store.currentPage === 'settings'" class="animate-fade-in settings-layout">
          <div class="card settings-card">
            <div class="card-title">System Configuration Settings</div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              
              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; flex-direction: row; gap: 12px;">
                <div>
                  <div style="font-weight: 600; color: var(--text-title);">Theme Preference</div>
                  <div class="text-muted" style="font-size: 0.8rem;">Toggle application visual theme mode</div>
                </div>
                <select 
                  :value="store.settings.themeMode" 
                  @change="updateTheme(($event.target as HTMLSelectElement).value)" 
                  class="form-select" 
                  style="width: 150px;"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>

              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; flex-direction: row; gap: 12px;">
                <div>
                  <div style="font-weight: 600; color: var(--text-title);">System Profile Name</div>
                  <div class="text-muted" style="font-size: 0.8rem;">Change system header label</div>
                </div>
                <input 
                  type="text" 
                  :value="store.settings.systemName" 
                  @input="updateSystemName(($event.target as HTMLInputElement).value)" 
                  class="form-control" 
                  style="width: 200px;" 
                />
              </div>

              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; flex-direction: row; gap: 12px;">
                <div>
                  <div style="font-weight: 600; color: var(--text-title);">Refresh Interval</div>
                  <div class="text-muted" style="font-size: 0.8rem;">Database query refresh time interval</div>
                </div>
                <select 
                  :value="store.settings.refreshInterval" 
                  @change="updateRefresh(($event.target as HTMLSelectElement).value)" 
                  class="form-select" 
                  style="width: 150px;"
                >
                  <option value="15s">15 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="60s">1 minute</option>
                </select>
              </div>
              
            </div>
          </div>
        </div>

      </main>
      
    </div>

    <!-- Global Delete Confirmation Modal -->
    <div v-if="store.deletingStation" class="modal-backdrop">
      <div class="modal-container" style="max-width: 450px; width: 100%; border-radius: var(--radius-lg); padding: 24px;">
        <div class="delete-modal-content">
          <div class="delete-warn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="delete-title">Confirm Deletion</span>
          <span class="delete-message">
            Are you sure you want to delete station <strong>"{{ store.deletingStation.name }}"</strong>? This action is permanent and cannot be undone.
          </span>
        </div>
        <div class="form-footer-actions" style="margin-top: 16px; padding-top: 16px;">
          <button class="btn btn-secondary" @click="store.deletingStation = null" :disabled="store.isLoading">
            Cancel
          </button>
          <button class="btn btn-primary" style="background-color: var(--danger); border-color: var(--danger);" @click="deleteStation" :disabled="store.isLoading">
            {{ store.isLoading ? 'Deleting...' : 'Delete Station' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
