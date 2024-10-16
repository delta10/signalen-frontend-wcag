/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type _NestedMySignalLocation = {
    readonly address: Record<string, any> | null;
    readonly address_text: string | null;
    readonly geometrie: {
        type?: _NestedMySignalLocation.type;
        coordinates?: Array<number>;
    };
};

export namespace _NestedMySignalLocation {

    export enum type {
        POINT = 'Point',
    }


}

