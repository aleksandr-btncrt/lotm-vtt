import generatePathwayTree from "../utils/generate-pathway-tree.mjs"

const paths = ["Mother", "Moon"]

export const goddessOfOrigin = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  const dashedKey = loweredKey.replaceAll(" ", "-")
  pv[`{${loweredKey.toLowerCase()}}`] = {
    name: `${cv} Pathway`,
    key: dashedKey.replaceAll(" ", "-"),
    tree: generatePathwayTree(dashedKey)
  }
  return pv;
}, {}) 