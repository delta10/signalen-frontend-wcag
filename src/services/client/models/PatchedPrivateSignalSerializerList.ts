/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedCategoryModel } from './_NestedCategoryModel';
import type { _NestedDepartmentModel } from './_NestedDepartmentModel';
import type { _NestedLocationModel } from './_NestedLocationModel';
import type { _NestedNoteModel } from './_NestedNoteModel';
import type { _NestedPriorityModel } from './_NestedPriorityModel';
import type { _NestedReporterModel } from './_NestedReporterModel';
import type { _NestedStatusModel } from './_NestedStatusModel';
import type { _NestedTypeModel } from './_NestedTypeModel';

/**
 * This serializer is used for the list endpoint and when creating a new instance
 */
export type PatchedPrivateSignalSerializerList = {
    readonly _links?: {
        self?: {
            href?: string;
        };
    };
    readonly _display?: string;
    readonly id?: number;
    readonly id_display?: string;
    readonly signal_id?: string;
    source?: string;
    text?: string;
    text_extra?: string;
    status?: _NestedStatusModel;
    location?: _NestedLocationModel;
    category?: _NestedCategoryModel;
    reporter?: _NestedReporterModel;
    priority?: _NestedPriorityModel;
    type?: _NestedTypeModel;
    readonly created_at?: string;
    readonly updated_at?: string;
    incident_date_start?: string;
    incident_date_end?: string | null;
    operational_date?: string | null;
    readonly has_attachments?: string;
    extra_properties?: Record<string, any> | null;
    notes?: Array<_NestedNoteModel>;
    directing_departments?: Array<_NestedDepartmentModel>;
    routing_departments?: Array<_NestedDepartmentModel> | null;
    attachments?: Array<string>;
    parent?: number;
    readonly has_parent?: string;
    readonly has_children?: string;
    assigned_user_email?: string | null;
    session?: string;
};

