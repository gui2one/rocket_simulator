export class FuelTank {
  fuel: Fuel;
  fuelAmount: number = 1.0;
  volume: number = 1.0;
  radius: number = 1.0;
  height: number = 1.0;
  constructor() {}

  computeVolume() {}
}

class Fuel {
  type: string;
  density: number;
}
