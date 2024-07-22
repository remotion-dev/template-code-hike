import { z } from "zod";
import { CalculateMetadataFunction } from "remotion";
import Content from "./content.md";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { createTwoslashFromCDN } from "twoslash-cdn";
import { highlight } from "codehike/code";
import { THEME } from "./config";
import { getThemeColors } from "@code-hike/lighter";
import { Props } from "./Main";

const Schema = Block.extend({
  code: z.array(HighlightedCodeBlock),
});

const twoslash = createTwoslashFromCDN();

export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const { code } = parseRoot(Content, Schema);

  const defaultStepDuration = 90;

  const themeColors = await getThemeColors(THEME);

  const twoslashPromises = code.map(async (step) => {
    const twoslashResult = await twoslash.run(step.value, step.lang, {
      compilerOptions: {
        lib: ["dom"],
      },
    });

    const highlighted = await highlight(
      { ...step, value: twoslashResult.code },
      THEME
    );

    await Promise.all(
      twoslashResult.queries.map(async ({ text, line, character, length }) => {
        const codeblock = await highlight(
          { value: text, lang: "ts", meta: "callout" },
          THEME
        );
        highlighted.annotations.push({
          name: "callout",
          query: text,
          lineNumber: line + 1,
          data: {
            character,
            codeblock,
          },
          fromColumn: character,
          toColumn: character + length,
        });
      })
    );

    twoslashResult.errors.forEach(({ text, line, character, length }) => {
      highlighted.annotations.push({
        name: "error",
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

  return {
    durationInFrames: code.length * defaultStepDuration,
    props: {
      steps: twoSlashedCode,
      themeColors,
    },
  };
};
