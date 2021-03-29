
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    abstract me(): string | Promise<string>;
}

export class BlockInterface {
    index: number;
    data: JSON;
    nonce: number;
    timestamp: number;
    prevHash: string;
    difficulty: number;
}

export type JSON = any;
