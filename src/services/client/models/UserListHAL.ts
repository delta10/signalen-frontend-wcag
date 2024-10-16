/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProfileList } from './ProfileList';

/**
 * Serializer mixin to make fields only writeable at creation. When updating the field is set to
 * read-only.
 *
 * In the Meta data of the serializer just add tupple:
 *
 * write_once_fields = (
     * '...',  # The name of the field you want to be write once
     * )
     *
     * or list:
     *
     * write_once_fields = [
         * '...',  # The name of the field you want to be write once
         * ]
         */
        export type UserListHAL = {
            readonly _links: {
                self?: {
                    href?: string;
                };
            };
            readonly _display: string;
            readonly id: number;
            /**
             * Vereist. 150 tekens of minder. Alleen letters, cijfers en de tekens @/,/+/-/_ zijn toegestaan.
             */
            username: string;
            /**
             * Bepaalt of deze gebruiker als actief dient te worden behandeld. U kunt dit uitvinken in plaats van een gebruiker te verwijderen.
             */
            is_active?: boolean;
            readonly roles: Array<string>;
            role_ids?: Array<number>;
            profile?: ProfileList;
        };

