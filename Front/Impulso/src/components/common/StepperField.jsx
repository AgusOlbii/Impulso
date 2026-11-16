function StepperField({ value, onStep, onChange, label, decimal = false }) {
  return (
    <span className="stepper">
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(-1)}
        aria-label={`Reducir ${label}`}
      >
        −
      </button>
      <input
        type="number"
        min="0"
        step={decimal ? "any" : "1"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      />
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(1)}
        aria-label={`Aumentar ${label}`}
      >
        +
      </button>
    </span>
  );
}

export function parseStepperValue(raw, { decimal = false } = {}) {
  if (raw === "") return "";
  const parsed = Number(String(raw).replace(",", "."));
  if (!Number.isFinite(parsed)) return "";
  const next = decimal ? parsed : Math.trunc(parsed);
  return Math.max(0, next);
}

export function stepperNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default StepperField;
