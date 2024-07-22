import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useThemeColors} from './calculate-metadata/theme';

export function ProgressBar({steps}: {steps: unknown[]}) {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const themeColors = useThemeColors();

	const stepDuration = durationInFrames / steps.length;
	const currentStep = Math.floor(frame / stepDuration);
	const currentStepProgress = (frame % stepDuration) / stepDuration;

	return (
		<div
			style={{
				position: 'absolute',
				top: 48,
				left: 48,
				right: 48,
				height: 6,
				display: 'flex',
				gap: 12,
			}}
		>
			{steps.map((_, index) => (
				<div
					key={index}
					style={{
						backgroundColor: themeColors.editor.lineHighlightBackground,
						borderRadius: 6,
						overflow: 'hidden',
						height: '100%',
						flex: 1,
					}}
				>
					<div
						style={{
							height: '100%',
							backgroundColor: themeColors.editor.foreground,
							width:
								index > currentStep
									? 0
									: index === currentStep
										? currentStepProgress * 100 + '%'
										: '100%',
						}}
					/>
				</div>
			))}
		</div>
	);
}
