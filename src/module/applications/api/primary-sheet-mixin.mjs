import DragDropApplicationMixin from "./drag-drop-mixin.mjs"

export default function PrimarySheetMixin(Base) {
  return class PrimartSheetLOTM extends DragDropApplicationMixin(Base) {
    /** @override */
    static DEFAULT_OPTIONS = {}

    static TABS = []

  }
}