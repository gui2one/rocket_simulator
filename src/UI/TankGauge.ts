import { FuelTank } from "../SpaceShip/FuelTank";

export default class TankGauge {
  tank: FuelTank;

  bar: HTMLDivElement;
  div: HTMLDivElement;
  constructor(div: HTMLDivElement, tank: FuelTank) {
    this.div = div;
    this.tank = tank;

    this.bar = document.createElement("div");
    this.bar.style.position = "relative";
    this.bar.style.width = "100%";
    this.bar.style.height = "100%";
    this.bar.style.backgroundColor = "green";

    this.div.appendChild(this.bar);

    // console.log(this.tank.fuelAmount);

    this.update();
  }

  update() {
    let percent = Math.floor(this.tank.fuelAmount * 100.0);
    this.bar.style.width = `${percent}%`;
  }
}
