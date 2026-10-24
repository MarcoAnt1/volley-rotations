<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
    positionCoords,
    positionOf,
    activeSetter,
    overlapViolations,
    type Position,
    type Point,
    type Violation,
    type VolleySystem
} from '@/data/rotations';
import PlayerToken from './PlayerToken.vue';

const props = defineProps<{ rotation: number; system: VolleySystem }>();

const players: Position[] = [1, 2, 3, 4, 5, 6];
const zones: Position[] = [1, 2, 3, 4, 5, 6];

const svg = ref<SVGSVGElement | null>(null);

const overrides = reactive<Partial<Record<Position, Point>>>({});

function coordsFor(player: Position): Point {
    return overrides[player] ?? positionCoords[positionOf(player, props.rotation)];
}

function toSvgPoint(event: PointerEvent): Point {
    const el = svg.value!;
    const screenToSvg = el?.getScreenCTM()!.inverse();
    const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToSvg);
    return { x: local.x, y: local.y };
}

function onDrag(player: Position, event: PointerEvent) {
    overrides[player] = toSvgPoint(event);
}

function resetPositions() {
    for (const p of players) delete overrides[p];
}

const hasOverrides = computed(() => players.some((p) => overrides[p] !== undefined));

watch(() => props.rotation, resetPositions);

const active = computed<Position>(() => activeSetter(props.system, props.rotation));

const playerByPosition = computed<Record<Position, Position>>(() => {
    const map = {} as Record<Position, Position>;
    for (const player of players) {
        map[positionOf(player, props.rotation)] = player;
    }
    return map;
});

const coordByPosition = computed<Record<Position, Point>>(() => {
    const map = {} as Record<Position, Point>;
    for (const player of players) {
        map[positionOf(player, props.rotation)] = coordsFor(player);
    }
    return map;
});

const violations = computed<Violation[]>(() => overlapViolations(coordByPosition.value));

const invalidPlayers = computed<Set<Position>>(() => {
    const flagged = new Set<Position>;
    for (const violation of violations.value) {
        flagged.add(playerByPosition.value[violation.a]);
        flagged.add(playerByPosition.value[violation.b]);
    }
    return flagged;
});

</script>

<template>
    <div class="court-wrap">
        <svg ref="svg" class="court" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
            <text class="net-label" x="180" y="30" text-anchor="middle">NET</text>
            <!-- Court floor -->
            <rect class="floor" x="40" y="40" width="280" height="280"/>
            
            <!-- Net runs along the top edge of the court -->
            <line class="net" x1="40" y1="40" x2="320" y2="40"/>
            
            <!-- Attack line: 3m from the net = one third of the 9m depth -->
            <line class="attack-line" x1="40" y1="133" x2="320" y2="133"/>

            <line class="zone-line" x1="133.3" y1="40" x2="133.3" y2="320"/>
            <line class="zone-line" x1="226.7" y1="40" x2="226.7" y2="320"/>

            <text
                v-for="zone in zones"
                :key="`zone-${zone}`"
                class="zone-number"
                :x="positionCoords[zone].x - 34"
                :y="positionCoords[zone].y - 34"
                text-anchor="middle"
                dominant-baseline="central"
            >
                {{  zone }}
            </text>
            
            <PlayerToken
                v-for="player in players"
                :key="player"
                :player="player"
                :label="system.roles[player]"
                :x="coordsFor(player).x"
                :y="coordsFor(player).y"
                :is-setter="system.setters.includes(player)"
                :is-active-setter="player === active"
                :invalid="invalidPlayers.has(player)"
                @drag="onDrag"
            />
        </svg>

        <p v-if="violations.length" class="warning">
            ⚠ Overlap: {{ violations.map((v) => v.rule).join('; ') }}
        </p>

        <button class="reset" :disabled="!hasOverrides" @click="resetPositions">
            Reset positions
        </button>
    </div>
</template>

<style scoped>
.court-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.court {
    width: 100%;
    max-width: 460px;
    height: auto;
}

.net-label {
    fill: #333333;
    font: 600 12px system-ui, sans-serif;
    letter-spacing: 2px;
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

.zone-line {
    stroke: #ffffff;
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.5;
}

.zone-number {
    fill: #ffffff;
    font: 700 16px system-ui, sans-serif;
    opacity: 0.6;
    pointer-events: none;
}

.warning {
    max-width: 420px;
    margin: 12px auto 0;
    color: #e03131;
    font-weight: 600;
    line-height: 1.4;
}

.reset {
    margin-top: 12px;
    font-size: 14px;
    padding: 6px 14px;
    cursor: pointer;
}

.reset:disabled {
    opacity: 0.5;
    cursor: default;
}
</style>