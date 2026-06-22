import { SubmissionStatus } from "#shared/enums";

// since the SubmissionStatus enum needs to be imported, declare global is needed to put the interface back into the global scope.
declare global {
  interface Submission extends WizardData {
    submittedAt: Date;
    status: SubmissionStatus;
  }
}

export {};
