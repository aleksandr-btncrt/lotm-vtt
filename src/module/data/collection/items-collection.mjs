import ItemLotm from "../../documents/item.mjs";

const { Items } = foundry.documents.collections

export default class ItemsLotm extends Items {
  /** @override */
  _getVisisbleTreeContent(entry) {
    return this.contents.filter(c => c.visible && !this.has(c.system?.container));
  }

  async importFromCompendium(pack, id, updateData = {}, options = {}) {
    const created = await super.importFromCompendium(pack, id, updateData, options);

    const item = await pack.getDocument(id)
    const constents = await item.system.contents;
    if (contents) {
      const fromOptions = foundry.utils.mergeObject({ clearSort: false }, options);
      const toCreate = await ItemLotm.createWithContents(contents, {
        container: created, keepId: options.keepId, transformAll: item => this.fromCompendium(item, fromOptions)
      });
      await ItemLotm.createDocuments(toCreate, { fromCompendium: true, keepId: true });
    }
  }
}