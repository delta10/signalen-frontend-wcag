/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AreaType } from './AreaType';
import type { GisFeatureEnum } from './GisFeatureEnum';

export type AreaGeo = {
    type?: GisFeatureEnum;
    geometry?: {
        type?: AreaGeo.type;
        coordinates?: Array<Array<Array<Array<number>>>>;
    };
    properties?: {
        name?: string;
        code?: string;
        type?: AreaType;
    };
};

export namespace AreaGeo {

    export enum type {
        MULTI_POLYGON = 'MultiPolygon',
    }


}

