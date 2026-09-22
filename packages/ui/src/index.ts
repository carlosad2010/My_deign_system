/**
 * @ds/ui — punto de entrada público del Design System.
 *
 * Los estilos NO se exportan desde acá: se importan una vez por app con
 * `import "@ds/ui/styles.css"`, porque un CSS side-effect dentro de un barrel
 * de componentes rompe el tree-shaking.
 */

/* Utilidades y recetas ---------------------------------------------------- */
export { cn } from "./lib/utils";
export {
  focusRing,
  focusRingOnSurface,
  focusItem,
  disabled,
  invalid,
  transitionBase,
  controlHeight,
  type ControlSize,
} from "./lib/states";

/* Primitivos -------------------------------------------------------------- */
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardFooterBordered,
} from "./components/card";
export { Input, inputVariants, type InputProps } from "./components/input";
export {
  PasswordInput,
  type PasswordInputProps,
} from "./components/password-input";
export { Label } from "./components/label";
export { Textarea } from "./components/textarea";
export { Separator } from "./components/separator";
export { Skeleton } from "./components/skeleton";
export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  type AlertProps,
} from "./components/alert";
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarVariants,
  type AvatarProps,
} from "./components/avatar";
export { Checkbox } from "./components/checkbox";
export { Switch } from "./components/switch";
export { Progress } from "./components/progress";
export { ScrollArea, ScrollBar } from "./components/scroll-area";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/select";
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
} from "./components/tabs";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/tooltip";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/dialog";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/sheet";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/dropdown-menu";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table";

/* Layouts ----------------------------------------------------------------- */
export {
  AppShell,
  AppHeader,
  AppHeaderBar,
  AppBody,
  AppSidebar,
  AppMain,
  AppContent,
} from "./layouts/app-shell";
export {
  AuthLayout,
  AuthPanel,
  AuthHeader,
  AuthFooter,
} from "./layouts/auth-layout";
export {
  Container,
  Grid,
  Section,
  containerVariants,
  type ContainerProps,
} from "./layouts/container";
export {
  SidebarNav,
  navItemClass,
  type SidebarNavProps,
  type NavItem,
  type NavSection,
  type RenderLink,
} from "./layouts/sidebar-nav";
export { MobileNav, type MobileNavProps } from "./layouts/mobile-nav";

/* Patrones ---------------------------------------------------------------- */
export { PageHeader, type PageHeaderProps } from "./patterns/page-header";
export { EmptyState, type EmptyStateProps } from "./patterns/empty-state";
export { StatCard, type StatCardProps } from "./patterns/stat-card";

/* Visualización de datos -------------------------------------------------- */
export {
  CHART_SLOTS,
  CHART_SEQUENTIAL,
  MAX_SERIES,
  MARK,
  CHROME,
  resolveSeriesColors,
  resolveOrdinalColors,
  defaultValueFormatter,
  createValueFormatter,
  compactFormatter,
  type NumberFormat,
} from "./charts/chart-config";
export {
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  axisDefaults,
  type ChartFrameProps,
  type ChartLegendProps,
  type ChartTooltipProps,
} from "./charts/chart-parts";
export { AreaChart, type AreaChartProps } from "./charts/area-chart";
export { BarChart, type BarChartProps } from "./charts/bar-chart";
export { LineChart, type LineChartProps } from "./charts/line-chart";
export { DonutChart, type DonutChartProps } from "./charts/donut-chart";
export { Sparkline, type SparklineProps } from "./charts/sparkline";
