/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * * `m` - Gemeld
 * * `i` - In afwachting van behandeling
 * * `b` - In behandeling
 * * `h` - On hold
 * * `ingepland` - Ingepland
 * * `ready to send` - Extern: te verzenden
 * * `o` - Afgehandeld
 * * `a` - Geannuleerd
 * * `reopened` - Heropend
 * * `s` - Gesplitst
 * * `closure requested` - Extern: verzoek tot afhandeling
 * * `reaction requested` - Reactie gevraagd
 * * `reaction received` - Reactie ontvangen
 * * `forward to external` - Doorgezet naar extern
 * * `sent` - Extern: verzonden
 * * `send failed` - Extern: mislukt
 * * `done external` - Extern: afgehandeld
 * * `reopen requested` - Verzoek tot heropenen
 */
export enum State187Enum {
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
    SENT = 'sent',
    SEND_FAILED = 'send failed',
    DONE_EXTERNAL = 'done external',
    REOPEN_REQUESTED = 'reopen requested',
}
