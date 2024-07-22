import { InlineAnnotation, AnnotationHandler, InnerToken } from "codehike/code";
import { interpolate, useCurrentFrame } from "remotion";

export const errorInline: AnnotationHandler = {
  name: "error",
  transform: (annotation: InlineAnnotation) => {
    const { query, lineNumber, data } = annotation;
    return [
      annotation,
      {
        name: "error-message",
        query,
        fromLineNumber: lineNumber,
        toLineNumber: lineNumber,
        data,
      },
    ];
  },
  Inline: ({ children }) => (
    <span
      style={{
        // @ts-expect-error - React types
        "--decoration": "underline wavy red",
      }}
    >
      {children}
    </span>
  ),
  Token: (props) => {
    return (
      <InnerToken
        merge={props}
        style={{
          textDecoration: "var(--decoration)",
        }}
      />
    );
  },
};

export const errorMessage: AnnotationHandler = {
  name: "error-message",
  Block: ({ annotation, children }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [25, 35], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <>
        {children}
        <div
          style={{
            opacity,
            borderLeft: "4px solid red",
            marginLeft: "-1rem",
            backgroundColor: "rgb(32 42 57)",
            padding: "1rem 2rem",
            marginTop: "0.5rem",
            whiteSpace: "pre-wrap",
            color: "#c9d1d9",
          }}
        >
          {annotation.data.children || annotation.query}
        </div>
      </>
    );
  },
};
