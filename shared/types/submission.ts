import type { WizardData } from "./wizard";

export enum SubmissionStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}
export interface Submission extends WizardData {
  submittedAt: Date;
  status: SubmissionStatus;
}
