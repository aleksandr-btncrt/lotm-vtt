import { pathways, sequences } from "../pathways/index.mjs"
export const LOTM = {};
/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
LOTM.abilities = {
  cha: 'LOTM.Ability.Cha.long',
  str: 'LOTM.Ability.Str.long',
  lck: 'LOTM.Ability.Lck.long',
  agi: 'LOTM.Ability.Agi.long',
  phy: 'LOTM.Ability.Phy.long',
  wll: 'LOTM.Ability.Wll.long',
  ins: 'LOTM.Ability.Ins.long',
  edu: 'LOTM.Ability.Edu.long'
};

LOTM.abilityAbbreviations = {
  cha: 'LOTM.Ability.Cha.abbr',
  str: 'LOTM.Ability.Str.abbr',
  lck: 'LOTM.Ability.Lck.abbr',
  agi: 'LOTM.Ability.Agi.abbr',
  phy: 'LOTM.Ability.Phy.abbr',
  wll: 'LOTM.Ability.Wll.abbr',
  ins: 'LOTM.Ability.Ins.abbr',
  edu: 'LOTM.Ability.Edu.abbr'
};

LOTM.pathways = pathways
LOTM.sequences = sequences