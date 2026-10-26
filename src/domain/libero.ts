import { PLAYERS, isFrontRow, type Point, type Position } from './court'
import type { Phase } from './formations'
import { SERVER_ZONE, positionOf } from './rotation'
import type { VolleySystem } from './systems'

export const BENCH_SPOT: Point = { x: -34, y: 250 }

export function backRowMiddle(system: VolleySystem, rotation: number): Position {
  const middles = PLAYERS.filter((p) => system.roles[p] === 'MB1' || system.roles[p] === 'MB2')
  return middles.find((p) => !isFrontRow(positionOf(p, rotation)))!
}

export function liberoReplaces(
  system: VolleySystem,
  rotation: number,
  phase: Phase,
): Position | null {
  const middle = backRowMiddle(system, rotation)
  if (phase === 'serve' && positionOf(middle, rotation) === SERVER_ZONE) return null
  return middle
}
