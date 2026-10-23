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

export const SETTER: Position = 1;

export const setterTips: Record<Position, string> = {
    1: 'Setter in position 1 (back-right). Back-row setter -> all three front-row players can attack. Short release to the net.',
    6: 'Setter in position 6 (back-middle). Still back row -> three front-row attackers. Release forward and right to the target.',
    5: 'Setter in position 5 (back-left). Back row, but the longest run to the target - release early toward the right-front.',
    4: 'Setter in position 4 (front-left). Now front row -> only two other front-row attackers. Slide righ along the net.',
    3: 'Setter in position 3 (front-middle). Front-row setter - move right to the target; back row attacks matter more here.',
    2: 'Setter in position 2 (front-right). Front row and already near the target - the easiest rotation to set from',
};