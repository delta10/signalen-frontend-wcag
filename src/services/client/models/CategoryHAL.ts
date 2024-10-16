/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HandlingEnum } from './HandlingEnum';

export type CategoryHAL = {
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
        'sia:questionnaire'?: {
            href?: string;
        };
        'sia:icon'?: {
            href?: string;
        };
    };
    readonly _display: string;
    name: string;
    readonly slug: string;
    handling?: HandlingEnum;
    readonly departments: string;
    is_active?: boolean;
    description?: string | null;
    handling_message?: string | null;
    readonly questionnaire: string;
    public_name?: string | null;
    is_public_accessible?: boolean;
};

