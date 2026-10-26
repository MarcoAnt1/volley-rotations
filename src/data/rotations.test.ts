import { describe, expect, it } from 'vitest'
import {
  PLAYERS,
  activeSetter,
  isFrontRow,
  overlapViolations,
  positionCoords,
  positionOf,
  systems,
} from './rotations'

const ROTATIONS = [0, 1, 2, 3, 4, 5]

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
      const zones = new Set(PLAYERS.map((p) => positionOf(p, r)))
      expect(zones.size).toBe(6)
    }
  })
})

describe('overlapViolations', () => {
  it('accepts the default formation', () => {
    expect(overlapViolations(positionCoords)).toEqual([])
  })

  it('flags zone 4 standing right of zone 3', () => {
    const at = { ...positionCoords, 4: { x: 200, y: 100 } }
    expect(overlapViolations(at)).toEqual([{ a: 4, b: 3, rule: '4 must stay left of 3' }])
  })

  it('ignores the exempt zone (the server)', () => {
    const at = { ...positionCoords, 1: { x: 0, y: 0 } }
    expect(overlapViolations(at, 1)).toEqual([])
  })
})

describe('activeSetter', () => {
  it('6-2: the setting setter is always in the back row', () => {
    for (const r of ROTATIONS) {
      expect(isFrontRow(positionOf(activeSetter(systems['6-2'], r), r))).toBe(false)
    }
  })

  it('4-2: the setting setter is always in the front row', () => {
    for (const r of ROTATIONS) {
      expect(isFrontRow(positionOf(activeSetter(systems['4-2'], r), r))).toBe(true)
    }
  })
})