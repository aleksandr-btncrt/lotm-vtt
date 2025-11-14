import LotmDataModel from "./base-model.mjs";

export default class LotmActorBase extends LotmDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.race = new fields.SchemaField({
      value: new fields.StringField({required: true, blank: true})
    })
    schema.path = new fields.SchemaField({
      value: new fields.StringField({required: true, blanck: true})
    })
    schema.gender = new fields.StringField({ required: true, blank: true, readonly: false, initial: "", recursive: false });
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    schema.sequence = new fields.SchemaField({
      value: new fields.NumberField({ required: false, nullable: true, min: 0 }),
      max: new fields.NumberField({ required: false, initial: 10 })
    })

    schema.age = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 16, min: 16 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 99999 })
    })

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      extra: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      hit: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      init: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });
    schema.power = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    return schema;
  }

}