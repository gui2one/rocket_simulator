import { Object3D } from "three";

export default class OrbitalBody extends Object3D {
  name: string;
  orbit: Orbit;
  mass: number = 10000000000.0; // Kg
  radius: number = 1000.0; // Km
  constructor() {
    super();
    this.name = "Orbital Body Name";
    this.orbit = new Orbit();
  }
}

export class Orbit {
  majorAxis: number;
  semiMajorAxis: number;
  constructor() {
    this.majorAxis = 1.0;
    this.semiMajorAxis = 1.0;
  }
}
