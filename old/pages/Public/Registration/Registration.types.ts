export type ContinueHandler = () => void;

export interface RegistrationStepProps {
  onContinue: ContinueHandler;
}

export interface Step {
  label: string;
  path: string;
  component: React.FC;
}
