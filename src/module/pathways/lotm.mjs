import generatePathwayTree from "../utils/generate-pathway-tree.mjs"


const paths = ["Fool", "Error", "Door"]

export const lordOfMysteries = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  pv[`{${loweredKey.toLowerCase()}}`] = {
    name: `${cv} Pathway`,
    key: loweredKey,
    tree: generatePathwayTree(loweredKey)
  }
  return pv;
}, {}) 