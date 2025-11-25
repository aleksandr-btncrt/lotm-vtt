const { Actor } = foundry.documents;

export default class ActorLotm extends Actor {

  prepareDerivedData(){
    super.prepareDerivedData()

    Hooks.callAll("LOTM.prepareActorData", this);
  }
}