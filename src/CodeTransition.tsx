import { spring } from "remotion";
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Pre, HighlightedCode, AnnotationHandler } from "codehike/code";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";
import { applyStyle } from "./utils";
import { mark } from "./annotations/Mark";
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
  const { fps } = useVideoConfig();

  const ref = React.useRef<HTMLPreElement>(null);
  const [snapshot, setSnapshot] = useState<TokenTransitionsSnapshot>();
  const [handle] = React.useState(() => delayRender());

  const prevCode: HighlightedCode = useMemo(() => {
    return oldCode || { ...newCode, tokens: [], annotations: [] };
  }, [newCode, oldCode]);

  useLayoutEffect(() => {
    if (!snapshot) {
      setSnapshot(getStartingSnapshot(ref.current!));
      return;
    }

    continueRender(handle);
  }, [handle, snapshot]);

  useEffect(() => {
    if (!snapshot) {
      return;
    }
    if (!ref.current) {
      return;
    }

    const transitions = calculateTransitions(ref.current, snapshot);

    for (const transition of transitions) {
      const { element, keyframes, options } = transition;
      const progress = spring({
        frame,
        fps,
        config: {
          damping: 200,
        },
        delay: durationInFrames * options.delay,
        durationInFrames: durationInFrames * options.duration,
        durationRestThreshold: 0.01,
      });

      applyStyle({
        element,
        keyframes,
        progress,
      });
    }
  }, [durationInFrames, fps, frame, snapshot]);

  const handlers: AnnotationHandler[] = useMemo(() => {
    return [inlineBlockTokens, mark, callout];
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "relative",
      fontSize: 20,
      lineHeight: 1.5,
      fontFamily,
    };
  }, []);

  return (
    <Pre
      ref={ref}
      code={snapshot ? newCode : prevCode}
      handlers={handlers}
      style={style}
    />
  );
}
