import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
    AGENTPING_GENUI_SURFACE,
    GENUI_RUNTIME_SIDECAR_SCHEMA,
    parseGenUIPlaygroundBundle,
    parseGenUIRuntimeSidecar,
    toAgentPingHostEnvelope,
} from "../src/index.js";

const fixture = JSON.parse(
    readFileSync(new URL("../fixtures/openlang-playground-bundle.json", import.meta.url), "utf8"),
);

describe("@agentping/lev-genui", () => {
    it("converts an OpenLang playground bundle into an AgentPing host envelope", () => {
        const envelope = toAgentPingHostEnvelope(fixture);

        expect(envelope.kind).toBe("surface");
        expect(envelope.surface).toBe(AGENTPING_GENUI_SURFACE);
        expect(envelope.meta).toMatchObject({
            source: "local-host-envelope",
            provider: "lev-genui",
            componentName: "LevGenUIRuntimeSidecar",
            channel: "declaration-only",
        });
        expect(envelope.data.schema).toBe(GENUI_RUNTIME_SIDECAR_SCHEMA);
        expect(envelope.data.renderSpec?.meta).toMatchObject({
            title: "OpenLang GenUI Sidecar Playground",
        });
        expect(envelope.data.source).toContain("Query deployments");
        expect(envelope.data.benchmark?.token_method).toBe("ceil(bytes / 4)");
        expect(envelope.data.diagnostics).toEqual([]);
    });

    it("converts a sidecar-only payload without bundle fields", () => {
        const runtime = parseGenUIRuntimeSidecar(fixture.runtime);
        const envelope = toAgentPingHostEnvelope(runtime);

        expect(envelope.data.runtime).toEqual(runtime);
        expect(envelope.data.renderSpec).toBeUndefined();
        expect(envelope.data.source).toBeUndefined();
        expect(envelope.data.declarationCount).toBe(3);
        expect(envelope.data.declarationKinds).toEqual(["state", "query", "mutation"]);
    });

    it("rejects a payload with the wrong sidecar schema", () => {
        expect(() => parseGenUIRuntimeSidecar({
            ...fixture.runtime,
            schema: "lev.openlang.runtime.v0",
        })).toThrow(/runtime.schema/);
    });

    it("preserves FlowMind/Poly routing and AgentPing ownership metadata", () => {
        const bundle = parseGenUIPlaygroundBundle(fixture);
        const envelope = toAgentPingHostEnvelope(bundle);
        const query = envelope.data.runtime.declarations.find((declaration) => declaration.kind === "query");
        const mutation = envelope.data.runtime.declarations.find((declaration) => declaration.kind === "mutation");

        expect(envelope.data.runtime.owners.router).toBe("FlowMind/Poly");
        expect(envelope.data.runtime.owners.interactionHost).toBe("AgentPing");
        expect(query?.route?.owner).toBe("FlowMind/Poly");
        expect(mutation?.route?.owner).toBe("FlowMind/Poly");
        expect(mutation?.confirm).toBe(true);
        expect(mutation?.guard).toBe("approval.required");
        expect(envelope.data.agentPing?.production_owner).toBe("AgentPing");
    });
});
