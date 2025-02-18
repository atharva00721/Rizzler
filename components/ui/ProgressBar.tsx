interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  );
}
