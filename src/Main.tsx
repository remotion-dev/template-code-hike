import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { ProgressBar } from "./ProgressBar";
import { CodeTransition } from "./CodeTransition";
import { HighlightedCode } from "codehike/code";

export const Main = (props: { steps: HighlightedCode[] }) => {
  const { steps } = props;
  const { durationInFrames } = useVideoConfig();
  const stepDuration = durationInFrames / steps.length;
  const transitionDuration = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      <ProgressBar steps={steps} />
      <AbsoluteFill style={{ padding: "42px 24px" }}>
        <Series>
          {steps.map((step, index) => (
            <Series.Sequence
              layout="none"
              durationInFrames={stepDuration}
              name={step.meta}
            >
              <CodeTransition
                oldCode={steps[index - 1]}
                newCode={step}
                durationInFrames={transitionDuration}
              />
            </Series.Sequence>
          ))}
        </Series>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
