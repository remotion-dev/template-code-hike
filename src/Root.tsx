import { Composition } from "remotion";
import { Main } from "./Main";
import { Block, HighlightedCodeBlock, parseRoot } from "codehike/blocks";
import { z } from "zod";

const Schema = Block.extend({
  code: z.array(HighlightedCodeBlock),
});

import Content from "./content.md";
const { code } = parseRoot(Content, Schema);
const defaultStepDuration = 90;

export const RemotionRoot = () => {
  return (
    <Composition
      id="CodeHikeExample"
      component={Main}
      defaultProps={{ steps: code }}
      fps={30}
      durationInFrames={defaultStepDuration * code.length}
      width={580}
      height={530}
    />
  );
};
