/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Permission } from './Permission';

export type PatchedRole = {
    readonly _links?: {
        self?: {
            href?: string;
        };
    };
    readonly _display?: string;
    readonly id?: number;
    name?: string;
    readonly permissions?: Array<Permission>;
    permission_ids?: Array<number>;
};

