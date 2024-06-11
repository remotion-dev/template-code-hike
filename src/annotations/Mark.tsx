import React from "react";
import { useCurrentFrame } from "remotion";
import { tweenColor } from "../utils";
import { AnnotationHandler } from "codehike/code";

export const mark: AnnotationHandler = {
  name: "mark",
  Inline: ({ children, annotation }) => {
    const [color = "blue", delay = 20, duration = 10] =
      annotation.query.split(" ");
    const frame = useCurrentFrame();
    const backgroundColor = tweenColor(frame, Number(delay), Number(duration), [
      "rgba(0, 0, 0, 0)",
      color,
    ]);

    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor,
          borderRadius: 4,
          padding: "0 .125rem",
          margin: "0 -.125rem",
        }}
      >
        {children}
      </div>
    );
  },
};
