/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedMySignalStatus } from './_NestedMySignalStatus';

export type SignalList = {
    readonly _links: {
        curies?: {
            href?: string;
        };
        self?: {
            href?: string;
        };
    };
    readonly _display: string;
    readonly uuid: string;
    readonly id_display: string;
    readonly text: string;
    status: _NestedMySignalStatus;
    readonly created_at: string;
};

