const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * @import { ApplicationContainerParts } from "./_types.mjs";
 */


/**
 * Mixin method for ApplicationV2-based LOTM application
 * @template {ApplicationV2} T
 * @param {typeof T} Base application class being extended
 * @returns {typeof BaseApplcationLotm} 
 */
export function ApplicationV2Mixin(Base) {
  class BaseApplicationLotm extends HandlebarsApplicationMixin(Base) {
    /** @override */
    static DEFAULT_OPTIONS = {
      classes: ["lotm"]
    }
    /** @type {Record<string, HandlebarsTemplatePart & ApplicationContainerParts >} */
    static PARTS = []
  }
  return BaseApplicationLotm;

}