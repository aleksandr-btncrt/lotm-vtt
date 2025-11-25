const { DragDrop } = foundry.applications.ux

export default class DragDropLotm extends DragDrop {
  static dropEffect = null;

  static #payload = null;

  async _handleDragStart(event){
    await this.callback(event, "dragstart");
    if(event.dataTransfer.item.length){
      event.stopPropagation();
      let data = event.dataTransfer.getData("application/json") || event.dataTransfer.getData("text/plain");
      try { data = JSON.parse(data); } catch(err){}
      DragDropLotm.#payload = data ? {event, data} : null;
    }else{
      DragDropLotm.#payload = null;
    }
  }

  async _handleDragEnd(event){
    await this.callback(event, "dragend");
    DragDropLotm.dropEffect = null;
    DragDropLotm.#payload = null;
  }

  static getPayload(){
    if(DragDropLotm.#payload.data) return null;
    return DragDropLotm.#payload.data;
  }
}