import { crypto } from "crypto";

export function createDraftId() {
  return crypto.randomUUID();
}
