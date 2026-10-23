<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { positionCoords, positionOf, SETTER, type Position, type Point } from '@/data/rotations';
import PlayerToken from './PlayerToken.vue';

const props = defineProps<{ rotation: number }>();

const players: Position[] = [1, 2, 3, 4, 5, 6];

const svg = ref<SVGSVGElement | null>(null);

const overrides = reactive<Partial<Record<Position, Point>>>({});

function coordsFor(player: Position): Point {
    return overrides[player] ?? positionCoords[positionOf(player, props.rotation)];
}

function toSvgPoint(event: PointerEvent): Point {
    const el = svg.value;
    const screenToSvg = el?.getScreenCTM()!.inverse();
    const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToSvg);
    return { x: local.x, y: local.y };
}

function onDrag(player: Position, event: PointerEvent) {
    overrides[player] = toSvgPoint(event);
}

watch(
    () => props.rotation,
    () => {
        for (const p of players) delete overrides[p];
    },
);
</script>

<template>
    <svg ref="svg" class="court" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
        <!-- Court floor -->
        <rect class="floor" x="40" y="40" width="280" height="280"/>

        <!-- Net runs along the top edge of the court -->
        <line class="net" x1="40" y1="40" x2="320" y2="40"/>

        <!-- Attack line: 3m from the net = one third of the 9m depth -->
        <line class="attack-line" x1="40" y1="133" x2="320" y2="133"/>

        <!-- One group per player: a circle + its position number.
             We position the whole group with translate(), because that
             same transform is what we'll animate in Stage 2. -->
        <PlayerToken
            v-for="player in players"
            :key="player"
            :player="player"
            :x="coordsFor(player).x"
            :y="coordsFor(player).y"
            :is-setter="player === SETTER"
            @drag="onDrag"
        />
    </svg>
</template>

<style scoped>
.court {
    width: 100%;
    max-width: 460px;
    height: auto;
}

.floor {
    fill: #e8a23d;
    stroke: #ffffff;
    stroke-width: 3;
}

.net {
    stroke: #333333;
    stroke-width: 4;
}

.attack-line {
    stroke: #ffffff;
    stroke-width: 2;
}
</style>