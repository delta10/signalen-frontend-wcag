/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedMySignalLocation } from './_NestedMySignalLocation';
import type { _NestedMySignalStatus } from './_NestedMySignalStatus';

export type SignalDetail = {
    readonly _links: {
        curies?: {
            href?: string;
        };
        self?: {
            href?: string;
        };
        archives?: {
            href?: string;
        };
        'sia:attachments'?: Array<{
            href?: string;
            created_by?: string;
            created_at?: string;
            caption?: string | null;
        }>;
    };
    readonly _display: string;
    readonly uuid: string;
    readonly id_display: string;
    readonly text: string;
    status: _NestedMySignalStatus;
    location: _NestedMySignalLocation;
    readonly extra_properties: Record<string, any> | null;
    readonly created_at: string;
};

