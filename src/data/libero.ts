import {
  positionOf,
  isFrontRow,
  PLAYERS,
  type Position,
  type Point,
  type VolleySystem,
} from './rotations'
import { SERVER_ZONE, type Phase } from './formations'

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

export function liberoTip(system: VolleySystem, rotation: number, phase: Phase): string {
  const middle = backRowMiddle(system, rotation)
  const name = system.roles[middle]
  if (liberoReplaces(system, rotation, phase) === null) {
    return `${name} is serving from zone 1. The libero can't serve, so they wait on the bench and come back in for ${name} once the rally is over.`
  }

  return `The libero (L) is in for ${name}, the back-row middle. When ${name} rotates to the front row, they swap back.`
}
