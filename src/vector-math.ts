export type Vector2 = [number, number];
export type radians = number;

export const PI_2 = Math.PI * 2;
export const PI = Math.PI;

export function multiply([ x, y ]: Vector2, k: number): Vector2 {
  // Quick conditions
  if(x === 0 && y === 0) return [ 0, 0 ];
  if(x === 0) return [ 0, y * k ];
  if(y === 0) return [ x * k, 0 ];
  if(k === 1) return [ x, y ];

  return [ x * k, y * k ];
}

export function add([ x1, y1 ]: Vector2, [ x2, y2 ]: Vector2): Vector2 {
  return [ x1 + x2, y1 + y2 ];
}

export function subtract([ x1, y1 ]: Vector2, [ x2, y2 ]: Vector2): Vector2 {
  return [ x1 - x2, y1 - y2 ];
}

export function magnitude([ x, y ]: Vector2): number {
  if(x === 0 && y === 0) return 0;
  if(x === 0) return y;
  if(y === 0) return x;

  return Math.sqrt(x*x + y*y);
}

export function isZeroLength([ x, y ]: Vector2): boolean {
  return x === 0 && y === 0;
}

export function normalize([ x, y ]: Vector2): Vector2 {
  if(x === 0 && y === 0) return [ 0, 0 ];
  if(x === 0) return [ 0, Math.sign(y) ];
  if(y === 0) return [ Math.sign(x), 0 ];

  const l = Math.sqrt( x*x + y*y );
  return [ x / l, y / l ]
}

export function dot([ x1, y1 ]: Vector2, [ x2, y2 ]: Vector2): number {
  return x1 * x2 + y1 * y2;
}

export function rotate([ x, y ]: Vector2, t: number): Vector2 {
  if(x === 0 && y === 0) return [ 0, 0 ];

  return [
    x * Math.cos(t) - y * Math.sin(t),
    x * Math.sin(t) + y * Math.cos(t)
  ];

}