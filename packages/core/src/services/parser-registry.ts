/**
 * ParserRegistry - Interaction Parser Management
 *
 * Manages parsers sorted by priority. Implements IParserRegistry
 * from ports/parser.ts.
 */

import type { Ping, ParsedInteraction } from '../domain/ping.js';
import type { IInteractionParser, IParserRegistry } from '../ports/parser.js';

// ============================================================================
// ParserRegistry Implementation
// ============================================================================

export class ParserRegistry implements IParserRegistry {
    private readonly parsers: IInteractionParser[];

    constructor(parsers: IInteractionParser[] = []) {
        this.parsers = [...parsers].sort((a, b) => b.priority - a.priority);
    }

    /**
     * Register a new parser and re-sort by priority.
     */
    register(parser: IInteractionParser): void {
        this.parsers.push(parser);
        this.parsers.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Unregister a parser by name.
     */
    unregister(name: string): void {
        const index = this.parsers.findIndex((p) => p.name === name);
        if (index !== -1) {
            this.parsers.splice(index, 1);
        }
    }

    /**
     * Get all registered parsers (returns a copy).
     */
    getAll(): IInteractionParser[] {
        return [...this.parsers];
    }

    /**
     * Find the highest-priority parser that can handle the ping and
     * return the parsed interaction, or null if no parser matches.
     */
    parse(ping: Ping): ParsedInteraction | null {
        const parser = this.parsers.find((p) => p.canParse(ping));
        if (parser) {
            return parser.parse(ping);
        }
        return null;
    }
}
