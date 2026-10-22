<template>
    <svg class="court" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
        <!-- Court floor -->
        <rect class="floor" x="40" y="40" width="280" height="280"/>

        <!-- Net runs along the top edge of the court -->
        <line class="net" x1="40" y1="40" x2="320" y2="40"/>

        <!-- Attack line: 3m from the net = one third of the 9m depth -->
        <line class="attack-line" x1="40" y1="133" x2="320" y2="133"/>

        <!-- One group per player: a circle + its position number.
             We position the whole group with translate(), because that
             same transform is what we'll animate in Stage 2. -->
        <g
            v-for="player in players"
            :key="player"
            class="player"
            :transform="`translate(${coordsFor(player).x}, ${coordsFor(player).y})`"
        >
            <circle r="24" />
            <text text-anchor="middle" dominant-baseline="central">{{ player }}</text>
        </g>
    </svg>
</template>

<script setup lang="ts">
import { positionCoords, positionOf, type Position, type Point } from '@/data/rotations';

const props = defineProps<{ rotation: number }>();

const players: Position[] = [1, 2, 3, 4, 5, 6];

function coordsFor(player: Position): Point {
    return positionCoords[positionOf(player, props.rotation)];
}
</script>

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

.player circle {
    fill: #2b6cb0;
    stroke: #ffffff;
    stroke-width: 2;
    transition: transform 0.6s ease;
}

.player text {
    fill: #ffffff;
    font: 600 18px system-ui, sans-serif;
}
</style>