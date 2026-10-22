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
    return rotationCycle[index];
}