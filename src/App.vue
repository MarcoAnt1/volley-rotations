<script setup lang="ts">
import { ref, computed } from 'vue';
import Court from './components/Court.vue';
import { useRotation } from './composables/useRotation.js';
import { systems, setterTip, type SystemName } from './data/rotations.js';

const { rotation, rotateForward, rotateBack } = useRotation();

const systemNames: SystemName[] = [ '5-1', '6-2', '4-2'];
const systemName = ref<SystemName>('5-1');
const system = computed(() => systems[systemName.value]);

const tip = computed(() => setterTip(system.value, rotation.value));
</script>

<template>
  <main>
    <h1>Volleyball Rotations</h1>

    <div class="systems">
      <button
        v-for="name in systemNames"
        :key="name"
        :class="{ selected: name === systemName }"
        @click="systemName = name"
      >
        {{ name }}
      </button>
    </div>

    <Court :rotation="rotation" :system="system" />

    <div class="controls">
      <button @click="rotateBack">‹ Back</button>
      <span>Rotation {{ rotation + 1 }} of 6</span>
      <button @click="rotateForward">Forward ›</button>
    </div>

    <p class="tip">{{ tip }}</p>

    <p class="legend">
      <span class="dot dot-setter"></span> Active setter
      <template v-if="system.setters.length > 1">
        <span class="dot dot-setter"></span> Other setter
      </template>
    </p>

    <p class="roles">S - Setter · OH - Outside hitter · MB - Middle blocker · OPP - Opposite</p>
  </main>
</template>

<style scoped>
main {
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
  font-family: system-ui, sans-serif;
}

.systems {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.systems button {
  font-size: 15px;
  padding: 6px 14px;
  border: 1px solid #ccc;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
}

.systems button.selected {
  background: #2b8a3e;
  color: #ffffff;
  border-color: #2b8a3e;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.controls button {
  font-size: 16px;
  padding: 6px 14px;
  cursor: pointer;
}

.tip {
  max-width: 420px;
  margin: 16px auto 0;
  line-height: 1.4;
  color: #333;
}

.legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 14px;
  color: #555;
}

.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.dot-active {
  background: #2b8a3e;
  border: 2px solid #ffd43b;
}

.dot-setter {
  background: #0c8599;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px #ccc;
}

.roles {
  margin-top: 4px;
  font-size: 13;
  color: #777;
}
</style>
