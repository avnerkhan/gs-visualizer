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
    for (let i = 0; i < this.prefList.length; i++) {
      console.log("GOT HERE TOO ");
      if (this.prefList[i].getId() === id) {
        console.log("GOT HERE");
        this.prefList[i].setCurrentPartner(false);
        this.prefList[i].crossOut();
        break;
      }
    }
  }

  setAsCurrentPartnerInList(id, isFemale = true) {
    let idIndex;
    for (let i = 0; i < this.prefList.length; i++) {
      if (this.prefList[i].getId() === id) {
        this.prefList[i].setCurrentPartner(true);
        idIndex = i;
      } else {
        this.prefList[i].setCurrentPartner(false);
        if (i > idIndex && isFemale) this.prefList[i].crossOut();
      }
    }
  }

  getPrefList() {
    return this.prefList;
  }

  getRankInList(partner) {
    for (let i = 0; i < this.prefList.length; i++) {
      if (this.prefList[i].getId() === partner.id) return i;
    }
  }

  // Pretty much a female only method
  setPartner(partner) {
    this.partner = partner;
  }

  // Male only method
  getFirstAvailablePref() {
    for (let pref of this.prefList) {
      if (!pref.isCrossedOut()) {
        return pref.getId();
      }
    }
  }

  getPartner() {
    return this.partner;
  }
}
