import * as THREE from "three";

export default class CustomCameraControls {
  camera: THREE.PerspectiveCamera;
  parent: THREE.Object3D;
  lat: number;
  lon: number;
  radius: number;
  canvas: HTMLCanvasElement;
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement, parent: THREE.Object3D = undefined) {
    this.camera = camera;
    this.canvas = canvas;
    if (parent) {
      this.parent = parent;
    }
  }

  update() {}
}
