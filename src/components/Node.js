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

  setAsCurrentPartnerInList(id) {
    for (let i = 0; i < this.prefList.length; i++) {
      if (this.prefList[i].getId() === id) {
        this.prefList[i].setCurrentPartner(true);
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

  // Pretty much a female only method
  setPartner(partner) {
    if (
      this.partner === null ||
      this.getRankInList(partner) > this.getRankInList(this.partner)
    ) {
      if (this.partner !== null) this.crossFromPrefList(this.partner.id);
      this.partner = partner;
      this.setAsCurrentPartnerInList(this.partner.id);
    } else {
      throw new Error("Cannot set to a partner of lower preference.");
    }
  }

  // Male only method
  getFirstAvailable() {
    for (let pref of this.prefList) {
      if (!pref.isCrossedOut()) {
        pref.setCurrentPartner(true);
        return pref;
      }
    }
  }

  getPartner() {
    return this.partner;
  }
}
