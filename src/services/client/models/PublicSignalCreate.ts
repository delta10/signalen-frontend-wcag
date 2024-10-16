/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedCategoryModel } from './_NestedCategoryModel';
import type { _NestedLocationModel } from './_NestedLocationModel';
import type { _NestedReporterModel } from './_NestedReporterModel';

/**
 * This serializer allows anonymous users to report `signals.Signals`.
 *
 * Note: this is only used in the creation of new Signal instances, not to
 * create the response body after a succesfull POST.
 */
export type PublicSignalCreate = {
    source?: string;
    text: string;
    text_extra?: string;
    location: _NestedLocationModel;
    category: _NestedCategoryModel;
    reporter: _NestedReporterModel;
    incident_date_start: string;
    incident_date_end?: string | null;
    extra_properties?: Record<string, any> | null;
    session?: string;
};

