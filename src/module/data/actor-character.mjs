import LotmActorBase from "./base-actor.mjs";

export default class LotmCharacter extends LotmActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.occupation = new fields.StringField({ initial: "" })
    schema.semiMyticCreatureMode = new fields.SchemaField({
      value: new fields.BooleanField({ initial: false })
    })
    schema.grade = new fields.SchemaField({
      value: new fields.StringField()
    })

    schema.max_points_abilities = new fields.NumberField({ initial: 32, min: 0 });
    schema.spirituality = new fields.NumberField({ initial: 0 })
    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.LOTM.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 6, step: 1 }),
        boost: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 })
        })
      });
      return obj;
    }, {}));

    return schema;
  }

  prepareDerivedData() {
    if (this.sequence.value === null) {
      this.grade.value = "Common Person"
    }
    if ([9, 8].includes(this.sequence.value)) {
      this.grade.value = "Low Sequence"
    }
    if ([7, 6, 5].includes(this.sequence.value)) {
      this.grade.value = "Mid Sequence"
    }
    if ([4, 3].includes(this.sequence.value)) {
      this.grade.value = "High Sequence - Saint"
    }
    if ([2, 1].includes(this.sequence.value)) {
      this.grade.value = "High Sequence - Angel"
    }
    if (this.sequence.value === 0) {
      this.grade.value = "True God"
    }

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.LOTM.abilities[key]) ?? key;
    }
    // (((((((10+'主体信息'!R7+
    let derivatedMaxHealth = this.health.init + this.abilities['phy'].value
    console.log('init', derivatedMaxHealth)
    // IF(V2<=9,SUM(V18:W18),0)+
    // IF(V2<=8,SUM(V18:X18),0)+
    // IF(V2<=7,SUM(V18:Y18),0)+
    // IF(V2<=6,SUM(V18:Z18),0)+
    // IF(V2<=5,SUM(V18:AA18),0)+
    if (this.sequence.value <= 9 && this.sequence.value >= 5) {
      derivatedMaxHealth += this.abilities['phy'].value * ((9 - this.sequence.value) + 1) + this.abilities['phy'].boost.value;
    }
    // IF(V2<=4,SUM(V18:AB18)*2,0))
    if (this.sequence.value == 4) {
      derivatedMaxHealth += (this.abilities['phy'].value * (9 - this.sequence.value) + this.abilities['phy'].boost.value) * 2
    }
    // *IF(V2<=4,2,1))+
    if (this.sequence.value <= 4) {
      derivatedMaxHealth = derivatedMaxHealth * 2
    }
    // IF(V2<=3,SUM(V18:AC18)*2,0)+
    if (this.sequence.value == 3) {
      derivatedMaxHealth += (this.abilities['phy'].value * (9 - this.sequence.value) + this.abilities['phy'].boost.value) * 2
    }
    // IF(V2<=2,SUM(V18:AD18)*3,0))*
    if (this.sequence.value == 2) {
      derivatedMaxHealth += (this.abilities['phy'].value + this.abilities['phy'].boost.value) * 3 + (9 - this.sequence.value)
    }
    //IF(V2<=2,2,1)+
    if (this.sequence.value <= 2) {
      derivatedMaxHealth = derivatedMaxHealth * 2
    }
    // IF(V2<=1,SUM(V18:AE18)*3,0))*
    if (this.sequence.value == 1) {
      derivatedMaxHealth += ((this.abilities['phy'].value + this.abilities['phy'].boost.value) * 3) + (9 - this.sequence.value)
    }
    // IF(V3="天使之王",1.5
    // IF(V3="真神",1.5
    // IF(V3="旧日",1.5
    // V3="支柱",1.5 +
    if (["King of Angels", "True God", "Old One", "Pilar"].includes(this.grade.value)) {
      derivatedMaxHealth + derivatedMaxHealth * 1.5
    }
    //IF(V2=0,SUM(V18:AF18)*4,0))*
    if (this.sequence === 0) {
      derivatedMaxHealth += this.abilities['phy'].boost.value * 4
    }

    // IF(V2=0,2,1))*
    if (this.sequence === 0) {
      derivatedMaxHealth = derivatedMaxHealth * 2
    }

    // IF(V3="旧日",3,IF(V3="支柱",3,1)))*
    if (["Old One", "Pilar"].includes(this.grade.value)) {
      derivatedMaxHealth = derivatedMaxHealth * 3
    }

    if (['Pilar'].includes(this.grade.value)) {
      derivatedMaxHealth = derivatedMaxHealth * 4
    }


    // *IF(V3="支柱",4,1)+
    // SUM('主体信息'!AZ4:BA13)/5
    if (this.semiMyticCreatureMode.value === true) {

    }

    derivatedMaxHealth += this.health.extra;
    this.health.value = derivatedMaxHealth - this.health.hit


    this.health.derivatedMax = derivatedMaxHealth
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    //data.lvl = this.attributes.level.value;

    return data
  }
}