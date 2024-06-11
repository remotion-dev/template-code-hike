import { z } from "zod";
import { CalculateMetadataFunction } from "remotion";
import Content from "./content.md";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { createTwoslashFromCDN } from "twoslash-cdn";
import { HighlightedCode, highlight } from "codehike/code";

const Schema = Block.extend({
  code: z.array(HighlightedCodeBlock),
});

const twoslash = createTwoslashFromCDN();

type Props = {
  steps: HighlightedCode[];
};

export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const { code } = parseRoot(Content, Schema);
  const defaultStepDuration = 90;

  const twoslashPromises = code.map(async (step) => {
    const twoslashResult = await twoslash.run(step.value, step.lang, {
      compilerOptions: {
        lib: ["dom"],
      },
    });
    const highlighted = await highlight(
      { ...step, value: twoslashResult.code },
      "github-dark"
    );

    twoslashResult.errors.forEach(({ text, line, character, length }) => {
      highlighted.annotations.push({
        name: "callout",
        query: text,
        lineNumber: line + 1,
        data: { character },
        fromColumn: character,
        toColumn: character + length,
      });
    });

    return highlighted;
  });

  const twoSlashedCode = await Promise.all(twoslashPromises);

  console.log(twoSlashedCode);

  return {
    durationInFrames: code.length * defaultStepDuration,
    props: {
      steps: twoSlashedCode,
    },
  };
};
