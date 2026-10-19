import commonnNavigation from "./commonNavigation";
const adminNavigation = [
  ...commonnNavigation,
  { id: "crear-ejercicio", label: "Crear Ejercicio", mobileLabel: "Crear Ejercicio", icon: "edit", path: "/create/exercise" },
  { id: "admin", label: "Administración", icon: "shield", path: "/admin" },
];
export default adminNavigation;
 