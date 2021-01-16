import { Group, Mesh, Vector3 } from "three";
import OrbitalBody from "../OrbitalBody/OrbitalBody";
import { Engine } from "./Engine";
import { FuelTank } from "./FuelTank";
import { SpaceShipPart } from "./SpaceShipPart";

export default class SpaceShip extends OrbitalBody {
  parts: Array<SpaceShipPart | SpaceShip>;

  velocity: Vector3;
  angularVelocity: Vector3;

  centerOfMass: Mesh;
  jsonURL: string; //mainly for compatibility with SpaceshipPart Class

  partsGroup: Group;
  constructor() {
    super();
    this.parts = [];
    this.partsGroup = new Group();
    this.add(this.partsGroup);
    // this.parts.push(new Engine());
    this.position.set(0, 1, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.angularVelocity = new Vector3(0, 0, 0);
    this.centerOfMass = new Mesh();
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

    let pos = new Vector3(0, 0, 0);
    this.parts.forEach((part, index) => {
      if (index === 0) pos = part.centerOfMass.position.clone();
      else {
        let part_mass;
        if (part instanceof FuelTank) {
          part.computeCenterOfMass();
          part_mass = (<FuelTank>part).getMass();
        } else {
          part_mass = part.mass;
        }
        let ratio = part_mass / fullMass;
        pos.add(part.centerOfMass.position.clone().multiplyScalar(ratio));
      }
    });

    this.centerOfMass.position.set(pos.x, pos.y, pos.z);
  }

  get engines(): Array<Engine> {
    return this.parts.filter((element) => element instanceof Engine).map((element) => element as Engine);
  }

  get fuelTanks(): Array<FuelTank> {
    return this.parts.filter((element) => element instanceof FuelTank).map((element) => element as FuelTank);
  }
}
