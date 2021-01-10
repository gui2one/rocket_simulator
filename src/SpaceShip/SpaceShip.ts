import { Vector3 } from "three";
import OrbitalBody from "../OrbitalBody/OrbitalBody";
import { Engine } from "./Engine";
import { SpaceShipPart } from "./SpaceShipPart";

export default class SpaceShip extends OrbitalBody {
  // engines: Array<Engine>;
  parts: Array<SpaceShipPart>;
  position: Vector3;
  velocity: Vector3;

  center_of_mass: Vector3;
  constructor() {
    super();
    // this.engines = [];
    this.parts = [];
    // this.parts.push(new Engine());
    this.position.set(0, 1, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.center_of_mass = new Vector3(0, 0, 0);
  }

  calculateShipMass(): number {
    let mass = 0;
    for (let part of this.parts) {
      mass += part.mass;
    }

    return mass;
  }

  get engines(): Array<Engine> {
    return this.parts.filter((element) => element instanceof Engine).map((element) => element as Engine);
  }
}
