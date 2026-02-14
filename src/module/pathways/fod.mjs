import generatePathwayTree from "../utils/generate-pathway-tree.mjs"

const paths = ["Abyss", "Chained"]

export const fatherOfDevils = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  const dashedKey = loweredKey.replace(/ /g, "-")
  pv[`${dashedKey.toLowerCase()}`] = {
    name: `${cv} Pathway`,
    key: dashedKey,
    // Sequences from 9 (lowest) to 0 (highest)
    sequences: generatePathwayTree(dashedKey),
    // Keep tree for backwards compatibility if needed
    tree: generatePathwayTree(dashedKey)
  }
  return pv;
}, {}) 