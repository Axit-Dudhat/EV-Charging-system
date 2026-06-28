<template>
  <div class="animate-fade-in map-page-layout">
    <!-- Top Filter Bar -->
    <div class="filter-action-bar" style="margin-bottom: 0">
      <div class="filter-group-left">
        <!-- Search bar -->
        <div class="search-box-wrapper">
          <svg
            class="search-icon-svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
            />
          </svg>
          <input
            type="text"
            v-model="store.filters.search"
            class="form-control"
            placeholder="Search on map..."
          />
        </div>

        <!-- Status Filter -->
        <select
          v-model="store.filters.status"
          class="form-select filter-select"
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <!-- Connector Filter -->
        <select
          v-model="store.filters.connector"
          class="form-select filter-select"
        >
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
    </div>

    <!-- Map View Container -->
    <div class="map-container" style="position: relative">
      <!-- Loading indicator on map overlay -->
      <div
        v-if="store.isLoading"
        style="
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid var(--border-color);
          border-radius: var(--radius);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          box-shadow: var(--shadow-md);
        "
      >
        Updating grid map...
      </div>

      <!-- Leaflet Map Mount Point -->
      <div
        id="map"
        style="
          height: 100%;
          width: 100%;
          min-height: 500px;
          z-index: 1;
          border-radius: var(--radius);
        "
      ></div>

      <!-- Floating Legend -->
      <div class="map-legend-card" style="z-index: 1000">
        <span class="map-legend-title">Live Grid Status</span>
        <div class="map-legend-row">
          <span
            class="map-legend-dot"
            style="
              background-color: var(--success);
              box-shadow: 0 0 6px var(--success);
            "
          ></span>
          <span>Active Charger</span>
        </div>
        <div class="map-legend-row">
          <span
            class="map-legend-dot"
            style="
              background-color: var(--danger);
              box-shadow: 0 0 6px var(--danger);
            "
          ></span>
          <span>Inactive / Faulted</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { store } from "../store";

let map = null;
let markers = [];

// Filtered stations logic (handles power filter client-side, other filters server-side)
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

const updateMarkers = () => {
  if (!map) return;

  // Clear existing markers from the map instance
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Plot fresh marker layers
  filteredStations.value.forEach(station => {
    const markerColor = station.status.toLowerCase() === 'active' ? '#22C55E' : '#EF4444';

    // Pure HTML DivIcon to prevent path/asset resolution failures in Vite
    const customIcon = L.divIcon({
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="width: 24px; height: 24px; border-radius: 50% 50% 50% 0; background-color: ${markerColor}; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
          <div style="position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px; border-radius: 50%; border: 2px solid ${markerColor}; animation: pulseRadar 2s infinite ease-out; pointer-events: none;"></div>
        </div>
      `,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });

    const popupContent = `
      <div style="font-family: 'Poppins', sans-serif; font-size: 0.8rem; line-height: 1.4; color: #1F2937; min-width: 150px;">
        <h4 style="margin: 0 0 4px 0; font-size: 0.85rem; font-weight: 600; color: #111827;">${station.name}</h4>
        <div><b>Connector:</b> ${station.connectorType}</div>
        <div><b>Capacity:</b> ${station.powerOutput} kW</div>
        <div><b>Location:</b> ${station.latitude.toFixed(4)}, ${station.longitude.toFixed(4)}</div>
        <div style="margin-top: 6px;">
          <span style="display: inline-block; padding: 2px 6px; font-size: 0.65rem; font-weight: 600; border-radius: 4px; background-color: ${station.status === 'Active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${station.status === 'Active' ? '#16A34A' : '#DC2626'};">
            ${station.status}
          </span>
        </div>
      </div>
    `;

    const marker = L.marker([station.latitude, station.longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);

    markers.push(marker);
  });

  // Fit map viewport bounds to display all plotted pins
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.15));
  } else {
    // Default fallback to India center coordinates if database is empty or filters have no match
    map.setView([20.5937, 78.9629], 5);
  }
};

onMounted(async () => {
  // Load chargers list from backend
  await store.fetchStations();

  // Instantiate Leaflet Map
  map = L.map("map").setView([20.5937, 78.9629], 5); // India
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  // Plot markers
  updateMarkers();
});

// Watch database values and client-side filters updates to refresh markers live
watch(filteredStations, () => {
  updateMarkers();
}, { deep: true });

// Query backend endpoints on filter selections
watch([
  () => store.filters.search,
  () => store.filters.status,
  () => store.filters.connector
], () => {
  store.fetchStations();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>
