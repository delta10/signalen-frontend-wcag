/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SignalContextReporter = {
    readonly id: number;
    readonly created_at: string;
    readonly category: {
        sub?: string;
        sub_slug?: string;
        departments?: string;
        main?: string;
        main_slug?: string;
    };
    readonly status: {
        state?: SignalContextReporter.state;
        state_display?: string;
    };
    readonly feedback: {
        is_satisfied?: boolean;
        submitted_at?: string;
    };
    readonly can_view_signal: boolean;
    readonly has_children: boolean;
};

export namespace SignalContextReporter {

    export enum state {
        M = 'm',
        I = 'i',
        B = 'b',
        H = 'h',
        INGEPLAND = 'ingepland',
        READY_TO_SEND = 'ready to send',
        O = 'o',
        A = 'a',
        REOPENED = 'reopened',
        S = 's',
        CLOSURE_REQUESTED = 'closure requested',
        REACTION_REQUESTED = 'reaction requested',
        REACTION_RECEIVED = 'reaction received',
        FORWARD_TO_EXTERNAL = 'forward to external',
    }


}

