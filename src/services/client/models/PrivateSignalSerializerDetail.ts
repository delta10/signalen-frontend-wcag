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
 * This serializer is used for the detail endpoint and when updating the instance
 */
export type PrivateSignalSerializerDetail = {
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
        'sia:attachments'?: {
            href?: string;
        };
        'sia:pdf'?: {
            href?: string;
        };
        'sia:context'?: {
            href?: string;
        };
        'sia:parent'?: {
            href?: string;
        };
        'sia:children'?: Array<{
            href?: string;
        }>;
    };
    readonly _display: string;
    category?: _NestedCategoryModel;
    readonly id: number;
    readonly id_display: string;
    readonly has_attachments: string;
    location?: _NestedLocationModel;
    status?: _NestedStatusModel;
    reporter?: _NestedReporterModel;
    priority?: _NestedPriorityModel;
    notes?: Array<_NestedNoteModel>;
    type?: _NestedTypeModel;
    source?: string;
    text: string;
    text_extra?: string;
    extra_properties?: Record<string, any>;
    readonly created_at: string;
    readonly updated_at: string;
    incident_date_start: string;
    incident_date_end?: string | null;
    directing_departments?: Array<_NestedDepartmentModel>;
    routing_departments?: Array<_NestedDepartmentModel> | null;
    readonly attachments: Array<string>;
    assigned_user_email?: string | null;
};

