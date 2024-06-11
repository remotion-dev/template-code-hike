import { TokenTransition } from "codehike/utils/token-transitions";
import { interpolate, interpolateColors, spring } from "remotion";

export function tweenStyle({
  element,
  keyframes,
  progress,
}: {
  element: HTMLElement;
  keyframes: TokenTransition["keyframes"];
  progress: number;
}) {
  const { translateX, translateY, color, opacity } = keyframes;
  if (opacity) {
    element.style.opacity = interpolate(progress, [0, 1], opacity).toString();
  }
  if (color) {
    element.style.color = interpolateColors(progress, [0, 1], color);
  }
  if (translateX || translateY) {
    const x = interpolate(progress, [0, 1], translateX!);
    const y = interpolate(progress, [0, 1], translateY!);
    element.style.translate = `${x}px ${y}px`;
  }
}

export function tween({
  frame,
  delayInFrames,
  durationInFrames,
  range,
  fps,
}: {
  frame: number;
  delayInFrames: number;
  durationInFrames: number;
  range: [number, number];
  fps: number;
}) {
  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    delay: delayInFrames,
    durationInFrames,
    durationRestThreshold: 0.01,
  });
  return interpolate(progress, [0, 1], range);
}

export function tweenColor({
  frame,
  delay,
  duration,
  range,
}: {
  frame: number;
  delay: number;
  duration: number;
  range: [string, string];
}) {
  return interpolateColors(frame - delay, [0, duration], range);
}
