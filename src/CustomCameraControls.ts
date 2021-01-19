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

  startScreenCoords: Vector2;
  dragStarted: boolean = false;
  isMouseDown: boolean = false;

  deltaTime: number;
  constructor(camera: PerspectiveCamera, canvas: HTMLCanvasElement, positionTarget: Vector3 = undefined) {
    this.camera = camera;
    this.canvas = canvas;
    this.radius = 10.0;
    if (positionTarget) {
      this.positionTarget = positionTarget;
    } else {
      this.positionTarget = new Vector3(0, 0, 0);
    }

    this.mouseCurPos = new Vector2();
    this.mouseOldPos = new Vector2();
    this.mouseCurPolarCoords = new Vector2(0.0, Math.PI / 2.0 + 0.33);
    this.startScreenCoords = new Vector2();
    canvas.addEventListener("mousemove", this.onMousemove.bind(this));
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    canvas.addEventListener("wheel", this.onScroll.bind(this));
  }

  update(deltaTime: number) {
    this.deltaTime = deltaTime;
    this.camera.up.set(0, 1, 0);

    if (this.mouseCurPolarCoords.y > Math.PI - 0.2) this.mouseCurPolarCoords.y = Math.PI - 0.2;
    else if (this.mouseCurPolarCoords.y < 0.2) this.mouseCurPolarCoords.y = 0.2;

    let pos = fromPolar(this.mouseCurPolarCoords.x, this.mouseCurPolarCoords.y, this.radius);
    this.camera.position.set(
      this.positionTarget.x + pos.x,
      this.positionTarget.y - pos.z,
      this.positionTarget.z + pos.y
    );

    this.camera.lookAt(this.positionTarget);

    /// set oldpos to curPos
    this.mouseOldPos.x = this.mouseCurPos.x;
    this.mouseOldPos.y = this.mouseCurPos.y;
  }

  onMouseDown(event) {
    if (event.button === 0) {
      this.isMouseDown = true;
      this.startScreenCoords.x = event.clientX;
      this.startScreenCoords.y = event.clientY;
    }
  }
  onMouseUp(event) {
    this.isMouseDown = false;
    this.dragStarted = false;
  }
  onMousemove(event: MouseEvent) {
    // console.log(event);
    if (this.isMouseDown && this.dragStarted === false) {
      this.dragStarted = true;

      this.mouseOldPos.x = this.startScreenCoords.x;
      this.mouseOldPos.y = this.startScreenCoords.y;
    } else {
    }

    if (this.dragStarted) {
      // console.log(this.positionTarget.x, this.positionTarget.y);
      this.mouseCurPos.x = event.clientX;
      this.mouseCurPos.y = event.clientY;
      this.mouseDeltaPos = this.mouseCurPos.clone().sub(this.mouseOldPos.clone());

      this.mouseCurPolarCoords.add(this.mouseDeltaPos.clone().multiplyScalar(this.deltaTime * 0.25));
    }
  }

  onScroll(event: WheelEvent) {
    // console.log(event);
    this.radius *= 1.0 + (event.deltaY / 100.0) * 0.3;
  }
}
