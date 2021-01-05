import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Clock from "./Clock";
import Planet from "./Planet";
import SpaceShip from "./SpaceShip/SpaceShip";

export default class RocketSimulator {
  // SIMULATION stuff

  clock: Clock;
  currentPlanet: Planet;
  currentSpaceShip: SpaceShip;
  //THREEJS stuff
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  cameras: Array<THREE.PerspectiveCamera>;
  sunlight: THREE.DirectionalLight;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  orbitControls: OrbitControls;

  activeCameraId: number = -1;
  activeCamera: THREE.PerspectiveCamera;
  glftLoader: GLTFLoader;
  constructor() {
    console.log("Hello Universe ...");
    this.clock = new Clock(true);
    this.cameras = [];
    this.currentSpaceShip = new SpaceShip();
  }

  initSimulation() {
    this.currentPlanet = new Planet();
    this.currentSpaceShip = new SpaceShip();

    console.log(this.currentPlanet);
    console.log(this.currentSpaceShip);
  }

  init3d(container: HTMLElement) {
    this.glftLoader = new GLTFLoader();
    this.glftLoader.load(
      this.currentSpaceShip.engines[0].meshURL,
      //loaded
      (gltf) => {
        console.log(gltf.scene);
        this.currentSpaceShip.add(gltf.scene);
      },
      // progress
      () => {},
      // errors
      () => {}
    );
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.add(this.currentSpaceShip);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.canvas = this.renderer.domElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.container.appendChild(this.renderer.domElement);

    let pad_camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 1000.0);
    pad_camera.position.x = 0.0;
    pad_camera.position.y = 5.0;
    pad_camera.position.z = -5.0;
    this.cameras.push(pad_camera);

    this.activeCameraId = 0;
    this.activeCamera = this.cameras[this.activeCameraId];

    let ship_camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 1000.0);
    ship_camera.position.x = 0.0;
    ship_camera.position.y = 5.0;
    ship_camera.position.z = -1.0;
    this.cameras.push(ship_camera);
    this.currentSpaceShip.add(ship_camera);

    this.orbitControls = new OrbitControls(this.cameras[this.activeCameraId], this.canvas);
    this.orbitControls.enablePan = false;
    // this.orbitControls.dampingFactor = 0.5;
    // this.orbitControls.enableDamping = true;

    this.sunlight = new THREE.DirectionalLight();
    this.sunlight.position.setX(5);
    this.sunlight.position.setY(5);
    this.scene.add(this.sunlight);

    let ambientLight = new THREE.AmbientLight("white");
    ambientLight.intensity = 0.1;
    this.scene.add(ambientLight);

    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      for (let cam of this.cameras) {
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      }
    });
    const event = new Event("resize");
    window.dispatchEvent(event);
    this.createObjects();
    // this.update3d();
  }

  changeCamera() {
    if (this.activeCameraId < this.cameras.length - 1) this.activeCameraId++;
    else this.activeCameraId = 0;

    this.activeCamera = this.cameras[this.activeCameraId];
    // this.activeCamera.updateProjectionMatrix();
    this.orbitControls.object = this.activeCamera;
    this.orbitControls.center = this.currentSpaceShip.position;
    this.orbitControls.update();
  }
  createObjects() {
    let ground = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 10.0), new THREE.MeshPhysicalMaterial({}));
    ground.rotateX(-Math.PI / 2.0);

    this.scene.add(ground);
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  updateSimulation() {
    this.clock.update();

    this.currentSpaceShip.simulateStep(this.clock.getDeltaTime());
  }

  update3d() {
    this.currentSpaceShip;

    this.renderer.render(this.scene, this.activeCamera);

    // console.log(this.clock.getDeltaTime());
  }
}
