import DocumentSheetLOTM from "../api/document-sheet.mjs";
import PrimarySheetMixin from "../api/primary-sheet-mixin.mjs";

export class LotmItemSheet extends PrimarySheetMixin(DocumentSheetLOTM){
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    form: {
      submitOnChange: true
    },
    position: {
      width: 500
    },
    window:{
      resizable: false
    }
  }

  /** @override */
  static PARTS = {
    body: {
      template: "systems/lotm/templates/item/item-sheet.hbs"
    }
  }

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    const initialized = super._initializeApplicationOptions(options);

    initialized.classes.push(initialized.document.type);

    return initialized;
  }

  /** @override */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    return context;
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return {
      ...context,
      item: this.document,
      system: this.document.system,
      flags: this.document.flags,
      editable: this.isEditable,
      owner: this.document.isOwner,
      limited: this.document.limited,
      enrichedDescription: await TextEditor.enrichHTML(this.document.system.description ?? "", {
        async: true,
        secrets: this.document.isOwner,
        relativeTo: this.document
      })
    };
  }
}