/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { _NestedPublicDepartment } from './_NestedPublicDepartment';
import type { HandlingEnum } from './HandlingEnum';

/**
 * SIG-2287 [BE] Afdeling geeft categorie zonder main slug terug
 *
 * Added a TemporaryParentCategoryHALSerializer so that we can override the serializer_url_field to render the correct
 * url for a parent category
 *
 * TODO: Refactor the TemporaryCategoryHALSerializer and TemporaryParentCategoryHALSerializer serializers
 */
export type TemporaryParentCategoryHAL = {
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
    readonly id: number;
    name: string;
    readonly slug: string;
    handling?: HandlingEnum;
    readonly departments: Array<_NestedPublicDepartment>;
    is_active?: boolean;
    description?: string | null;
    handling_message?: string | null;
};

