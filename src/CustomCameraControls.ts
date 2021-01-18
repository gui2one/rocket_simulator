import { Vector3, PerspectiveCamera, Vector2 } from "three";
import { fromPolar } from "./Utils";
export default class CustomCameraControls {
  camera: PerspectiveCamera;
  positionTarget: Vector3;
  lat: number;
  lon: number;
  radius: number;
  canvas: HTMLCanvasElement;

  mouseCurPos: Vector2;
  mouseOldPos: Vector2;

  mouseCurPolarCoords: Vector2;
  mouseDeltaPos: Vector2;
  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement, positionTarget: Vector3 = undefined) {
    this.camera = camera;
    this.canvas = canvas;
    if (positionTarget) {
      this.positionTarget = positionTarget;
    } else {
      this.positionTarget = new Vector3(0, 0, 0);
    }

    this.mouseCurPos = new Vector2();
    this.mouseOldPos = new Vector2();
    this.mouseCurPolarCoords = new Vector2();
    canvas.addEventListener("mousemove", this.onMousemove.bind(this));
  }

  update(deltaTime: number) {
    this.mouseDeltaPos = this.mouseCurPos.clone().sub(this.mouseOldPos.clone());
    // console.log(this.mouseDeltaPos);

    this.mouseCurPolarCoords.add(this.mouseDeltaPos.clone().multiplyScalar(deltaTime * 0.5));

    if (this.mouseCurPolarCoords.y > Math.PI - 0.2) this.mouseCurPolarCoords.y = Math.PI - 0.2;
    else if (this.mouseCurPolarCoords.y < 0.2) this.mouseCurPolarCoords.y = 0.2;

    let pos = fromPolar(this.mouseCurPolarCoords.x, this.mouseCurPolarCoords.y, 10);
    this.camera.position.set(
      this.positionTarget.x + pos.x,
      this.positionTarget.y + pos.z,
      this.positionTarget.z + pos.y
    );

    this.camera.up.set(0, 1, 0);

    this.camera.lookAt(this.positionTarget);

    /// set oldpos to curPos
    this.mouseOldPos.x = this.mouseCurPos.x;
    this.mouseOldPos.y = this.mouseCurPos.y;
  }

  onMousemove(event: MouseEvent) {
    // console.log(event);
    if (event.buttons === 1 && event.button === 0) {
      this.mouseCurPos.x = event.clientX;
      this.mouseCurPos.y = event.clientY;
    }
  }
}
