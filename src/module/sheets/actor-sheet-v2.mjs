import { createDefaultOptions, createTabs, createTemplateParts } from "../utils/default-options.mjs";

const { api, sheets } = foundry.applications;

export class LotmActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheet) {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = createDefaultOptions("actor")

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
    switch (partId) {
      case "attributes":
        context.attributes = await this._getAttributes();
        context.tab = context.tabs[partId]
        break;
      case "pathway":
        context.pathway = "";
        context.tab = context.tab[partId];
        break;
    }
    return context;
  }

  async _getFields() {
    const doc = this.actor;
    const source = doc._source;
    const systemFields = CONFIG.Actor.dataModels[doc.type]?.schema.fields
    
  }


}