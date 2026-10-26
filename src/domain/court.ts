// The court, its six zones, and who can stand on it.
//
// Coordinates are SVG units. The court floor is the square from (40,40)
// to (320,320): x runs left → right, y runs from the net (top) to the end line.
//
//            NET (top)
//      4      3      2     ← front row
//      5      6      1     ← back row

// One of the six zones on a side, numbered 1–6.
export type Position = 1 | 2 | 3 | 4 | 5 | 6

// Everyone who can be on the court: the six lineup players plus the libero.
export type PlayerId = Position | 'L'

// A point on the court, in SVG coordinates (x →, y ↓).
export interface Point {
  x: number
  y: number
}

// The six lineup players (or zones — same values).
export const PLAYERS: Position[] = [1, 2, 3, 4, 5, 6]

export const FRONT_ROW: Position[] = [2, 3, 4]

export function isFrontRow(pos: Position): boolean {
  return FRONT_ROW.includes(pos)
}

// The center of each zone: where players stand by default.
export const positionCoords: Record<Position, Point> = {
  4: { x: 90, y: 100 },
  3: { x: 180, y: 100 },
  2: { x: 270, y: 100 },
  5: { x: 90, y: 250 },
  6: { x: 180, y: 250 },
  1: { x: 270, y: 250 },
}