/**
 * IInteractionParser - Parser Port
 * 
 * Turns ping payloads into UI hints. Parsers analyze structured payloads
 * and produce ParsedInteraction objects that tell UIs how to render.
 */

import type { Ping, ParsedInteraction } from '../domain/ping.js';

export interface IInteractionParser {
    /**
     * Unique name of this parser
     */
    readonly name: string;

    /**
     * Priority - higher values are tried first
     * Default parsers use 1-50, custom parsers should use 51+
     */
    readonly priority: number;

    /**
     * Check if this parser can handle the given ping
     */
    canParse(ping: Ping): boolean;

    /**
     * Parse the ping and produce interaction hints
     */
    parse(ping: Ping): ParsedInteraction;
}

/**
 * Parser registry for managing and running parsers
 */
export interface IParserRegistry {
    /**
     * Register a new parser
     */
    register(parser: IInteractionParser): void;

    /**
     * Unregister a parser by name
     */
    unregister(name: string): void;

    /**
     * Get all registered parsers
     */
    getAll(): IInteractionParser[];

    /**
     * Find and run the best parser for a ping
     */
    parse(ping: Ping): ParsedInteraction | null;
}
