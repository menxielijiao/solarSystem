import * as THREE from "three"
import Common from "./Common"

export default class Planet {
  constructor(name) {
    this.pName = name
    this.texture = null
    this.normalT = null
    this.specularT = null
    this.cloudT = null

    this.planetSize = {
      sun: 109,
      mercury: 0.38,
      venus: 0.95,
      earth: 1,
      moon: 0.27,
      mars: 0.53,
      jupiter: 11.2,
      saturn: 9.45,
      uranus: 4.01,
      neptune: 3.88,
    }
    this.planetDistance = {
      sun:     1,
      mercury: 4461,
      venus:   8307,
      earth:   11538,
      moon:    29,
      mars:    17692,
      jupiter: 60000,
      saturn:  110000,
      uranus:  221538,
      neptune: 346461,
    }
    this.planetOrbitalPeriod = {
      mercury: 0.241,
      venus:   0.615,
      earth:   1,
      moon:    0.073,
      mars:    4.602,
      jupiter: 11.862,
      saturn:  84.023,
      uranus:  164.772,
      neptune: 247.826,
    }
    this.baseRadius = 10

    this.geometry = null
    this.material = null
    this.planet = null

    this.group = new THREE.Group()

    // this.init()
  }

  init() {
    this.switchPlanetData()

    this.geometry = new THREE.SphereGeometry(this.baseRadius, 60, 60)
    if(this.pName !== 'sun') {
      this.material = new THREE.MeshPhongMaterial({
        map: this.texture,
        specularMap: this.specularT,
        normalMap: this.normalT,
        normalScale: new THREE.Vector2(30, -30),
      })
    } else {
      this.material = new THREE.MeshBasicMaterial({
        map: this.texture,
      })
    }

    this.planet = new THREE.Mesh(this.geometry, this.material)
    this.planet.name = this.pName
    this.planet.scale.setScalar(this.planetSize[this.pName])
    if(this.pName !== 'sun') {
      this.planet.receiveShadow = true
      this.planet.castShadow = true
    }
    this.group.position.setZ(this.planetDistance[this.pName])

    if(this.pName === 'earth') {
      // cloud
      this.cGeometry = new THREE.SphereGeometry(this.baseRadius+0.5, 60, 60)
      this.cMaterial = new THREE.MeshPhongMaterial({
        map: this.cloudT,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })
      this.cloud = new THREE.Mesh(this.cGeometry, this.cMaterial)
      this.cloud.scale.setScalar(this.planetSize[this.pName])
      this.cloud.castShadow = true
      this.group.add(this.cloud)

      // moon
      this.mGeometry = new THREE.SphereGeometry(this.baseRadius, 60, 60)
      this.mMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('img/moon/color.jpg'),
        displacementMap: new THREE.TextureLoader().load('img/moon/displacement.jpg'),
        displacementScale: 1,
        displacementBias: 1
      })
      this.moon = new THREE.Mesh(this.mGeometry, this.mMaterial)
      this.moon.scale.setScalar(this.planetSize['moon'])
      this.moon.receiveShadow = true
      this.moon.castShadow = true
      this.moon.position.setZ(this.planetDistance['moon']) // this.planetDistance['moon']
      this.group.add(this.moon)
    }

    // saturn
    if(this.pName === 'saturn') {
      const jGeo = new THREE.TorusGeometry(this.baseRadius, 1, 2, 1000)
      const jMat = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('img/saturn/saturn_ring_alpha.png'),
        opacity:0.7,
        transparent: true
      })
      const ring = new THREE.Mesh(jGeo, jMat)
      ring.rotation.x = Math.PI / 2
      ring.position.setY(-1)
      ring.scale.setScalar(this.planetSize['saturn'] + 10)
      this.group.add(ring)
    }

    this.group.add(this.planet)
    Common.scene.add(this.group)
  }

  switchPlanetData() {
    switch(this.pName) {
      case 'sun':
        this.texture = new THREE.TextureLoader().load('img/sun/sun.jpg')
        break
      case 'mercury':
        this.texture = new THREE.TextureLoader().load('img/mercury/mercury.jpg')
        break
      case 'venus':
        this.texture = new THREE.TextureLoader().load('img/venus/surface.jpg')
        break
      case 'earth':
        this.texture   = new THREE.TextureLoader().load('img/earth/daymap.jpg')
        this.normalT   = new THREE.TextureLoader().load('img/earth/normal.jpg')
        this.specularT = new THREE.TextureLoader().load('img/earth/specular.jpg')
        this.cloudT    = new THREE.TextureLoader().load('img/earth/clouds.jpg')
        break
      case 'moon':
        break
      case 'mars':
        this.texture = new THREE.TextureLoader().load('img/mars/mars.jpg')
        break
      case 'jupiter':
        this.texture = new THREE.TextureLoader().load('img/jupiter/jupiter.jpg')
        break
      case 'saturn':
        this.texture = new THREE.TextureLoader().load('img/saturn/saturn.jpg')
        break
      case 'uranus':
        this.texture = new THREE.TextureLoader().load('img/uranus/uranus.jpg')
        break
      case 'neptune':
        this.texture = new THREE.TextureLoader().load('img/neptune/neptune.jpg')
        break
      default:
        break
    }
  }

  update() {
    const pos = this.rotatePlanet()
    this.group.position.set(pos.x, pos.y, pos.z)
    if(this.pName === 'earth') {
      this.cloud.rotation.y += 0.001
      this.moon.position.copy(this.rotateMoon())
    }
  }

  rotatePlanet() {
    const nowTime = Common.time.total * 0.1
    const sin = Math.sin(nowTime / this.planetOrbitalPeriod[this.pName])
    const cos = Math.cos(nowTime / this.planetOrbitalPeriod[this.pName])

    return new THREE.Vector3(sin * this.planetDistance[this.pName], 0, cos * this.planetDistance[this.pName])
  }

  rotateMoon() {
    const nowTime = Common.time.total * 0.1
    const sin = Math.sin(nowTime / this.planetOrbitalPeriod['moon'])
    const cos = Math.cos(nowTime / this.planetOrbitalPeriod['moon'])

    return new THREE.Vector3(sin * this.planetDistance['moon'], 0, cos * this.planetDistance['moon'])
  }
}