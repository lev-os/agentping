export const GENUI_RUNTIME_SIDECAR_SCHEMA = "lev.genui.runtime_sidecar.v0";
export const OPENLANG_PLAYGROUND_BUNDLE_SCHEMA = "lev.openlang.playground_bundle.v0";
export const AGENTPING_GENUI_SURFACE = "lev-genui-runtime-sidecar";

export interface GenUIRuntimeDeclaration {
    kind: "state" | "query" | "mutation" | string;
    id: string;
    statementId?: string;
    capability?: string;
    inputs?: Record<string, unknown>;
    output?: string;
    cache?: string;
    effect?: string;
    confirm?: boolean;
    guard?: string;
    route?: {
        owner: string;
        capability?: string;
        [key: string]: unknown;
    };
    source?: {
        line?: number;
        column?: number;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface GenUIRuntimeSidecar {
    schema: typeof GENUI_RUNTIME_SIDECAR_SCHEMA;
    source?: Record<string, unknown>;
    owners: {
        compiler?: string;
        router: string;
        interactionHost: string;
        [key: string]: unknown;
    };
    mode: "declaration_only";
    declarations: GenUIRuntimeDeclaration[];
    bindings?: unknown[];
    policy?: {
        forbidden?: string[];
        requiredGuards?: string[];
        [key: string]: unknown;
    };
    compatibility?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface GenUIPlaygroundBundle {
    schema: typeof OPENLANG_PLAYGROUND_BUNDLE_SCHEMA | string;
    source?: string;
    sourcePath?: string;
    renderedHtmlPath?: string;
    paths?: Record<string, unknown>;
    hashes?: Record<string, unknown>;
    renderSpec?: Record<string, unknown>;
    runtime: GenUIRuntimeSidecar;
    sourceMap?: unknown;
    diagnostics?: unknown[];
    benchmark?: Record<string, unknown>;
    agentPing?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface AgentPingGenUIHostEnvelope {
    kind: "surface";
    surface: typeof AGENTPING_GENUI_SURFACE;
    title?: string;
    meta: {
        source: "local-host-envelope";
        provider: "lev-genui";
        componentName: "LevGenUIRuntimeSidecar";
        channel: "declaration-only";
        variant: "declaration_only";
    };
    data: {
        schema: typeof GENUI_RUNTIME_SIDECAR_SCHEMA;
        runtime: GenUIRuntimeSidecar;
        declarationCount: number;
        declarationKinds: string[];
        source?: string;
        sourcePath?: string;
        renderedHtmlPath?: string;
        paths?: Record<string, unknown>;
        hashes?: Record<string, unknown>;
        renderSpec?: Record<string, unknown>;
        sourceMap?: unknown;
        diagnostics?: unknown[];
        benchmark?: Record<string, unknown>;
        agentPing?: Record<string, unknown>;
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
    if (!isRecord(value)) {
        throw new TypeError(`${label} must be an object`);
    }
    return value;
}

function requireString(value: unknown, label: string): string {
    if (typeof value !== "string" || !value.trim()) {
        throw new TypeError(`${label} must be a non-empty string`);
    }
    return value;
}

function optionalString(value: unknown, label: string): string | undefined {
    if (value === undefined) return undefined;
    return requireString(value, label);
}

function parseDeclaration(value: unknown, index: number): GenUIRuntimeDeclaration {
    const declaration = requireRecord(value, `runtime.declarations[${index}]`);
    const kind = requireString(declaration.kind, `runtime.declarations[${index}].kind`);
    const id = requireString(declaration.id, `runtime.declarations[${index}].id`);

    if (declaration.route !== undefined) {
        const route = requireRecord(declaration.route, `runtime.declarations[${index}].route`);
        requireString(route.owner, `runtime.declarations[${index}].route.owner`);
    }

    return {
        ...declaration,
        kind,
        id,
        statementId: optionalString(declaration.statementId, `runtime.declarations[${index}].statementId`),
        capability: optionalString(declaration.capability, `runtime.declarations[${index}].capability`),
        output: optionalString(declaration.output, `runtime.declarations[${index}].output`),
        cache: optionalString(declaration.cache, `runtime.declarations[${index}].cache`),
        effect: optionalString(declaration.effect, `runtime.declarations[${index}].effect`),
        guard: optionalString(declaration.guard, `runtime.declarations[${index}].guard`),
    };
}

export function parseGenUIRuntimeSidecar(value: unknown): GenUIRuntimeSidecar {
    const runtime = requireRecord(value, "runtime");
    if (runtime.schema !== GENUI_RUNTIME_SIDECAR_SCHEMA) {
        throw new TypeError(`runtime.schema must be ${GENUI_RUNTIME_SIDECAR_SCHEMA}`);
    }

    const owners = requireRecord(runtime.owners, "runtime.owners");
    const router = requireString(owners.router, "runtime.owners.router");
    const interactionHost = requireString(owners.interactionHost, "runtime.owners.interactionHost");

    if (runtime.mode !== "declaration_only") {
        throw new TypeError("runtime.mode must be declaration_only");
    }
    if (!Array.isArray(runtime.declarations)) {
        throw new TypeError("runtime.declarations must be an array");
    }

    return {
        ...runtime,
        schema: GENUI_RUNTIME_SIDECAR_SCHEMA,
        owners: {
            ...owners,
            compiler: optionalString(owners.compiler, "runtime.owners.compiler"),
            router,
            interactionHost,
        },
        mode: "declaration_only",
        declarations: runtime.declarations.map(parseDeclaration),
        bindings: Array.isArray(runtime.bindings) ? runtime.bindings : undefined,
        policy: isRecord(runtime.policy) ? runtime.policy : undefined,
        compatibility: isRecord(runtime.compatibility) ? runtime.compatibility : undefined,
    };
}

export function parseGenUIPlaygroundBundle(value: unknown): GenUIPlaygroundBundle {
    const bundle = requireRecord(value, "bundle");
    requireString(bundle.schema, "bundle.schema");
    const runtime = parseGenUIRuntimeSidecar(bundle.runtime);

    return {
        ...bundle,
        schema: String(bundle.schema),
        source: optionalString(bundle.source, "bundle.source"),
        sourcePath: optionalString(bundle.sourcePath, "bundle.sourcePath"),
        renderedHtmlPath: optionalString(bundle.renderedHtmlPath, "bundle.renderedHtmlPath"),
        paths: isRecord(bundle.paths) ? bundle.paths : undefined,
        hashes: isRecord(bundle.hashes) ? bundle.hashes : undefined,
        renderSpec: isRecord(bundle.renderSpec) ? bundle.renderSpec : undefined,
        runtime,
        diagnostics: Array.isArray(bundle.diagnostics) ? bundle.diagnostics : undefined,
        benchmark: isRecord(bundle.benchmark) ? bundle.benchmark : undefined,
        agentPing: isRecord(bundle.agentPing) ? bundle.agentPing : undefined,
    };
}

function isRuntimeSidecar(value: unknown): boolean {
    return isRecord(value) && value.schema === GENUI_RUNTIME_SIDECAR_SCHEMA;
}

function titleFromBundle(bundle: GenUIPlaygroundBundle | undefined): string {
    const meta = isRecord(bundle?.renderSpec?.meta) ? bundle?.renderSpec?.meta : undefined;
    return typeof meta?.title === "string" ? meta.title : "GenUI Runtime Sidecar";
}

function compact<T extends Record<string, unknown>>(value: T): T {
    return Object.fromEntries(
        Object.entries(value).filter(([, entry]) => entry !== undefined),
    ) as T;
}

export function toAgentPingHostEnvelope(input: unknown): AgentPingGenUIHostEnvelope {
    const bundle = isRuntimeSidecar(input) ? undefined : parseGenUIPlaygroundBundle(input);
    const runtime = bundle ? bundle.runtime : parseGenUIRuntimeSidecar(input);
    const declarationKinds = [...new Set(runtime.declarations.map((declaration) => declaration.kind))];

    return {
        kind: "surface",
        surface: AGENTPING_GENUI_SURFACE,
        title: titleFromBundle(bundle),
        meta: {
            source: "local-host-envelope",
            provider: "lev-genui",
            componentName: "LevGenUIRuntimeSidecar",
            channel: "declaration-only",
            variant: "declaration_only",
        },
        data: compact({
            schema: GENUI_RUNTIME_SIDECAR_SCHEMA,
            runtime,
            declarationCount: runtime.declarations.length,
            declarationKinds,
            source: bundle?.source,
            sourcePath: bundle?.sourcePath,
            renderedHtmlPath: bundle?.renderedHtmlPath,
            paths: bundle?.paths,
            hashes: bundle?.hashes,
            renderSpec: bundle?.renderSpec,
            sourceMap: bundle?.sourceMap,
            diagnostics: bundle?.diagnostics ?? [],
            benchmark: bundle?.benchmark,
            agentPing: bundle?.agentPing,
        }),
    };
}
