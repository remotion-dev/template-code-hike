import {
	InlineAnnotation,
	AnnotationHandler,
	InnerLine,
	Pre,
} from 'codehike/code';
import {interpolate, useCurrentFrame} from 'remotion';
import {useThemeColors} from '../theme';

export const callout: AnnotationHandler = {
	name: 'callout',
	transform: (annotation: InlineAnnotation) => {
		const {name, query, lineNumber, fromColumn, toColumn, data} = annotation;
		return {
			name,
			query,
			fromLineNumber: lineNumber,
			toLineNumber: lineNumber,
			data: {...data, column: (fromColumn + toColumn) / 2},
		};
	},
	AnnotatedLine: ({annotation, ...props}) => {
		const {column, codeblock} = annotation.data;
		const {indentation} = props;
		const frame = useCurrentFrame();

		const opacity = interpolate(frame, [25, 35], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

		const themeColors = useThemeColors();

		return (
			<>
				<InnerLine merge={props} />
				<div
					style={{
						opacity,
						minWidth: `${column + 4}ch`,
						marginLeft: `${indentation}ch`,
						width: 'fit-content',
						backgroundColor: themeColors.editor.lineHighlightBackground,
						padding: '1rem 2rem',
						position: 'relative',
						marginTop: '0.25rem',
						whiteSpace: 'pre-wrap',
						color: themeColors.editor.foreground,
					}}
				>
					<div
						style={{
							left: `${column - indentation - 1}ch`,
							position: 'absolute',
							width: '1rem',
							height: '1rem',
							transform: 'rotate(45deg) translateY(-50%)',
							top: '-2px',
							backgroundColor: 'rgb(32 42 57)',
						}}
					/>
					{codeblock ? (
						<Pre code={codeblock} style={{margin: 0}} />
					) : (
						annotation.data.children || annotation.query
					)}
				</div>
			</>
		);
	},
};
