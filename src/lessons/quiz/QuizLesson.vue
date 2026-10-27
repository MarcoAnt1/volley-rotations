<script setup lang="ts">
import { computed, ref } from 'vue'
import Court from '@/components/court/Court.vue'
import { questions, results } from '@/content/quiz'
import { roleInfo } from '@/content/roles'
import { topRole, totalScores, type Points } from '@/domain/quiz'
import { playersIn } from '@/domain/roles'
import { systems } from '@/domain/systems'

const system = systems['5-1']

// The quiz's whole state: the points of each answer picked so far.
const picks = ref<Points[]>([])

// The question being asked, or undefined once every question is answered.
const current = computed(() => questions[picks.value.length])

const role = computed(() => topRole(totalScores(picks.value)))
const result = computed(() => results[role.value])

function choose(points: Points) {
  picks.value.push(points)
}

function back() {
  picks.value.pop()
}

function restart() {
  picks.value = []
}
</script>

<template>
  <article class="lesson">
    <header>
      <h1>Which role are you?</h1>
      <p class="subtitle">{{ questions.length }} quick questions to find your spot on the court.</p>
    </header>

    <Transition name="fade" mode="out-in">
      <section v-if="current" :key="picks.length" class="step">
        <p class="eyebrow">Question {{ picks.length + 1 }} of {{ questions.length }}</p>
        <h2>{{ current.text }}</h2>

        <ul class="answers">
          <li v-for="answer in current.answers" :key="answer.text">
            <button class="answer" @click="choose(answer.points)">{{ answer.text }}</button>
          </li>
        </ul>

        <button v-if="picks.length > 0" class="text-btn" @click="back">‹ Back</button>
      </section>

      <section v-else class="step">
        <p class="eyebrow">You are…</p>
        <h2 class="result-title">{{ result.title }}</h2>
        <p class="result-role">{{ roleInfo[role].name }}</p>
        <p>{{ result.text }}</p>

        <div class="card">
          <Court
            :rotation="0"
            :system="system"
            phase="play"
            use-libero
            :focus="playersIn(role, system)"
          />
        </div>

        <div class="actions">
          <button class="text-btn" @click="restart">Take it again</button>
          <RouterLink class="text-btn" to="/lessons/roles">Learn about the roles →</RouterLink>
        </div>
      </section>
    </Transition>
  </article>
</template>

<style scoped>
.step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

h2 {
  font-size: 20px;
  font-weight: 700;
}

.answers {
  width: 100%;
  list-style: none;
  display: grid;
  gap: 10px;
}

.answer {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  color: var(--ink);
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.1s;
}

.answer:hover {
  border-color: var(--accent);
}

.answer:active {
  transform: scale(0.99);
}

.text-btn {
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.text-btn:hover {
  color: var(--ink);
}

.result-title {
  font-size: 32px;
  color: var(--accent);
}

.result-role {
  margin-top: -12px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>