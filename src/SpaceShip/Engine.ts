import { SpaceShipPart } from "./SpaceShipPart";
import { FuelTank } from "./FuelTank";
import * as THREE from "three";
export class Engine extends SpaceShipPart {
  isp: number; //https://wiki.kerbalspaceprogram.com/wiki/Specific_impulse

  thrust: number = 10.0; // in Kilo Newtons ...?
  throttle: number = 0.0;
  thrustDirection: THREE.Vector3;
  flowRate: number = 1.0; // Kg/s

  activated: boolean = false;
  fuelTanks: Array<FuelTank>;
  flamedOut: boolean = false;

  constructor() {
    super();
    this.thrustDirection = new THREE.Vector3(0, -1, 0);
    // this.meshURL = "assets/gltf/engine_test_1.glb";
    this.jsonURL = "assets/gltf/engine_test_1.json";
    this.fuelTanks = [];
    this.mass = 10;
  }

  activate(start_fuel_amount: number) {
    console.log(start_fuel_amount);

    this.fuelTanks[0].fuelAmount = start_fuel_amount;
    this.activated = true;
  }

  createGeometry() {}

  static presets = {
    Merlin1D: (): Engine => {
      /// source : https://fr.wikipedia.org/wiki/Merlin_(moteur-fus%C3%A9e)
      let engine = new Engine();
      engine.mass = 470;
      engine.thrust = 845; // 845 original value
      // engine.thrust = 200;
      engine.flowRate = 236.6;
      return engine;
    },
  };
}
