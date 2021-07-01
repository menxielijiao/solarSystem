import Common from "./Common"
import Planet from "./Planet"
import Spaceship from "./Spaceship"
// import Stats from "./Stats"
// import gsap from "gsap"

export default class MyGL {

  constructor(props) {
    this.props = props
    // this.stats = new Stats()

    this.nowPlanet = 'earth'
    this.nowPlanetPos = null

    this.init()
  }

  init() {
    Common.init(this.props.$canvas)

    this.sun = new Planet('sun')
    this.sun.init()
    this.mercury = new Planet('mercury')
    this.mercury.init()
    this.venus = new Planet('venus')
    this.venus.init()
    this.earth = new Planet('earth')
    this.earth.init()
    this.mars = new Planet('mars')
    this.mars.init()
    this.jupiter = new Planet('jupiter')
    this.jupiter.init()
    this.saturn = new Planet('saturn')
    this.saturn.init()
    this.uranus = new Planet('uranus')
    this.uranus.init()
    this.neptune = new Planet('neptune')
    this.neptune.init()

    // Common.camera.position.set(0, 50, 11538)
    // Common.camera.lookAt(this.ship.model.scene.position)

    this.ship = new Spaceship()

    window.addEventListener("resize", this.resize.bind(this))
    // this.stats.init()
    this.loop()
  }

  resize(){
    Common.resize();
  }

  loop(){
    // this.stats.updateBegin()
    this.render()
    // this.stats.updateEnd()
    requestAnimationFrame(this.loop.bind(this));
  }

  render(){
    Common.render()
    this.mercury.update()
    this.venus.update()
    this.earth.update()
    this.mars.update()
    this.jupiter.update()
    this.saturn.update()
    this.uranus.update()
    this.neptune.update()

    this.ship.update(this.nowPlanet,this[this.nowPlanet].group)
    // console.log(this[this.nowPlanet].group)
  }

  changePlanet(name) {
    this.nowPlanet = name
    // console.log(this[this.nowPlanet].planet.position)

    // this.ship.model.scene.rotation.z = 0
    // gsap.to(this.ship.model.scene.rotation, {
    //   z: -Math.PI / 2,
    //   duration: 0.1,
    //   ease: 'Power3.easeInOut',
    // })
  }
}
