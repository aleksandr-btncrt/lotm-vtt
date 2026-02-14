
const { TypeDataModel } = foundry.abstract
const { StringField, ArrayField, SchemaField, NumberField, BooleanField } = foundry.data.fields

export default class LotmActorModelV2 extends TypeDataModel {

  /** @inheritdoc */
  static LOCALIZATION_PREFIX = ["LOTM.Actor"]

  /** @inheritdoc */
  static defineSchema() {
    return {
      editable: new BooleanField({ initial: false }),
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
          boost: new ArrayField(new NumberField())
        })
        return obj;
      }, {})),
      isBeyonder: new SchemaField({
        value: new BooleanField({ initial: false })
      }),
      spirituality: new NumberField({ initial: 0 })
    }
  }

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    
    // Data cleanup: Fix any corrupted sequence data (old code stored localization keys instead of numbers)
    let needsCleanup = false;
    const updateData = {};
    
    // Check if there's an old 'path' field in the database that needs to be removed
    if (this.path && typeof this.path === 'object') {
      console.warn("Detected old 'path' field in database, will remove it:", this.path);
      updateData["system.-=path"] = null; // Delete the old path field
      needsCleanup = true;
    }
    
    if (this.pathway?.sequence && typeof this.pathway.sequence === 'string' && this.pathway.sequence.startsWith('LOTM.Pathways.')) {
      console.warn("Detected corrupted sequence data in prepareDerivedData:", this.pathway.sequence);
      // Extract the sequence number and pathway name from the localization key
      // Format: "LOTM.Pathways.read-priest.3"
      const parts = this.pathway.sequence.split('.');
      const sequenceNum = parts[parts.length - 1];
      const pathwayName = parts[2]; // The pathway name is the 3rd part
      
      if (!isNaN(sequenceNum) && sequenceNum >= 0 && sequenceNum <= 9) {
        console.log("Fixing sequence in memory to:", sequenceNum);
        console.log("Extracted pathway name from corrupted data:", pathwayName);
        
        // Fix sequence in memory for this render
        this.pathway.sequence = sequenceNum;
        updateData["system.pathway.sequence"] = sequenceNum;
        needsCleanup = true;
        
        // If pathway name is also missing or doesn't match, fix it too
        if (!this.pathway.name || this.pathway.name === "") {
          console.log("Fixing missing pathway name to:", pathwayName);
          this.pathway.name = pathwayName;
          updateData["system.pathway.name"] = pathwayName;
        }
      }
    }
    
    // Persist the cleanup to database if needed
    if (needsCleanup && this.parent) {
      this.parent.update(updateData, {render: false}).then(() => {
        console.log("Persisted data fix to database:", updateData);
      });
    }
  }
}