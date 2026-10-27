// formations.test.ts
import { describe, expect, it } from 'vitest'
import { formation, type Phase } from './formations'
import { overlapViolations } from './overlap'
import { ROTATIONS, SERVER_ZONE, positionOf } from './rotation'
import { SYSTEM_NAMES, systems } from './systems'
import type { Position } from './court'

// 'play' is left out on purpose: the overlap rule only applies at the serve.
const PHASES: Phase[] = ['base', 'serve', 'receive']

describe('every formation obeys the overlap rule', () => {
  for (const name of SYSTEM_NAMES) {
    for (const phase of PHASES) {
      for (const r of ROTATIONS) {
        it(`${name} · ${phase} · rotation ${r + 1}`, () => {
          const exempt = phase === 'serve' ? SERVER_ZONE : undefined
          expect(overlapViolations(formation(phase, systems[name], r), exempt)).toEqual([])
        })
      }
    }
  }
})

describe('in play, everyone switches to the side of their job', () => {
  for (const r of ROTATIONS) {
    it(`5-1 · rotation ${r + 1}`, () => {
      const at = formation('play', systems['5-1'], r)
      const xOf = (player: Position) => at[positionOf(player, r)].x
      expect(xOf(2)).toBeLessThan(180) // OH1: left
      expect(xOf(5)).toBeLessThan(180) // OH2: left
      expect(xOf(3)).toBe(180) // MB1: middle
      expect(xOf(6)).toBe(180) // MB2: middle
      expect(xOf(1)).toBeGreaterThan(180) // S: right
      expect(xOf(4)).toBeGreaterThan(180) // OPP: right
    })
  }
})
