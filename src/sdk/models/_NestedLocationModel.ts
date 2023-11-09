/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NullEnum } from './NullEnum';
import type { StadsdeelEnum } from './StadsdeelEnum';

export type _NestedLocationModel = {
    readonly id: number;
    stadsdeel?: (StadsdeelEnum | NullEnum) | null;
    buurt_code?: string | null;
    area_type_code?: string | null;
    area_code?: string | null;
    area_name?: string | null;
    address?: Record<string, any> | null;
    readonly address_text: string | null;
    geometrie: {
        type?: _NestedLocationModel.type;
        coordinates?: Array<number>;
    };
    extra_properties?: Record<string, any> | null;
    readonly created_by: string | null;
    readonly bag_validated: boolean;
};

export namespace _NestedLocationModel {

    export enum type {
        POINT = 'Point',
    }


}

