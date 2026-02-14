export default function SystemFlagsMixin(Base) {
  class SystemFlags extends Base {

    /**
     * Get the data model that represents system flags.
     * @type {typeof DataModel|null}
     * @abstract
     */
    get _systemFlagsDataModel() {
      return null;
    }

    prepareData() {
      super.prepareData();
      if (("lotm" in this.flags) && this._systemFlagsDataModel) {
        this.flags.lotm = new this._systemFlagsDataModel(this._source.flags.lotm, { parent: this });
      }
    }

    async setFlag(scope, key, value) {
      if ((scope === "lotm") && this._systemFlagsDataModel) {
        let diff;
        const changes = foundry.utils.expandObject({ [key]: value });
        if (this.flags.lotm) diff = this.flags.lotm.updateSource(changes, { dryRun: true });
        else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject();
        return this.update({ flags: { lotm: diff } });
      }
      return super.setFlag(scope, key, value);
    }
  }
  return SystemFlags;
}