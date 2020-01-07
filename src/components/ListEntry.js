export default class ListEntry {
  constructor(id) {
    this.id = id;
    this.isCurrentPartner = false;
    this.crossedOut = false;
  }

  isPartner() {
    return this.isCurrentPartner;
  }

  isCrossedOut() {
    return this.crossedOut;
  }

  getId() {
    return this.id;
  }

  setCurrentPartner(partnerStatus) {
    this.isCurrentPartner = partnerStatus;
  }

  crossOut() {
    this.crossedOut = true;
  }
}
