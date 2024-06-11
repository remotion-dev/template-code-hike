import { TokenTransition } from "codehike/utils/token-transitions";
import { interpolate, interpolateColors } from "remotion";

export function tweenStyle({
  element,
  keyframes,
  frame,
  frameDelay,
  frameDuration,
}: {
  element: HTMLElement;
  keyframes: TokenTransition["keyframes"];
  frame: number;
  frameDelay: number;
  frameDuration: number;
}) {
  const { translateX, translateY, color, opacity } = keyframes;
  if (opacity) {
    element.style.opacity = tween(
      frame,
      frameDelay,
      frameDuration,
      opacity
    ).toString();
  }
  if (color) {
    element.style.color = tweenColor(frame, frameDelay, frameDuration, color);
  }
  if (translateX || translateY) {
    const x = tween(frame, frameDelay, frameDuration, translateX!);
    const y = tween(frame, frameDelay, frameDuration, translateY!);
    element.style.translate = `${x}px ${y}px`;
  }
}

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
