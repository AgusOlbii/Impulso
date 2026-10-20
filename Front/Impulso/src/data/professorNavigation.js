import commonnNavigation from "./commonNavigation";

const professorNavigation = [
    ...commonnNavigation,
    { id: "crear-rutina", label: "Crear Rutina", mobileLabel: "Crear", icon: "plus", path: "/create/routine" },
    { id: "panel-profesor", label: "Soy profesor", icon: "user", path: "/panel/profesor" },
];
export default professorNavigation;
 