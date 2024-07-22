import { Config } from "@remotion/cli/config";
import { enableMdx } from "./src/webpack-override";

Config.overrideWebpackConfig(enableMdx);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
