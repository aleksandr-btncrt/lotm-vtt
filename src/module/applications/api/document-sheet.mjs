import { ApplicationV2Mixin } from "./application-v2-mixin.mjs";
const { DocumentSheetV2 } = foundry.applications.api

export default class DocumentSheetLOTM extends ApplicationV2Mixin(DocumentSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["standard-form"]
  };
}
