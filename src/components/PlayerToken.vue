<script setup lang="ts">
import { ref } from 'vue';
import type { PlayerId } from '@/data/rotations';

const props = defineProps<{
  player: PlayerId;
  label: string;
  x: number;
  y: number;
  isSetter: boolean;
  isActiveSetter: boolean;
  isLibero: boolean;
  benched: boolean;
  invalid: boolean;
}>();

const emit = defineEmits<{
    drag: [player: PlayerId, event: PointerEvent];
}>();

const dragging = ref(false);

function onPointerDown(event: PointerEvent) {
    dragging.value = true;
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
    if (!dragging.value) return;
    emit('drag', props.player, event);
}

function onPointerUp(event: PointerEvent) {
    dragging.value = false;
    (event.currentTarget as Element).releasePointerCapture(event.pointerId);
}
</script>

<template>
    <g
        class="token"
        :class="{ setter: isSetter, 'active-setter': isActiveSetter, libero: isLibero, benched, dragging, invalid }"
        :transform="`translate(${x}, ${y})`"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
    >
        <circle r="24" />
        <text text-anchor="middle" dominant-baseline="central">{{ label }}</text>
    </g>
</template>

<style scoped>
.token {
    cursor: grab;
    touch-action: none;
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
    transition: fill 0.2s, stroke 0.2s, filter 0.2s;
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