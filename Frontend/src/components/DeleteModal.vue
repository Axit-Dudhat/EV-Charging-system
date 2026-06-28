<template>
  <div v-if="store.deletingStation" class="modal-backdrop" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>Delete Charging Station?</h3>
        <button class="modal-close-btn" @click="closeModal" aria-label="Close" :disabled="store.isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 18px; height: 18px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="delete-modal-content">
          <div class="delete-warn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 class="delete-title">Delete "{{ store.deletingStation.name }}"?</h4>
          <p class="delete-message">
            Are you sure you want to delete this charging station? This action is permanent and cannot be undone in the database.
          </p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal" :disabled="store.isLoading">
          Cancel
        </button>
        <button class="btn btn-danger" @click="confirmDelete" :disabled="store.isLoading">
          {{ store.isLoading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '../store';

const closeModal = () => {
  store.deletingStation = null;
};

const confirmDelete = async () => {
  if (store.deletingStation) {
    const stationId = store.deletingStation._id || store.deletingStation.id;
    const success = await store.deleteStation(stationId);
    if (success) {
      store.deletingStation = null;
    } else {
      alert(store.errorMessage || 'Failed to remove station from the database.');
    }
  }
};
</script>
