<script setup lang="ts" generic="T extends string">
defineProps<{
  options: readonly T[]
  label: string // read by screen readers
  labels?: Partial<Record<T, string>> // display text; defaults to the option itself
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="segmented" role="tablist" :aria-label="label">
    <button
      v-for="option in options"
      :key="option"
      role="tab"
      :aria-selected="option === model"
      :class="{ selected: option === model }"
      @click="model = option"
    >
      {{ labels?.[option] ?? option }}
    </button>
  </div>
</template>

<style scoped>
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
  transition:
    background 0.2s,
    color 0.2s;
}

.segmented button.selected {
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}
</style>
