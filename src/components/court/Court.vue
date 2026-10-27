<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { PLAYERS, type PlayerId, type Point, type Position } from '@/domain/court'
import CourtFloor from './CourtFloor.vue'
import PlayerToken from './PlayerToken.vue'
import { formation, type Phase } from '@/domain/formations'
import { BENCH_SPOT, liberoReplaces } from '@/domain/libero'
import { overlapViolations, type Violation } from '@/domain/overlap'
import { SERVER_ZONE, positionOf } from '@/domain/rotation'
import { activeSetter, type VolleySystem } from '@/domain/systems'
import { violationText } from '@/content/rotations'

const props = defineProps<{
  rotation: number
  system: VolleySystem
  phase: Phase
  useLibero: boolean
}>()

const everyone: PlayerId[] = [...PLAYERS, 'L']

// Who we draw: the six in the lineup, plus the libero when enabled.
const people = computed<PlayerId[]>(() => (props.useLibero ? everyone : PLAYERS))

const svg = ref<SVGSVGElement | null>(null)

const overrides = reactive<Partial<Record<PlayerId, Point>>>({})

const currentFormation = computed(() => formation(props.phase, props.system, props.rotation))

// The lineup player the libero is standing in for (null = libero on the bench).
const replaced = computed<Position | null>(() =>
  props.useLibero ? liberoReplaces(props.system, props.rotation, props.phase) : null,
)

const BENCH_ROOM = 70
const viewLeft = computed(() => (props.useLibero ? -BENCH_ROOM : 0))
const viewWidth = computed(() => 360 - viewLeft.value)

// Where someone stands before any dragging.
function spotFor(id: PlayerId): Point {
  if (id === 'L') {
    const r = replaced.value
    return r === null ? BENCH_SPOT : currentFormation.value[positionOf(r, props.rotation)]
  }
  if (id === replaced.value) return BENCH_SPOT
  return currentFormation.value[positionOf(id, props.rotation)]
}

function coordsFor(id: PlayerId): Point {
  return overrides[id] ?? spotFor(id)
}

function isBenched(id: PlayerId): boolean {
  return id === 'L' ? replaced.value === null : id === replaced.value
}

function labelFor(id: PlayerId): string {
  return id === 'L' ? 'L' : props.system.roles[id]
}

function toSvgPoint(event: PointerEvent): Point {
  const el = svg.value!
  const screenToSvg = el.getScreenCTM()!.inverse()
  const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToSvg)
  return { x: local.x, y: local.y }
}

function onDrag(id: PlayerId, event: PointerEvent) {
  overrides[id] = toSvgPoint(event)
}

function resetPositions() {
  for (const id of everyone) delete overrides[id]
}

const hasOverrides = computed(() => everyone.some((id) => overrides[id] !== undefined))

watch(
  [() => props.rotation, () => props.phase, () => props.system, () => props.useLibero],
  resetPositions,
)

const active = computed<Position>(() => activeSetter(props.system, props.rotation))

// Who stands in each zone: a lineup player, or the libero in their place.
const personByZone = computed<Record<Position, PlayerId>>(() => {
  const map = {} as Record<Position, PlayerId>
  for (const player of PLAYERS) {
    map[positionOf(player, props.rotation)] = player === replaced.value ? 'L' : player
  }
  return map
})

const coordByPosition = computed<Record<Position, Point>>(() => {
  const map = {} as Record<Position, Point>
  for (const zone of PLAYERS) {
    map[zone] = coordsFor(personByZone.value[zone])
  }
  return map
})

const violations = computed<Violation[]>(() => {
  const exempt = props.phase === 'serve' ? SERVER_ZONE : undefined
  return overlapViolations(coordByPosition.value, exempt)
})

const invalidPlayers = computed<Set<PlayerId>>(() => {
  const flagged = new Set<PlayerId>()
  for (const violation of violations.value) {
    flagged.add(personByZone.value[violation.a])
    flagged.add(personByZone.value[violation.b])
  }
  return flagged
})
</script>

<template>
  <div class="court-wrap">
    <svg
      ref="svg"
      class="court"
      :viewBox="`${viewLeft} 0 ${viewWidth} 390`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <CourtFloor :view-left="viewLeft" :view-width="viewWidth" :show-bench="useLibero" />

      <PlayerToken
        v-for="id in people"
        :key="id"
        :player="id"
        :label="labelFor(id)"
        :x="coordsFor(id).x"
        :y="coordsFor(id).y"
        :is-setter="id !== 'L' && system.setters.includes(id)"
        :is-active-setter="id === active"
        :is-libero="id === 'L'"
        :benched="isBenched(id)"
        :invalid="invalidPlayers.has(id)"
        @drag="onDrag"
      />
    </svg>

    <div class="footer-row">
      <p v-if="violations.length" class="warning">
        ⚠ Overlap: {{ violations.map(violationText).join('; ') }}
      </p>

      <button class="reset" :disabled="!hasOverrides" @click="resetPositions">
        Reset positions
      </button>
    </div>
  </div>
</template>

<style scoped>
.court-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.court {
  display: block;
  width: 100%;
  max-width: 460px;
  height: auto;
  user-select: none;
  touch-action: none;
}

.footer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 460px;
  min-height: 32px;
}

.warning {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  color: var(--danger);
  background: color-mix(in srgb, var(--danger) 12%, transparent);
}

.reset {
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reset:hover:not(:disabled) {
  background: var(--surface-2);
}

.reset:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
