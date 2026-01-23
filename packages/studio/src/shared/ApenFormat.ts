/**
 * AgentPing Enhanced (.apen) File Format
 * 
 * Open, JSON-based design file format that lives in your git repo.
 */

export interface ApenDocument {
    version: '1.0.0';
    meta: ApenMeta;
    pages: ApenPage[];
    assets: ApenAsset[];
    agentHistory: AgentConversation[];
}

export interface ApenMeta {
    name: string;
    created: string; // ISO date
    modified: string; // ISO date
    author?: string;
    description?: string;
}

export interface ApenPage {
    id: string;
    name: string;
    width: number;
    height: number;
    backgroundColor: string;
    objects: ApenObject[];
}

export type ApenObject =
    | ApenRectangle
    | ApenEllipse
    | ApenText
    | ApenPath
    | ApenGroup
    | ApenComponent;

interface ApenBaseObject {
    id: string;
    type: string;
    name?: string;
    x: number;
    y: number;
    rotation: number;
    opacity: number;
    locked: boolean;
    visible: boolean;
}

export interface ApenRectangle extends ApenBaseObject {
    type: 'rectangle';
    width: number;
    height: number;
    cornerRadius: number;
    fill: ApenFill;
    stroke: ApenStroke;
}

export interface ApenEllipse extends ApenBaseObject {
    type: 'ellipse';
    radiusX: number;
    radiusY: number;
    fill: ApenFill;
    stroke: ApenStroke;
}

export interface ApenText extends ApenBaseObject {
    type: 'text';
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    fill: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
}

export interface ApenPath extends ApenBaseObject {
    type: 'path';
    pathData: string; // SVG path data
    fill: ApenFill;
    stroke: ApenStroke;
}

export interface ApenGroup extends ApenBaseObject {
    type: 'group';
    children: ApenObject[];
}

export interface ApenComponent extends ApenBaseObject {
    type: 'component';
    componentId: string;
    overrides: Record<string, unknown>;
}

export interface ApenFill {
    type: 'solid' | 'gradient' | 'none';
    color?: string;
    gradient?: {
        type: 'linear' | 'radial';
        stops: { offset: number; color: string }[];
        angle?: number;
    };
}

export interface ApenStroke {
    color: string;
    width: number;
    dashArray?: number[];
}

export interface ApenAsset {
    id: string;
    name: string;
    type: 'image' | 'font' | 'component';
    data: string; // Base64 or reference
}

export interface AgentConversation {
    id: string;
    agentId: string;
    startedAt: string;
    messages: AgentMessage[];
}

export interface AgentMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

// ============================================================================
// File Operations
// ============================================================================

export function createEmptyDocument(name: string = 'Untitled'): ApenDocument {
    const now = new Date().toISOString();
    return {
        version: '1.0.0',
        meta: {
            name,
            created: now,
            modified: now,
        },
        pages: [
            {
                id: 'page-1',
                name: 'Page 1',
                width: 1440,
                height: 900,
                backgroundColor: '#1a1a24',
                objects: [],
            },
        ],
        assets: [],
        agentHistory: [],
    };
}

export function serializeDocument(doc: ApenDocument): string {
    return JSON.stringify(doc, null, 2);
}

export function parseDocument(json: string): ApenDocument {
    const doc = JSON.parse(json) as ApenDocument;
    // TODO: Validate schema
    return doc;
}
