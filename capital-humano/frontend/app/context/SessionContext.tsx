"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RolUsuario, SesionMiniLogin } from "@/app/types";

// v2: el candidato ingresa con su número de candidato (las sesiones v1 guardaban el id)
const STORAGE_KEY = "capital_humano_mini_sesion_v2";

interface SessionContextValue {
  sesion: SesionMiniLogin | null;
  listo: boolean;
  ingresarComoConsultor: (nombre?: string) => void;
  ingresarComoCandidato: (numeroCandidato: string, nombre: string) => void;
  cerrarSesion: () => void;
  tieneRol: (roles: RolUsuario[]) => boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<SesionMiniLogin | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSesion(JSON.parse(raw) as SesionMiniLogin);
      }
    } catch {
      setSesion(null);
    } finally {
      setListo(true);
    }
  }, []);

  const persistir = useCallback((nueva: SesionMiniLogin | null) => {
    setSesion(nueva);
    try {
      if (nueva) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nueva));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de almacenamiento privado
    }
  }, []);

  const ingresarComoConsultor = useCallback(
    (nombre = "Pedro Martínez") => {
      persistir({
        rol: "CONSULTOR",
        nombre: nombre.trim() || "Pedro Martínez",
      });
    },
    [persistir]
  );

  const ingresarComoCandidato = useCallback(
    (numeroCandidato: string, nombre: string) => {
      const limpio = numeroCandidato.trim();
      persistir({
        rol: "CANDIDATO",
        numeroCandidato: limpio,
        nombre: nombre.trim(),
      });
    },
    [persistir]
  );

  const cerrarSesion = useCallback(() => {
    persistir(null);
  }, [persistir]);

  const tieneRol = useCallback(
    (roles: RolUsuario[]) => (sesion ? roles.includes(sesion.rol) : false),
    [sesion]
  );

  const value = useMemo(
    () => ({
      sesion,
      listo,
      ingresarComoConsultor,
      ingresarComoCandidato,
      cerrarSesion,
      tieneRol,
    }),
    [sesion, listo, ingresarComoConsultor, ingresarComoCandidato, cerrarSesion, tieneRol]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }
  return ctx;
}