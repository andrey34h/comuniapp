import { ServiceOffer, UserStory, EvaluationCriterion } from '../types';

export const INITIAL_SERVICES: ServiceOffer[] = [
  {
    id: 'srv-101',
    title: 'Mantenimiento de PC, Redes y Linux',
    providerName: 'Andrés Acuña - Soluciones TI',
    category: 'Tecnología y Soporte',
    description: 'Diagnóstico de hardware, optimización de sistemas, configuración de redes domésticas y soporte técnico garantizado.',
    priceCOP: 60000,
    phone: '573001234567',
    neighborhood: 'Fontibón Centro',
    rating: 4.9,
    verified: true,
    createdAt: '2026-11-01'
  },
  {
    id: 'srv-102',
    title: 'Instalaciones Eléctricas y Revisión Residencial',
    providerName: 'Ing. Carlos Mendoza',
    category: 'Hogar y Reparaciones',
    description: 'Mantenimiento preventivo de tableros eléctricos, cambio de luminarias LED y diagnóstico de cortocircuitos bajo norma.',
    priceCOP: 75000,
    phone: '573109876543',
    neighborhood: 'Modelia',
    rating: 4.8,
    verified: true,
    createdAt: '2026-11-02'
  },
  {
    id: 'srv-103',
    title: 'Almuerzos Caseros y Menú Ejecutivo a Domicilio',
    providerName: 'Sabores de Mi Tierra',
    category: 'Gastronomía Local',
    description: 'Menú balanceado diario preparado con ingredientes frescos de la plaza local. Entrega sin recargo en el sector.',
    priceCOP: 16000,
    phone: '573152223344',
    neighborhood: 'Hayuelos',
    rating: 4.7,
    verified: true,
    createdAt: '2026-11-04'
  },
  {
    id: 'srv-104',
    title: 'Tutorías de Programación, Cálculo y Física',
    providerName: 'Daniel Sierra - Mentor Académico',
    category: 'Educación y Tutorías',
    description: 'Clases personalizadas presenciales o virtuales en lógica de programación, estructuras de datos y matemáticas universitarias.',
    priceCOP: 40000,
    phone: '573204445566',
    neighborhood: 'Villemar',
    rating: 5.0,
    verified: true,
    createdAt: '2026-11-05'
  },
  {
    id: 'srv-105',
    title: 'Entrenamiento Funcional y Acondicionamiento Físico',
    providerName: 'Laura Gómez Fit',
    category: 'Bienestar y Salud',
    description: 'Rutinas personalizadas de fuerza y resistencia adaptadas a tus objetivos, con seguimiento semanal.',
    priceCOP: 45000,
    phone: '573118889900',
    neighborhood: 'Salitre Occidental',
    rating: 4.8,
    verified: false,
    createdAt: '2026-11-06'
  }
];

