import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import { Engine } from "./Engine";
import { SpaceShipPart } from "./SpaceShipPart";

export default class SpaceShip extends Object3D {
  engines: Array<Engine>;
  parts: Array<SpaceShipPart>;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  constructor() {
    super();
    this.engines = [];
    this.parts = [];
    this.engines.push(new Engine());
    this.position.set(0, 1, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  calculateShipMass(): number {
    let mass = 0;
    for (let part of this.parts) {
      mass += part.mass;
    }

    return mass;
  }
  simulateStep(deltaTime: number) {
    let gravity = new Vector3(0, -9.8 * deltaTime, 0);
    this.velocity.add(gravity);

    for (let engine of this.engines) {
      if (engine instanceof Engine) {
        this.velocity.add(
          engine.thrustDirection.clone().multiplyScalar(-1 * deltaTime * engine.thrust * engine.throttle)
        );
      }
    }
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.set(0, 0, 0);
    }
  }
}
