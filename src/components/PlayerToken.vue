<script setup lang="ts">
import { ref } from 'vue';
import type { Position } from '@/data/rotations';

const props = defineProps<{
  player: Position;
  x: number;
  y: number;
  isSetter: boolean;
  isActiveSetter: boolean;
  invalid: boolean;
}>();

const emit = defineEmits<{
    drag: [player: Position, event: PointerEvent];
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
        :class="{ setter: isSetter, 'active-setter': isActiveSetter, dragging, invalid }"
        :transform="`translate(${x}, ${y})`"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
    >
        <circle r="24" />
        <text text-anchor="middle" dominant-baseline="central">{{ player }}</text>
    </g>
</template>

<style scoped>
.token {
    cursor: grab;
    touch-action: none;
    transition: transform 0.6s ease;
}

.token.dragging {
    cursor: grabbing;
    transition: none;
}

.token circle {
    fill: #2b6cb0;
    stroke: #ffffff;
    stroke-width: 2;
}

.token text {
    fill: #ffffff;
    font: 600 18px system-ui, sans-serif;
    user-select: none;
}

.token.setter circle {
    fill: #0c8599;
    stroke: #ffd43b;
    stroke-width: 3;
}

.token.active-setter circle {
    fill: #2b8a3e;
    stroke: #ffd43b;
    stroke-width: 2;
}

.token.invalid circle {
    stroke: #e03131;
    stroke-width: 4;
}
</style>