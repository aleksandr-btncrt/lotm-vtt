import SystemDocumentMixin from "./mixins/document.mjs"
import CreateDocumentDialog from "../applications/create-document-dialog.mjs"


export default class ItemLotm extends SystemDocumentMixin(Item){

  static async createWithContents(items, { container, keepId=false, transformAll, transformFirst }={}) {
    let depth = 0;
    if ( container ) {
      depth = 1 + (await container.system.allContainers()).length;
      if ( depth > PhysicalItemTemplate.MAX_DEPTH ) {
        ui.notifications.warn(game.i18n.format("DND5E.ContainerMaxDepth", { depth: PhysicalItemTemplate.MAX_DEPTH }));
        return;
      }
    }

    const createItemData = async (item, containerId, depth) => {
    };

    const created = [];
    for ( const item of items ) await createItemData(item, container?.id, depth);
    return created;
  }

  static async createDialog(data={}, createOptions={}, dialogOptions={}){
    CreateDocumentDialog.migrateOptions(createOptions, dialogOptions);
    return CreateDocumentDialog.prompt(this, data, createOptions, dialogOptions)
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    //await this.system.onCreateActivities?.(data, options, userId);
  }

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
  }

  static _createDialogTypes(parent) {
    return this.TYPES.filter(t => t !== "backpack");
  }

}