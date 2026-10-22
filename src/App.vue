<script setup lang="ts">
import { computed } from 'vue';
import Court from './components/Court.vue';
import { useRotation } from './composables/useRotation.js';
import { positionOf, setterTips, SETTER } from './data/rotations.js';

const { rotation, rotateForward, rotateBack } = useRotation();

const setterTip = computed(() => setterTips[positionOf(SETTER, rotation.value)]);
</script>

<template>
  <main>
    <h1>Volleyball Rotations</h1>
    <Court :rotation="rotation" />
    <div class="controls">
      <button @click="rotateBack">‹ Back</button>
      <span>Rotation {{ rotation + 1 }} of 6</span>
      <button @click="rotateForward">Forward ›</button>
    </div>
    <p class="tip">{{ setterTip }}</p>
    <p class="legend"><span class="dot"></span> Setter (5-1 system)</p>
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
  background: #2b8a3e;
  border: 2px solid #ffd43b;
}
</style>
