// The words of the Positions & roles lesson.
import type { RoleGroup } from '@/domain/roles'
import type { Phase } from '@/domain/formations'

export interface RoleInfo {
  name: string
  summary: string
  duties: string[]
  playsAt: string
  traits: string
}

export const viewLabels: Partial<Record<Phase, string>> = {
  base: 'Before the serve',
  play: 'In play',
}

// Short labels for the role picker; they match the labels on the court.
export const roleShort: Record<RoleGroup, string> = {
  setter: 'S',
  outside: 'OH',
  middle: 'MB',
  opposite: 'OPP',
  libero: 'L',
}

export const roleInfo: Record<RoleGroup, RoleInfo> = {
  setter: {
    name: 'Setter',
    summary: 'The playmaker. Takes the second touch on almost every rally and decides who attacks.',
    duties: [
      'Runs to the target spot, near the net between zones 2 and 3, on every play.',
      'Sets the hitters, choosing who attacks and how fast.',
      'Blocks on the right side when in the front row.',
    ],
    traits: 'Soft hands, quick decisions, and a good read of the other team’s block.',
    playsAt: 'Right side. Front row: at the net, near zone 2. Back row: zone 1, running to the net to set.',
  },
  outside: {
    name: 'Outside hitter',
    summary: 'The all-rounder. Attacks from the left and passes serves.',
    duties: [
      'Attacks from zone 4, and gets most of the sets when a play breaks down.',
      'Passes serves; outside hitters are the core of the reception line.',
      'Plays defense in the back row and blocks the other team’s right side.',
    ],
    traits: 'Complete: passing, attacking and defending, all at a good level.',
    playsAt: 'Left side. Front row: zone 4. Back row: zone 5, passing and defending.',
  },
  middle: {
    name: 'Middle blocker',
    summary: 'The wall at the net. Blocks in the middle and attacks fast sets.',
    duties: [
      'Reads the setter and moves along the net to block, from the middle to either side.',
      'Attacks quick sets that arrive before the block is ready.',
      'Is usually replaced by the libero in the back row.',
    ],
    traits: 'Tall, with long arms and quick feet along the net.',
    playsAt: 'Middle. Front row: zone 3, at the net. Back row: usually on the bench, while the libero plays.',
  },
  opposite: {
    name: 'Opposite',
    summary: 'The scorer. Plays opposite the setter and attacks from the right.',
    duties: [
      'Attacks from zone 2, and from the back row when in zones 1 to 6.',
      'Blocks the other team’s outside hitter.',
      'Usually stays out of the reception line to stay ready to attack.',
    ],
    traits: 'A powerful attacker, often the team’s top scorer. Often left-handed.',
    playsAt: 'Right side. Front row: zone 2. Back row: zone 1.',
  },
  libero: {
    name: 'Libero',
    summary: 'The defensive specialist, in a different-colored jersey.',
    duties: [
      'Passes serves and digs attacks, only in the back row.',
      'Can’t attack above net height, block, or serve (in most leagues).',
      'Swaps in and out freely, usually for the middle blockers.',
    ],
    traits: 'Fast reactions, great ball control, and fearless on the floor.',
    playsAt: 'Back row only, usually middle back (zone 6), in the back-row middle’s place.',
  },
}
