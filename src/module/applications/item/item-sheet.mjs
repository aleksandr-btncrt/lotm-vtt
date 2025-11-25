import DocumentSheetLOTM from "../api/document-sheet.mjs";
import PrimarySheetMixin from "../api/primary-sheet-mixin.mjs";

export class LotmItemSheet extends PrimarySheetMixin(DocumentSheetLOTM){
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["item"],
    form: {
      submitOnChange: true
    },
    position: {
      width: 500
    },
    window:{
      resizable: false
    }
  }
}