/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AreaType } from './AreaType';

export type Area = {
    name: string;
    code: string;
    type: AreaType;
    /**
     * Bounding box as [min_x, min_y, max_x, max_y]
     */
    readonly bbox: Array<number>;
};

