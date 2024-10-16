/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PrivateDepartmentSerializerList } from './PrivateDepartmentSerializerList';

export type PaginatedPrivateDepartmentSerializerListList = {
    _links?: {
        self?: {
            href?: string | null;
        };
        next?: {
            href?: string | null;
        };
        previous?: {
            href?: string | null;
        };
    };
    count?: number;
    results?: Array<PrivateDepartmentSerializerList>;
};

