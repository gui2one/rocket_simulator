import { MeshPhysicalMaterial, Texture, TextureLoader, Vector3 } from "three";
import OrbitalBody from "./OrbitalBody";

export default class Planet extends OrbitalBody {
  hasAtmosphere: boolean = true;

  transformMode: string;
  texture: Texture;
  material: MeshPhysicalMaterial;
  centerOfMass: Vector3;
  gravityAcceleration: number = 1.0; // in m/s at sea level
  constructor() {
    super();
    this.transformMode = "normal";
    this.centerOfMass = new Vector3(0, 0, 0);
    // this.setTexure("assets/textures/earth.jpg");
  }

  setTransformMode(mode: string) {
    switch (mode) {
      case "ship":
        this.transformMode = mode;

        break;
      case "normal":
        this.transformMode = mode;
        break;
      default:
        console.warn("unknow TransformMode Type :", mode);
        break;
    }
  }
  setTexure(texture_url: string) {
    let loader = new TextureLoader();
    this.texture = loader.load(texture_url);
  }
  static presets = {
    Earth(): Planet {
      let planet = new Planet();
      planet.radius = 6371; // kilometers
      planet.mass = 5972000000000000000000000; // 5,972 × 10^24 kg
      planet.name = "Earth";
      planet.gravityAcceleration = 9.8;
      planet.setTransformMode("ship");
      planet.setTexure("assets/textures/earth.jpg");
      // console.log(planet.mass);
      return planet;
    },
  };
}
