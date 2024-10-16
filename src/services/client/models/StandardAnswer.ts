/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StandardAnswer = {
    is_satisfied?: boolean;
    text: string;
    readonly topic: string;
    /**
     * Als deze optie is aangevinkt, dan wordt er een open antwoord verwacht van de melder en is de opgegeven text een default waarde.
     */
    open_answer?: boolean;
};

