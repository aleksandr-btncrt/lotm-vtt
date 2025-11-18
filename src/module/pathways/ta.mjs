import generatePathwayTree from "../utils/generate-pathway-tree.mjs"


const paths = ["Black Emperor", "Justiciar"]

export const theAnarchy = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  pv[`{${loweredKey.toLowerCase()}}`] = {
    name: `${cv} Pathway`,
    key: loweredKey,
    tree: generatePathwayTree(loweredKey)
  }
}, {}) 