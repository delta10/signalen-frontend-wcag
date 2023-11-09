/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ParentCategoryHAL = {
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
    public_name?: string | null;
    readonly is_public_accessible: string;
    sub_categories: 'ParentCategoryHAL';
    configuration?: Record<string, any>;
};

