<script setup lang="ts">
import type { VolleySystem } from '@/domain/systems'

defineProps<{
  system: VolleySystem
  useLibero: boolean
}>()
</script>

<template>
  <div class="legend-wrap">
    <ul class="legend">
      <li><span class="swatch swatch-active"></span>Active setter</li>
      <li v-if="system.setters.length > 1">
        <span class="swatch swatch-setter"></span>Other setter
      </li>
      <li><span class="swatch swatch-player"></span>Player</li>
      <li v-if="useLibero"><span class="swatch swatch-libero"></span>Libero</li>
    </ul>
    <p class="roles">S - Setter · OH - Outside hitter · MB - Middle blocker · OPP - Opposite</p>
  </div>
</template>

<style scoped>
.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  font-size: 13px;
  color: var(--muted);
}

.legend-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.swatch-active {
  background: var(--accent);
}

.swatch-setter {
  background: var(--player);
  box-shadow: inset 0 0 0 2px var(--accent);
}

.swatch-player {
  background: var(--player);
  box-shadow: inset 0 0 0 1px var(--border-strong);
}

.swatch-libero {
  background: var(--libero);
}

.roles {
  font-size: 12px;
  color: var(--muted);
}
</style>
