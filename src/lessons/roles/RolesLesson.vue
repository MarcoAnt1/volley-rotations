<script setup lang="ts">
import { computed, ref } from 'vue'
import Court from '@/components/court/Court.vue'
import InfoCallout from '@/components/ui/InfoCallout.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import StepperNav from '@/components/ui/StepperNav.vue'
import { roleInfo, roleShort, viewLabels } from '@/content/roles'
import { ROLE_GROUPS, playersIn, type RoleGroup } from '@/domain/roles'
import { NUM_ROTATIONS } from '@/domain/rotation'
import { systems } from '@/domain/systems'
import type { Phase } from '@/domain/formations'

const VIEWS: Phase[] = ['base', 'play']
const view = ref<Phase>('base')

// The 5-1 is the only system with all five roles.
const system = systems['5-1']

const group = ref<RoleGroup>('setter')
const rotation = ref(0)

const info = computed(() => roleInfo[group.value])
const focus = computed(() => playersIn(group.value, system))
</script>

<template>
  <article class="lesson">
    <header>
      <h1>Positions &amp; roles</h1>
      <p class="subtitle">Five jobs, six players. Pick a role to see who does it and where.</p>
    </header>

    <SegmentedControl v-model="group" :options="ROLE_GROUPS" :labels="roleShort" label="Role" />
    <SegmentedControl v-model="view" :options="VIEWS" :labels="viewLabels" label="Moment" />

    <section class="card">
      <Court :rotation="rotation" :system="system" :phase="view" use-libero :focus="focus" />
    </section>

    <StepperNav v-model="rotation" :count="NUM_ROTATIONS" label="Rotation" />

    <InfoCallout :title="info.name">
      <p>{{ info.summary }}</p>
      <ul class="duties">
        <li v-for="duty in info.duties" :key="duty">{{ duty }}</li>
      </ul>
      <p><strong>Plays:</strong> {{ info.playsAt }}</p>
      <p class="secondary">{{ info.traits }}</p>
    </InfoCallout>
  </article>
</template>

<style scoped>
.duties {
  padding-left: 20px;
  list-style: disc;
}

.duties li + li {
  margin-top: 4px;
}
</style>
