import { systemPath } from '../utils/path.mjs'
import { LotmActorSheet } from '../applications/actor-sheet-v2.mjs'

/**
 * 
 * @param {string} type 
 * @returns 
 */
export const createDefaultOptions = (type) => {
  return {
    classes: ["lotm", `${type}-sheet`],
    position: {
      width: 600,
      height: 600
    },
    form: {
      submitOnChange: true
    },
    tag: "form",
  }
}

export const createTabs = () => {
  return {
    primary: {
      tabs: [
        {
          id: "features"
        },
        {
          id: "pathway"
        }
      ],
      initial: "properties",
      labelPrefix: "LOTM.Sheets.Tabs"
    }
  }
}
/**
 * 
 * @param {string} type 
 */
export const createTemplateParts = (type)=>{
  return {
    header: {
      template: systemPath(`templates/${type}/header.hbs`)
    },
    details: {
      template: systemPath(`templates/${type}/main.hbs`)
    }
  }
}

