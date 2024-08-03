import {z} from 'zod';
import {CalculateMetadataFunction} from 'remotion';
import {getThemeColors} from '@code-hike/lighter';
import {Props} from '../Main';
import {schema} from './schema';
import {processSnippet} from './process-snippet';
import {getFiles} from './get-files';
import {measureText} from '@remotion/layout-utils';
import {
	fontFamily,
	fontSize,
	horizontalPadding,
	tabSize,
	waitUntilDone,
} from '../font';

export const calculateMetadata: CalculateMetadataFunction<
	Props & z.infer<typeof schema>
> = async ({props}) => {
	const contents = await getFiles();

	await waitUntilDone();
	const widthPerCharacter = measureText({
		text: 'A',
		fontFamily,
		fontSize,
		validateFontIsLoaded: true,
	}).width;

	const maxCharacters = Math.max(
		...contents
			.map(({value}) => value.split('\n'))
			.flat()
			.map((value) => value.replaceAll('\t', ' '.repeat(tabSize)).length)
			.flat(),
	);
	const codeWidth = widthPerCharacter * maxCharacters;

	const defaultStepDuration = 90;

	const themeColors = await getThemeColors(props.theme);

	const twoslashPromises = contents.map((step) => {
		return processSnippet(step, props.theme);
	});

	const twoSlashedCode = await Promise.all(twoslashPromises);

	return {
		durationInFrames: contents.length * defaultStepDuration,
		width: Math.max(1080, Math.ceil(codeWidth + horizontalPadding * 2)),
		props: {
			steps: twoSlashedCode,
			themeColors,
			theme: props.theme,
			codeWidth,
		},
	};
};
