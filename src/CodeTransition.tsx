import { Easing, interpolate } from "remotion";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { Pre, HighlightedCode, AnnotationHandler } from "codehike/code";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";

import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { applyStyle } from "./utils";
import { callout } from "./annotations/Callout";

import { loadFont } from "@remotion/google-fonts/RobotoMono";
import { inlineBlockTokens } from "./annotations/InlineToken";
const { fontFamily } = loadFont();

export function CodeTransition({
  oldCode,
  newCode,
  durationInFrames = 30,
}: {
  oldCode: HighlightedCode | null;
  newCode: HighlightedCode;
  durationInFrames?: number;
}) {
  const frame = useCurrentFrame();

  const ref = React.useRef<HTMLPreElement>(null);
  const [oldSnapshot, setOldSnapshot] =
    useState<TokenTransitionsSnapshot | null>(null);
  const [handle] = React.useState(() => delayRender());

  const prevCode: HighlightedCode = useMemo(() => {
    return oldCode || { ...newCode, tokens: [], annotations: [] };
  }, [newCode, oldCode]);

  const code = useMemo(() => {
    return oldSnapshot ? newCode : prevCode;
  }, [newCode, prevCode, oldSnapshot]);

  useEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
    }
  }, [oldSnapshot]);

  useLayoutEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
      return;
    }
    const transitions = calculateTransitions(ref.current!, oldSnapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      const delay = durationInFrames * options.delay;
      const duration = durationInFrames * options.duration;
      const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.ease),
      });

      applyStyle({
        element,
        keyframes,
        progress,
      });
    });
    continueRender(handle);
  });

  const handlers: AnnotationHandler[] = useMemo(() => {
    return [inlineBlockTokens, callout];
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "relative",
      fontSize: 40,
      lineHeight: 1.5,
      fontFamily,
    };
  }, []);

  return <Pre ref={ref} code={code} handlers={handlers} style={style} />;
}
