<script setup lang="ts">
import { ref, computed } from 'vue';
import Court from './components/Court.vue';
import { useRotation } from './composables/useRotation.js';
import { systems, setterTip, type SystemName } from './data/rotations.ts';
import { phaseLabels, phaseTips, type Phase } from './data/formations.ts';
import { liberoTip } from './data/libero.ts';

const { rotation, rotateForward, rotateBack, goTo } = useRotation();

const systemNames: SystemName[] = [ '5-1', '6-2', '4-2'];
const systemName = ref<SystemName>('5-1');
const system = computed(() => systems[systemName.value]);
const phases: Phase[] = ['base', 'serve', 'receive', 'defense'];
const phase = ref<Phase>('base');
const useLibero = ref(true);
const libero = computed(() => liberoTip(system.value, rotation.value, phase.value));

const tip = computed(() => setterTip(system.value, rotation.value));
</script>

<template>
  <main class="page">
    <header>
      <h1>Volleyball Rotations</h1>
      <p class="subtitle">Step through the six rotations and see where everyone stands.</p>
    </header>

    <div class="segmented" role="tablist" aria-label="Setter system">
      <button
        v-for="name in systemNames"
        :key="name"
        role="tab"
        :aria-selected="name === systemName"
        :class="{ selected: name === systemName }"
        @click="systemName = name"
      >
        {{ name }}
      </button>
    </div>

    <div class="segmented" role="tablist" aria-label="Situation">
      <button
        v-for="p in phases"
        :key="p"
        role="tab"
        :aria-selected="p === phase"
        :class="{ selected: p === phase }"
        @click="phase = p"
      >
        {{ phaseLabels[p] }}
      </button>
    </div>

    <label class="switch">
      <input v-model="useLibero" type="checkbox" />
      <span class="track" aria-hidden="true"></span>
      Libero
    </label>

    <section class="card">
      <Court :rotation="rotation" :system="system" :phase="phase" :use-libero="useLibero" />
    </section>

    <nav class="stepper" aria-label="Rotation">
      <button class="icon-btn" aria-label="Previous rotation" @click="rotateBack">‹</button>
      <div class="dots">
        <button
          v-for="n in 6"
          :key="n"
          class="step-dot"
          :class="{ current: n - 1 === rotation }"
          :aria-label="`Rotation ${n}`"
          @click="goTo(n - 1)"
        />
      </div>
      <button class="icon-btn" aria-label="Next rotation" @click="rotateForward">›</button>
    </nav>
    <p class="step-label">Rotation {{  rotation + 1 }} of 6</p>

    <section class="callout">
      <p class="callout-title">{{ phaseLabels[phase] }}</p>
      <p>{{ phaseTips[phase] }}</p>
      <p class="callout-setter">{{ tip }}</p>
      <p v-if="useLibero" class="callout-setter">{{ libero }}</p>
    </section>

    <ul class="legend">
      <li><span class="swatch swatch-active"></span>Active setter</li>
      <li v-if="system.setters.length > 1"><span class="swatch swatch-setter"></span>Other setter</li>
      <li><span class="swatch swatch-player"></span>Player</li>
      <li v-if="useLibero"><span class="swatch swatch-libero"></span>Libero</li>
    </ul>

    <p class="roles">S - Setter · OH - Outside hitter · MB - Middle blocker · OPP - Opposite</p>
  </main>
</template>

<style scoped>
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 16px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 6px;
  color: var(--muted);
  font-size: 15px;
}

/* Segmented control: a pill track with the selected option raised */
.segmented {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: var(--surface-2);
  border-radius: 999px;
}

.segmented button {
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.segmented button.selected {
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.card {
  width: 100%;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

/* Stepper: round prev/next buttons around six dots */
.stepper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--ink);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.icon-btn:hover {
  background: var(--surface-2);
}

.icon-btn:active {
  transform: scale(0.95);
}

.dots {
  display: flex;
  gap: 8px;
}

.step-dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--border-strong);
  cursor: pointer;
  transition: width 0.25s, background 0.25s;
}

.step-dot.current {
  width: 28px;
  background: var(--ink);
}

.step-label {
  margin-top: -12px;
  font-size: 13px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.callout {
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  font-size: 15px;
  line-height: 1.5;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 12px;
}

.callout p + p {
  margin-top: 8px;
}

.callout-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.callout-setter {
  font-size: 14px;
  color: var(--muted);
}

.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
  font-size: 13px;
  color: var(--muted);
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

.roles {
  font-size: 12px;
  color: var(--muted);
}

/* A real checkbox, visually replaced by a sliding track */
.switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.switch input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.track {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--border-strong);
  transition: background 0.2s;
}

.track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.switch input:checked + .track {
  background: var(--libero);
}

.switch input:checked + .track::after {
  transform: translateX(16px);
}

.switch input:focus-visible + .track {
  outline: 2px solid var(--libero);
  outline-offset: 2px;
}

.swatch-libero {
  background: var(--libero);
}
</style>
