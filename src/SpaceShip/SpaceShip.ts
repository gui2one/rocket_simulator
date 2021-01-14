import { Vector3 } from "three";
import OrbitalBody from "../OrbitalBody/OrbitalBody";
import { Engine } from "./Engine";
import { FuelTank } from "./FuelTank";
import { SpaceShipPart } from "./SpaceShipPart";

export default class SpaceShip extends OrbitalBody {
  parts: Array<SpaceShipPart>;

  velocity: Vector3;
  angular_velocity: Vector3;

  center_of_mass: Vector3;
  constructor() {
    super();
    this.parts = [];
    // this.parts.push(new Engine());
    this.position.set(0, 1, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.angular_velocity = new Vector3(0, 0, 0);
    this.center_of_mass = new Vector3(0, 0, 0);
  }

  computeShipMass(): number {
    let mass = 0.0;
    for (let part of this.parts) {
      if (part instanceof FuelTank) {
        mass += part.getFuelMass();
      } else {
        mass += part.mass;
      }
    }

    return mass;
  }

  get engines(): Array<Engine> {
    return this.parts.filter((element) => element instanceof Engine).map((element) => element as Engine);
  }

  get fuelTanks(): Array<FuelTank> {
    return this.parts.filter((element) => element instanceof FuelTank).map((element) => element as FuelTank);
  }
}
