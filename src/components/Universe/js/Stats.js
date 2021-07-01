import Stats from 'three/examples/jsm/libs/stats.module'

export default class Box {
  constructor() {
    this.stats = null
    // this.init()
  }

  init() {
    this.stats = new Stats()
    document.body.appendChild( this.stats.dom )
  }

  updateBegin() {
    this.stats.begin()
  }

  updateEnd() {
    this.stats.end()
  }

}
