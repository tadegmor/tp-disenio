"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CandidatoDTO, PuestoDTO, CuestionarioDTO } from "@/app/types/evaluacion";

export default function EvaluarCandidatosPage() {
  const router = useRouter();
  const [paso, setPaso] = useState<number>(1);

  // Estados de búsqueda
  const [filtros, setFiltros] = useState({ apellido: "", nombre: "", numeroCandidato: "" });
  const [resultados, setResultados] = useState<CandidatoDTO[]>([]);
  const [seleccionados, setSeleccionados] = useState<CandidatoDTO[]>([]);
  const [candidatosActivosError, setCandidatosActivosError] = useState<string[]>([]);

  // Estados de puesto y evaluación
  const [puestos, setPuestos] = useState<PuestoDTO[]>([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState<PuestoDTO | null>(null);
  const [errorValidacionCompetencias, setErrorValidacionCompetencias] = useState<string[]>([]);
  
  // Resultados finales con claves
  const [cuestionariosGenerados, setCuestionariosGenerados] = useState<CuestionarioDTO[]>([]);
  const [nombreArchivoExport, setNombreArchivoExport] = useState<string>("");
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const buscarCandidatos = async () => {
    try {
      const query = new URLSearchParams(filtros as any).toString();
      const res = await fetch(`http://localhost:8080/api/evaluaciones/candidatos?${query}`);
      const data = await res.json();
      setResultados(data);
      setPaso(2);
    } catch (err) {
      setMensajeError("Error al conectar con el servidor.");
    }
  };

  const avanzarAPasoSiguiente = async () => {
    if (seleccionados.length === 0) {
      setMensajeError("Debe seleccionar uno o más candidatos.");
      return;
    }
    setMensajeError(null);

    // Validar cuestionarios activos (Paso 6.A)
    const ids = seleccionados.map(c => c.id);
    const res = await fetch("http://localhost:8080/api/evaluaciones/verificar-activos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });
    const activos: CandidatoDTO[] = await res.json();

    if (activos.length > 0) {
      setCandidatosActivosError(activos.map(c => `${c.apellido} ${c.nombre}`));
      setPaso(2.5); // Pantalla de error cuestionario activo
      return;
    }

  try {
    const resPuestos = await fetch("http://localhost:8080/api/puestos");
    if (resPuestos.ok) {
     const data = await resPuestos.json();
      // Guardamos los puestos reales que vienen del backend (ej: "Desarrollador Java Senior")
      setPuestos(data); 
    } else {
      console.error("Error al obtener los puestos del servidor");
    }
  } catch (error) {
    console.error("Fallo de red al conectar con el backend:", error);
  }

    setPaso(3);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-xl font-bold text-slate-800">CU025 · Evaluar a Candidato</h1>
        <button onClick={() => router.push("/")} className="rounded bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">
          Salir
        </button>
      </div>

      {mensajeError && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {mensajeError}
        </div>
      )}

      {/* PASO 1: BÚSQUEDA */}
      {paso === 1 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Búsqueda de Candidatos</h2>
          <div className="grid gap-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-slate-600">Apellido</label>
              <input type="text" className="w-only mt-1 rounded border px-3 py-2 text-sm w-full"
                value={filtros.apellido} onChange={e => setFiltros({...filtros, apellido: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Nombre</label>
              <input type="text" className="mt-1 rounded border px-3 py-2 text-sm w-full"
                value={filtros.nombre} onChange={e => setFiltros({...filtros, nombre: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Número de Candidato</label>
              <input type="text" className="mt-1 rounded border px-3 py-2 text-sm w-full"
                value={filtros.numeroCandidato} onChange={e => setFiltros({...filtros, numeroCandidato: e.target.value})} />
            </div>
            <button onClick={buscarCandidatos} className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: RESULTADOS Y SELECCIÓN */}
      {paso === 2 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Resultados de Búsqueda</h2>
          <table className="w-full text-left text-sm mb-4 border-collapse">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-2">Sel</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Nro. Candidato</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(c => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="p-2">
                    <input type="checkbox" onChange={e => {
                      if(e.target.checked) setSeleccionados([...seleccionados, c]);
                      else setSeleccionados(seleccionados.filter(item => item.id !== c.id));
                    }} />
                  </td>
                  <td className="p-2">{c.apellido}</td>
                  <td className="p-2">{c.nombre}</td>
                  <td className="p-2">{c.numeroCandidato}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={avanzarAPasoSiguiente} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Agregar / Siguiente
          </button>
        </div>
      )}

      {/* PASO 2.5: ERROR CUESTIONARIO ACTIVO */}
      {paso === 2.5 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-center">
          <h2 className="text-lg font-bold text-amber-800">Cuestionario Activo Detectado</h2>
          <p className="mt-2 text-sm text-amber-700">
            Los siguientes candidatos poseen un cuestionario activo o en proceso y no pueden ser evaluados nuevamente:
          </p>
          <ul className="my-3 font-semibold text-slate-800">
            {candidatosActivosError.map((nombre, idx) => <li key={idx}>* {nombre}</li>)}
          </ul>
          <button onClick={() => setPaso(2)} className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
            Aceptar
          </button>
        </div>
      )}

      {/* PASO 3: SELECCIÓN DE PUESTO */}
      {paso === 3 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Seleccionar Puesto para la Evaluación</h2>
          <div className="grid gap-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Puesto disponible</label>
              <select 
                className="w-full rounded border px-3 py-2 text-sm"
                onChange={e => {
                  const seleccionado = puestos.find(p => p.id === Number(e.target.value));
                  setPuestoSeleccionado(seleccionado || null);
                }}
                defaultValue=""
              >
                <option value="" disabled>Seleccione un puesto...</option>
                {puestos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.empresa}) - Código: {p.codigo}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => {
                if (!puestoSeleccionado) {
                  setMensajeError("Debe seleccionar un puesto.");
                  return;
                }
                setMensajeError(null);
                alert(`Puesto seleccionado: ${puestoSeleccionado.nombre}. ¡Listo para generar evaluación!`);
                // Aquí podés avanzar al siguiente paso de generación (paso 4)
              }} 
              className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Confirmar Puesto / Generar Evaluación
            </button>
          </div>
        </div>
      )}
      
    </main>
  );
}