export const degToRad = (degrees: number): number => {
  return (degrees / 180.0) * Math.PI;
};

export const radToDeg = (radians: number): number => {
  return (radians / Math.PI) * 180.0;
};

export const KNToKg = (newtons: number): number => {
  return newtons * 101.9716005;
};

export const KgToKN = (kilograms: number): number => {
  return kilograms * 0.00980665;
};