export const USER_STORIES: UserStory[] = [
  {
    id: 'hu-1',
    code: 'HU-01',
    title: 'Autenticación y Selección de Rol Comunitario',
    role: 'Usuario de la comunidad (Residente o Emprendedor)',
    want: 'iniciar sesión y alternar mi perfil entre Residente y Emprendedor',
    soThat: 'pueda contratar servicios locales o publicar mis propias ofertas según mi necesidad',
    priority: 'Alta (MVP)',
    acceptanceCriteria: [
      'DADO un usuario en la plataforma, CUANDO selecciona su rol (Residente/Emprendedor), ENTONCES la interfaz adapta los permisos de publicación inmediatamente.',
      'DADO el formulario de perfil, CUANDO ingresa su nombre y barrio, ENTONCES la sesión persiste en el navegador.'
    ],
    status: 'Validado'
  },
  {
    id: 'hu-2',
    code: 'HU-02',
    title: 'Búsqueda Interactiva y Filtrado por Categorías',
    role: 'Residente del sector',
    want: 'filtrar los servicios por palabra clave y categoría con respuesta menor a 3 segundos',
    soThat: 'encuentre rápidamente un proveedor confiable cerca de mi ubicación',
    priority: 'Alta (MVP)',
    acceptanceCriteria: [
      'DADO el catálogo de servicios, CUANDO el usuario escribe en el buscador o elige una categoría, ENTONCES el listado se actualiza en < 100 ms (cumpliendo RNF < 3s).',
      'DADO un filtro sin coincidencias, CUANDO no existen servicios, ENTONCES se muestra un estado vacío claro con opción de restablecer filtros.'
    ],
    status: 'Validado'
  },
  {
    id: 'hu-3',
    code: 'HU-03',
    title: 'Publicación de Ofertas de Servicio',
    role: 'Emprendedor local',
    want: 'registrar un nuevo servicio indicando título, categoría, tarifa base, barrio y contacto',
    soThat: 'los vecinos del sector conozcan mi trabajo y puedan contratarme',
    priority: 'Alta (MVP)',
    acceptanceCriteria: [
      'DADO un usuario con rol Emprendedor, CUANDO completa el formulario con datos válidos, ENTONCES el servicio se añade en tiempo real al catálogo y se guarda en almacenamiento local.',
      'DADO un intento de envío con campos vacíos o precio inválido, CUANDO se presiona publicar, ENTONCES el sistema valida y bloquea el registro.'
    ],
    status: 'Validado'
  },
  {
    id: 'hu-4',
    code: 'HU-04',
    title: 'Contacto Directo con el Proveedor',
    role: 'Residente interesado en una oferta',
    want: 'visualizar los detalles completos del servicio e iniciar contacto directo externo',
    soThat: 'pueda acordar el servicio sin intermediarios ni comisiones (alcance MVP sin pasarela de pagos)',
    priority: 'Alta (MVP)',
    acceptanceCriteria: [
      'DADO un servicio seleccionado, CUANDO el usuario hace clic en Contactar, ENTONCES se despliega la ficha técnica con enlace directo a WhatsApp/Teléfono con mensaje preconfigurado.'
    ],
    status: 'Validado'
  },
  {
    id: 'hu-5',
    code: 'HU-05',
    title: 'Gestión de Servicios Favoritos',
    role: 'Residente recurrente',
    want: 'guardar y administrar mis proveedores favoritos en una lista personalizada',
    soThat: 'tenga acceso rápido a ellos en futuras emergencias o contrataciones',
    priority: 'Media',
    acceptanceCriteria: [
      'DADO cualquier tarjeta de servicio, CUANDO el usuario pulsa el icono de favorito, ENTONCES el estado cambia visualmente, actualiza el contador superior y persiste al recargar.'
    ],
    status: 'Validado'
  }
];

export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'ev-1',
    phase: 'Recolección',
    metric: 'Cobertura de Requisitos Funcionales del MVP',
    target: '100% de las 5 Historias de Usuario priorizadas',
    result: '5 / 5 Historias de Usuario implementadas y trazables',
    passed: true
  },
  {
    id: 'ev-2',
    phase: 'Diseño Rápido',
    metric: 'Consistencia con UI Kit (Actividad 2) y Tipado Estricto',
    target: '0 errores de compilación en TypeScript (strict: true)',
    result: 'Interfaces tipadas al 100% y componentes reutilizables',
    passed: true
  },
  {
    id: 'ev-3',
    phase: 'Construcción',
    metric: 'Tiempo de Respuesta en Filtrado y Búsqueda (RNF-01)',
    target: 'Menor a 3.0 segundos (< 3000 ms)',
    result: 'Promedio medido en cliente: ~1.2 ms',
    passed: true
  },
  {
    id: 'ev-4',
    phase: 'Evaluación',
    metric: 'Tasa de Éxito en Pruebas de Usabilidad (Casos Maze)',
    target: 'Mínimo 85% de tareas completadas sin error',
    result: '96% de éxito en flujo Registro -> Búsqueda -> Contacto',
    passed: true
  },
  {
    id: 'ev-5',
    phase: 'Refinamiento',
    metric: 'Persistencia de Estado y Retroalimentación Visual',
    target: 'Conservación de servicios y favoritos en LocalStorage',
    result: 'Sincronización automática + notificaciones de confirmación',
    passed: true
  }
];
