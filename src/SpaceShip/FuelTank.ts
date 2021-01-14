import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { CylinderBufferGeometry, Mesh, MeshPhysicalMaterial, SphereBufferGeometry } from "three";
import { SpaceShipPart, Bounds } from "./SpaceShipPart";

export class FuelTank extends SpaceShipPart {
  fuel: Fuel;
  fuelAmount: number = 1.0;
  private volume: number = 1.0; // m3
  private radius: number = 1.0; // meters
  private height: number = 1.0; // meters
  empty: boolean = false;
  constructor() {
    super();
    this.fuel = Fuel.presets.CH4__LOX();
    this.computeVolume();
  }

  computeVolume() {
    // volume of the spherical part
    let volume = (4.0 / 3.0) * Math.PI * this.radius;
    // volume of the cylindrical part
    volume += Math.PI * (this.radius * this.radius) * this.height;

    this.volume = volume;
  }

  setHeight(height: number) {
    this.height = height;
    this.computeVolume();
  }
  setRadius(radius: number) {
    this.radius = radius;
    this.computeVolume();
  }
  getFuelMass(): number {
    return this.fuel.density * this.fuelAmount * this.volume;
  }

  getMass(): number {
    return this.mass + this.getFuelMass();
  }

  getVolume(): number {
    return this.volume;
  }

  createMesh(): Mesh {
    let mesh = new Mesh();
    let num_segs = 42;
    mesh.geometry = new CylinderBufferGeometry(this.radius, this.radius, this.height, num_segs, 3, true);

    let half_sphere = new SphereBufferGeometry(this.radius, num_segs, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    half_sphere.translate(0, this.height / 2, 0.0);
    // console.log(half_sphere);

    let angle = Math.PI / 2.0;
    half_sphere.rotateY(angle);
    mesh.geometry = BufferGeometryUtils.mergeBufferGeometries([mesh.geometry, half_sphere]);
    // mesh.geometry.merge(half_sphere);
    half_sphere.rotateZ(Math.PI);

    mesh.geometry = BufferGeometryUtils.mergeBufferGeometries([mesh.geometry, half_sphere]);

    // mesh.geometry.computeVertexNormals();
    mesh.material = new MeshPhysicalMaterial({ roughness: 0.5, color: "red" });

    mesh.geometry.computeBoundingBox();
    this.bounds = Bounds.fromBox3(mesh.geometry.boundingBox);
    mesh.geometry.translate(0, this.bounds.height / 2.0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}

class Fuel {
  /**
   * sources : http://www.braeunig.us/space/propel.htm
   */
  type: string;
  density: number; // Kg / m3

  constructor(type: string, density: number) {
    this.type = type;
    this.density = density;
  }
  static presets = {
    CH4__LOX: (): Fuel => {
      //0.423 g/ml
      //423.0 g/l
      // 423 000 g/m3
      // 423 kg/m3
      return new Fuel("CH4__LOX", 423.0);
    },
  };
}
