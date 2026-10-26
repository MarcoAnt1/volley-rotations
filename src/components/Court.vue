<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
    positionCoords,
    positionOf,
    activeSetter,
    overlapViolations,
    PLAYERS,
    type Position,
    type PlayerId,
    type Point,
    type Violation,
    type VolleySystem,
} from '@/data/rotations';
import { formation, SERVER_ZONE, type Phase } from '@/data/formations';
import { liberoReplaces, BENCH_SPOT } from '@/data/libero';
import PlayerToken from './PlayerToken.vue';

const props = defineProps<{
    rotation: number;
    system: VolleySystem;
    phase: Phase;
    useLibero: boolean;
}>();

const zones: Position[] = PLAYERS;
const everyone: PlayerId[] = [...PLAYERS, 'L'];

// Who we draw: the six in the lineup, plus the libero when enabled.
const people = computed<PlayerId[]>(() => (props.useLibero ? everyone : PLAYERS));

const svg = ref<SVGSVGElement | null>(null);

const overrides = reactive<Partial<Record<PlayerId, Point>>>({});

const currentFormation = computed(() => formation(props.phase, props.system, props.rotation));

// The lineup player the libero is standing in for (null = libero on the bench).
const replaced = computed<Position | null>(() =>
    props.useLibero ? liberoReplaces(props.system, props.rotation, props.phase) : null,
);

const BENCH_ROOM = 70;
const viewLeft = computed(() => (props.useLibero ? -BENCH_ROOM : 0));
const viewWidth = computed(() => 360 - viewLeft.value);

// Where someone stands before any dragging.
function spotFor(id: PlayerId): Point {
    if (id === 'L') {
        const r = replaced.value;
        return r === null ? BENCH_SPOT : currentFormation.value[positionOf(r, props.rotation)];
    }
    if (id === replaced.value) return BENCH_SPOT;
    return currentFormation.value[positionOf(id, props.rotation)];
}

function coordsFor(id: PlayerId): Point {
    return overrides[id] ?? spotFor(id);
}

function isBenched(id: PlayerId): boolean {
    return id === 'L' ? replaced.value === null : id === replaced.value;
}

function labelFor(id: PlayerId): string {
    return id === 'L' ? 'L' : props.system.roles[id];
}

function toSvgPoint(event: PointerEvent): Point {
    const el = svg.value!;
    const screenToSvg = el.getScreenCTM()!.inverse();
    const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(screenToSvg);
    return { x: local.x, y: local.y };
}

function onDrag(id: PlayerId, event: PointerEvent) {
    overrides[id] = toSvgPoint(event);
}

function resetPositions() {
    for (const id of everyone) delete overrides[id];
}

const hasOverrides = computed(() => everyone.some((id) => overrides[id] !== undefined));

watch(
    [() => props.rotation, () => props.phase, () => props.system, () => props.useLibero],
    resetPositions,
);

const active = computed<Position>(() => activeSetter(props.system, props.rotation));

// Who stands in each zone: a lineup player, or the libero in their place.
const personByZone = computed<Record<Position, PlayerId>>(() => {
    const map = {} as Record<Position, PlayerId>;
    for (const player of PLAYERS) {
        map[positionOf(player, props.rotation)] = player === replaced.value ? 'L' : player;
    }
    return map;
});

const coordByPosition = computed<Record<Position, Point>>(() => {
    const map = {} as Record<Position, Point>;
    for (const zone of zones) map[zone] = coordsFor(personByZone.value[zone]);
    return map;
});

const violations = computed<Violation[]>(() => {
    const exempt = props.phase === 'serve' ? SERVER_ZONE : undefined;
    return overlapViolations(coordByPosition.value, exempt);
});

const invalidPlayers = computed<Set<PlayerId>>(() => {
    const flagged = new Set<PlayerId>();
    for (const violation of violations.value) {
        flagged.add(personByZone.value[violation.a]);
        flagged.add(personByZone.value[violation.b]);
    }
    return flagged;
});
</script>

<template>
    <div class="court-wrap">
        <svg ref="svg" class="court" :viewBox="`${viewLeft} 0 ${viewWidth} 390`" xmlns="http://www.w3.org/2000/svg">
            <!-- Free zone: the area around the court -->
            <rect class="free-zone" x="-70" y="0" width="430" height="390" rx="16"/>

            <!-- Bench: where whoever is off court waits -->
            <g v-if="useLibero">
                <rect class="bench" x="-62" y="150" width="56" height="200" rx="12"/>
                <text class="bench-label" x="-34" y="168" text-anchor="middle">BENCH</text>
            </g>

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

.bench {
    fill: none;
    stroke: var(--border-strong);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
}

.bench-label {
    fill: var(--muted);
    font: 600 9px Inter, system-ui, sans-serif;
    letter-spacing: 0.15em;
}
</style>