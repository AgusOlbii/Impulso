export function asNumber(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

export function studentChangeLines(exercise) {
  const checks = [
    { label: "las series", from: exercise.target_sets, to: exercise.actual_sets, unit: "" },
    { label: "las repeticiones", from: exercise.target_reps, to: exercise.actual_reps, unit: "" },
    { label: "el peso", from: exercise.target_weight, to: exercise.actual_weight, unit: " kg" },
  ];
  return checks.flatMap((item) => {
    const from = asNumber(item.from);
    const to = asNumber(item.to);
    if (to == null || from == null || to === from) return [];
    const verb = to < from ? "bajó" : "subió";
    return [`El alumno ${verb} ${item.label} de ${from}${item.unit} a ${to}${item.unit}`];
  });
}

export function assignedLabel(exercise) {
  const sets = asNumber(exercise.target_sets) ?? 0;
  const reps = asNumber(exercise.target_reps) ?? 0;
  const weight = asNumber(exercise.target_weight) ?? 0;
  return `${sets} series · ${reps} repe${reps === 1 ? "" : "s"} · ${weight} kg`;
}
