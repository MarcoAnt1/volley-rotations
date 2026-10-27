<script setup lang="ts">
import { PLAYERS, positionCoords } from '@/domain/court'

defineProps<{ viewLeft: any, viewWidth: any, showBench: boolean }>()
</script>

<template>
  <g>
    <!-- Free zone: the area around the court -->
    <rect class="free-zone" :x="`${viewLeft}`" y="0" :width="`${viewWidth}`" height="390" rx="16" />

    <!-- Bench: where whoever is off court waits -->
    <g v-if="showBench">
      <rect class="bench" x="-62" y="150" width="56" height="200" rx="12" />
      <text class="bench-label" x="-34" y="168" text-anchor="middle">BENCH</text>
    </g>

    <text class="net-label" x="180" y="22" text-anchor="middle">NET</text>

    <!-- Court floor, with the front zone slightly lighter -->
    <rect class="floor" x="40" y="40" width="280" height="280" />
    <rect class="front-zone" x="40" y="40" width="280" height="93" />

    <!-- Attack line: 3m from the net = one third of the 9m depth -->
    <line class="attack-line" x1="40" y1="133" x2="320" y2="133" />

    <line class="zone-line" x1="133.3" y1="40" x2="133.3" y2="320" />
    <line class="zone-line" x1="226.7" y1="40" x2="226.7" y2="320" />

    <text
      v-for="zone in PLAYERS"
      :key="`zone-${zone}`"
      class="zone-number"
      :x="positionCoords[zone].x - 34"
      :y="positionCoords[zone].y - 34"
      text-anchor="middle"
      dominant-baseline="central"
    >
      {{ zone }}
    </text>

    <!-- Net reaches a bit past the sidelines, with posts at both ends -->
    <line class="net" x1="28" y1="40" x2="332" y2="40" />
    <circle class="net-post" cx="28" cy="40" r="4" />
    <circle class="net-post" cx="332" cy="40" r="4" />
  </g>
</template>

<style scoped>
.free-zone {
  fill: var(--free-zone);
}

.floor {
  fill: var(--court);
  stroke: var(--court-line);
  stroke-width: 2;
}

.front-zone {
  fill: #ffffff;
  opacity: 0.05;
}

.net {
  stroke: var(--net);
  stroke-width: 3;
  stroke-linecap: round;
}

.net-post {
  fill: var(--net);
}

.net-label {
  fill: var(--muted);
  font:
    600 10px Inter,
    system-ui,
    sans-serif;
  letter-spacing: 0.2em;
}

.attack-line {
  stroke: var(--court-line);
  stroke-width: 2;
}

.zone-line {
  stroke: #ffffff;
  stroke-width: 1;
  stroke-dasharray: 3 5;
  opacity: 0.25;
}

.zone-number {
  fill: #ffffff;
  font:
    600 14px Inter,
    system-ui,
    sans-serif;
  opacity: 0.35;
  pointer-events: none;
}

.bench {
  fill: none;
  stroke: var(--border-strong);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}

.bench-label {
  fill: var(--muted);
  font:
    600 9px Inter,
    system-ui,
    sans-serif;
  letter-spacing: 0.15em;
}
</style>
