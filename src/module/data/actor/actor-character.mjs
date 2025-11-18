
const { TypeDataModel } = foundry.abstract
const { StringField, SchemaField, NumberField, BooleanField } = foundry.data.fields

export default class LotmActorModelV2 extends TypeDataModel {

  /** @inheritdoc */
  static LOCALIZATION_PREFIX = ["LOTM.Actor"]

  /** @inheritdoc */
  static defineSchema() {
    return {
      editable: new BooleanField({initial: false}),
      occupation: new SchemaField({
        value: new StringField({ initial: "" })
      }),
      pathway: new SchemaField({
        name: new StringField({ initial: "" }),
        sequence: new StringField({ initial: "" })
      }),
      abilities: new SchemaField(Object.keys(CONFIG.LOTM.abilities).reduce((obj, ability) => {
        obj[ability] = new SchemaField({
          value: new NumberField({ initial: 0, min: 0, max: 6, step: 1 }),
          boost: new SchemaField({
            value: new NumberField({ initial: 0 })
          })
        });
        return obj;
      }, {})),
      isBeyonder: new SchemaField({
        value: new BooleanField({ initial: false })
      }),
      spirituality: new NumberField({ initial: 0 })
    }
  }
}