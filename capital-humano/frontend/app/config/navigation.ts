export interface NavItem{
    href: string;
    label: string;
    codigo?: string;
    description?: string;
}

//Para sumar un caso de uso al menú alcanza con agregar un objeto a este arreglo:
//el Navbar y las tarjetas de Inicio se generan a partir de él.

export const NAV_ITEMS: NavItem[] = [
    {
        href: "/",
        label: "Inicio",
        description: "Menú Principal del Sistema de C@pital Humano.",
    },
    {
        href: "/preguntas",
        label: "Gestionar Preguntas",
        codigo: "CU020",
        description: "Buscar, crear, modificar o eliminar preguntas del sistema.",
    },
    {
        href: "/evaluaciones/nuevo",
        label: "Evaluar Candidatos",
        codigo: "CU025",
        description: "Evaluar candidatos en un puesto: genera los cuestionarios y las claves de ingreso.",
    },
];

//Provisiorio hasta integrar la autenticación (CU001)
export const USUARIO_ACTUAL = "Pedro Martínez";


