import { InlineAnnotation, AnnotationHandler } from "codehike/code";
import { useCurrentFrame } from "remotion";
import { tween } from "../utils";

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation;
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    };
  },
  AnnotatedLine: ({ InnerLine, annotation, indentation, ...props }) => {
    const { column } = annotation.data;
    const frame = useCurrentFrame();
    const opacity = tween(frame, 25, 20, [0, 1]);
    return (
      <>
        <InnerLine {...props} />
        <div
          style={{
            opacity,
            minWidth: `${column + 4}ch`,
            marginLeft: `${indentation}ch`,
            width: "fit-content",
            border: "1px solid #aaa",
            backgroundColor: "#171717",
            borderRadius: "0.25rem",
            padding: "0.5rem",
            position: "relative",
            marginTop: "0.25rem",
            whiteSpace: "pre-wrap",
            color: "#c9d1d9",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              left: `${column - indentation - 0.5}ch`,
              position: "absolute",
              borderLeft: "1px solid #888",
              borderTop: "1px solid #888",
              width: "0.5rem",
              height: "0.5rem",
              transform: "rotate(45deg) translateY(-50%)",
              top: "-2px",
              backgroundColor: "#171717",
            }}
          />
          {annotation.data.children || annotation.query}
        </div>
      </>
    );
  },
};
