const { TypeDataModel } = foundry.abstract;
const { StringField, NumberField, SchemaField } = foundry.data.fields;

/**
 * Data model for Class items (pathway/sequence or occupation used on the character sheet).
 * Used as drag-and-drop "classes" on the character.
 */
export default class ClassData extends TypeDataModel {
  static LOCALIZATION_PREFIXES = ["LOTM.Class"];

  /** @inheritdoc */
  static defineSchema() {
    return {
      /** Pathway key (e.g. "fool", "door") */
      pathway: new StringField({ initial: "" }),
      /** Sequence index or name (e.g. "0", "1", "Attendant of Mysteries") */
      sequence: new StringField({ initial: "" }),
      /** Optional description for the class */
      description: new StringField({ initial: "" }),
    };
  }
}
