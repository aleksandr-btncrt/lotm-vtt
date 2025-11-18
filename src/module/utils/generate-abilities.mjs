import { Ability, Abilities, systemID } from "./constants.mjs"

/**
 * 
 * @param {string} type strings like abbr || long 
 * @returns 
 */
export default function(type){
  return Abilities.reduce((pv, cv)=>{
    pv[`${cv.toLowerCase()}`] = `${systemID.toUpperCase()}.${Ability}.${cv}.${type}`
    return pv;
  }, {})
}