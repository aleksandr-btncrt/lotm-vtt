export const foolPathway = {
  '0': { name: 'LOTM.Pathways.fool.0', sequence: "0" },
  '1': { name: 'LOTM.Pathways.fool.1', sequence: "1" },
  '2': { name: 'LOTM.Pathways.fool.2', sequence: "2" },
  '3': { name: 'LOTM.Pathways.fool.3', sequence: "3" },
  '4': { name: 'LOTM.Pathways.fool.4', sequence: "4" },
  '5': { name: 'LOTM.Pathways.fool.5', sequence: "5" },
  '6': { name: 'LOTM.Pathways.fool.6', sequence: "6" },
  '7': { name: 'LOTM.Pathways.fool.7', sequence: "7" },
  '8': { name: 'LOTM.Pathways.fool.8', sequence: "8" },
  '9': { name: "LOTM.Pathways.fool.9", sequence: "9" }
}

export const lordOfMysteries = {
  fool: {
    name: 'Fool Pathway',
    key: 'fool',
    tree: foolPathway
  },
  error: {
    name: 'Error Pathway',
    key: 'error',
    tree: []
  },
  door: {
    name: 'Door Pathway',
    key: "error",
    tree: []
  }
}