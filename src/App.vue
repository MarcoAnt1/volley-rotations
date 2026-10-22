<script setup lang="ts">
import Court from './components/Court.vue';
import { useRotation } from './composables/useRotation.js';

const { rotation, rotateForward, rotateBack } = useRotation();
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
</style>
