import { Shell } from "@/components/shell";

/** Todo lo que vive dentro de la aplicación lleva header y sidebar. */
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell>{children}</Shell>;
}
