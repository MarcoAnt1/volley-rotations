import { PLAYERS, type Point, type Position } from './court'

// Minimum spacing between neighbours, so circles (diameter 48) don't overlap.
const GAP = 50

// The overlap rule, checked at the moment of the serve, as pairs of zones.
// [front, back]: the front zone must be closer to the net (smaller y).
export const FRONT_BEHIND: [Position, Position][] = [
  [2, 1],
  [3, 6],
  [4, 5],
]

// [left, right]: the left zone must stay further left (smaller x).
export const LEFT_OF: [Position, Position][] = [
  [4, 3],
  [3, 2],
  [5, 6],
  [6, 1],
]

// A broken pair: the player in zone `a` is on the wrong side of zone `b`.
export interface Violation {
  a: Position
  b: Position
  kind: 'front-behind' | 'left-of'
}

// Every broken pair for these coordinates. `exempt` is a zone to skip
// (the server, who stands behind the end line).
export function overlapViolations(at: Record<Position, Point>, exempt?: Position): Violation[] {
  const found: Violation[] = []

  for (const [front, back] of FRONT_BEHIND) {
    if (front === exempt || back === exempt) continue
    if (at[front].y >= at[back].y) found.push({ a: front, b: back, kind: 'front-behind' })
  }

  for (const [left, right] of LEFT_OF) {
    if (left === exempt || right === exempt) continue
    if (at[left].x >= at[right].x) found.push({ a: left, b: right, kind: 'left-of' })
  }

  return found
}

// Nudge a formation until it obeys the overlap rule: any pair that is out
// of order (or too close) is pushed apart around its midpoint. Fixing one
// pair can disturb another, so we repeat the pass until things settle.
export function legalize(
  target: Record<Position, Point>,
  exempt?: Position,
): Record<Position, Point> {
  // Work on copies: the target points may be shared constants.
  const at = {} as Record<Position, Point>
  for (const zone of PLAYERS) at[zone] = { ...target[zone] }

  for (let pass = 0; pass < 20; pass++) {
    for (const [left, right] of LEFT_OF) {
      if (left === exempt || right === exempt) continue
      const a = at[left]
      const b = at[right]
      if (b.x - a.x < GAP) {
        const mid = (a.x + b.x) / 2
        a.x = mid - GAP / 2
        b.x = mid + GAP / 2
      }
    }
    for (const [front, back] of FRONT_BEHIND) {
      if (front === exempt || back === exempt) continue
      const a = at[front]
      const b = at[back]
      if (b.y - a.y < GAP) {
        const mid = (a.y + b.y) / 2
        a.y = mid - GAP / 2
        b.y = mid + GAP / 2
      }
    }
  }
  return at
}
