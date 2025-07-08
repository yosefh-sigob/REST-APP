import { z } from "zod"

// Esquema base para validación de productos
export const ProductoFormSchema = z.object({
  ClaveProducto: z
    .string()
    .min(1, "La clave del producto es requerida")
    .max(10, "La clave no puede tener más de 10 caracteres")
    .regex(/^[A-Z0-9]+$/, "Solo se permiten letras mayúsculas y números"),

  TipoProducto: z.enum(["Platillo", "Producto", "Botella"], {
    required_error: "Debe seleccionar un tipo de producto",
  }),

  Nombredelproducto: z
    .string()
    .min(1, "El nombre del producto es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),

  Descripcion: z.string().max(500, "La descripción no puede tener más de 500 caracteres"),

  Favorito: z.boolean(),
  ExentoImpuesto: z.boolean(),
  PrecioAbierto: z.boolean(),
  ControlStock: z.boolean(),
  PrecioxUtilidadad: z.boolean(),
  Facturable: z.boolean(),
  Suspendido: z.boolean(),

  // Canales de venta
  Comedor: z.boolean(),
  ADomicilio: z.boolean(),
  Mostrador: z.boolean(),
  Enlinea: z.boolean(),
  EnAPP: z.boolean(),
  EnMenuQR: z.boolean(),

  // Relaciones
  GrupoProductoULID: z.string(),
  SubgrupoProductoULID: z.string(),
  UnidadesULID: z.string(),
  AreaProduccionULID: z.string(),
  AlmacenULID: z.string(),
  ClasificacionQRULID: z.string(),

  ClaveTributaria: z.string(),
  DatosDinamicos: z.record(z.any()),
})

// Validación personalizada para asegurar que al menos un canal esté activo
export const ProductoFormSchemaWithValidation = ProductoFormSchema.refine(
  (data) => {
    return data.Comedor || data.ADomicilio || data.Mostrador || data.Enlinea || data.EnAPP || data.EnMenuQR
  },
  {
    message: "Debe seleccionar al menos un canal de venta",
    path: ["Comedor"], // Mostrar el error en el primer campo de canales
  },
)

export type ProductoFormData = z.infer<typeof ProductoFormSchema>

// Constantes para los formularios
export const TIPOS_PRODUCTO = [
  { value: "Platillo", label: "Platillo", description: "Producto que requiere preparación" },
  { value: "Producto", label: "Producto", description: "Producto que se vende tal como se compra" },
  { value: "Botella", label: "Botella", description: "Bebidas alcohólicas y no alcohólicas" },
] as const

export const CANALES_VENTA = [
  { key: "Comedor", label: "🍽️ Comedor", description: "Disponible para servicio en mesas" },
  { key: "ADomicilio", label: "🏠 A Domicilio", description: "Disponible para entrega a domicilio" },
  { key: "Mostrador", label: "🏪 Mostrador", description: "Disponible para venta en mostrador" },
  { key: "Enlinea", label: "🌐 En Línea", description: "Disponible en plataforma web" },
  { key: "EnAPP", label: "📱 En APP", description: "Disponible en aplicación móvil" },
  { key: "EnMenuQR", label: "📱 Menú QR", description: "Disponible en menú con código QR" },
] as const

// Esquemas para filtros y búsquedas
export const FiltrosProductosSchema = z.object({
  busqueda: z.string().optional(),
  tipo: z.string().optional(),
  grupo: z.string().optional(),
  subgrupo: z.string().optional(),
  favoritos: z.boolean().optional(),
  suspendidos: z.boolean().optional(),
  activos: z.boolean().optional(),
})

export type FiltrosProductos = z.infer<typeof FiltrosProductosSchema>

// Esquema para paginación
export const PaginacionSchema = z.object({
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(10),
  ordenarPor: z.string().optional().default("Nombredelproducto"),
  direccion: z.enum(["asc", "desc"]).optional().default("asc"),
})

export type Paginacion = z.infer<typeof PaginacionSchema>

// Esquema combinado para búsqueda con paginación
export const BusquedaProductosSchema = FiltrosProductosSchema.merge(PaginacionSchema)

export type BusquedaProductos = z.infer<typeof BusquedaProductosSchema>
