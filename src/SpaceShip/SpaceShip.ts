import OrbitalBody from "../OrbitalBody/OrbitalBody";
import { Engine } from "./Engine";
import { FuelTank } from "./FuelTank";
import { SpaceShipPart } from "./SpaceShipPart";
import * as THREE from "three";

export default class SpaceShip extends OrbitalBody {
  parts: Array<SpaceShipPart | SpaceShip>;

  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;

  centerOfMass: THREE.Vector3;

  jsonURL: string; //mainly for compatibility with SpaceshipPart Class

  partsGroup: THREE.Group;
  constructor() {
    super();
    this.parts = [];
    this.partsGroup = new THREE.Group();
    this.add(this.partsGroup);
    // this.parts.push(new Engine());
    this.position.set(0, 1, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.centerOfMass = new THREE.Vector3();
    // this.centerOfMass.add(this);
  }

  computeShipMass(): number {
    let mass = 0.0;
    for (let part of this.parts) {
      if (part instanceof FuelTank) {
        mass += part.getMass();
      } else {
        mass += part.mass;
      }
    }

    return mass;
  }

  computeCenterOfMass() {
    let fullMass = this.computeShipMass();

    let pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    this.parts.forEach((part, index) => {
      if (index === 0) pos = part.centerOfMass.clone();
      else {
        let part_mass;
        if (part instanceof FuelTank) {
          part.computeCenterOfMass();
          part_mass = (<FuelTank>part).getMass();
        } else {
          part_mass = part.mass;
        }
        let ratio = part_mass / fullMass;
        pos.add(part.centerOfMass.clone().multiplyScalar(ratio));
      }
    });

    this.centerOfMass.set(pos.x, pos.y, pos.z);
  }

  get engines(): Array<Engine> {
    return this.parts.filter((element) => element instanceof Engine).map((element) => element as Engine);
  }

  get fuelTanks(): Array<FuelTank> {
    return this.parts.filter((element) => element instanceof FuelTank).map((element) => element as FuelTank);
  }
}
