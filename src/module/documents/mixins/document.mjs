import DependentDocumentMixin from "./dependent.mjs";
import SystemFlagsMixin from "./flags.mjs";

export default function SystemDocumentMixin(Base) {
  class SystemDocument extends DependentDocumentMixin(SystemFlagsMixin(Base)) {
    /** @inheritDoc */
    get _systemFlagsDataModel() {
      return this.system?.metadata?.systemFlagsModel ?? null;
    }
  }
  return SystemDocument
}