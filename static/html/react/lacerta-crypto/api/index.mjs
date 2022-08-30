import { coupons } from './response';

import { arrayToCamelCase } from '../libs/objects/index';
import { pipe } from '../libs/service/index';

export const getCoupons = () =>
    new Promise(resolve =>
        pipe(
            coupons,
            arrayToCamelCase,
            resolve,
        ));
