export type GateStatus = "pass" | "fail" | "shell" | "hollow" | "needs-review";
export type Classification = "REAL" | "RE-EXPORT" | "SHELL" | "HOLLOW" | "UNKNOWN";
export type Domain = "webui" | "studio" | "canvas" | "dm-ui" | "shared";

export interface ComponentMeta {
  id: string;
  name: string;
  family: string;
  domain: Domain;
  lanes: string[];
  beadId: string;
  storyPath: string;
  gateStatus: GateStatus;
  classification: Classification;
  markers: string[];
  ownerNotes?: string;
}

export interface ReviewPageProps {
  title: string;
  category: string;
  description?: string;
  components: ComponentMeta[];
}

export interface CompareLane {
  id: string;
  label: string;
  variant: "agentping" | "sophia" | "combined";
}
