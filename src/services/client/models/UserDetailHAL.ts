/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Permission } from './Permission';
import type { ProfileDetail } from './ProfileDetail';
import type { Role } from './Role';

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
        export type UserDetailHAL = {
            readonly _links: {
                curies?: {
                    href?: string;
                };
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
            readonly email: string;
            first_name?: string;
            last_name?: string;
            /**
             * Bepaalt of deze gebruiker als actief dient te worden behandeld. U kunt dit uitvinken in plaats van een gebruiker te verwijderen.
             */
            is_active?: boolean;
            /**
             * Bepaalt of de gebruiker zich op deze beheerwebsite kan aanmelden.
             */
            readonly is_staff: boolean;
            /**
             * Bepaalt dat deze gebruiker alle rechten heeft, zonder deze expliciet toe te wijzen.
             */
            readonly is_superuser: boolean;
            readonly roles: Array<Role>;
            role_ids?: Array<number>;
            readonly permissions: Array<Permission>;
            profile?: ProfileDetail;
        };

