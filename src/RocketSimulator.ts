import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

import PartLoader from "./SpaceShip/PartLoader";

import Clock from "./Clock";
import Planet from "./OrbitalBody/Planet";
import SpaceShip from "./SpaceShip/SpaceShip";
import Mission from "./Mission";
import { Euler, Loader, Matrix3, Mesh, Vector3, WebGLInfo } from "three";
import { Engine } from "./SpaceShip/Engine";
import { FuelTank } from "./SpaceShip/FuelTank";
import { Bounds } from "./SpaceShip/SpaceShipPart";

import * as Utils from "./Utils";
export default class RocketSimulator {
  // SIMULATION stuff

  clock: Clock;

  currentPlanet: Planet;
  currentSpaceShip: SpaceShip;
  //THREEJS stuff
  scene: THREE.Scene;

  renderer: THREE.WebGLRenderer;
  effectComposer: EffectComposer;
  renderPass: RenderPass;
  fxaaPass: ShaderPass;

  cameras: Array<THREE.PerspectiveCamera>;
  sunlight: THREE.DirectionalLight;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  orbitControls: OrbitControls;

  activeCameraId: number = -1;
  activeCamera: THREE.PerspectiveCamera;

  glftLoader: GLTFLoader;

  currentMission: Mission;

  launchPad: THREE.Object3D;

  constructor() {
    console.log("Hello Universe ...");
    this.clock = new Clock(true);
    this.clock.time_scale = 1.0;
    this.cameras = [];
    this.currentMission = Mission.presets.basic();
    this.launchPad = new THREE.Object3D();
    this.currentPlanet = this.currentMission.launchPlanet;
    this.currentSpaceShip = this.currentMission.ships[0];

    console.log(this.currentMission);
  }

  init3d(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.add(this.launchPad);
    this.scene.add(this.currentPlanet);
    this.launchPad.add(this.currentMission.ships[0]);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.shadowMap.enabled = true;

    this.canvas = this.renderer.domElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.container.appendChild(this.renderer.domElement);

    let pad_camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 10000000000000.0);
    pad_camera.position.x = 0.0;
    pad_camera.position.y = 5.0;
    pad_camera.position.z = -5.0;
    this.cameras.push(pad_camera);
    this.launchPad.add(pad_camera);

    this.activeCameraId = 0;
    this.activeCamera = this.cameras[this.activeCameraId];

