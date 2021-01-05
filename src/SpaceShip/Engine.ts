import { SpaceShipPart } from "./SpaceShipPart";
import { FuelTank } from "./FuelTank";
import * as THREE from "three";
export class Engine extends SpaceShipPart {
  isp: number; //https://wiki.kerbalspaceprogram.com/wiki/Specific_impulse
  mass: number = 1.0;
  thrust: number = 20.0;
  throttle: number = 0.0;
  thrustDirection: THREE.Vector3;
  meshURL: string;

  fuelTanks: Array<FuelTank>;
  constructor() {
    super();
    this.thrustDirection = new THREE.Vector3(0, -1, 0);
    this.meshURL = "assets/gltf/engine_test_1.glb";
  }

  createGeometry() {}
}
