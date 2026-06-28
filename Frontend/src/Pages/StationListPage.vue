<template>
  <div class="animate-fade-in">
    <!-- Filter Action Bar -->
    <div class="filter-action-bar">
      <div class="filter-group-left">
        <!-- Search bar -->
        <div class="search-box-wrapper">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
          </svg>
          <input 
            type="text" 
            v-model="store.filters.search" 
            class="form-control" 
            placeholder="Search stations..." 
          />
        </div>

        <!-- Status Filter -->
        <select v-model="store.filters.status" class="form-select filter-select">
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <!-- Connector Filter -->
        <select v-model="store.filters.connector" class="form-select filter-select">
          <option value="All">Connector: All</option>
          <option value="CCS2">CCS2</option>
          <option value="Tesla Supercharger">Tesla Supercharger</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Type 2">Type 2</option>
        </select>

        <!-- Power Filter -->
        <select v-model="store.filters.power" class="form-select filter-select">
          <option value="All">Power: All</option>
          <option value="low">Under 50 kW</option>
          <option value="medium">50 - 150 kW</option>
          <option value="high">Over 150 kW</option>
        </select>
      </div>

      <!-- Add Charger Button -->
      <button class="btn btn-primary" @click="navigateToAdd" :disabled="store.isLoading">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add New Charger
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading" style="text-align: center; padding: 60px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); margin-bottom: 20px; box-shadow: var(--shadow-card);">
      <div style="font-weight: 500; color: var(--text-muted); font-size: 0.95rem;">Refreshing Database Records...</div>
    </div>

    <!-- Data Table Container -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Station Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Status</th>
            <th>Power Output</th>
            <th>Connector Type</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in paginatedStations" :key="station._id || station.id">
            <td style="font-weight: 500; color: var(--text-title);">{{ station.name }}</td>
            <td class="text-muted">{{ station.latitude.toFixed(4) }}</td>
            <td class="text-muted">{{ station.longitude.toFixed(4) }}</td>
            <td>
              <span 
                class="badge" 
                :class="station.status.toLowerCase() === 'active' ? 'badge-success' : 'badge-danger'"
              >
                <span class="badge-dot"></span>
                {{ station.status }}
              </span>
            </td>
            <td>
              <span style="font-weight: 600;">{{ station.powerOutput }}</span> <span class="text-muted">kW</span>
            </td>
            <td>
              <span class="badge badge-info">{{ station.connectorType }}</span>
            </td>
            <td>
              <div class="table-actions-cell">
                <button class="btn btn-secondary btn-icon" @click="navigateToEdit(station)" title="Edit Station">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
                <button class="btn btn-secondary btn-icon text-danger" @click="confirmDelete(station)" title="Delete Station">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStations.length === 0">
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
              No stations match the search query and filter parameters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination UI -->
    <div class="pagination" v-if="filteredStations.length > 0 && !store.isLoading">
      <div>
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredStations.length }} stations
      </div>
      <div class="pagination-controls">
        <button 
          class="pagination-btn" 
          :disabled="currentPageNum === 1" 
          @click="currentPageNum--"
        >
          Previous
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPageNum === totalPages" 
          @click="currentPageNum++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store/index.js';
import '../assets/css/pages.css'

const itemsPerPage = 5;
const currentPageNum = ref(1);

onMounted(() => {
  store.fetchStations();
});

// Trigger backend fetching query updates on search/status/connector filter changes
watch([
  () => store.filters.search,
  () => store.filters.status,
  () => store.filters.connector
], () => {
  currentPageNum.value = 1;
  store.fetchStations();
});

// Watch power outputs client-side filter
watch(() => store.filters.power, () => {
  currentPageNum.value = 1;
});

// Power output filtering
const filteredStations = computed(() => {
  return store.stations.filter(station => {
    if (store.filters.power !== 'All') {
      if (store.filters.power === 'low' && station.powerOutput >= 50) return false;
      if (store.filters.power === 'medium' && (station.powerOutput < 50 || station.powerOutput > 150)) return false;
      if (store.filters.power === 'high' && station.powerOutput <= 150) return false;
    }
    return true;
  });
});

// Watch filtering bounds
watch(filteredStations, () => {
  if (currentPageNum.value > totalPages.value) {
    currentPageNum.value = Math.max(1, totalPages.value);
  }
});

// Page boundaries math
const totalPages = computed(() => {
  return Math.ceil(filteredStations.value.length / itemsPerPage) || 1;
});

const startIndex = computed(() => {
  return (currentPageNum.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, filteredStations.value.length);
});

const paginatedStations = computed(() => {
  return filteredStations.value.slice(startIndex.value, endIndex.value);
});

// Action routing triggers
const navigateToAdd = () => {
  store.navigate('add-charger');
};

const navigateToEdit = (station) => {
  store.editingStation = { ...station };
  store.navigate('edit-charger');
};

const confirmDelete = (station) => {
  store.deletingStation = station;
};
</script>
