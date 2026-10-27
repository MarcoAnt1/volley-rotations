<script setup lang="ts">
import { computed, ref } from 'vue'
import Court from '@/components/court/Court.vue'
import CourtLegend from '@/components/court/CourtLegend.vue'
import InfoCallout from '@/components/ui/InfoCallout.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import StepperNav from '@/components/ui/StepperNav.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import { liberoTip, phaseLabels, phaseTips, setterTip } from '@/content/rotations'
import type { Phase } from '@/domain/formations'
import { NUM_ROTATIONS } from '@/domain/rotation'
import { SYSTEM_NAMES, systems, type SystemName } from '@/domain/systems'

const PHASES: Phase[] = ['base', 'serve', 'receive']

const rotation = ref(0)
const systemName = ref<SystemName>('4-2')
const phase = ref<Phase>('base')
const useLibero = ref(false)

const system = computed(() => systems[systemName.value])
const tip = computed(() => setterTip(system.value, rotation.value))
const libero = computed(() => liberoTip(system.value, rotation.value, phase.value))
</script>

<template>
  <article class="lesson">
    <header>
      <h1>Rotations</h1>
      <p class="subtitle">Step through the six rotations and see where everyone stands.</p>
    </header>


    <SegmentedControl v-model="systemName" :options="SYSTEM_NAMES" label="Setter system" />
    <SegmentedControl v-model="phase" :options="PHASES" :labels="phaseLabels" label="Situation" />

    <ToggleSwitch v-model="useLibero" style="--switch-on: var(--libero)">Libero</ToggleSwitch>

    <section class="card">
      <Court :rotation="rotation" :system="system" :phase="phase" :use-libero="useLibero" />
    </section>

    <StepperNav v-model="rotation" :count="NUM_ROTATIONS" label="Rotation" />

    <InfoCallout :title="phaseLabels[phase]">
      <p>{{ phaseTips[phase] }}</p>
      <p class="secondary">{{ tip }}</p>
      <p v-if="useLibero" class="secondary">{{ libero }}</p>
    </InfoCallout>

    <CourtLegend :system="system" :use-libero="useLibero" />
  </article>
</template>

<style scoped>
.lesson {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card {
  width: 100%;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}
</style>
