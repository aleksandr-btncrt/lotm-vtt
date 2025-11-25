const { TypeDataModel } = foundry.abstract
const { StringField, ArrayField, SchemaField, NumberField, BooleanField } = foundry.data.fields

export default class ConsumableData extends TypeDataModel {
  static LOCALIZATION_PREFIXES = ["LOTM.Consumable"];


  /** @inheritdoc */
  static defineSchema(){
    return {
      properties: new StringField(),
      type: new StringField({initial: "consumable"}),
      uses: new NumberField()
    }
  }
}