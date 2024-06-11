import { TokenTransition } from "codehike/utils/token-transitions";
import { interpolate, interpolateColors, spring } from "remotion";

export function tweenStyle({
  element,
  keyframes,
  frame,
  frameDelay,
  frameDuration,
  fps,
}: {
  element: HTMLElement;
  keyframes: TokenTransition["keyframes"];
  frame: number;
  frameDelay: number;
  frameDuration: number;
  fps: number;
}) {
  const { translateX, translateY, color, opacity } = keyframes;
  if (opacity) {
    element.style.opacity = tween({
      frame,
      delayInFrames: frameDelay,
      durationInFrames: frameDuration,
      range: opacity,
      fps,
    }).toString();
  }
  if (color) {
    element.style.color = tweenColor({
      frame,
      delay: frameDelay,
      duration: frameDuration,
      range: color,
    });
  }
  if (translateX || translateY) {
    const x = tween({
      frame,
      delayInFrames: frameDelay,
      durationInFrames: frameDuration,
      range: translateX!,
      fps,
    });
    const y = tween({
      frame,
      delayInFrames: frameDelay,
      durationInFrames: frameDuration,
      range: translateY!,
      fps,
    });
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
