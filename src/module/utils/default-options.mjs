import { systemPath } from './path.mjs'

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
    },
    bottom: {
      template: systemPath(`templates/${type}/bottom.hbs`),
      templates: [
        systemPath(`templates/${type}/parts/actor-skills.hbs`)
      ],
      scrolleable: [""]
    }
  }
}

