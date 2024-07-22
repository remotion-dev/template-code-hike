import {AbsoluteFill, Series, useVideoConfig} from 'remotion';
import {ProgressBar} from './ProgressBar';
import {CodeTransition} from './CodeTransition';
import {HighlightedCode} from 'codehike/code';
import {ThemeColors, ThemeProvider} from './theme';

export type Props = {
	steps: HighlightedCode[] | null;
	themeColors: ThemeColors | null;
};

export const Main = (props: Props) => {
	if (!props.themeColors) {
		throw new Error('Theme colors are not defined');
	}
	if (!props.steps) {
		throw new Error('Steps are not defined');
	}

	const {steps} = props;
	const {durationInFrames} = useVideoConfig();
	const stepDuration = durationInFrames / steps.length;
	const transitionDuration = 30;

	return (
		<ThemeProvider themeColors={props.themeColors}>
			<AbsoluteFill style={{backgroundColor: props.themeColors.background}}>
				<ProgressBar steps={steps} />
				<AbsoluteFill style={{padding: '84px 48px'}}>
					<Series>
						{steps.map((step, index) => (
							<Series.Sequence
								key={index}
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
		</ThemeProvider>
	);
};
