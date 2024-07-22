import {z} from 'zod';
import {CalculateMetadataFunction} from 'remotion';
import {getThemeColors} from '@code-hike/lighter';
import {Props} from '../Main';
import {schema} from './schema';
import {processSnippet} from './process-snippet';
import {getFiles} from './get-files';

export const calculateMetadata: CalculateMetadataFunction<
	Props & z.infer<typeof schema>
> = async ({props}) => {
	const contents = await getFiles();

	const defaultStepDuration = 90;

	const themeColors = await getThemeColors(props.theme);

	const twoslashPromises = contents.map((step) => {
		return processSnippet(step, props.theme);
	});

	const twoSlashedCode = await Promise.all(twoslashPromises);

	return {
		durationInFrames: contents.length * defaultStepDuration,
		props: {
			steps: twoSlashedCode,
			themeColors,
			theme: props.theme,
		},
	};
};
