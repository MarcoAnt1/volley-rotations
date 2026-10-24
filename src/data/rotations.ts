// A court position is one of the six spots, numbered 1–6.
export type Position = 1 | 2 | 3 | 4 | 5 | 6;

// A point on the court, in SVG coordinates (x →, y ↓).
export interface Point {
    x: number
    y: number
}

// Where each position sits. Our court floor is the square from
// (40,40) to (320,320), so x runs 40→320 left-to-right and
// y runs 40→320 net-to-baseline.
//
//            NET (top)
//      4      3      2     ← front row  (y = 100)
//      5      6      1     ← back row   (y = 250)
//
export const positionCoords: Record<Position, Point> = {
    4: { x: 90, y: 100 },
    3: { x: 180, y: 100 },
    2: { x: 270, y: 100 },
    5: { x: 90, y: 250 },
    6: { x: 180, y: 250 },
    1: { x: 270, y: 250 },
}

export const rotationCycle: Position[] = [2, 1, 6, 5, 4, 3];

export function positionOf(player: Position, rotation: number): Position {
    const start = rotationCycle.indexOf(player);
    const index = (start + rotation) % rotationCycle.length;
    return rotationCycle[index]!;
}

export interface Violation {
    a: Position;
    b: Position;
    rule: string;
}

export function overlapViolations(at: Record<Position, Point>): Violation[] {
    const found: Violation[] = [];

    const frontBehind: [Position, Position][] = [
        [2, 1],
        [3, 6],
        [4, 5],
    ];
    for (const [front, back] of frontBehind) {
        if (at[front].y >= at[back].y) {
            found.push({ a: front, b: back, rule: `${front} must stay in front of ${back}` });
        }
    }

    const leftOf: [Position, Position][] = [
        [4, 3],
        [3, 2],
        [5, 6],
        [6, 1],
    ];
    for (const [left, right] of leftOf) {
        if (at[left].x >= at[right].x) {
            found.push({ a: left, b: right, rule: `${left} must stay left of ${right}` });
        }
    }

    return found;
}

// -- System --

export type SystemName = '5-1' | '6-2' | '4-2';

export interface VolleySystem {
    name: SystemName;
    setters: Position[];
    activeRow: 'front' | 'back' | 'any';
    blurb: string;
}

export const systems: Record<SystemName, VolleySystem> = {
    '5-1': {
        name: '5-1',
        setters: [1],
        activeRow: 'any',
        blurb: 'One setter who sets in all six rotations.',
    },
    '6-2': {
        name: '6-2',
        setters: [1, 4],
        activeRow: 'back',
        blurb: 'Two setters; the back-row one sets, so all three front-row players can attack.',
    },
    '4-2': {
        name: '4-2',
        setters: [1, 4],
        activeRow: 'front',
        blurb: 'Two setters; the front-row one sets from near the net.',
    },
};

export const FROM_ROW: Position[] = [2, 3, 4];

export function isFrontRow(pos: Position): boolean {
    return FROM_ROW.includes(pos);
}

export function activeSetter(system: VolleySystem, rotation: number): Position {
    if (system.setters.length == 1) return system.setters[0]!;

    for (const setter of system.setters) {
        const front = isFrontRow(positionOf(setter, rotation));
        if (system.activeRow === 'front' && front) return setter;
        if (system.activeRow === 'back' && !front) return setter;
    }
    return system.setters[0]!;
}

export function setterTip(system: VolleySystem, rotation: number): string {
    const setter = activeSetter(system, rotation);
    const pos = positionOf(setter, rotation);
    const front = isFrontRow(pos);
    const where = front
        ? 'sets from near the net'
        : 'penetrates from the back row to the net to set';
    return `${system.blurb} This rotation the setter is player ${setter}, in the position ${pos}(${front ? 'front' : 'back'}) - ${where}.`;
}