// Import document classes.
import { LotmActor } from './documents/actor.mjs';
import { LotmItem } from './documents/item.mjs';
// Import sheet classes.
import { LotmActorSheet } from './sheets/actor-sheet.mjs';
import { LotmItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { LOTM } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

import { ClasslessSkillTree5E } from "./data/skilltree/_module.mjs";
import { RequiredSkill } from "./data/skilltree/RequiredSkill.mjs";
import { SkillNode } from "./data/skilltree/SkillNode.mjs";
import { SkillRequirement } from "./data/skilltree/SkillRequirement.mjs";
import { SkillTree } from "./data/skilltree/SkillTree.mjs";
import { SkillTreeUtils } from "./data/skilltree/SkillTreeUtils.mjs";

import { foolPathway } from './pathways/fool.mjs'

const Actors = foundry.documents.collections.Actors;
const ActorSheet = foundry.appv1.sheets.ActorSheet;
const Items = foundry.documents.collections.Items;
const ItemSheet = foundry.appv1.sheets.ItemSheet;


Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  SkillTreeUtils.log(false, "Dev Mode Ready");
  registerPackageDebugFlag(ClasslessSkillTree5E.ID);
});

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  SkillTreeUtils.log(false, "Main Initialized!");
  game.lotm = {
    LotmActor,
    LotmItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.LOTM = LOTM;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = LotmActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.LotmCharacter,
    npc: models.LotmNPC
  }
  CONFIG.Item.documentClass = LotmItem;
  CONFIG.Item.dataModels = {
    item: models.LotmItem,
    feature: models.LotmFeature,
    spell: models.LotmSpell
  }

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('lotm', LotmActorSheet, {
    makeDefault: true,
    label: 'LOTM.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('lotm', LotmItemSheet, {
    makeDefault: true,
    label: 'LOTM.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
  setupSkillTree()
});

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

function setupSkillTree() {
  const nodes = [];
  for (let index = 0; index < foolPathway.length; index++) {
    const element = foolPathway[index]
    let node;
    if(index === 0){
      node = new SkillNode(`${element.name}-${element.sequence}`,element.name, "", "", 0, 0, [])
    }
    if(index>0 && index<10){
      node = new SkillNode(`${element.name}-${element.sequence}`, element.name, "", "", 0, 1, [new SkillRequirement([
        new RequiredSkill(nodes[index-1], 1, "<="), 
      ], "AND")])
    }
    if(index === 10){
      node = new SkillNode(`${element.name}-${element.sequence}`,element.name, "", "", 0, 0, [])
    }
    nodes.push(node)
    console.log(node);
  }

  const testSkillTree = new SkillTree(
    "Fool",
    "This is a test to see if the Skill Tree class works.",
    nodes
  );

  const errorMessages = testSkillTree.validateTree();
  if (errorMessages.length > 0) {
    SkillTreeUtils.log(false, "Errors found in the Skill Tree:");
    errorMessages.forEach((errorMsg) => {
      console.warn(`CST5E | ${errorMsg}`);
    });
  }
}