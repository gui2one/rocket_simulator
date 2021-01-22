import { MeshPhysicalMaterial, Texture, TextureLoader, Vector3 } from "three";
import OrbitalBody from "./OrbitalBody";

export default class Planet extends OrbitalBody {
  G: number = 6.67e-11;

  hasAtmosphere: boolean = true;

  transformMode: string;
  texture: Texture;
  material: MeshPhysicalMaterial;
  centerOfMass: Vector3;
  // gravityAcceleration: number = 1.0; // in m/s at sea level
  constructor() {
    super();
    this.transformMode = "normal";
    this.centerOfMass = new Vector3(0, 0, 0);
    // this.setTexure("assets/textures/earth.jpg");
  }

  get gravityAcceleration(): number {
    const F = (this.G * this.mass) / (this.radius * 1000.0 * (this.radius * 1000.0));
    return F;
  }

  set gravityAcceleration(value) {}
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
      planet.mass = 5.972e24; // 5,972 × 10^24 kg
      planet.name = "Earth";

      planet.setTransformMode("ship");
      planet.setTexure("assets/textures/8k_earth_daymap.jpg");
      // console.log(planet.mass);
      return planet;
    },
    Moon(): Planet {
      let planet = new Planet();
      planet.radius = 1737.4; // kilometers
      planet.mass = 7.342e22; // 5,972 × 10^24 kg
      planet.name = "Moon";

      planet.setTransformMode("ship");
      planet.setTexure("assets/textures/8k_moon.jpg");

      return planet;
    },
  };
}
