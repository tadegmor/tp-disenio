import type { RolUsuario } from "@/app/types";

export interface NavItem {
  href: string;
  label: string;
  codigo?: string;
  description?: string;
  roles?: RolUsuario[];
}

// Para sumar un caso de uso al menú alcanza con agregar un objeto a este arreglo:
// el Navbar y las tarjetas de Inicio se generan a partir de él.

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    description: "Menú Principal del Sistema de C@pital Humano.",
    roles: ["CONSULTOR"],
  },
  {
    href: "/preguntas",
    label: "Gestionar Preguntas",
    codigo: "CU020",
    description: "Buscar, crear, modificar o eliminar preguntas del sistema.",
    roles: ["CONSULTOR"],
  },
  {
    href: "/evaluaciones/nuevo",
    label: "Evaluar Candidatos",
    codigo: "CU025",
    description:
      "Evaluar candidatos en un puesto: genera los cuestionarios y las claves de ingreso.",
    roles: ["CONSULTOR"],
  },
  {
    href: "/cuestionario",
    label: "Completar Cuestionario",
    codigo: "CU026",
    description: "El candidato responde, por bloques, el cuestionario que le fue asignado.",
    roles: ["CANDIDATO"],
  },
  {
    href: "/orden-merito",
    codigo: "CU028",
    label: "Emitir Orden de Mérito",
    description:
      "Consultar puestos evaluados y emitir el ranking de candidatos por orden de mérito.",
    roles: ["CONSULTOR"],
  },
];

// Valor por defecto del consultor para el mini login
export const CONSULTOR_POR_DEFECTO = "Pedro Martínez";
