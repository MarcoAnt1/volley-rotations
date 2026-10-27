<script setup lang="ts">
import { lessons } from '@/lessons'
</script>

<template>
  <section class="home">
    <header>
      <h1>Learn volleyball</h1>
      <p class="subtitle">Short, interactive lessons. Pick one to start.</p>
    </header>

    <ul class="lessons">
      <li v-for="lesson in lessons" :key="lesson.slug">
        <RouterLink class="lesson-card" :to="`/lessons/${lesson.slug}`">
          <span class="lesson-title">{{ lesson.title }}</span>
          <span class="lesson-summary">{{ lesson.summary }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.lessons {
  list-style: none;
  display: grid;
  gap: 12px;
  text-align: left;
}

.lesson-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  color: var(--ink);
  text-decoration: none;
  transition:
    border-color 0.2s,
    transform 0.1s;
}

.lesson-card:hover {
  border-color: var(--accent);
}

.lesson-card:active {
  transform: scale(0.99);
}

.lesson-title {
  font-size: 17px;
  font-weight: 700;
}

.lesson-summary {
  font-size: 14px;
  color: var(--muted);
}
</style>
