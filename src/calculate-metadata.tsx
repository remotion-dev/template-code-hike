import {z} from 'zod';
import {CalculateMetadataFunction, getStaticFiles} from 'remotion';
import {createTwoslashFromCDN} from 'twoslash-cdn';
import {highlight} from 'codehike/code';
import {getThemeColors} from '@code-hike/lighter';
import {Props} from './Main';
import {schema} from './schema';

const twoslash = createTwoslashFromCDN();

export const calculateMetadata: CalculateMetadataFunction<
	Props & z.infer<typeof schema>
> = async ({props}) => {
	const files = getStaticFiles();
	const codeFiles = files.filter((file) => file.name.startsWith('code'));

	const contents = await Promise.all(
		codeFiles.map(async (file) => {
			const contents = await fetch(file.src);
			const text = await contents.text();

			return {filename: file.name, value: text};
		}),
	);

	const defaultStepDuration = 90;

	const themeColors = await getThemeColors(props.theme);

	const twoslashPromises = contents.map(async (step) => {
		const extension = step.filename.split('.')[1];
		const twoslashResult =
			extension === 'ts' || extension === 'tsx'
				? await twoslash.run(step.value, extension, {
						compilerOptions: {
							lib: ['dom'],
						},
					})
				: null;

		const highlighted = await highlight(
			{
				lang: 'tsx',
				meta: '',
				value: twoslashResult ? twoslashResult.code : step.value,
			},
			props.theme,
		);

		if (twoslashResult) {
			await Promise.all(
				twoslashResult.queries.map(async ({text, line, character, length}) => {
					const codeblock = await highlight(
						{value: text, lang: 'ts', meta: 'callout'},
						props.theme,
					);
					highlighted.annotations.push({
						name: 'callout',
						query: text,
						lineNumber: line + 1,
						data: {
							character,
							codeblock,
						},
						fromColumn: character,
						toColumn: character + length,
					});
				}),
			);

			twoslashResult.errors.forEach(({text, line, character, length}) => {
				highlighted.annotations.push({
					name: 'error',
					query: text,
					lineNumber: line + 1,
					data: {character},
					fromColumn: character,
					toColumn: character + length,
				});
			});
		}

		return highlighted;
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
