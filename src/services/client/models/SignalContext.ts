/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SignalContext = {
    readonly _links: {
        curies?: {
            href?: string;
        };
        self?: {
            href?: string;
        };
        'sia:context-reporter-detail'?: {
            href?: string;
        };
        'sia:context-geography-detail'?: {
            href?: string;
        };
    };
    readonly near: {
        /**
         * The number of signals in the same category as the current signal, within a radius of 500 meters, created in the last 4 weeks.
         */
        signal_count?: number;
    };
    readonly reporter: ({
        /**
         * The number of signals created by the same reporter as the current signal.
         */
        signal_count?: number;
        /**
         * The number of open signals created by the same reporter as the current signal.
         */
        open_count?: number;
        /**
         * The number of signals created by the same reporter as the current signal, that have been marked as positive feedback.
         */
        positive_count?: number;
        /**
         * The number of signals created by the same reporter as the current signal, that have been marked as negative feedback.
         */
        negative_count?: number;
    } | null);
};

