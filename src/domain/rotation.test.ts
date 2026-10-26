import { describe, expect, it } from 'vitest'
import { PLAYERS } from './court'
import { ROTATIONS, positionOf } from './rotation'

describe('positionOf', () => {
  it('starts every player in the zone with their own number', () => {
    for (const p of PLAYERS) expect(positionOf(p, 0)).toBe(p)
  })

  it('rotates clockwise: 2 → 1 → 6 → 5 → 4 → 3 → 2', () => {
    expect(positionOf(2, 1)).toBe(1)
    expect(positionOf(1, 1)).toBe(6)
    expect(positionOf(3, 1)).toBe(2)
  })

  it('comes back to the start after six rotations', () => {
    for (const p of PLAYERS) expect(positionOf(p, 6)).toBe(p)
  })

  it('always puts the six players in six different zones', () => {
    for (const r of ROTATIONS) {
      expect(new Set(PLAYERS.map((p) => positionOf(p, r))).size).toBe(6)
    }
  })
})