    let ship_camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 10000000000000.0);
    ship_camera.position.x = 10.0;
    ship_camera.position.y = 5.0;
    ship_camera.position.z = 10.0;
    this.cameras.push(ship_camera);
    this.currentMission.ships[0].add(ship_camera);

    this.orbitControls = new OrbitControls(this.cameras[this.activeCameraId], this.canvas);
    this.orbitControls.enablePan = false;

    this.sunlight = new THREE.DirectionalLight();
    this.sunlight.castShadow = true;
    // this.sunlight.shadow.bias = -0.0001;
    // this.sunlight.shadow.autoUpdate = true;
    // this.sunlight.shadow.camera = this.activeCamera;
    this.sunlight.position.setX(3);
    this.sunlight.position.setY(10);
    this.sunlight.position.setZ(5);

    let target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    this.sunlight.target = target;

    this.currentSpaceShip.add(this.sunlight);
    this.currentSpaceShip.add(target);

    let ambientLight = new THREE.AmbientLight("lightblue");
    ambientLight.intensity = 0.3;
    this.launchPad.add(ambientLight);

    this.renderPass = new RenderPass(this.scene, this.activeCamera);
    this.fxaaPass = new ShaderPass(FXAAShader);
    // this.fxaaPass
    this.effectComposer = new EffectComposer(this.renderer);

    this.effectComposer.addPass(this.renderPass);
    // this.effectComposer.addPass(this.fxaaPass);

    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.effectComposer.setSize(window.innerWidth, window.innerHeight);
      const pixelRatio = this.renderer.getPixelRatio();

      this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (container.offsetWidth * pixelRatio);
      this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (container.offsetHeight * pixelRatio);

      for (let cam of this.cameras) {
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      }
    });
    const event = new Event("resize");
    window.dispatchEvent(event);

    this.createObjects();
    this.initPlanet();
    this.initSpaceShip();
  }

  changeCamera() {
    if (this.activeCameraId < this.cameras.length - 1) this.activeCameraId++;
    else this.activeCameraId = 0;

    this.activeCamera = this.cameras[this.activeCameraId];
    // this.activeCamera.updateProjectionMatrix();
    this.orbitControls.object = this.activeCamera;
    this.orbitControls.center = this.currentSpaceShip.position;
    this.orbitControls.update();
    this.renderPass.camera = this.activeCamera;
  }

  async loadShipParts() {
    let gltfs = [];
    let heights = [];
    let return_data = [];
    const partLoader = new PartLoader();
    let index = 0;
    for (let part of this.currentSpaceShip.parts) {
      if (part instanceof SpaceShip == false) {
        if (part.jsonURL !== undefined) {
          const json_data = await partLoader.load(part.jsonURL);

          let height = json_data.bounds.max[1] - json_data.bounds.min[1];
          let center_of_mass = json_data.center_of_mass;
          return_data.push({
            index,
            part,
            gltf: json_data.gltf,
            height,
            center_of_mass,
          });
        } else {
          let height = 1.0; // default
          if (part instanceof FuelTank) {
            (part as FuelTank).createMesh();
            height = part.bounds.max.y - part.bounds.min.y;
          }

          return_data.push({
            index,
            part,
            gltf: undefined,
            height,
          });
        }
      }

      index++;
    }

    return Promise.resolve(return_data);
  }
  initSpaceShip() {
    this.loadShipParts().then((array) => {
      let part_height = 0;
      for (let data of array) {
        // console.log(data);
        this.currentMission.ships[0].add(data.part);
        data.part.position.y = part_height;

        part_height += data.height;
        data.part.castShadow = true;
        if (data.gltf !== undefined) {
          console.log(parseFloat(data.center_of_mass[1]));

          data.part.centerOfMass.position.set(
            parseFloat(data.center_of_mass[0]),
            parseFloat(data.center_of_mass[1]),
            parseFloat(data.center_of_mass[2])
          );
          const gltf_loader = new GLTFLoader();
          gltf_loader.load(
            data.gltf, // url
            //loaded
            (gltf) => {
              gltf.scene.castShadow = true;
              // console.log(gltf.scene);
              for (let child of gltf.scene.children) {
                if (child instanceof Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;

                  child.material.side = THREE.FrontSide;
                  child.material.shadowSide = THREE.BackSide;
                }
              }
              data.part.add(gltf.scene);
            },
            // progress
            () => {},
            // errors
            (error) => {
              console.log(error);
            }
          );
        } else {
          // console.log("Creating Custom Mesh");
          if (data.part instanceof FuelTank) {
            let mesh = data.part.createMesh();

            data.part.add(mesh);
          }
        }

        const geometry = new THREE.SphereBufferGeometry(0.1, 20, 20);
        const material = new THREE.MeshBasicMaterial({ color: "green" });
        material.depthTest = false;
        data.part.centerOfMass.renderOrder = 1;

        data.part.centerOfMass.geometry = geometry;
        data.part.centerOfMass.material = material;

        // this.scene.add(data.part.centerOfMass);
      }

      /**
       * SHIP center of mass display
       */

      const geometry2 = new THREE.SphereBufferGeometry(0.2, 20, 20);
      const material2 = new THREE.MeshBasicMaterial({ color: "red" });
      material2.depthTest = false;
      this.currentSpaceShip.centerOfMass.renderOrder = 1;

      this.currentSpaceShip.centerOfMass.geometry = geometry2;
      this.currentSpaceShip.centerOfMass.material = material2;

      this.scene.add(this.currentSpaceShip.centerOfMass);
      console.log(this.scene);
    });
  }
  initPlanet() {
    let planet = this.currentMission.launchPlanet;
    let geometry = new THREE.SphereGeometry(planet.radius * 1000, 100, 100);

    if (planet.transformMode === "ship") {
      geometry.translate(0, -planet.radius * 1000, 0);
      geometry.computeBoundingBox();
      let bounds = Bounds.fromBox3(geometry.boundingBox);
      let center = bounds.center;
      planet.centerOfMass.set(center.x, center.y, center.z);
    }
    let material = new THREE.MeshPhysicalMaterial({});

    material.map = planet.texture;
    material.side = THREE.FrontSide;
    material.depthTest = false;
    let planet_mesh = new THREE.Mesh(geometry, material);

    planet_mesh.renderOrder = -1;
    this.currentPlanet.add(planet_mesh);
    // this.currentPlanet.position.y = -planet.radius * 1000;
    // this.launchPad.rotateX(Math.PI * 0.5);
  }

  createObjects() {
    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000.0, 1000.0),
      new THREE.MeshPhysicalMaterial({ color: "brown" })
    );
    ground.rotateX(-Math.PI / 2.0);
    ground.receiveShadow = true;
    ground.renderOrder = 1;
    this.launchPad.add(ground);
    const axesHelper = new THREE.AxesHelper(5);
    this.launchPad.add(axesHelper);
  }

  updateSimulation() {
    const ship = this.currentMission.ships[0];
    //// time management
    this.clock.update();
    let deltaTime = this.clock.getDeltaTime();

    //// gravity
    let dir = ship.position.clone().sub(this.currentMission.launchPlanet.centerOfMass).normalize();
    let gravity = dir.multiplyScalar(-this.currentMission.gravityAcceleration * deltaTime);

    ship.velocity.add(gravity);

    //// engines

    ship.engines.forEach((engine, engine_index) => {
      if (engine.activated) {
        let quantity = engine.flowRate * engine.throttle * deltaTime;
        quantity /= engine.fuelTanks.length;
        engine.fuelTanks.forEach((tank, tank_index) => {
          if (tank.fuelAmount > 0.0) {
            tank.fuelAmount -= quantity / (tank.getVolume() * 1000);
            // console.log(tank.fuelAmount);
          } else {
            tank.fuelAmount = 0;
            tank.empty = true;
          }
        });
        engine.flamedOut = engine.fuelTanks.every((tank) => tank.empty);
      }
    });

    this.currentSpaceShip.computeCenterOfMass();

    for (let engine of ship.engines) {
      if (!engine.flamedOut && engine.activated) {
        //// compute thrust ...
        let shipWeight = ship.computeShipMass() * this.currentMission.gravityAcceleration;

        let force = Utils.KNToKg(engine.thrust) - shipWeight;
        // console.log("force", force);
        ship.velocity.add(
          engine.thrustDirection
            .clone()
            .multiplyScalar(-1 * engine.throttle * (force / shipWeight) * this.clock.time_scale)
        );
      }
    }
    ship.position.add(ship.velocity.clone().multiplyScalar(deltaTime));
    if (ship.position.y < 0) {
      ship.position.y = 0;
      ship.velocity.set(0, 0, 0);
    }
  }

  update3d() {
    this.scene.position.x = -this.currentSpaceShip.position.x;
    this.scene.position.y = -this.currentSpaceShip.position.y;
    this.scene.position.z = -this.currentSpaceShip.position.z;
    // this.renderer.render(this.scene, this.activeCamera);
    this.effectComposer.render();
  }

  renderInfos(): WebGLInfo {
    return this.renderer.info;
  }
}
