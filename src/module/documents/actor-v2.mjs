const { Actor } = foundry.documents;

export default class LOTMActorV2 extends Actor {

  prepareDerivedData(){
    super.prepareDerivedData()

    Hooks.callAll("LOTM.prepareActorData", this);
  }
}