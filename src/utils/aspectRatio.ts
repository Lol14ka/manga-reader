export function gcd(x: number, y: number) {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function aspectRatio(width: number, height: number) {
  const common = gcd(width, height);
  return [width / common, height / common];
}

export function getRatioHeight(width: number, ratio: number[]) {
  return width * (ratio[1] / ratio[0]);
}

export function getRatioWidth(height: number, ratio: number[]) {
  return height * (ratio[0] / ratio[1]);
}
