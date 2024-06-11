import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { Pre, AnnotationHandler, HighlightedCode } from "codehike/code";
import React, { useLayoutEffect, useState } from "react";
import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { tweenStyle } from "./utils";
import { mark } from "./annotations/Mark";
import { callout } from "./annotations/Callout";

import { loadFont } from "@remotion/google-fonts/RobotoMono";
const { fontFamily } = loadFont();

export function CodeTransition({
  oldCode,
  newCode,
  durationInFrames = 30,
}: {
  oldCode?: HighlightedCode;
  newCode: HighlightedCode;
  durationInFrames?: number;
}) {
  const frame = useCurrentFrame();
  const ref = React.useRef<HTMLPreElement>(null);
  const [snapshot, setSnapshot] = useState<TokenTransitionsSnapshot>();
  const [handle] = React.useState(() => delayRender());
  const prevCode = oldCode || { ...newCode, tokens: [], annotations: [] };

  useLayoutEffect(() => {
    if (!snapshot) {
      setSnapshot(getStartingSnapshot(ref.current!));
      return;
    }

    const transitions = calculateTransitions(ref.current!, snapshot);

    transitions.forEach(({ element, keyframes, options }) => {
      tweenStyle({
        element,
        keyframes,
        frame,
        frameDelay: durationInFrames * options.delay,
        frameDuration: durationInFrames * options.duration,
      });
    });
    continueRender(handle);
  }, [durationInFrames, frame, handle, snapshot]);

  return (
    <Pre
      ref={ref}
      code={snapshot ? newCode : prevCode}
      handlers={[inlineBlockTokens, mark, callout]}
      style={{
        position: "relative",
        fontSize: 20,
        lineHeight: 1.5,
        fontFamily,
      }}
    />
  );
}

const inlineBlockTokens: AnnotationHandler = {
  name: "inline-block",
  Token: ({ InnerToken, ...props }) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
};
