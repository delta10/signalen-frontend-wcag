/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PrivateCategoryHistoryHal = {
    readonly identifier: string;
    readonly when: string;
    readonly what: string;
    readonly action: string;
    readonly description: string;
    /**
     * "who" in the style of the signals_history_view
     * Present for backwards compatibility
     */
    readonly who: string;
    readonly _category: number;
};

