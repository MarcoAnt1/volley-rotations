<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="switch">
    <input v-model="model" type="checkbox" />
    <span class="track" aria-hidden="true"></span>
    <slot />
  </label>
</template>

<style scoped>
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

.switch input:checked + .track {
  background: var(--switch-on, var(--accent));
}

.switch input:checked + .track::after {
  transform: translateX(16px);
}

.switch input:focus-visible + .track {
  outline: 2px solid var(--switch-on, var(--accent));
  outline-offset: 2px;
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
</style>
