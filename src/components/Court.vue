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
import { formation, SERVER_ZONE, type Phase } from '@/data/formations.ts';
import PlayerToken from './PlayerToken.vue';

const props = defineProps<{ rotation: number; system: VolleySystem; phase: Phase }>();

const players: Position[] = [1, 2, 3, 4, 5, 6];
const zones: Position[] = [1, 2, 3, 4, 5, 6];

const svg = ref<SVGSVGElement | null>(null);

const overrides = reactive<Partial<Record<Position, Point>>>({});

const currentFormation = computed(() => formation(props.phase, props.system, props.rotation));

function coordsFor(player: Position): Point {
    return overrides[player] ?? currentFormation.value[positionOf(player, props.rotation)];
}

function toSvgPoint(event: PointerEvent): Point {
    const el = svg.value!;
    const screenToSvg = el.getScreenCTM()!.inverse();
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

watch([() => props.rotation, () => props.phase, () => props.system], resetPositions);

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

const violations = computed<Violation[]>(() => {
    if (props.phase === 'defense') return [];
    const exempt = props.phase === 'serve' ? SERVER_ZONE : undefined;
    return overlapViolations(coordByPosition.value, exempt);
});

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
        <svg ref="svg" class="court" viewBox="0 0 360 390" xmlns="http://www.w3.org/2000/svg">
            <!-- Free zone: the area around the court -->
            <rect class="free-zone" x="0" y="0" width="360" height="390" rx="16"/>
            <text class="net-label" x="180" y="22" text-anchor="middle">NET</text>

            <!-- Court floor, with the front zone slightly lighter -->
            <rect class="floor" x="40" y="40" width="280" height="280"/>
            <rect class="front-zone" x="40" y="40" width="280" height="93" />
            
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
            
            <!-- Net reaches a bit past the sidelines, with posts at both ends -->
            <line class="net" x1="28" y1="40" x2="332" y2="40" />
            <circle class="net-post" cx="28" cy="40" r="4" />
            <circle class="net-post" cx="332" cy="40" r="4" />

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

        <div class="footer-row">
            <p v-if="violations.length" class="warning">
                ⚠ Overlap: {{ violations.map((v) => v.rule).join('; ') }}
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
}

.free-zone {
    fill: var(--free-zone);
}

.floor {
    fill: var(--court);
    stroke: var(--court-line);
    stroke-width: 2;
}

.front-zone {
    fill: #ffffff;
    opacity: 0.05;
}

.net {
    stroke: var(--net);
    stroke-width: 3;
    stroke-linecap: round;
}

.net-post {
    fill: var(--net);
}

.net-label {
    fill: var(--muted);
    font: 600 10px Inter, system-ui, sans-serif;
    letter-spacing: 0.2em;
}

.attack-line {
    stroke: var(--court-line);
    stroke-width: 2;
}

.zone-line {
    stroke: #ffffff;
    stroke-width: 1;
    stroke-dasharray: 3 5;
    opacity: 0.25;
}

.zone-number {
    fill: #ffffff;
    font: 600 14px Inter, system-ui, sans-serif;
    opacity: 0.35;
    pointer-events: none;
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