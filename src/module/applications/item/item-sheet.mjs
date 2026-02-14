import DocumentSheetLOTM from "../api/document-sheet.mjs";
import PrimarySheetMixin from "../api/primary-sheet-mixin.mjs";

const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
 * Base item sheet for LOTM items.
 * Follows the DnD5e pattern of using data model methods for sheet-specific data.
 */
export class LotmItemSheet extends PrimarySheetMixin(DocumentSheetLOTM) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    form: {
      submitOnChange: true
    },
    position: {
      width: 500,
      height: 1200
    },
    window: {
      resizable: false
    },
    tag: "form"
  };

  /** @override */
  static PARTS = {
    body: {
      template: "systems/lotm/templates/item/item-sheet.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * The Item document managed by this sheet.
   * @type {Item}
   */
  get item() {
    return this.document;
  }

  /** @override */
  _getPartTemplate(partId) {
    // No longer need dynamic template switching - item-sheet.hbs uses partials
    return super._getPartTemplate?.(partId) || this.constructor.PARTS[partId]?.template;
  }

  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    const initialized = super._initializeApplicationOptions(options);
    initialized.classes.push(initialized.document.type);
    return initialized;
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Build the base context following DnD5e pattern
    const enrichmentOptions = {
      secrets: this.item.isOwner, 
      relativeTo: this.item, 
      rollData: this.item.getRollData?.() ?? {}
    };

    const preparedContext = {
      ...context,
      item: this.item,
      system: this.item.system,
      source: this.isEditable ? this.item.system._source : this.item.system,
      flags: this.item.flags,
      editable: this.isEditable,
      owner: this.item.isOwner,
      limited: this.item.limited,
      labels: this.item.system.labels || {},
      // Enrich description if it exists
      enrichedDescription: this.item.system.description 
        ? await TextEditor.enrichHTML(this.item.system.description, enrichmentOptions)
        : ""
    };

    // Allow the data model to add type-specific sheet data
    await this.item.system.getSheetData?.(preparedContext);

    return preparedContext;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    // Context is already prepared in _prepareContext, no special handling needed
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    body: {
      template: "systems/lotm/templates/item/item-sheet.hbs"
    }
  };
  
  /* -------------------------------------------- */
  
  /** @override */
  async _preRender(context, options) {
    // No longer need to dynamically switch templates - item-sheet.hbs uses partials
    return super._preRender?.(context, options);
  }

  /* -------------------------------------------- */
  /* Tab Handling                                  */
  /* -------------------------------------------- */

  /** @override */
  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
  }

  /** @override */
  _onRender(context, options) {
    super._onRender?.(context, options);
    
    // Activate tabs after a short delay to ensure DOM is ready
    requestAnimationFrame(() => {
      this._activateTabs();
    });
  }

  /**
   * Activate tab navigation manually
   * @protected
   */
  _activateTabs() {
    const html = this.element;
    
    if (!html) return;

    // Find all tab navigation links
    const tabLinks = html.querySelectorAll('.sheet-tabs [data-tab]');
    
    if (tabLinks.length === 0) return;
    
    // Set first tab as active if none are active
    const hasActive = html.querySelector('.sheet-tabs [data-tab].active');
    
    if (!hasActive && tabLinks.length > 0) {
      const firstTab = tabLinks[0];
      const firstTabName = firstTab.dataset.tab;
      const firstGroup = firstTab.dataset.group || 'primary';
      
      firstTab.classList.add('active');
      
      // Hide all tabs first
      html.querySelectorAll(`.tab[data-group="${firstGroup}"]`).forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
      });
      
      // Activate first tab content with inline style
      const firstContent = html.querySelector(`.tab[data-group="${firstGroup}"][data-tab="${firstTabName}"]`);
      if (firstContent) {
        firstContent.classList.add('active');
        firstContent.style.display = 'block';
      }
    }
    
    // Add click handlers to tab links
    tabLinks.forEach((link) => {
      // Remove any existing listeners
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      newLink.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const group = newLink.dataset.group || 'primary';
        const tab = newLink.dataset.tab;
        
        // Deactivate all tabs in this group
        html.querySelectorAll(`.sheet-tabs [data-group="${group}"][data-tab]`).forEach(t => {
          t.classList.remove('active');
        });
        
        // Hide all tab content in this group - use inline styles to force it
        html.querySelectorAll(`.tab[data-group="${group}"]`).forEach(c => {
          c.classList.remove('active');
          c.style.display = 'none';
        });
        
        // Activate clicked tab
        newLink.classList.add('active');
        
        // Show corresponding content - use inline styles to force it
        const content = html.querySelector(`.tab[data-group="${group}"][data-tab="${tab}"]`);
        if (content) {
          content.classList.add('active');
          content.style.display = 'block';
        }
      });
    });
  }

  /* -------------------------------------------- */
  /*  Form Handling                               */
  /* -------------------------------------------- */

  /**
   * Handle change events on form inputs.
   * @param {Event} event - The change event
   * @param {object} formConfig - The form configuration
   * @returns {Promise<void>}
   * @protected
   * @override
   */
  async _onChangeForm(formConfig, event) {
    // Call parent to get default FormData processing
    return super._onChangeForm(formConfig, event);
  }
  
  /* -------------------------------------------- */

  /**
   * Process form data for submission.
   * @param {Event} event - The originating form submission event
   * @param {HTMLFormElement} form - The form element that was submitted
   * @param {FormDataExtended} formData - The FormDataExtended object
   * @returns {object}
   * @protected
   * @override
   */
  _processFormData(event, form, formData) {
    // If this is a change event and the target has a name, ensure it's in the FormData
    if (event?.type === 'change' && event?.target?.name && event?.target?.value !== undefined) {
      const targetName = event.target.name;
      const targetValue = event.target.value;
      
      // Check if the changed field is in the FormData
      if (!formData.has(targetName)) {
        formData.set(targetName, targetValue);
      }
    }
    
    return super._processFormData(event, form, formData);
  }
}