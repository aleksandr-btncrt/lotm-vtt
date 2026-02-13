const { TypeDataModel } = foundry.abstract;
const { StringField } = foundry.data.fields;

/**
 * Base/generic Item type data model (minimal schema).
 * Used when type is "item" in the create dialog.
 */
export default class ItemData extends TypeDataModel {
  static LOCALIZATION_PREFIXES = ["LOTM.Item"];

  /** @inheritdoc */
  static defineSchema() {
    return {};
  }
}
