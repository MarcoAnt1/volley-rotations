import { isFrontRow, type Position } from './court'
import { positionOf } from './rotation'

export type SystemName = '4-2' | '5-1' | '6-2'

export type Role = 'S' | 'S1' | 'S2' | 'OH1' | 'OH2' | 'MB1' | 'MB2' | 'OPP'

export interface VolleySystem {
  name: SystemName
  setters: Position[] // player ids that are setters
  activeRow: 'front' | 'back' | 'any' // which setter sets, by their row
  roles: Record<Position, Role> // player id → role
}

// In the order the app lists them.
export const systems: Record<SystemName, VolleySystem> = {
  '4-2': {
    name: '4-2',
    setters: [1, 4],
    activeRow: 'front',
    roles: { 1: 'S1', 2: 'OH1', 3: 'MB1', 4: 'S2', 5: 'OH2', 6: 'MB2' },
  },
  '5-1': {
    name: '5-1',
    setters: [1],
    activeRow: 'any',
    roles: { 1: 'S', 2: 'OH1', 3: 'MB1', 4: 'OPP', 5: 'OH2', 6: 'MB2' },
  },
  '6-2': {
    name: '6-2',
    setters: [1, 4],
    activeRow: 'back',
    roles: { 1: 'S1', 2: 'OH1', 3: 'MB1', 4: 'S2', 5: 'OH2', 6: 'MB2' },
  },
}

export const SYSTEM_NAMES = Object.keys(systems) as SystemName[]

// The setter who sets this rotation.
export function activeSetter(system: VolleySystem, rotation: number): Position {
  if (system.setters.length === 1) return system.setters[0]!

  for (const setter of system.setters) {
    const front = isFrontRow(positionOf(setter, rotation))
    if (system.activeRow === 'front' && front) return setter
    if (system.activeRow === 'back' && !front) return setter
  }
  return system.setters[0]!
}
