"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlertIcon, InfoIcon, LogInIcon, PenLineIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  AuthFooter,
  AuthHeader,
  AuthLayout,
  AuthPanel,
  Button,
  Card,
  CardContent,
  Checkbox,
  Input,
  Label,
  PasswordInput,
  Separator,
} from "biblioteca-diseno";

import { ThemeToggle } from "@/components/theme";

/**
 * LOGIN — solo front-end.
 *
 * No hay autenticación real detrás: esta pantalla existe para mostrar el
 * Design System resolviendo un formulario de acceso completo, con sus estados
 * de validación, error y carga.
 *
 * La contraseña no se guarda, no se envía a ningún lado y no se persiste. La
 * comprobación es una comparación local contra una credencial de demo, y el
 * "éxito" es simplemente navegar al panel. Si esto se conectara a un backend
 * de verdad, la validación del lado del cliente seguiría siendo solo una
 * cortesía para el usuario — nunca un control de seguridad.
 */

const DEMO = { email: "lucia@ejemplo.com", password: "redaccion" };

type Errores = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errores, setErrores] = React.useState<Errores>({});
  const [intentado, setIntentado] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [fallo, setFallo] = React.useState(false);

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const validar = (valores: { email: string; password: string }): Errores => {
    const siguientes: Errores = {};

    if (!valores.email.trim()) {
      siguientes.email = "Ingresá tu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())) {
      siguientes.email = "Ese email no tiene un formato válido.";
    }

    if (!valores.password) {
      siguientes.password = "Ingresá tu contraseña.";
    }

    return siguientes;
  };

  // Revalida en cada tecla, pero solo después del primer intento: marcar en
  // rojo un formulario que la persona todavía no terminó de completar es
  // hostil y no le aporta información nueva.
  const cambiar = (campo: "email" | "password", valor: string) => {
    const siguiente = { email, password, [campo]: valor };
    if (campo === "email") setEmail(valor);
    else setPassword(valor);
    if (fallo) setFallo(false);
    if (intentado) setErrores(validar(siguiente));
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setIntentado(true);
    setFallo(false);

    const siguientes = validar({ email, password });
    setErrores(siguientes);

    if (siguientes.email || siguientes.password) {
      // Mover el foco al primer campo con problema: sin esto, quien navega con
      // teclado o lector de pantalla se queda en el botón sin saber qué pasó.
      (siguientes.email ? emailRef : passwordRef).current?.focus();
      return;
    }

    setEnviando(true);
    // Latencia simulada, solo para que el estado de carga sea visible.
    await new Promise((r) => setTimeout(r, 900));

    const ok =
      email.trim().toLowerCase() === DEMO.email && password === DEMO.password;

    if (!ok) {
      setEnviando(false);
      setFallo(true);
      // El mensaje no dice si falló el email o la contraseña: distinguirlos le
      // confirma a un atacante qué cuentas existen.
      setPassword("");
      passwordRef.current?.focus();
      return;
    }

    router.push("/");
  };

  return (
    <AuthLayout>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <AuthPanel>
        <AuthHeader
          brand={
            <span className="flex items-center gap-2 text-h4">
              <PenLineIcon className="size-6 text-primary" />
              Redacción
            </span>
          }
          title="Iniciá sesión"
          description="Entrá al panel para administrar los posts del blog."
        />

        <Card>
          <CardContent className="pt-5">
            <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
              {fallo ? (
                // El Alert destructivo lleva role="alert": interrumpe al lector
                // de pantalla, que es lo correcto para un error de envío.
                <Alert variant="destructive">
                  <CircleAlertIcon />
                  <AlertTitle>No pudimos iniciar sesión</AlertTitle>
                  <AlertDescription>
                    El email o la contraseña no coinciden. Revisalos e intentá de
                    nuevo.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => cambiar("email", e.target.value)}
                  aria-invalid={Boolean(errores.email) || undefined}
                  aria-describedby={errores.email ? "email-error" : undefined}
                  placeholder="nombre@dominio.com"
                />
                {errores.email ? (
                  <p id="email-error" className="text-caption text-destructive-text">
                    {errores.email}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/login"
                    className="text-caption text-info-text underline-offset-4 hover:underline"
                  >
                    ¿La olvidaste?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  ref={passwordRef}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => cambiar("password", e.target.value)}
                  aria-invalid={Boolean(errores.password) || undefined}
                  aria-describedby={
                    errores.password ? "password-error" : undefined
                  }
                  placeholder="Tu contraseña"
                />
                {errores.password ? (
                  <p
                    id="password-error"
                    className="text-caption text-destructive-text"
                  >
                    {errores.password}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="recordarme" defaultChecked />
                <Label htmlFor="recordarme" className="font-normal">
                  Mantener la sesión iniciada
                </Label>
              </div>

              <Button
                type="submit"
                block
                size="lg"
                loading={enviando}
                loadingText="Verificando…"
              >
                <LogInIcon />
                Iniciar sesión
              </Button>

              <Separator />

              <p className="text-center text-ui-sm text-muted-foreground">
                ¿No tenés cuenta?{" "}
                <Link
                  href="/login"
                  className="text-info-text underline-offset-4 hover:underline"
                >
                  Pedí acceso al equipo
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>Pantalla de demostración</AlertTitle>
          <AlertDescription>
            <p>
              No hay autenticación real detrás. Para entrar, usá{" "}
              <code className="font-mono">{DEMO.email}</code> con la contraseña{" "}
              <code className="font-mono">{DEMO.password}</code>.
            </p>
          </AlertDescription>
        </Alert>

        <AuthFooter>
          Al continuar aceptás los <Link href="/login">términos del servicio</Link>{" "}
          y la <Link href="/login">política de privacidad</Link>.
        </AuthFooter>
      </AuthPanel>
    </AuthLayout>
  );
}
