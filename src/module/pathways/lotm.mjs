import generatePathwayTree from "../utils/generate-pathway-tree.mjs"


export const lordOfMysteries = {
  fool: {
    name: 'Fool Pathway',
    key: 'fool',
    tree: generatePathwayTree("fool")
  },
  error: {
    name: 'Error Pathway',
    key: 'error',
    tree: generatePathwayTree("error")
  },
  door: {
    name: 'Door Pathway',
    key: "door",
    tree: generatePathwayTree("door")
  }
}