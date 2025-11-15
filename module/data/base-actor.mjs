import LotmDataModel from "./base-model.mjs";

export default class LotmActorBase extends LotmDataModel {

  static defineSchema() {
    const { SchemaField, StringField, NumberField, BooleanField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.isBeyonder = new SchemaField({
      value: new BooleanField({initial: false})
    })

    schema.race = new SchemaField({
      value: new StringField({ required: true, blank: true })
    })
    schema.path = new SchemaField({
      value: new StringField({ required: true, blanck: true })
    })
    schema.gender = new StringField({ required: true, blank: true, readonly: false, initial: "", recursive: false });
    schema.biography = new StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    schema.sequence = new SchemaField({
      value: new NumberField({ required: false, nullable: true, min: 0 }),
      max: new NumberField({ required: false, initial: 10 })
    })

    schema.age = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 16, min: 16 }),
      max: new NumberField({ ...requiredInteger, initial: 99999 })
    })

    schema.health = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      extra: new NumberField({ ...requiredInteger, initial: 0 }),
      hit: new NumberField({ ...requiredInteger, initial: 0 }),
      init: new NumberField({ ...requiredInteger, initial: 10 })
    });
    schema.power = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 5 })
    });

    return schema;
  }

}