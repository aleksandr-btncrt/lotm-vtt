const { TypeDataModel } = foundry.abstract;
const { StringField, ArrayField, SchemaField, NumberField, BooleanField, HTMLField } = foundry.data.fields;

export default class ConsumableData extends TypeDataModel {
  static LOCALIZATION_PREFIXES = ["LOTM.Consumable"];

  /** @inheritdoc */
  static defineSchema() {
    return {
      /** Properties of the consumable */
      properties: new StringField({ initial: "" }),
      /** Type of consumable */
      type: new StringField({ initial: "consumable" }),
      /** Number of uses remaining */
      uses: new NumberField({ initial: 0, min: 0, integer: true }),
      /** Maximum uses */
      maxUses: new NumberField({ initial: 0, min: 0, integer: true }),
      /** Description of the consumable */
      description: new HTMLField({ initial: "" })
    };
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareBaseData() {
    // Initialize any base properties
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    // Calculate derived values
    this.prepareLabels();
  }

  /* -------------------------------------------- */

  /**
   * Prepare labels for display.
   * @protected
   */
  prepareLabels() {
    this.labels = {
      type: this.type || game.i18n.localize("LOTM.Consumable.DefaultType"),
      uses: this.maxUses > 0 
        ? `${this.uses}/${this.maxUses}` 
        : this.uses.toString()
    };
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareFinalData() {
    // Final preparations if embedded in an actor
  }

  /* -------------------------------------------- */

  /**
   * Prepare sheet-specific data for rendering.
   * @param {object} context  The rendering context object.
   * @returns {Promise<void>}
   */
  async getSheetData(context) {
    // Add consumable type options
    context.consumableTypes = CONFIG.LOTM?.consumableTypes || {
      potion: "LOTM.Consumable.Type.Potion",
      scroll: "LOTM.Consumable.Type.Scroll",
      charm: "LOTM.Consumable.Type.Charm",
      other: "LOTM.Consumable.Type.Other"
    };
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Does this consumable have limited uses?
   * @type {boolean}
   */
  get hasLimitedUses() {
    return this.maxUses > 0;
  }

  /* -------------------------------------------- */

  /**
   * Properties displayed in chat cards.
   * @type {string[]}
   */
  get chatProperties() {
    const props = [this.labels?.type];
    if (this.hasLimitedUses) {
      props.push(`${game.i18n.localize("LOTM.Uses")}: ${this.labels?.uses}`);
    }
    return props.filter(p => p);
  }
}