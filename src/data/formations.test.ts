import { describe, expect, it } from 'vitest'
import { SERVER_ZONE, formation, type Phase } from './formations'
import { overlapViolations, systems, type SystemName } from './rotations'

const ROTATIONS = [0, 1, 2, 3, 4, 5]
const SYSTEM_NAMES = Object.keys(systems) as SystemName[]
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