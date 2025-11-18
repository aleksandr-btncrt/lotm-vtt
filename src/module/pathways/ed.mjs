import generatePathwayTree from "../utils/generate-pathway-tree.mjs"

const paths = ["Darkness", "Death", "Twilight Giant"]

export const eternalDarkness = paths.reduce((pv, cv)=>{
  const loweredKey = cv.toLowerCase()
  const dashedKey = loweredKey.replace(/ /g, "-")
  pv[`${dashedKey.toLowerCase()}`] = {
    name: `${cv} Pathway`,
    key: dashedKey,
    tree: generatePathwayTree(dashedKey)
  }
  return pv;
}, {}) 