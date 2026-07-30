export type MatterStatus = "opened" | "in_progress" | "awaiting_client" | "closed";

export type Matter = {
  id: string;
  client_id: string;
  staff_id: string | null;
  reference: string;
  title: string;
  status: MatterStatus;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABELS: Record<MatterStatus, string> = {
  opened: "Opened",
  in_progress: "In Progress",
  awaiting_client: "Awaiting Client",
  closed: "Closed",
};
