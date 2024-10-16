/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StatusMessageFacet } from './StatusMessageFacet';
import type { StatusMessageSearchResult } from './StatusMessageSearchResult';

export type StatusMessageList = {
    readonly count: number;
    results: Array<StatusMessageSearchResult>;
    facets: StatusMessageFacet;
};

