import styled from 'styled-components';
import {
    lineHeight, fontWeight, letterSpacing, compose,
} from 'styled-system';

import { Box } from './index';

const enhanceStyledComponent = compose(
    lineHeight,
    fontWeight,
    letterSpacing,
);
const Text = styled(Box).attrs({ as: 'span' })`
    display: block;
    ${enhanceStyledComponent}
`;

export default Text;
