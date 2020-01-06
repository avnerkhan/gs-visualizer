export default class ListEntry {
  constructor(id) {
    this.id = id;
    this.crossedOut = false;
  }

  isCrossedOut() {
    return this.crossedOut;
  }

  getId() {
    return this.id;
  }

  crossOut() {
    this.crossedOut = true;
  }
}
