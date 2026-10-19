import commonnNavigation from "./commonNavigation";

const studentNavigation = [
  ...commonnNavigation,
  { id: "rutina", label: "Mi rutina", icon: "dumbbell", path: "/rutina" },
  { id: "postular-profesor", label: "Quiero ser Profesor", icon: "user", path: "/postular/profesor" },
  
];
export default studentNavigation; 
