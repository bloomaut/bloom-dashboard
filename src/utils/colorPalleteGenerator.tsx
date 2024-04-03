import { PaletteItem } from "@/typescript/interfaces/business.interface";

const hexToRgb = (hex: string): number[] => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const generateAnalogColor = (baseRGB: number[]): string => {
  const hue = baseRGBToHue(baseRGB);
  const newHue = (hue + Math.random() * 30 - 15 + 360) % 360;
  const lightness = 50 + Math.random() * 20 - 10;
  const saturation = 50 + Math.random() * 20 - 10;
  return `hsl(${newHue},${saturation}%,${lightness}%)`;
};

const baseRGBToHue = (baseRGB: number[]): number => {
  const [r, g, b]: number[] = baseRGB;
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);
  let hue: number;
  if (max === min) {
    hue = 0;
  } else if (max === r) {
    hue = (60 * (g - b)) / (max - min);
  } else if (max === g) {
    hue = 120 + (60 * (b - r)) / (max - min);
  } else {
    hue = 240 + (60 * (r - g)) / (max - min);
  }
  return hue;
};

export const colorPalleteGenerator = (colorBase: string): PaletteItem[] => {
  const baseRGB = hexToRgb(colorBase);

  // Generar el primer color a partir del color base seleccionado por el usuario
  const color1 = `rgb(${baseRGB[0]}, ${baseRGB[1]}, ${baseRGB[2]})`;

  // Generar los 3 colores alternativos
  const hue = baseRGBToHue(baseRGB);
  const saturation = 50 + Math.random() * 20 - 1; // Mantener la saturación coherente

  // Calcular los matices para los colores alternativos
  const hue1 = (hue + 30 + Math.random() * 60) % 360;
  const hue2 = (hue - 30 + Math.random() * 60) % 360;
  const hue3 = (hue + 180 + Math.random() * 60) % 360;

  // Generar los colores HSL
  const color2 = `hsl(${hue1},${saturation}%,40%)`;
  const color3 = `hsl(${hue2},${saturation}%,60%)`;
  const color4 = `hsl(${hue3},${saturation}%,10%)`;

  return [{ color: color1 }, { color: color2 }, { color: color3 }, { color: color4 }];
};
