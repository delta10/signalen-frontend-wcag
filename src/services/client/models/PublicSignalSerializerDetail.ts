/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedPublicStatusModel } from './_NestedPublicStatusModel';

export type PublicSignalSerializerDetail = {
    readonly _display: string;
    readonly id: number;
    readonly id_display: string;
    signal_id: string;
    status?: _NestedPublicStatusModel;
    readonly created_at: string;
    readonly updated_at: string;
    incident_date_start: string;
    incident_date_end?: string | null;
};

