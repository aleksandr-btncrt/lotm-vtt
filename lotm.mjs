import * as documents from "./src/module/documents/_module.mjs";
import * as apps from "./src/module/applications/_module.mjs"
import * as dataModels from "./src/module/data/_module.mjs";
import { LOTM } from './src/module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './src/module/helpers/templates.mjs';
import DragDropLotm from "./src/module/drag-drop.mjs"

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {
  CONFIG.LOTM = LOTM;

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  for (const doc of Object.values(documents)) {
    CONFIG[doc.documentName].documentClass = doc;
    if (dataModels.collection[`${doc.documentName}sLotm`]) {
      CONFIG[doc.documentName].collection = dataModels.collection[`${doc.documentName}sLotm`]
    }
    console.log(CONFIG);
  }


  Object.assign(CONFIG.Actor.dataModels, dataModels.Actor.config);
  Object.assign(CONFIG.Item.dataModels, dataModels.Item.config);

  CONFIG.Actor.defaultType = "token"


  foundry.documents.collections.Actors.registerSheet("lotm", apps.Actor.LotmActorSheet, { makeDefault: true, label: "LOTM.Sheets.Labels.ActorSheet" })
  foundry.documents.collections.Items.registerSheet("lotm", apps.Item.LotmItemSheet, { label: "LOTM.Sheets.Label.ItemSheet" })

  CONFIG.ux.DragDrop = DragDropLotm
});

/* -------------------------------------------- */
/*  Migration Hooks                             */
/* -------------------------------------------- */

/**
 * Migrate item data before it's initialized.
 * This fixes validation errors for old data.
 */
Hooks.on('preCreateItem', (item, data, options, userId) => {
  if (data.system && CONFIG.Item.dataModels[data.type]?._migrateData) {
    CONFIG.Item.dataModels[data.type]._migrateData(data.system);
  }
});

/**
 * Migrate actor's embedded items on actor creation/update.
 */
Hooks.on('preCreateActor', (actor, data, options, userId) => {
  if (data.items) {
    for (const itemData of data.items) {
      if (itemData.system && CONFIG.Item.dataModels[itemData.type]?._migrateData) {
        CONFIG.Item.dataModels[itemData.type]._migrateData(itemData.system);
      }
    }
  }
});

Hooks.once("i18nInit", () => {
  localizeHelper(CONFIG.LOTM)
})

/**
 * Searches through an object recursively and localizes strings
 * @param {Record<string, unknown>} object
 */
export function localizeHelper(object) {
  for (const [key, value] of Object.entries(object)) {
    // const type = foundry.utils.getType(value)
    switch (typeof value) {
      case "object":
        if (value) localizeHelper(value);
        break;
      case "string":
        if (key === "label") object[key] = game.i18n.localize(value);
        break;
    }
  }
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('capitalize', function (str) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
})

Handlebars.registerHelper('toUpperCase', function (str) {
  return str.toUpperCase();
})

Handlebars.registerHelper('subtract', function (a, b) {
  return a - b;
})

Handlebars.registerHelper('gt', function (a, b) {
  return a > b;
})

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
})


/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.lotm.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'lotm.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}