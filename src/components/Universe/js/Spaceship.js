import * as THREE from "three"
import Common from "./Common"
import Planet from "./Planet"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
// import gsap from "gsap"

export default class Spaceship {
  constructor() {
    this.model= null
    this.modelUrl = "models/spaceship/model2.gltf"

    this.loadOK = false

    this.degree = 0
    this.planet = new Planet()
    this.targetPlanet = 'earth'
    this.frontVector = new THREE.Vector3(0.0, 0.0, 1.0)
    this.prevVector = null

    this.shipSpeed = 100

    this.raycaster = null

    this.targetDom = document.getElementById('distance')

    this.init()
  }

  init() {
    const loader = new GLTFLoader()
    const _this = this
    loader.load(this.modelUrl, function(data) {
      // console.log(data)
      _this.model =  data
      Common.scene.add(_this.model.scene)
      _this.model.scene.scale.setScalar(0.5) // 0.05
      _this.model.scene.up.set(0, 1, 0)
      // _this.model.scene.rotation.z = Math.PI /2

      // for(let i=0; i<_this.model.scene.children[0].children[0].children.length; i++) {
      //   _this.model.scene.children[0].children[0].children[i].castShadow = true
      // }
      // _this.model.scene.castShadow = true
      // _this.model.scene.children[0].castShadow = true
      // _this.model.scene.children[0].children[0].castShadow = true

      _this.loadOK = true
    })
  }

  update(targetPlanetName, target) {
    if(!this.loadOK) return
    if(this.targetPlanet !== targetPlanetName) {
      // console.log('違うよ！')
      this.goToBieDePlanet(target.position.clone())

      const judge = this.collisionDetection(target, targetPlanetName)
      if(judge) {
        this.targetPlanet = targetPlanetName
        // gsap.to(this.model.scene.rotation, {
        //   z: -0,
        //   duration: 0.1,
        //   ease: 'Power3.easeInOut',
        // })
        this.shipSpeed = 100
      }
      return
    }

    this.targetPlanet = targetPlanetName
    this.targetPos = target.position.clone()

    // this.model.scene.position.x += Math.sin(Common.time.total) / 10
    // this.model.scene.position.y += Math.cos(Common.time.total) / 10
    this.shipPosUpdate()
  }

  shipPosUpdate() {
    this.degree -= 0.5
    this.prevVector = this.frontVector.clone()

    // const oldPos = this.model.scene.position.clone()
    const oldDegree = this.degree + 0.5
    const oldPos = this.targetPos.clone().add(this.getCircularMotionPosition(oldDegree))
    this.newPos = this.targetPos.clone().add(this.getCircularMotionPosition(this.degree))
    this.model.scene.position.copy(this.newPos)
    const vectorOfnantara = this.newPos.clone().sub(oldPos).normalize().multiplyScalar(0.1)
    this.frontVector.add(vectorOfnantara).normalize()
    // this.model.scene.position.add(this.frontVector.clone())

    const backVector = this.frontVector.clone().negate()
    const distance = 10
    const pNormal = this.targetPos.sub(this.model.scene.position).normalize()
    backVector.multiplyScalar(distance).applyAxisAngle(pNormal, (Math.PI / 10) * Math.sin(Common.time.total)).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 5)
    const cameraPos = backVector.add(this.model.scene.position)
    Common.camera.position.copy(cameraPos)
    const camVec = this.model.scene.position.clone().sub(this.targetPos.clone()).normalize().multiplyScalar(3.0)
    Common.camera.lookAt(this.model.scene.position.clone().add(camVec))

    this.setQuaternion()
  }

  getCircularMotionPosition(degree) {
    let distance = this.setDistance(this.targetPlanet)
    const radius = (this.planet.planetSize[this.targetPlanet] * this.planet.baseRadius) + distance + (Math.sin(Common.time.total)*0.05)
    // 角度をラジアンに変換
    const rad = degree * Math.PI / 180
    // X座標 = 半径 x Cosθ
    const x = radius * Math.cos(rad)
    // Y座標
    // const y = radius * Math.sin(rad) / 7;
    // const y = (Math.sin(Common.time.total)*0.1)+0.2;
    const y = 0
    // Z座標 = 半径 x Sinθ
    const z = radius * Math.sin(rad)
    return new THREE.Vector3(x, y, z)
  }

  setQuaternion() {
    // if(!this.loadOK) return

    const tangent = new THREE.Vector3().crossVectors(this.prevVector, this.frontVector).normalize()
    // console.log(this.prevVector, this.frontVector)
    // const normal = this.newPos.clone().sub(this.targetPos).normalize()

    const cos = this.prevVector.dot(this.frontVector)
    const radians = Math.acos(cos)
    const qtn = new THREE.Quaternion()
    qtn.setFromAxisAngle(new THREE.Vector3(tangent.x, tangent.y, tangent.z), radians)
    // qtn.setFromAxisAngle(normal, radians)
    this.model.scene.quaternion.premultiply(qtn)
  }

  goToBieDePlanet(targetPos) {
    this.shipSpeed = this.shipSpeed > 100 ? this.shipSpeed : this.shipSpeed+0.1

    this.prevVector = this.frontVector.clone()
    const ship = this.model.scene
    const vectorOfShipToBiedePlanet = targetPos.clone().sub(ship.position).normalize()
    this.frontVector.add(vectorOfShipToBiedePlanet).normalize()
    ship.position.add(this.frontVector.clone().multiplyScalar(this.shipSpeed))

    const hengVec = this.frontVector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    const backVector = this.frontVector.clone().negate().applyAxisAngle(hengVec, (Math.PI / 10) * Math.cos(Common.time.total * 0.5)).applyAxisAngle(new THREE.Vector3(0, -1, 0), (Math.PI / 10) * Math.sin(Common.time.total))
    const distance = 10
    backVector.multiplyScalar(distance)
    const cameraPos = backVector.add(ship.position)
    Common.camera.position.copy(cameraPos)
    Common.camera.lookAt(ship.position)

    const tangent = new THREE.Vector3().crossVectors(this.prevVector, this.frontVector).normalize()
    const cos = this.prevVector.dot(this.frontVector)
    const radians = Math.acos(cos)
    const qtn = new THREE.Quaternion()
    qtn.setFromAxisAngle(new THREE.Vector3(tangent.x, tangent.y, tangent.z), radians)
    ship.quaternion.premultiply(qtn)
  }

  collisionDetection(target, name) {
    this.raycaster = new THREE.Raycaster(this.model.scene.position, target.position.clone().sub(this.model.scene.position).normalize())
    const intersect = this.raycaster.intersectObjects(target.children)
    if(intersect.length > 0) {
      const dist = intersect[0].distance
      this.targetDom.innerHTML = Math.round(dist)
      if(dist < (this.planet.planetSize[name] * this.planet.baseRadius) || dist < 150) {
        // console.log('衝突')
        return true
      }
    }
    return false
  }

  setDistance(name) {
    let distance
    switch(name) {
      case 'mercury':
        distance = 5
        break
      case 'venus':
      case 'earth':
      case 'mars':
        distance = 10
        break
      case 'jupiter':
      case 'saturn':
        distance = 100
        break
      case 'uranus':
      case 'neptune':
        distance = 20
        break
      default:
        distance = 15
        break
    }

    return distance
  }
}