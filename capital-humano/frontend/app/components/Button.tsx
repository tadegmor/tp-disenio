import type { ComponentProps } from "react";

type Variante = "primary" | "secondary" | "danger";

const ESTILOS: Record<Variante, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400 disabled:hover:bg-white",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variante;
};

export default function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:shadow-none ${ESTILOS[variant]} ${className}`}
      {...props}
    />
  );
}
