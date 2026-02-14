import SystemDocumentMixin from "./mixins/document.mjs";
import CreateDocumentDialog from "../applications/create-document-dialog.mjs";

/**
 * Extended Item document for LOTM system.
 * Follows DnD5e patterns for data preparation and lifecycle management.
 */
export default class ItemLotm extends SystemDocumentMixin(Item) {

  /** @override */
  static DEFAULT_ICON = "systems/lotm/icons/svg/item.svg";

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Labels object for this item.
   * @type {object}
   */
  labels = {};

  /* -------------------------------------------- */
  /*  Data Initialization                         */
  /* -------------------------------------------- */

  /**
   * Initialize source data for the item, including migration.
   * @param {object} data     The data to initialize
   * @param {object} options  Initialization options
   * @returns {object}        The initialized data
   * @override
   */
  _initializeSource(data, options = {}) {
    // Perform migration before initialization
    if (data.system && CONFIG.Item.dataModels[data.type]?._migrateData) {
      CONFIG.Item.dataModels[data.type]._migrateData(data.system);
    }
    
    return super._initializeSource(data, options);
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareBaseData() {
    this.labels = {};
    // Call the system data model's prepareBaseData if it exists
    this.system.prepareBaseData?.();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    this.labels ??= {};
    super.prepareDerivedData();
    
    // Call the system data model's prepareDerivedData if it exists
    this.system.prepareDerivedData?.();

    // Un-owned items can have their final preparation done here
    if (!this.isOwned) this.prepareFinalAttributes();
  }

  /* -------------------------------------------- */

  /**
   * Compute item attributes which might depend on prepared actor data.
   * If this item is embedded, this method will be called after the actor's data is prepared.
   * Otherwise, it will be called at the end of `Item#prepareDerivedData`.
   */
  prepareFinalAttributes() {
    this.system.prepareFinalData?.();
  }

  /* -------------------------------------------- */

  /**
   * Get roll data for this item.
   * @param {object} [options]
   * @param {boolean} [options.deterministic]  Whether to force deterministic values.
   * @returns {object}
   */
  getRollData({ deterministic = false } = {}) {
    let data;
    if (this.system.getRollData) {
      data = this.system.getRollData({ deterministic });
    } else {
      data = { 
        ...(this.actor?.getRollData({ deterministic }) ?? {}), 
        item: { ...this.system } 
      };
    }
    
    if (data?.item) {
      data.item.flags = { ...this.flags };
      data.item.name = this.name;
    }
    
    data.labels = this.labels;
    return data;
  }

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * Create multiple items with their container contents.
   * @param {Item[]} items                           Items to create.
   * @param {object} [options={}]                    Creation options.
   * @param {Item} [options.container]               Container in which to create the item.
   * @param {boolean} [options.keepId=false]         Should IDs be maintained?
   * @param {Function} [options.transformAll]        Method called on provided items and their contents.
   * @param {Function} [options.transformFirst]      Method called only on provided items.
   * @returns {Promise<object[]>}                    Data for items to be created.
   */
  static async createWithContents(items, { container, keepId = false, transformAll, transformFirst } = {}) {
    const created = [];
    // Simplified implementation - expand as needed based on your container support
    for (const item of items) {
      let itemData = item;
      if (transformAll) itemData = await transformAll(itemData);
      if (transformFirst) itemData = await transformFirst(itemData);
      if (itemData) created.push(itemData);
    }
    return created;
  }

  /* -------------------------------------------- */

  /**
   * Show a dialog to create a new item.
   * @param {object} data                  Initial data for the item.
   * @param {object} createOptions         Options for item creation.
   * @param {object} dialogOptions         Options for dialog display.
   * @returns {Promise<Item|null>}
   */
  static async createDialog(data = {}, createOptions = {}, dialogOptions = {}) {
    CreateDocumentDialog.migrateOptions(createOptions, dialogOptions);
    return CreateDocumentDialog.prompt(this, data, createOptions, dialogOptions);
  }

  /* -------------------------------------------- */

  /**
   * Get the list of item types that can be created.
   * @param {Actor} parent  The parent actor, if any.
   * @returns {string[]}
   */
  static _createDialogTypes(parent) {
    return this.TYPES.filter(t => t !== "backpack");
  }

  /* -------------------------------------------- */
  /*  Socket Event Handlers                       */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    if ((await super._preCreate(data, options, user)) === false) return false;
    
    // Call the system data model's _preCreate if it exists
    await this.system._preCreate?.(data, options, user);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    
    // Call the system data model's _onCreate if it exists
    await this.system._onCreate?.(data, options, userId);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preUpdate(changed, options, user) {
    if ((await super._preUpdate(changed, options, user)) === false) return false;
    
    // Call the system data model's _preUpdate if it exists
    await this.system._preUpdate?.(changed, options, user);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
    
    // Call the system data model's _onUpdate if it exists
    await this.system._onUpdate?.(changed, options, userId);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDelete(options, userId) {
    super._onDelete(options, userId);
    
    // Call the system data model's _onDelete if it exists
    await this.system._onDelete?.(options, userId);
  }
}