import { createTabs, createTemplateParts } from "../utils/default-options.mjs";

const { api, sheets } = foundry.applications;

export class LotmActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["lotm", "character-sheet"],
    position: {
      width: 600,
      height: 600
    },
    form: {
      submitOnChange: true
    },
    tag: "form",
  }

  /** @inheritdoc */
  static TABS = createTabs()

  /** @inheritdoc */
  static PARTS = createTemplateParts("actor")

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    const initialized = super._initializeApplicationOptions(options);

    initialized.classes.push(initialized.document.type);

    return initialized;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)

    Object.assign(context, {
      owner: this.document.isOwner,
      limited: this.document.limited,
      actor: this.actor,
      system: this.actor.system,
      flags: this.actor.flags,
      actorFields: this.actor.schema.fields,
      config: CONFIG
    })

    return context;
  }

  async _preparePartContext(partId, context) {
    let newContext = {}
    switch (partId) {
      case "header": {
        newContext = context;
        break;
      }
      case "details": {
        newContext = this._preprareSummaryDetails(context);
        break;
      }
      case "attributes":
        newContext.attributes = await this._getAttributes();
        newContext.tab = context.tabs[partId]
        break;
      case "pathway":
        newContext.pathway = "";
        newContext.tab = context.tab[partId];
        break;
    }
    console.log("_preparePartContext", {partId, newContext})
    return newContext;
  }

  _preprareSummaryDetails(context) {
    console.log("_preprareSummaryDetails", context);
    return {
      editable: context.actor.system.editable,
      abilities: context.actor.system.abilities,
      pathway: context.actor.system.pathway
    }
  }

  /* -------------------------------------------------- */
  /*   Actor override handling                          */
  /* -------------------------------------------------- */

  /**
   * Submit a document update based on the processed form data.
   * @param {SubmitEvent} event                   The originating form submission event
   * @param {HTMLFormElement} form                The form element that was submitted
   * @param {object} submitData                   Processed and validated form data to be used for a document update
   * @returns {Promise<void>}
   * @protected
   * @inheritdoc
   */
  async _processSubmitData(event, form, submitData) {
    const data = await submitData;
    console.log("_processSubmitData", {event, form, data})
    const dataWithoutActorPrefix = Object.keys(data).reduce((pv, cv) => {
      pv[cv.replace("actor.", "")] = data[cv]
      return pv
    }, {})
    await this.actor.update(dataWithoutActorPrefix);
  }

  /**
   * 
   * @param {SubmitEvent} event 
   * @param {HTMLFormElement} form 
   * @param {object} submitData 
   * @returns {Promise<void>}
   * @protected
   * @inheritdoc
   */
  async _prepareSubmitData(event, form, submitData) {
    console.log('_prepareSubmitData', { event, form, submitData });
    return submitData.object;
  }


}