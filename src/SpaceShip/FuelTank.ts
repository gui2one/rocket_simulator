import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import { CylinderBufferGeometry, Mesh, MeshPhysicalMaterial, SphereBufferGeometry } from "three";
import { SpaceShipPart, Bounds } from "./SpaceShipPart";

export class FuelTank extends SpaceShipPart {
  fuel: Fuel;
  fuelAmount: number = 1.0;
  volume: number = 1.0;
  radius: number = 1.0;
  height: number = 1.0;
  constructor() {
    super();
  }

  computeVolume() {}

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
  type: string;
  density: number;
}
