import generatePathwayTree from "../utils/generate-pathway-tree.mjs"

const paths = ["Wheel of Fortune"]

export const keyOfLight = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  const dashedKey = loweredKey.replace(/ /g, "-")
  pv[`${dashedKey.toLowerCase()}`] = {
    name: `${cv} Pathway`,
    key: dashedKey,
    tree: generatePathwayTree(dashedKey)
  }
  return pv;
}, {}) 