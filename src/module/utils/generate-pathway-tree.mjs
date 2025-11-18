import { systemID, Pathways } from './constants.mjs'

/**
 * 
 * @param {string} pathway 
 */
export default function (pathway) {
  let tree = {}
  for (let sequence = 0; sequence <= 9; sequence++) {
    tree[`${sequence}`] = {
      name: `${systemID.toUpperCase()}.${Pathways}.${pathway.toLowerCase()}.${sequence}`
    }
  }
  return tree;
}