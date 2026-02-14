import { systemID, Pathways } from './constants.mjs'

/**
 * Generate a pathway tree with sequences from 9 (lowest) to 0 (highest).
 * Each sequence has a localization key that should resolve to its name.
 * @param {string} pathway  The pathway identifier (e.g., "fool", "door")
 * @returns {object}        Object with sequence data keyed by sequence number
 */
export default function (pathway) {
  let sequences = {}
  
  // Generate sequences from 9 (lowest) to 0 (highest/divine)
  for (let sequence = 0; sequence <= 9; sequence++) {
    sequences[sequence] = {
      // Localization key for the sequence name
      name: `${systemID.toUpperCase()}.${Pathways}.${pathway.toLowerCase()}.${sequence}`,
      // Sequence number
      sequence: sequence,
      // Rank based on sequence
      rank: sequence === 0 ? "divine" : sequence <= 3 ? "high" : sequence <= 6 ? "mid" : "low"
    }
  }
  
  return sequences;
}