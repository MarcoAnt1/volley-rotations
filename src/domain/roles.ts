import { PLAYERS, type PlayerId } from './court'
import type { Role, VolleySystem } from './systems'

export type RoleGroup = 'setter' | 'outside' | 'middle' | 'opposite' | 'libero'

export const ROLE_GROUPS: RoleGroup[] = ['setter', 'outside', 'middle', 'opposite', 'libero']

export const roleGroupOf: Record<Role, RoleGroup> = {
  S: 'setter',
  S1: 'setter',
  S2: 'setter',
  OH1: 'outside',
  OH2: 'outside',
  MB1: 'middle',
  MB2: 'middle',
  OPP: 'opposite',
}

export function playersIn(group: RoleGroup, system: VolleySystem): PlayerId[] {
  if (group === 'libero') return ['L']
  return PLAYERS.filter((p) => roleGroupOf[system.roles[p]] === group)
}
