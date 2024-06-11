import { interpolate, interpolateColors } from "remotion";

export function tween(
  frame: number,
  delayInFrames: number,
  durationInFrames: number,
  [from, to]: [number, number]
) {
  if (frame < delayInFrames) {
    return from;
  }
  if (frame > delayInFrames + durationInFrames) {
    return to;
  }
  return interpolate(frame - delayInFrames, [0, durationInFrames], [from, to]);
}

export function tweenColor(
  frame: number,
  delay: number,
  duration: number,
  [from, to]: [string, string]
) {
  if (frame < delay) {
    return from;
  }
  if (frame > delay + duration) {
    return to;
  }
  return interpolateColors(frame - delay, [0, duration], [from, to]);
}
