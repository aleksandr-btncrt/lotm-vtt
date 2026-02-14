const { TypeDataModel } = foundry.abstract;
const { StringField, NumberField, SchemaField, HTMLField } = foundry.data.fields;

/**
 * Data model for Pathway items (pathway/sequence or occupation used on the character sheet).
 * Used as drag-and-drop "pathways" on the character.
 * 
 * Pathways represent the 22 divine pathways in Lord of the Mysteries.
 * Sequences range from 9 (lowest) to 0 (highest/god), with each having a unique name.
 */
export default class PathwayData extends TypeDataModel {
  static LOCALIZATION_PREFIXES = ["LOTM.Pathway"];

  /** @inheritdoc */
  static defineSchema() {
    return {
      /** Pathway identifier (e.g. "fool", "door", "error") */
      pathway: new StringField({ 
        required: true, 
        blank: true,  // Allow blank for existing items
        initial: "",
        label: "LOTM.Pathway.Pathway",
        hint: "LOTM.Pathway.PathwayHint"
      }),
      /** Sequence number (0-9, where 0 is highest) */
      sequence: new NumberField({ 
        required: true, 
        integer: true, 
        min: 0, 
        max: 9, 
        initial: 9,
        label: "LOTM.Pathway.Sequence",
        hint: "LOTM.Pathway.SequenceHint"
      }),
      /** Optional description for the pathway */
      description: new HTMLField({ 
        initial: "",
        label: "LOTM.Pathway.Description"
      }),
    };
  }

  /* -------------------------------------------- */
  /*  Data Migration                              */
  /* -------------------------------------------- */

  /**
   * Migrate old pathway data to new structure.
   * @param {object} source  The candidate source data from which the model will be constructed.
   * @protected
   */
  static _migrateData(source) {
    // Migrate string sequence to number
    if (typeof source.sequence === "string") {
      const seqNum = parseInt(source.sequence);
      if (!isNaN(seqNum) && seqNum >= 0 && seqNum <= 9) {
        source.sequence = seqNum;
      } else {
        // Default to sequence 9 if invalid
        source.sequence = 9;
      }
    }
    
    // Ensure sequence is within bounds
    if (typeof source.sequence === "number") {
      if (source.sequence < 0) source.sequence = 0;
      if (source.sequence > 9) source.sequence = 9;
    }
    
    // Set default pathway if missing or blank
    if (!source.pathway || source.pathway === "") {
      source.pathway = "fool";  // Default to fool pathway
    }
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
    // Handle missing or blank pathway
    if (!this.pathway || this.pathway === "") {
      this.labels = {
        pathway: game.i18n.localize("LOTM.Pathway.NoPathway"),
        sequence: `Sequence ${this.sequence}`,
        rank: this.getSequenceRank(),
        fullTitle: game.i18n.localize("LOTM.Pathway.NoPathway")
      };
      return;
    }
    
    const pathwayConfig = CONFIG.LOTM?.pathways?.[this.pathway];
    const sequenceConfig = pathwayConfig?.sequences?.[this.sequence];
    
    this.labels = {
      pathway: pathwayConfig?.name || this.pathway || game.i18n.localize("LOTM.Pathway.NoPathway"),
      sequence: sequenceConfig?.name || `Sequence ${this.sequence}`,
      rank: this.getSequenceRank(),
      fullTitle: this.getFullTitle()
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
    // Prepare pathway options for dropdown
    context.pathwayOptions = Object.entries(CONFIG.LOTM?.pathways || {}).map(([key, config]) => ({
      value: key,
      label: config.name,
      selected: this.pathway === key
    }));
    
    // Prepare sequence options (9 to 0, hierarchical display)
    const pathwayConfig = CONFIG.LOTM?.pathways?.[this.pathway];
    context.sequenceOptions = [];
    
    for (let i = 9; i >= 0; i--) {
      const sequenceData = pathwayConfig?.sequences?.[i];
      let label = `Sequence ${i}`;
      
      // Try to get localized sequence name
      if (sequenceData?.name) {
        const localizedName = game.i18n.localize(sequenceData.name);
        // Only append if localization succeeded (didn't return the key)
        if (localizedName !== sequenceData.name) {
          label = `Sequence ${i}: ${localizedName}`;
        }
      }
      
      context.sequenceOptions.push({
        value: i,
        label: label,
        selected: this.sequence === i,
        disabled: false
      });
    }
    
    // Add current pathway/sequence info
    context.currentPathway = pathwayConfig;
    context.currentSequence = pathwayConfig?.sequences?.[this.sequence];
    
    // Prepare all 10 sequences for display
    context.allSequences = [];
    if (pathwayConfig) {
      for (let i = 9; i >= 0; i--) {
        const sequenceData = pathwayConfig?.sequences?.[i];
        if (sequenceData) {
          const localizedName = game.i18n.localize(sequenceData.name);
          context.allSequences.push({
            number: i,
            name: localizedName !== sequenceData.name ? localizedName : `Sequence ${i}`,
            rank: sequenceData.rank,
            isCurrent: this.sequence === i,
            localizationKey: sequenceData.name
          });
        }
      }
    }
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Get the rank description for this sequence.
   * Sequences 9-7 are considered low rank, 6-4 mid rank, 3-1 high rank, 0 is divine.
   * @returns {string}
   */
  getSequenceRank() {
    if (this.sequence === 0) return game.i18n.localize("LOTM.Pathway.Rank.Divine");
    if (this.sequence <= 3) return game.i18n.localize("LOTM.Pathway.Rank.High");
    if (this.sequence <= 6) return game.i18n.localize("LOTM.Pathway.Rank.Mid");
    return game.i18n.localize("LOTM.Pathway.Rank.Low");
  }

  /* -------------------------------------------- */

  /**
   * Get the full title combining pathway and sequence.
   * @returns {string}
   */
  getFullTitle() {
    // Handle missing or blank pathway
    if (!this.pathway || this.pathway === "") {
      return game.i18n.localize("LOTM.Pathway.NoPathway");
    }
    
    const pathwayConfig = CONFIG.LOTM?.pathways?.[this.pathway];
    const sequenceConfig = pathwayConfig?.sequences?.[this.sequence];
    
    if (pathwayConfig && sequenceConfig) {
      // Try to localize the sequence name
      const seqName = game.i18n.localize(sequenceConfig.name);
      return `${seqName} (${pathwayConfig.name} - Sequence ${this.sequence})`;
    }
    return `${this.pathway} Sequence ${this.sequence}`;
  }

  /* -------------------------------------------- */

  /**
   * Check if this sequence can advance (not yet Sequence 0).
   * @returns {boolean}
   */
  canAdvance() {
    return this.sequence > 0;
  }

  /* -------------------------------------------- */

  /**
   * Get the next sequence in advancement.
   * @returns {number|null}
   */
  getNextSequence() {
    return this.canAdvance() ? this.sequence - 1 : null;
  }

  /* -------------------------------------------- */

  /**
   * Properties displayed in chat cards.
   * @type {string[]}
   */
  get chatProperties() {
    return [
      this.labels?.pathway,
      this.labels?.sequence,
      this.labels?.rank
    ].filter(p => p);
  }
}
