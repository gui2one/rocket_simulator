import Planet from "./OrbitalBody/Planet";
import { Engine } from "./SpaceShip/Engine";
import { FuelTank } from "./SpaceShip/FuelTank";
import SpaceShip from "./SpaceShip/SpaceShip";
import { SpaceShipPart } from "./SpaceShip/SpaceShipPart";

export default class Mission {
  launchPlanet: Planet;
  launchLatitude: number;
  launchLongitude: number;

  ships: Array<SpaceShip>;
  constructor() {
    this.launchPlanet = new Planet();
    this.launchLatitude = 48.0833;
    this.launchLongitude = -1.6833;
    this.ships = [];
  }

  get gravityAcceleration(): number {
    let ship = this.ships[0];
    let planet = this.launchPlanet;
    let altitude = ship.position.clone().distanceTo(planet.centerOfMass);
    let ratio = altitude / (planet.radius * 1000.0);

    return (planet.gravityAcceleration * 1.0) / (ratio * ratio);
  }

  static presets = {
    basic(): Mission {
      let mission = new Mission();
      mission.launchPlanet = Planet.presets.Earth();
      let ship = new SpaceShip();
      mission.ships.push(ship);
      ship.parts.push(new Engine());
      ship.parts.push(new FuelTank());
      let nose_cone = new SpaceShipPart();
      nose_cone.jsonURL = "/assets/gltf/nose_cone_001.json";
      ship.parts.push(nose_cone);
      mission.launchLatitude = 48.0833;
      mission.launchLongitude = -1.6833;

      return mission;
    },
  };
}
