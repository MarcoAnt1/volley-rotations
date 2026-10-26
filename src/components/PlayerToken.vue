<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import type { PlayerId } from '@/domain/court';

const props = defineProps<{
  player: PlayerId
  label: string
  x: number
  y: number
  isSetter: boolean
  isActiveSetter: boolean
  isLibero: boolean
  benched: boolean
  invalid: boolean
}>()

const emit = defineEmits<{
  drag: [player: PlayerId, event: PointerEvent]
}>()

const dragging = ref(false)

// Which finger (or mouse) is dragging us. Not reactive: the template never shows it.
let activePointer: number | null = null

function onPointerDown(event: PointerEvent) {
  // Ignore right-clicks, and a second finger while one is already dragging.
  if (event.button !== 0 || activePointer !== null) return

  activePointer = event.pointerId
  dragging.value = true

  // Follow the pointer anywhere on the page, not just over this circle.
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDragging)
  window.addEventListener('pointercancel', stopDragging)
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerId !== activePointer) return
  emit('drag', props.player, event)
}

function stopDragging(event?: PointerEvent) {
  if (event && event.pointerId !== activePointer) return

  activePointer = null
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDragging)
  window.removeEventListener('pointercancel', stopDragging)
}

// If this token disappears mid-drag (e.g. the libero is switched off), clean up.
onBeforeUnmount(() => stopDragging())
</script>

<template>
  <g
    class="token"
    :class="{
      setter: isSetter,
      'active-setter': isActiveSetter,
      libero: isLibero,
      benched,
      dragging,
      invalid,
    }"
    :transform="`translate(${x}, ${y})`"
    @pointerdown="onPointerDown"
  >
    <circle r="24" />
    <text text-anchor="middle" dominant-baseline="central">{{ label }}</text>
  </g>
</template>

<style scoped>
.token {
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.token.dragging {
  cursor: grabbing;
  transition: none;
}

.token circle {
  fill: var(--player);
  stroke: transparent;
  stroke-width: 3;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
  transition:
    fill 0.2s,
    stroke 0.2s,
    filter 0.2s;
}

.token.dragging circle {
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
}

.token.setter circle {
  stroke: var(--accent);
}

.token.active-setter circle {
  fill: var(--accent);
  stroke: transparent;
}

.token.active-setter text {
  fill: var(--accent-ink);
}

.token.benched {
  opacity: 0.6;
}

.token.libero circle {
  fill: var(--libero);
}

.token.libero text {
  fill: var(--libero-ink);
}

.token.invalid circle {
  stroke: var(--danger);
}
</style>
