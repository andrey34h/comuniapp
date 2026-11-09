# ComuniApp — Prototipo Funcional (Actividad 4)

Prototipo funcional evolutivo desarrollado en **TypeScript + React + Vite + Tailwind CSS**, aplicando el ciclo de vida del prototipo (Gual Ortí, 2016; Suárez, 2017) como continuación a la formulación del proyecto de ingeniería de software.

## 1. Ciclo de Vida del Prototipo Aplicado
1. **Recolección de Requisitos:** Definición de 5 Historias de Usuario del MVP (`HU-01` a `HU-05`) y requisitos no funcionales (rendimiento menor a 3 segundos).
2. **Diseño Rápido:** Contratos e interfaces de dominio tipadas en TypeScript (`src/types/index.ts`) y diseño modular de interfaz.
3. **Construcción del Prototipo:** Implementación interactiva completa con persistencia en `localStorage`.
4. **Evaluación:** Matriz de verificación de criterios funcionales y medición en tiempo real de latencia de filtrado.
5. **Refinamiento y Entrega:** Ajustes de usabilidad, notificaciones de retroalimentación y versionamiento semántico en Git.

## 2. Instrucciones Básicas de Instalación y Ejecución (Windows / Linux / macOS)

### Requisitos previos
- **Node.js** (versión 18 LTS o superior) y **npm** instalados.
- **Git** instalado.

### Pasos de instalación
```bash
# 1. Clonar el repositorio
git clone <URL_DE_TU_REPOSITORIO_GITHUB>
cd comuniapp-prototipo

# 2. Instalar las dependencias del proyecto
npm install

# 3. Iniciar el servidor de desarrollo local
npm run devLuego abre en el navegador la ruta indicada en consola (http://localhost:5173).
