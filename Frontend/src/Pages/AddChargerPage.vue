<template>
  <div class="animate-fade-in form-card-container">
    <div class="card">
      <div class="card-title">
        <span>Register New Charging Station</span>
        <button class="btn btn-secondary btn-icon" @click="cancel" title="Back to List" :disabled="store.isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="save">
        <div v-if="error" class="badge badge-danger" style="width: 100%; justify-content: center; padding: 10px; margin-bottom: 16px; border-radius: var(--radius);">
          <span class="badge-dot"></span>
          {{ error }}
        </div>

        <!-- Station Name -->
        <div class="form-group">
          <label for="name" class="form-label">Station Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            class="form-control" 
            placeholder="e.g. Downtown Central EV Hub" 
            required
            :disabled="store.isLoading"
          />
        </div>

        <!-- Coordinates Row (Grid) -->
        <div class="form-grid-2">
          <div class="form-group">
            <label for="latitude" class="form-label">Latitude</label>
            <input 
              type="number" 
              step="0.000001" 
              id="latitude" 
              v-model.number="form.latitude" 
              class="form-control" 
              placeholder="e.g. 34.0522" 
              required
              :disabled="store.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="longitude" class="form-label">Longitude</label>
            <input 
              type="number" 
              step="0.000001" 
              id="longitude" 
              v-model.number="form.longitude" 
              class="form-control" 
              placeholder="e.g. -118.2437" 
              required
              :disabled="store.isLoading"
            />
          </div>
        </div>

        <!-- Details Row (Grid) -->
        <div class="form-grid-2">
          <div class="form-group">
            <label for="powerOutput" class="form-label">Power Output (kW)</label>
            <input 
              type="number" 
              min="1" 
              max="500" 
              id="powerOutput" 
              v-model.number="form.powerOutput" 
              class="form-control" 
              placeholder="e.g. 150" 
              required
              :disabled="store.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="connectorType" class="form-label">Connector Type</label>
            <select id="connectorType" v-model="form.connectorType" class="form-select" required :disabled="store.isLoading">
              <option value="CCS2">CCS2</option>
              <option value="Tesla Supercharger">Tesla Supercharger</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Type 2">Type 2</option>
            </select>
          </div>
        </div>

        <!-- Status & City Row (Grid) -->
        <div class="form-grid-2">
          <div class="form-group">
            <label for="status" class="form-label">Operational Status</label>
            <select id="status" v-model="form.status" class="form-select" required :disabled="store.isLoading">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label for="city" class="form-label">City Zone</label>
            <input 
              type="text" 
              id="city" 
              v-model="form.city" 
              class="form-control" 
              placeholder="e.g. Downtown"
              :disabled="store.isLoading"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="form-footer-actions">
          <button type="button" class="btn btn-secondary" @click="cancel" :disabled="store.isLoading">
            Cancel
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm" style="border-color: var(--border-color);" :disabled="store.isLoading">
            Reset
          </button>
          <button type="submit" class="btn btn-primary" :disabled="store.isLoading">
            {{ store.isLoading ? 'Registering...' : 'Save Station' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store';

const initialForm = {
  name: '',
  latitude: '',
  longitude: '',
  powerOutput: '',
  connectorType: 'CCS2',
  status: 'Active',
  city: ''
};

const form = ref({ ...initialForm });
const error = ref('');

const resetForm = () => {
  form.value = { ...initialForm };
  error.value = '';
};

const cancel = () => {
  store.navigate('stations');
};

const save = async () => {
  error.value = '';

  // Validation
  if (!form.value.name) {
    error.value = 'Station Name is required.';
    return;
  }
  if (isNaN(parseFloat(form.value.latitude)) || isNaN(parseFloat(form.value.longitude))) {
    error.value = 'Please provide valid numerical coordinates.';
    return;
  }
  if (isNaN(parseInt(form.value.powerOutput)) || form.value.powerOutput <= 0) {
    error.value = 'Power Output must be a positive integer.';
    return;
  }

  const success = await store.addStation({
    name: form.value.name,
    latitude: parseFloat(form.value.latitude),
    longitude: parseFloat(form.value.longitude),
    powerOutput: parseInt(form.value.powerOutput),
    connectorType: form.value.connectorType,
    status: form.value.status,
    city: form.value.city || 'Downtown'
  });

  if (success) {
    store.navigate('stations');
  } else {
    error.value = store.errorMessage || 'Failed to register the station in database.';
  }
};
</script>
