<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="callout">
    <p class="callout-title">{{ title }}</p>
    <slot />
  </section>
</template>

<style scoped>
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.callout :slotted(.secondary) {
  font-size: 14px;
  color: var(--muted);
}
</style>
