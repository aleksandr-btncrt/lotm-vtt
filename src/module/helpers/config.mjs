import { pathways } from "../pathways/index.mjs"
import generateAbilities from "../utils/generate-abilities.mjs"
export const LOTM = {};
/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
LOTM.abilities = generateAbilities("long")

LOTM.abilityAbbreviations =  generateAbilities("abbr")

LOTM.pathways = pathways