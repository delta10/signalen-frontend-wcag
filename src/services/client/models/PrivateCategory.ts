/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedPrivateCategoryDepartment } from './_NestedPrivateCategoryDepartment';
import type { PrivateCategorySLA } from './PrivateCategorySLA';

export type PrivateCategory = {
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
        'sia:status-message-templates'?: {
            href?: string;
        };
    };
    readonly _display: string;
    readonly id: number;
    name: string;
    readonly slug: string;
    is_active?: boolean;
    description?: string | null;
    handling_message?: string | null;
    readonly sla: Record<string, any>;
    new_sla: PrivateCategorySLA;
    readonly departments: Array<_NestedPrivateCategoryDepartment>;
    note?: string | null;
    public_name?: string | null;
    is_public_accessible?: boolean;
    configuration?: Record<string, any>;
    icon?: string | null;
};

