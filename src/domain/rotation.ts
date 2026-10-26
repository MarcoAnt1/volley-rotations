import type { Position } from './court'

export const NUM_ROTATIONS = 6

// 0, 1, …, 5: every rotation, handy for loops and tests.
export const ROTATIONS: number[] = Array.from({ length: NUM_ROTATIONS }, (_, i) => i)

// Zones in the order players rotate through them (clockwise):
// the player in zone 2 moves to 1, then 6, 5, 4, 3 and back to 2.
export const rotationCycle: Position[] = [2, 1, 6, 5, 4, 3]

// The zone a player stands in after `rotation` rotations.
// In rotation 0, player k starts in zone k.
export function positionOf(player: Position, rotation: number): Position {
  const start = rotationCycle.indexOf(player)
  const index = (start + rotation) % rotationCycle.length
  return rotationCycle[index]!
}

// The player in this zone serves.
export const SERVER_ZONE: Position = 1