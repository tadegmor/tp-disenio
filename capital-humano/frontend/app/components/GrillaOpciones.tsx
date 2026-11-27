"use client";

import type { ItemOpcionDTO } from "../types";

interface GrillaOpcionesProps {
  items: ItemOpcionDTO[];
  onCambiarPonderacion: (itemId: number, valor: string) => void;
}

export default function GrillaOpciones({
  items,
  onCambiarPonderacion,
}: GrillaOpcionesProps) {
  const ordenados = [...items].sort((a, b) => a.orden - b.orden);
  const suma = ordenados.reduce(
    (acc, it) => acc + (typeof it.ponderacion === "number" ? it.ponderacion : 0),
    0,
  );

  return (
    <div className="mt-4">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="w-20 px-3 py-2.5 text-center">Orden</th>
              <th className="px-3 py-2.5">Descripción</th>
              <th className="w-36 px-3 py-2.5 text-center">Ponderación (*)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {ordenados.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2 text-center text-slate-600">
                  {item.orden}
                </td>
                <td className="px-3 py-2 font-medium text-slate-800">
                  {item.descripcion}
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step="any"
                    aria-label={`Ponderación para ${item.descripcion}`}
                    value={item.ponderacion ?? ""}
                    onChange={(e) =>
                      onCambiarPonderacion(item.id, e.target.value)
                    }
                    className="w-24 rounded-md border border-slate-300 px-2 py-1 text-center text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-right text-xs text-slate-500">
        Suma actual: <span className="font-semibold text-slate-700">{suma}</span> / 10
      </p>
    </div>
  );
}