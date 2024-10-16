/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CategoryDepartment } from './CategoryDepartment';

export type PrivateDepartmentSerializerDetail = {
    readonly _links: {
        self?: {
            href?: string;
        };
    };
    readonly _display: string;
    readonly id: number;
    name: string;
    code: string;
    is_intern?: boolean;
    categories?: Array<CategoryDepartment>;
    can_direct?: boolean;
};

