import { createTemplateParts } from "../../utils/default-options.mjs";

const { api, sheets } = foundry.applications;

export class LotmActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["lotm", "character-sheet"],
    position: {
      width: 600,
      height: 1000
    },
    form: {
      submitOnChange: true
    },
    tag: "form",
  }

  /** @inheritdoc */
  static TABS = []

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

    console.log("_prepareContext - Actor ID:", this.actor.id, "Name:", this.actor.name);
    console.log("_prepareContext - this.actor.system.pathway:", this.actor.system.pathway);

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
        console.log("_preparePartContext(header) - system.pathway:", context.system?.pathway);
        newContext = context;
        break;
      }
      case "details": {
        newContext = this._preprareSummaryDetails(context);
        console.log("_preparePartContext(details) - pathway:", newContext.pathway);
        break;
      }
      case "attributes":
        newContext.attributes = await this._getAttributes();
        newContext.tab = context.tabs[partId]
        break;
      case "pathway":
        newContext = this._preparePathwayContext(context);
        break;
    }
    return newContext;
  }

  _preparePathwayContext(context) {
    const { config: {
      LOTM: {pathways}
    }, system: {
      pathway
    } } = context;
    
    const pathwayName = pathway?.name || "";
    const currentSequence = pathway?.sequence || "";
    
    console.log("_preparePathwayContext - pathwayName:", pathwayName);
    console.log("_preparePathwayContext - currentSequence:", currentSequence, "type:", typeof currentSequence);
    
    // Prepare all sequences for the current pathway
    let allSequences = [];
    let pathwayOptions = [];
    
    // Prepare pathway options for dropdown
    if (pathways) {
      pathwayOptions = Object.entries(pathways).map(([key, config]) => ({
        key: key,
        name: config.name,
        selected: pathwayName === key
      }));
    }
    
    // Prepare all sequences if a pathway is selected
    if (pathwayName && pathways && pathways[pathwayName]) {
      const pathwayConfig = pathways[pathwayName];
      // Generate sequences from 9 to 0
      for (let i = 9; i >= 0; i--) {
        const sequenceData = pathwayConfig.sequences?.[i];
        if (sequenceData) {
          const localizedName = game.i18n.localize(sequenceData.name);
          const isCurrent = currentSequence == i.toString() || currentSequence == i;
          console.log(`Sequence ${i} - isCurrent check: currentSequence(${currentSequence}) == ${i} or ${i.toString()} => ${isCurrent}`);
          allSequences.push({
            number: i,
            name: localizedName,
            rank: sequenceData.rank,
            isCurrent: isCurrent,
            localizationKey: sequenceData.name
          });
        }
      }
    }
    
    return {
      system: context.system,
      config: context.config,
      pathwayOptions: pathwayOptions,
      currentPathway: pathways?.[pathwayName],
      allSequences: allSequences,
      tab: context.tab?.pathway
    };
  }

  _preprareSummaryDetails(context) {
    const { config: {
      LOTM: {pathways}
    }, system: {
      editable, abilities, pathway
    }, actor } = context
    console.log("_preprareSummaryDetails - pathway:", pathway);
    
    // Create selectedPathway with localized sequence names for the dropdown
    let selectedPathway = {};
    if (pathway && pathway.name && pathway.name !== "" && pathways[pathway.name]?.sequences) {
      selectedPathway = Object.keys(pathways[pathway.name].sequences).reduce((pv, sequenceNum)=>{
        const sequenceData = pathways[pathway.name].sequences[sequenceNum];
        pv[sequenceNum] = {
          name: game.i18n.localize(sequenceData.name), // Localize the I18n key here
          sequence: `${sequenceData.sequence}`
        }
        return pv;
      }, {});
    }
    
    return {
      editable,
      abilities,
      pathway,
      actor,
      config: context.config,
      selectedPathway
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
    console.log("_processSubmitData", { event, form, data })
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

  /* -------------------------------------------------- */
  /*   Drag and Drop                                    */
  /* -------------------------------------------------- */

  /**
   * Handle dropping an Item on the Actor sheet
   * @param {DragEvent} event
   * @returns {Promise<void>}
   * @protected
   * @override
   */
  async _onDropItem(event, data) {
    if (!this.isEditable) return;

    const item = await Item.implementation.fromDropData(data);
    if (!item) return;

    // Handle pathway items specially
    if (item.type === "pathway") {
      return this._onDropPathwayItem(item);
    }

    // Default behavior for other items
    return super._onDropItem(event, data);
  }

  /**
   * Handle dropping a pathway item on the Actor
   * @param {Item} item - The pathway item being dropped
   * @returns {Promise<void>}
   * @protected
   */
  async _onDropPathwayItem(item) {
    console.log("=== PATHWAY ITEM DROP START ===");
    console.log("Actor ID:", this.actor.id);
    console.log("Actor name:", this.actor.name);
    console.log("Dropping pathway item:", item);
    console.log("Pathway item name:", item.name);
    console.log("Pathway item system data:", item.system);
    console.log("Current actor pathway before update:", this.actor.system.pathway);
    
    const pathway = item.system.pathway || "";
    const sequence = item.system.sequence;

    console.log("Extracted pathway:", pathway);
    console.log("Extracted sequence:", sequence);
    console.log("Sequence type:", typeof sequence);

    // Validate that we have the necessary data
    if (!pathway) {
      ui.notifications.warn(`Pathway item "${item.name}" is missing pathway information. Please edit the item and fill in the pathway field.`);
      return;
    }

    if (sequence === undefined || sequence === null) {
      ui.notifications.warn(`Pathway item "${item.name}" is missing sequence information. Please edit the item and fill in the sequence field.`);
      return;
    }

    // Convert sequence to string for actor's StringField
    const sequenceString = String(sequence);

    // Update the actor's pathway information
    // Note: We MUST use 'pathway' not 'path' - 'path' is just an alias created in prepareDerivedData
    const updateData = {
      "system.pathway.name": pathway,
      "system.pathway.sequence": sequenceString,
      "system.isBeyonder.value": true
    };
    
    console.log("Updating actor with:", updateData);
    const result = await this.actor.update(updateData);
    console.log("Update result:", result);
    console.log("Actor pathway after update:", this.actor.system.pathway);
    
    // Force a re-render to ensure the UI updates with new data
    await this.render(false);
    console.log("After manual render - pathway:", this.actor.system.pathway);

    // Get pathway name for notification
    const pathwayConfig = CONFIG.LOTM?.pathways?.[pathway];
    const pathwayName = pathwayConfig?.name || pathway;
    const sequenceData = pathwayConfig?.sequences?.[sequence];
    const sequenceName = sequenceData ? game.i18n.localize(sequenceData.name) : `Sequence ${sequence}`;

    ui.notifications.info(`Applied pathway: ${item.name} (${pathwayName} - ${sequenceName})`);
    console.log("=== PATHWAY ITEM DROP END ===");
  }


}