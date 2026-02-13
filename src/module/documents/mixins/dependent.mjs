export default function DependentDocumentMixin(Base){
  class DependentDocument extends Base {
    /** @inheritDoc */
    prepareData(){
      super.prepareData();
      if(this.flags?.lotm?.dependentOn && this.uuid){

      }
    }

    _onDelete(options, userId){
      super._onDelete(options, userId)
    }
  }
  return DependentDocument;
}