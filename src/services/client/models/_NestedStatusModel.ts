/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BlankEnum } from './BlankEnum';
import type { NullEnum } from './NullEnum';
import type { State187Enum } from './State187Enum';
import type { TargetApiEnum } from './TargetApiEnum';

export type _NestedStatusModel = {
    text?: string | null;
    readonly user: string | null;
    /**
     * Melding status
     *
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
    state?: (State187Enum | BlankEnum);
    readonly state_display: string;
    target_api?: (TargetApiEnum | BlankEnum | NullEnum) | null;
    extra_properties?: Record<string, any> | null;
    send_email?: boolean;
    readonly created_at: string;
    email_override?: string | null;
};

