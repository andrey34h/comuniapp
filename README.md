# Manual Técnico y Documentación del Prototipo — ComuniApp

Repositorio oficial del proyecto **ComuniApp**, desarrollado aplicando **Programación Orientada a Objetos (POO) en TypeScript** y **React 18**, dando cumplimiento a la **Actividad 4 (Prototipo Funcional)** y a la **Entrega Final** del curso de Proyecto de Software.

---

## 1. Arquitectura y Paradigma Orientado a Objetos (POO)

En cumplimiento de los lineamientos técnicos del curso, el núcleo de dominio está modelado bajo el paradigma de **Programación Orientada a Objetos (POO)** en `src/models/DomainModels.ts`:

* **Abstracción y Herencia:** La clase abstracta `EntidadComunitaria` define la estructura base (`id`, `createdAt`, `obtenerResumen()`), de la cual heredan las clases `UsuarioComunitario` y `ModeloServicio`.
* **Encapsulamiento:** Los atributos sensibles como `passwordHash` y `email` son privados (`private`) y sólo pueden validarse a través de métodos públicos de instancia como `validarCredenciales(email, passwordInput)`.
* **Polimorfismo:** Implementación polimórfica del método `override obtenerResumen()` en cada subclase del dominio.

---

## 2. Historias de Usuario y Criterios de Aceptación (CA) Evaluados

| Código HU | Nombre de la Historia | Criterios Evaluados | Estado General |
| :--- | :--- | :--- | :--- |
| **HU-01** | Registro de Nuevos Usuarios en la Comunidad | `CA-01.1`, `CA-01.2`, `CA-01.3` | **Cumple (3/3)** |
| **HU-02** | Inicio de Sesión con Credenciales de Acceso | `CA-02.1`, `CA-02.2`, `CA-02.3`, `CA-02.4` | **Cumple (3/4) - 1 en Backlog** |
| **HU-03** | Búsqueda Interactiva y Filtrado por Categorías (`< 3s`) | `CA-03.1`, `CA-03.2` | **Cumple (2/2)** |
| **HU-04** | Publicación de Nuevas Ofertas de Servicio | `CA-04.1`, `CA-04.2` | **Cumple (2/2)** |
| **HU-05** | Contacto Directo con el Proveedor del Servicio | `CA-05.1` | **Cumple (1/1)** |
| **HU-06** | Gestión de Lista de Proveedores Favoritos | `CA-06.1` | **Cumple (1/1)** |

---

## 3. Credenciales de Prueba para Evaluación Docente

La docente puede evaluar el sistema de inicio de sesión (`HU-02`) o crear nuevas cuentas (`HU-01`):
* **Cuenta Emprendedor:** `andres@comuniapp.co` | Contraseña: `Admin123*`
* **Cuenta Residente:** `residente@comuniapp.co` | Contraseña: `Vecino123*`

---

## 4. Instrucciones de Instalación y Ejecución Local

### Requisitos del Sistema
* **Node.js** v18 LTS o superior.
* **Git** instalado en el sistema operativo (Windows 11 / Linux / macOS).

### Pasos de Ejecución
```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd comuniapp-prototipo

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Conpilacion y despligue en cloudflare 
npm run build 
npm wrangler pages deploy dist --project-name comuniapp-prototipo
