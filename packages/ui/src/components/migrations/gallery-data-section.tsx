"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { AdvancedDataGrid } from "./advanced-data-grid";
import { JsonTreeViewer } from "./json-tree-viewer";
import { SqlResultTable } from "./sql-result-table";
import { CsvPreview } from "./csv-preview";
import { SchemaGraph } from "./schema-graph";
import { KeyValueStore } from "./key-value-store";
import { HexDumpView } from "./hex-dump-view";
import { DataPipeline } from "./data-pipeline";

export interface GalleryDataSectionProps {
  className?: string;
}

export function GalleryDataSection({ className }: GalleryDataSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Data Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="AdvancedDataGrid">
          <AdvancedDataGrid
            title="Agents"
            columns={[
              { key: "name", label: "Name" },
              { key: "status", label: "Status" },
              { key: "tasks", label: "Tasks" },
            ]}
            data={[
              { name: "Alpha", status: "active", tasks: "12" },
              { name: "Beta", status: "idle", tasks: "7" },
              { name: "Gamma", status: "active", tasks: "23" },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="JsonTreeViewer">
          <JsonTreeViewer
            title="Config"
            data={{
              agent: { name: "Alpha", version: "2.1" },
              models: ["opus", "sonnet"],
              enabled: true,
              maxTokens: 128000,
            }}
          />
        </GalleryCard>

        <GalleryCard name="SqlResultTable">
          <SqlResultTable
            query="SELECT id, name, status FROM agents LIMIT 3;"
            columns={["id", "name", "status"]}
            rows={[
              ["1", "Alpha", "active"],
              ["2", "Beta", "idle"],
              ["3", "Gamma", "active"],
            ]}
            executionTime="12ms"
          />
        </GalleryCard>

        <GalleryCard name="CsvPreview">
          <CsvPreview
            filename="agents.csv"
            headers={["Name", "Role", "Score"]}
            rows={[
              ["Alpha", "Analyst", "94"],
              ["Beta", "Engineer", "87"],
              ["Gamma", "Researcher", "91"],
            ]}
          />
        </GalleryCard>

        <GalleryCard name="SchemaGraph">
          <SchemaGraph
            width={280}
            height={140}
            nodes={[
              { id: "agent", name: "Agent", fields: [{ name: "id", type: "uuid" }], x: 70, y: 70 },
              { id: "task", name: "Task", fields: [{ name: "agent_id", type: "fk" }], x: 210, y: 70 },
            ]}
            relations={[{ from: "agent", to: "task", type: "one-to-many" }]}
          />
        </GalleryCard>

        <GalleryCard name="KeyValueStore">
          <KeyValueStore
            entries={[
              { key: "session.id", value: "a3f9c2", type: "string" },
              { key: "retry.count", value: "3", type: "number" },
              { key: "debug.mode", value: "true", type: "boolean" },
            ]}
          />
        </GalleryCard>

        <GalleryCard name="HexDumpView">
          <HexDumpView
            data={[72, 101, 108, 108, 111, 32, 76, 101, 118, 105, 97, 116, 104, 97, 110, 33]}
            bytesPerRow={8}
          />
        </GalleryCard>

        <GalleryCard name="DataPipeline">
          <DataPipeline
            stages={[
              { id: "ingest", name: "Ingest", status: "success", throughput: "1.2k/s" },
              { id: "transform", name: "Transform", status: "running", throughput: "800/s" },
              { id: "load", name: "Load", status: "idle" },
            ]}
          />
        </GalleryCard>
      </div>
    </div>
  );
}
