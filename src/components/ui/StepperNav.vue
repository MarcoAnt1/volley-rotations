<script setup lang="ts">
const props = defineProps<{
  count: number
  label: string // e.g. "Rotation" → "Rotation 3 of 6"
}>()

const current = defineModel<number>({ required: true })

// Wraps around: going back from the first lands on the last.
function go(n: number) {
  current.value = ((n % props.count) + props.count) % props.count
}
</script>

<template>
  <div class="stepper-wrap">
    <nav class="stepper" :aria-label="label">
      <button class="icon-btn" :aria-label="`Previous ${label}`" @click="go(current - 1)">‹</button>
      <div class="dots">
        <button
          v-for="n in count"
          :key="n"
          class="step-dot"
          :class="{ current: n - 1 === current }"
          :aria-label="`${label} ${n}`"
          @click="go(n - 1)"
        />
      </div>
      <button class="icon-btn" :aria-label="`Next ${label}`" @click="go(current + 1)">›</button>
    </nav>
    <p class="step-label">{{ label }} {{ current + 1 }} of {{ count }}</p>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stepper-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
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
  transition:
    width 0.25s,
    background 0.25s;
}

.step-dot.current {
  width: 28px;
  background: var(--ink);
}

.step-label {
  font-size: 13px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
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
  transition:
    background 0.2s,
    transform 0.1s;
}
</style>
