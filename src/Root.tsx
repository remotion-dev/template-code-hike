import {Composition} from 'remotion';
import {Main} from './Main';

import {calculateMetadata} from './calculate-metadata';
import {schema} from './schema';

export const RemotionRoot = () => {
	return (
		<Composition
			id="CodeHikeExample"
			component={Main}
			defaultProps={{steps: null, themeColors: null, theme: 'github-dark'}}
			fps={30}
			width={1080}
			height={1080}
			calculateMetadata={calculateMetadata}
			schema={schema}
		/>
	);
};
