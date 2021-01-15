/**
 *
 * Rocket stuff
 */
export const KNToKg = (newtons: number): number => {
  return newtons * 101.9716005;
};

export const KgToKN = (kilograms: number): number => {
  return kilograms * 0.00980665;
};

/**
 *
 * Basic Math stuff
 */
export const degToRad = (degrees: number): number => {
  return (degrees / 180.0) * Math.PI;
};

export const radToDeg = (radians: number): number => {
  return (radians / Math.PI) * 180.0;
};
export const clamp = (src, min, max): number => {
  if (src < min) return min;
  else if (src > max) return max;
  else return src;
};
export const fit_range = (src, src_min, src_max, dst_min, dst_max): number => {
  src = clamp(src, src_min, src_max);
  return ((src - src_min) / (src_max - src_min)) * (dst_max - dst_min) + dst_min;
};

export const lerp = (ratio, value1, value2): number => {
  return (value2 - value1) * clamp(ratio, 0, 1) + value1;
};
