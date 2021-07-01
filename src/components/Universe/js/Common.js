import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

class Common {
  constructor() {
    this.scene = null
    this.camera = null
    this.spotLight = null
    this.renderer = null

    this.size = {
      windowW: null,
      windowH: null
    }

    this.clock = null

    this.time = {
      total: null,
      delta: null
    }
    this.stats = null

  }

  init($canvas) {
    this.setSize()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.size.windowW / (this.size.windowH*0.8),
      0.01,
      350000
    );
    // this.camera.position.set(3, 0, 11538)
    // this.camera.lookAt(new THREE.Vector3(0, 0, 11538))
    this.camera.position.set(0,500,-500)
    this.camera.lookAt(this.scene.position)

    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      // antialias: true
    })

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000)
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(this.size.windowW, this.size.windowH*0.8)
    // this.renderer.outputEncoding = THREE.sRGBEncoding

    // this.helper = new THREE.AxesHelper(100000)
    // this.scene.add(this.helper)

    this.light = new THREE.PointLight( 0xff5555, 3, 400000 )
    this.light.position.set(0, 0, 0)
    this.light.castShadow = true
    this.scene.add(this.light)

    this.ambient = new THREE.AmbientLight(0x222233)
    this.scene.add(this.ambient)

    this.clock = new THREE.Clock()
    this.clock.start()

    this.sGeo = new THREE.SphereGeometry(600000, 60, 60)
    this.sMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('img/other/8k_stars_milky_way.jpg'),
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    this.star = new THREE.Mesh(this.sGeo, this.sMat)
    this.scene.add(this.star)

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  setSize() {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
  }

  resize(){
    this.setSize();
    this.camera.aspect = this.size.windowW / (this.size.windowH*0.8)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.windowW, this.size.windowH*0.8)
  }

  render(){
    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta
    this.renderer.render(this.scene, this.camera)
  }

}

export default new Common()