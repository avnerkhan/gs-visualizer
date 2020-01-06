export default class Node {
  constructor(id, prefList, x, y) {
    this.id = id;
    this.prefList = prefList;
    this.x = x;
    this.y = y;
    this.partner = null;
    this.proposals = [];
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  addToProposals(id) {
    this.proposals.push(id);
  }

  getProposals() {
    return this.proposals;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  crossFromPrefList(id) {
    for (let i = 0; i < this.prefList.size; i++) {
      if (this.prefList[i].getId() === id) {
        this.prefList[i].crossOut();
        break;
      }
    }
  }

  getPrefList() {
    return this.prefList;
  }

  getRankInList(partner) {
    return this.prefList.indexOf(partner.id);
  }

  setPartner(partner) {
    if (
      this.partner === null ||
      this.getRankInList(partner) > this.getRankInList(this.partner)
    ) {
      this.partner = partner;
    } else {
      throw new Error("Cannot set to a partner of lower preference.");
    }
  }

  getPartner() {
    return this.partner;
  }
}
