# MacroTracker Pro

Una app para registrar tu comida diaria y llevar el control de tus macronutrientes (proteína, grasa, carbohidratos y calorías).

Tu información se guarda directamente en Google Sheets, así que siempre tienes acceso a tus datos sin depender de una base de datos externa o suscripciones.

## 🤔 ¿Por qué MacroTracker?

Porque las apps de conteo de calorías suelen ser lentas, llenas de anuncios, o te obligan a pagar una suscripción para funciones básicas. MacroTracker es minimalista, rápida, y tus datos son tuyos — literalmente están en un Google Sheet que puedes descargar, compartir o analizar cuando quieras.

## ✨ Funcionalidades

- **Registro diario** — Agrega alimentos con un solo clic, ajusta las cantidades en gramos o por pieza
- **Seguimiento automático** — Al registrar un alimento, los macros se calculan automáticamente
- **7 categorías** — Proteína, carbohidratos, grasas, frutas, verduras, condimentos y suplementos
- **Búsqueda** — Encuentra cualquier alimento por nombre
- **Navegación por fechas** — Revisa días anteriores, modifica o elimina entradas
- **Totales en tiempo real** — Ve el resumen del día al instante
- **Datos en Google Sheets** — Toda tu información está en una hoja de cálculo, sin bloqueos de proveedor

## 🚀 Comenzar

```bash
just setup     # Instalar dependencias
just run       # Iniciar servidor en http://localhost:3000
```

> **Nota técnica**: Necesitas [mise](https://mise.jdx.dev), [just](https://github.com/casey/just), y una clave de servicio de Google. Consulta [`docs/google-sheets.md`](docs/google-sheets.md) para la configuración de la hoja de cálculo y autenticación.

## 📖 Documentación técnica

- [`docs/architecture.md`](docs/architecture.md) — Estructura del proyecto, flujo de datos
- [`docs/google-sheets.md`](docs/google-sheets.md) — Configuración de Google Sheets, columnas, MCP server
- [`docs/nutrition.md`](docs/nutrition.md) — Tipos de alimentos, cálculo de macros
