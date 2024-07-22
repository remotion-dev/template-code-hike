import { Composition } from "remotion";
import { Main } from "./Main";

import { calculateMetadata } from "./calculate-metadata";

export const RemotionRoot = () => {
  return (
    <Composition
      id="CodeHikeExample"
      component={Main}
      defaultProps={{ steps: null, themeColors: null }}
      fps={30}
      width={1080}
      height={1080}
      calculateMetadata={calculateMetadata}
    />
  );
};
