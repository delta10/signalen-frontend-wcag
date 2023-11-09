/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HistoryLogHal = {
    when: string;
    /**
     * "what" in the style of the signals_history_view
     * Present for backwards compatibility
     */
    readonly what: string;
    readonly action: string;
    description: string;
    _signal: string;
};

