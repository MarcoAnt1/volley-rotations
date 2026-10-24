import { 
    positionCoords,
    positionOf,
    activeSetter,
    isFrontRow,
    FRONT_BEHIND,
    LEFT_OF,
    type Position,
    type Point,
    type Role,
    type VolleySystem
 } from "./rotations";

 export type Phase = 'base' | 'serve' | 'receive' | 'defense';

 export const phaseLabels: Record<Phase, string> = {
    base: 'Default',
    serve: 'Serving',
    receive: 'Reception',
    defense: 'Defense',
 };

export const phaseTips: Record<Phase, string> = {
    base: 'The rotational order: who stands in which zone. Every other situation starts from here.',
    serve: 'We serve. The player in zone 1 serves from behind the end line; the front row waits at the net to block. The overlap rule applies to everyone except the server.',
    receive: 'They serve. The two outside hitters and the back-row middle form the passing line. The setter, the opposite and the front-row middle stay out of the way so the setter can reach the target. Every layout is legal under the overlap rule.',
    defense: 'The serve is gone, so players switch to their specialty spots: outside hitters left, middles in the middle, setter and opposite right. Overlap no longer applies.',
};

export const SERVER_ZONE: Position = 1;

const PLAYERS: Position[] = [1, 2, 3, 4, 5, 6];

// Serve receive, keyed by the zone the ACTIVE SETTER is in.
// Passers: both outside hitters + the back-row middle.
// Hiders: setter, opposite (or second setter), front-row middle.
// Every layout satisfies the overlap rule.
const receiveFormations: Record<Position, Record<Position, Point>> = {
    // Setter in 1: hides deep right, behind the right-side passer.
    1: {
        4: { x: 80, y: 70 }, 3: { x: 170, y: 70 }, 2: { x: 255, y: 215 },
        5: { x: 90, y: 230 }, 6: { x: 180, y: 240 }, 1: { x: 300, y: 270 },
    },
    // Setter in 6: tucked right behind the front-middle player.
    6: {
        4: { x: 80, y: 205 }, 3: { x: 190, y: 65 }, 2: { x: 280, y: 65 },
        5: { x: 150, y: 250 }, 6: { x: 200, y: 120 }, 1: { x: 265, y: 235 },
    },
    // Setter in 5: hides behind the front-left middle — longest run to the target.
    5: {
        4: { x: 55, y: 65 }, 3: { x: 100, y: 200 }, 2: { x: 290, y: 65 },
        5: { x: 60, y: 125 }, 6: { x: 175, y: 250 }, 1: { x: 270, y: 235 },
    },
    // Setter in 4: at the net, as far right as the middle allows.
    4: {
        4: { x: 130, y: 65 }, 3: { x: 190, y: 65 }, 2: { x: 265, y: 210 },
        5: { x: 85, y: 225 }, 6: { x: 180, y: 240 }, 1: { x: 300, y: 285 },
    },
    // Setter in 3: at the net, middle-right; the back-row opposite hides deep.
    3: {
        4: { x: 85, y: 200 }, 3: { x: 200, y: 65 }, 2: { x: 280, y: 65 },
        5: { x: 150, y: 250 }, 6: { x: 195, y: 295 }, 1: { x: 245, y: 230 },
    },
    // Setter in 2: already at the target.
    2: {
        4: { x: 70, y: 65 }, 3: { x: 110, y: 205 }, 2: { x: 270, y: 65 },
        5: { x: 60, y: 280 }, 6: { x: 185, y: 245 }, 1: { x: 275, y: 230 },
    },
};

// Defense: each player goes to the side that matches their role.
type Side = 'left' | 'middle' | 'right';

function sideOf(role: Role): Side {
    if (role === 'OH1' || role === 'OH2') return 'left';
    if (role === 'MB1' || role === 'MB2') return 'middle';
    return 'right';
}

const defenseSpots: Record<'front' | 'back', Record<Side, Point>> = {
    front: { left: { x: 90, y: 65}, middle: { x: 180, y: 65}, right: { x: 270, y: 65}},
    back: { left: { x: 70, y: 250}, middle: { x: 180, y: 295}, right: { x: 290, y: 250}},
};

function defenseFormation(system: VolleySystem, rotation: number): Record<Position, Point> {
    const map = {} as Record<Position, Point>;
    for (const player of PLAYERS) {
        const zone = positionOf(player, rotation);
        const row = isFrontRow(zone) ? 'front' : 'back';
        map[zone] = defenseSpots[row][sideOf(system.roles[player])];
    }
    return map;
}

// Minimum spacing between neighbours, so circles (diameter 48) don't overlap.
const GAP = 50;

// Nudge a formation until it obeys the overlap rule: any pair that is out
// of order (or too close) is pushed apart around its midpoint. Fixing one
// pair can disturb another, so we repeat the pass until things settle.
function legalize(target: Record<Position, Point>, exempt?: Position): Record<Position, Point> {
    // Work on copies: the target points may be shared constants.
    const at = {} as Record<Position, Point>;
    for (const zone of PLAYERS) at[zone] = { ...target[zone] };

    for (let pass = 0; pass < 20; pass++) {
        for (const [left, right] of LEFT_OF) {
            if (left === exempt || right === exempt) continue;
            const a = at[left];
            const b = at[right];
            if (b.x - a.x < GAP) {
                const mid = (a.x + b.x) / 2;
                a.x = mid - GAP / 2;
                b.x = mid + GAP / 2;
            }
        }
        for (const [front, back] of FRONT_BEHIND) {
            if (front === exempt || back === exempt) continue;
            const a = at[front];
            const b = at[back];
            if (b.y - a.y < GAP) {
                const mid = (a.y + b.y) / 2;
                a.y = mid - GAP / 2;
                b.y = mid + GAP / 2;
            }
        }
    }
    return at;
}

// Where the server stands: behind the end line, on the right.
const SERVER_SPOT: Point = { x: 270, y: 350 };

// Serving: everyone starts as close to their defense spot as the
// overlap rule allows, so the switch after the serve is short.
function serveFormation(system: VolleySystem, rotation: number): Record<Position, Point> {
    const legal = legalize(defenseFormation(system, rotation), SERVER_ZONE);
    legal[SERVER_ZONE] = SERVER_SPOT;
    return legal;
}

export function formation(phase: Phase, system: VolleySystem, rotation: number): Record<Position, Point> {
    switch (phase) {
        case 'base':
            return positionCoords;
        case 'serve':
            return serveFormation(system, rotation);
        case 'receive':
            return receiveFormations[positionOf(activeSetter(system, rotation), rotation)];
        case 'defense':
            return defenseFormation(system, rotation);
    }
}