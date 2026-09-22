import type { Metadata } from "next";
import {
  BellIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooterBordered,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Grid,
  Input,
  Label,
  PageHeader,
  PasswordInput,
  Progress,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ds/ui";

import { Showcase } from "@/components/showcase";
import { teamMembers } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Componentes" };

const estadoBadge = {
  activo: { variant: "success" as const, icon: CircleCheckIcon, label: "Activo" },
  pendiente: { variant: "warning" as const, icon: TriangleAlertIcon, label: "Pendiente" },
  suspendido: { variant: "destructive" as const, icon: CircleAlertIcon, label: "Suspendido" },
};

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        title="Componentes"
        description="Primitivos sobre Radix UI. Todos aceptan className, comparten las recetas de estado y son responsive por defecto."
        separated
      />

      {/* ------------------------------------------------------------------ */}
      <Section title="Button" description="Seis variantes y seis tamaños.">
        <div className="flex flex-col gap-6">
          <Showcase
            title="Variantes"
            note="Una sola acción primary por vista. Si hay dos botones azules compitiendo, el usuario no sabe qué se espera de él."
          >
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </Showcase>

          <Showcase title="Con icono y solo icono">
            <Button>
              <PlusIcon />
              Nuevo post
            </Button>
            <Button variant="outline">
              <SearchIcon />
              Buscar
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SettingsIcon />
                  <span className="ds-sr-only">Configuración</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configuración</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="icon-sm">
              <BellIcon />
              <span className="ds-sr-only">Notificaciones</span>
            </Button>
          </Showcase>

          <Showcase
            title="Ancho completo"
            note="block hace que el botón ocupe el contenedor. Es el patrón correcto en formularios móviles, donde un botón centrado y angosto es más difícil de acertar."
            className="block"
          >
            <Button block>Guardar cambios</Button>
          </Showcase>

          <Showcase
            title="Cargando"
            note="loading muestra el spinner, deshabilita el botón (evita el doble envío) y marca aria-busy, que es lo que comunica «esperá» a un lector de pantalla — el spinner solo es información visual. loadingText reemplaza el contenido mientras tanto."
          >
            <Button loading>Guardar</Button>
            <Button loading loadingText="Verificando…">
              Iniciar sesión
            </Button>
            <Button variant="outline" loading>
              Exportar
            </Button>
            <Button variant="destructive" loading loadingText="Eliminando…">
              Eliminar
            </Button>
          </Showcase>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Badge"
        description="Etiquetas de estado. Las variantes de estado usan fondo lavado y texto en el paso accesible."
      >
        <Showcase note="Nunca el fill saturado con texto encima: ahí es donde se rompe el contraste. El par es --success-subtle de fondo con --success-text de tipografía.">
          <Badge>Neutral</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">
            <CircleCheckIcon />
            Publicado
          </Badge>
          <Badge variant="warning">
            <TriangleAlertIcon />
            Borrador
          </Badge>
          <Badge variant="destructive">
            <CircleAlertIcon />
            Rechazado
          </Badge>
          <Badge variant="info">
            <InfoIcon />
            En revisión
          </Badge>
        </Showcase>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Card" description="La superficie base del sistema.">
        <Grid cols={2}>
          <Card>
            <CardHeader>
              <CardTitle>Configuración del blog</CardTitle>
              <CardDescription>
                Ajustes generales de publicación y visibilidad.
              </CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon-sm">
                  <SettingsIcon />
                  <span className="ds-sr-only">Opciones</span>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="c-public">Blog público</Label>
                <Switch id="c-public" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="c-comments">Permitir comentarios</Label>
                <Switch id="c-comments" />
              </div>
            </CardContent>
            <CardFooterBordered>
              <Button size="sm">Guardar</Button>
              <Button size="sm" variant="ghost">
                Cancelar
              </Button>
            </CardFooterBordered>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuevo autor</CardTitle>
              <CardDescription>
                Se le enviará una invitación por email.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-name">Nombre</Label>
                <Input id="c-name" placeholder="Lucía Ferrer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-role">Rol</Label>
                <Select defaultValue="edicion">
                  <SelectTrigger id="c-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administración</SelectItem>
                    <SelectItem value="edicion">Edición</SelectItem>
                    <SelectItem value="lectura">Lectura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="c-notify" defaultChecked />
                <Label htmlFor="c-notify" className="leading-snug">
                  Notificarme cuando acepte
                </Label>
              </div>
            </CardContent>
            <CardFooterBordered>
              <Button size="sm" block className="sm:w-auto">
                Enviar invitación
              </Button>
            </CardFooterBordered>
          </Card>
        </Grid>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Formulario" description="Controles con label, ayuda y error.">
        <Card>
          <CardContent className="grid gap-5 pt-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="f-title">Título</Label>
              <Input id="f-title" placeholder="Cómo construir un design system" />
              <p className="text-caption text-muted-foreground">
                Aparece en el listado y en el SEO de la página.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="f-slug">Slug</Label>
              <Input
                id="f-slug"
                aria-invalid
                aria-describedby="f-slug-err"
                defaultValue="Cómo construir!"
              />
              <p id="f-slug-err" className="text-caption text-destructive-text">
                Solo minúsculas, números y guiones.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="f-pass">Contraseña</Label>
              <PasswordInput id="f-pass" defaultValue="unaClaveDeEjemplo" />
              <p className="text-caption text-muted-foreground">
                El ojito queda fuera del recorrido de Tab: se pasa de la
                contraseña directo al botón de enviar.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="f-pass-2">Sin alternancia</Label>
              <PasswordInput id="f-pass-2" hideToggle defaultValue="oculta" />
              <p className="text-caption text-muted-foreground">
                <code className="font-mono">hideToggle</code> para contextos
                donde mostrar el valor no corresponde.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="f-content">Contenido</Label>
              <Textarea
                id="f-content"
                rows={4}
                placeholder="Escribí el cuerpo del post…"
              />
              <p className="text-caption text-muted-foreground">
                El textarea crece con el contenido (field-sizing).
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Tabs" description="Dos variantes de navegación interna.">
        <Grid cols={2}>
          <Card>
            <CardContent className="pt-5">
              <Tabs defaultValue="a">
                <TabsList>
                  <TabsTrigger value="a">Contenido</TabsTrigger>
                  <TabsTrigger value="b">SEO</TabsTrigger>
                  <TabsTrigger value="c">Avanzado</TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="text-ui-sm text-muted-foreground">
                  Variante <code className="font-mono">pill</code>: para cambiar de
                  vista dentro de una card.
                </TabsContent>
                <TabsContent value="b" className="text-ui-sm text-muted-foreground">
                  Metadatos y descripción.
                </TabsContent>
                <TabsContent value="c" className="text-ui-sm text-muted-foreground">
                  Opciones avanzadas.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <Tabs defaultValue="a">
                <TabsList variant="underline">
                  <TabsTrigger value="a">Publicados</TabsTrigger>
                  <TabsTrigger value="b">Borradores</TabsTrigger>
                  <TabsTrigger value="c">Archivados</TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="text-ui-sm text-muted-foreground">
                  Variante <code className="font-mono">underline</code>: navegación
                  de sección, estilo Taxonomy.
                </TabsContent>
                <TabsContent value="b" className="text-ui-sm text-muted-foreground">
                  Sin publicar.
                </TabsContent>
                <TabsContent value="c" className="text-ui-sm text-muted-foreground">
                  Fuera de circulación.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Alert"
        description="El role cambia según la severidad: alert interrumpe al lector de pantalla, status espera."
      >
        <div className="flex flex-col gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>Neutral</AlertTitle>
            <AlertDescription>
              Información de contexto sin urgencia.
            </AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheckIcon />
            <AlertTitle>Post publicado</AlertTitle>
            <AlertDescription>Ya es visible en el blog público.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>Faltan metadatos</AlertTitle>
            <AlertDescription>
              Sin descripción, el post no se indexa bien.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>No se pudo guardar</AlertTitle>
            <AlertDescription>
              La conexión se interrumpió. Los cambios quedaron en borrador local.
            </AlertDescription>
          </Alert>
        </div>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          Cada variante lleva su icono: el color no puede ser el único portador
          de la severidad.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Overlays" description="Dialog y Dropdown menu.">
        <Showcase>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon />
                Eliminar post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar este post?</DialogTitle>
                <DialogDescription>
                  Se borrarán también sus 12 comentarios. Esta acción no se puede
                  deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive">Sí, eliminar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Acciones</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Post</DropdownMenuLabel>
              <DropdownMenuItem>
                Editar
                <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
              <DropdownMenuItem>Ver en el blog</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Showcase>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          En móvil el footer del dialog apila las acciones en columna invertida:
          la primaria queda arriba, más cerca del pulgar. Reducí el ancho de la
          ventana y abrí el dialog para verlo.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Table"
        description="Con scroll horizontal contenido y alineación numérica automática."
      >
        <Table caption="Autores del blog">
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead numeric>Posts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((m) => {
              const badge = estadoBadge[m.estado];
              const Icon = badge.icon;
              return (
                <TableRow key={m.email}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {m.nombre
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{m.nombre}</span>
                        <span className="truncate text-caption text-muted-foreground">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.rol}</TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>
                      <Icon />
                      {badge.label}
                    </Badge>
                  </TableCell>
                  <TableCell numeric>{m.posts}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <p className="max-w-reading border-l-2 border-primary/40 pl-3 text-ui-sm text-muted-foreground">
          El contenedor lleva <code className="font-mono">tabIndex=0</code> y{" "}
          <code className="font-mono">role=&quot;region&quot;</code>: sin eso,
          quien navega con teclado no puede hacer scroll para ver las columnas
          que quedaron cortadas en pantallas angostas.
        </p>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section title="Feedback y varios">
        <Grid cols={2}>
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Progress value={32} aria-label="Importación: 32%" />
              <Progress value={78} aria-label="Importación: 78%" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <div role="status" aria-label="Cargando contenido" className="flex gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Avatar size="xs">
                <AvatarFallback>XS</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Separator orientation="vertical" className="h-10" />
              <AvatarGroup max={3}>
                <Avatar size="sm">
                  <AvatarFallback>LF</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>MI</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>SQ</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </AvatarGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="v-1" defaultChecked />
                <Label htmlFor="v-1">Marcado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="v-2" checked="indeterminate" />
                <Label htmlFor="v-2">Indeterminado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="v-3" defaultChecked />
                <Label htmlFor="v-3">Switch activo</Label>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Section>
    </>
  );
}
