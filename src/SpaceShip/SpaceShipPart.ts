import * as THREE from "three";
import { Box3, Vector3 } from "three";

export class Bounds {
  min: Vector3;
  max: Vector3;
  constructor(min: Vector3 = undefined, max: Vector3 = undefined) {
    if (min) {
      this.min = min;
    } else {
      this.min = new Vector3();
    }
    if (max) {
      this.max = max;
    } else {
      this.max = new Vector3();
    }
  }
  private sizeY(): number {
    return this.max.y - this.min.y;
  }

  private sizeX(): number {
    return this.max.x - this.min.x;
  }

  private sizeZ(): number {
    return this.max.z - this.min.z;
  }

  get width(): number {
    return this.sizeX();
  }
  get height(): number {
    return this.sizeY();
  }
  get depth(): number {
    return this.sizeZ();
  }
  get center(): Vector3 {
    let x = (this.max.x - this.min.x) / 2.0 + this.min.x;
    let y = (this.max.y - this.min.y) / 2.0 + this.min.y;
    let z = (this.max.z - this.min.z) / 2.0 + this.min.z;

    return new Vector3(x, y, z);
  }
  static fromBox3(box3: Box3): Bounds {
    return new Bounds(box3.min, box3.max);
  }
}
export class SpaceShipPart extends THREE.Object3D {
  mass: number = 1.0;
  meshURL: string;
  jsonURL: string;
  bounds: any;

  centerOfMass: THREE.Mesh;

  constructor() {
    super();
    this.bounds = new Bounds();
    this.centerOfMass = new THREE.Mesh();
    this.centerOfMass.name = "center of mass";

    this.add(this.centerOfMass);
  }
}
