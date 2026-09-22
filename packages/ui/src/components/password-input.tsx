"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Input, type InputProps } from "./input";
import { focusRing, transitionBase } from "../lib/states";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /** Oculta el botón de mostrar/ocultar. */
  hideToggle?: boolean;
}

/**
 * Campo de contraseña con alternancia de visibilidad.
 *
 * Por qué existe el ojito: obligar a escribir a ciegas es una de las causas
 * más comunes de error en un login, sobre todo en móvil. Poder verificar lo
 * que se escribió reduce intentos fallidos.
 *
 * Detalles que importan:
 * - El botón es `type="button"`. Sin eso, dentro de un `<form>` enviaría el
 *   formulario al hacer clic — un bug clásico y muy molesto.
 * - `tabIndex={-1}`: el ojito queda fuera del recorrido de Tab. Quien navega
 *   con teclado espera pasar de contraseña directo al botón de enviar, no
 *   tropezar con un control decorativo en el medio. Sigue siendo accesible con
 *   el mouse y por lector de pantalla.
 * - El padding derecho deja lugar al botón para que el texto nunca pase por
 *   debajo del icono.
 */
function PasswordInput({
  className,
  hideToggle = false,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn(!hideToggle && "pr-10", className)}
        {...props}
      />

      {!hideToggle ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className={cn(
            "absolute top-1/2 right-1 -translate-y-1/2 rounded-sm p-1.5",
            "text-muted-foreground hover:text-foreground",
            transitionBase,
            focusRing,
          )}
        >
          {visible ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      ) : null}
    </div>
  );
}

export { PasswordInput };
