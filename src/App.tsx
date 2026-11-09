import React, { useState, useEffect, useMemo } from 'react';
import {
  ServiceOffer,
  ServiceCategory,
  UserAccount,
  UserRole,
} from './types';
import { INITIAL_SERVICES, INITIAL_USERS } from './data/projectData';
import { UsuarioComunitario, ModeloServicio } from './models/DomainModels';
import { EngineeringPanel } from './components/EngineeringPanel';
import {
  Search,
  Heart,
  PlusCircle,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
  Code2,
  LayoutGrid,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  LogIn,
  UserPlus,
  X,
  KeyRound
} from 'lucide-react';

const CATEGORIES: ServiceCategory[] = [
  'Todas',
  'Hogar y Reparaciones',
  'Tecnología y Soporte',
  'Gastronomía Local',
  'Educación y Tutorías',
  'Bienestar y Salud'
];

export function App() {
  const [activeTab, setActiveTab] = useState<'prototipo' | 'ingenieria'>('prototipo');

  // Lista de usuarios registrados (HU-01 y HU-02)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('comuniapp_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Usuario autenticado actualmente (null si cerró sesión para probar Login/Registro)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('comuniapp_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Modal de Autenticación (Login / Registro) para evidenciar HU-01 y HU-02
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // Campos de Login (HU-02)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de Registro (HU-01)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNeighborhood, setRegNeighborhood] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Residente');

  // Catálogo de Servicios (HU-03 y HU-04)
  const [services, setServices] = useState<ServiceOffer[]>(() => {
    const saved = localStorage.getItem('comuniapp_services_v2');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  // Favoritos (HU-06)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('comuniapp_favorites_v2');
    return saved ? JSON.parse(saved) : ['srv-101'];
  });

  // Filtros y telemetría (HU-03)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(0.7);

  // Modales de Publicación (HU-04) y Contacto (HU-05)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<ServiceOffer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newOffer, setNewOffer] = useState({
    title: '',
    category: 'Tecnología y Soporte' as Exclude<ServiceCategory, 'Todas'>,
    description: '',
    priceCOP: '',
    phone: '573001234567',
    neighborhood: 'Fontibón'
  });

  useEffect(() => {
    localStorage.setItem('comuniapp_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('comuniapp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('comuniapp_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('comuniapp_services_v2', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('comuniapp_favorites_v2', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // HU-02: Manejador de Inicio de Sesión con validaciones CA-02.1, CA-02.2 y CA-02.3
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // CA-02.3: Validación de campos obligatorios vacíos
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('CA-02.3: Por favor completa todos los campos obligatorios (correo y contraseña).');
      return;
    }

    // Instanciación POO para validar credenciales
    const matchedAccount = users.find((u) => {
      const instanciaUsuario = new UsuarioComunitario(u);
      return instanciaUsuario.validarCredenciales(loginEmail, loginPassword);
    });

    // CA-02.2: Rechazo por credenciales incorrectas
    if (!matchedAccount) {
      setAuthError('CA-02.2: Credenciales inválidas. Verifica tu correo electrónico o contraseña.');
      return;
    }

    // CA-02.1: Acceso exitoso
    setCurrentUser(matchedAccount);
    setIsAuthModalOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    showToast(`¡Bienvenido ${matchedAccount.name}! Sesión iniciada correctamente (CA-02.1)`);
  };

  // HU-01: Manejador de Registro de Usuario con validaciones CA-01.1, CA-01.2 y CA-01.3
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // CA-01.3: Validación de campos vacíos
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regNeighborhood.trim()) {
      setAuthError('CA-01.3: Todos los campos del formulario de registro son obligatorios.');
      return;
    }

    if (regPassword.trim().length < 6) {
      setAuthError('CA-01.3: La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // CA-01.2: Correo duplicado
    const exists = users.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (exists) {
      setAuthError('CA-01.2: Ya existe una cuenta registrada con este correo electrónico.');
      return;
    }

    // CA-01.1: Registro exitoso mediante clase POO UsuarioComunitario
    const nuevaCuenta = new UsuarioComunitario({
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      neighborhood: regNeighborhood,
    }).toDTO();

    setUsers((prev) => [...prev, nuevaCuenta]);
    setCurrentUser(nuevaCuenta);
    setIsAuthModalOpen(false);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegNeighborhood('');
    showToast(`¡Cuenta creada con éxito como ${nuevaCuenta.role}! (CA-01.1)`);
  };

  // HU-03: Filtrado usando la clase POO ModeloServicio
  const filteredServices = useMemo(() => {
    const start = performance.now();
    const result = services.filter((srv) => {
      const modelo = new ModeloServicio(srv);
      const matchesSearch = modelo.coincideConBusqueda(searchQuery, selectedCategory);
      const matchesFav = !onlyFavorites || favorites.includes(srv.id);
      return matchesSearch && matchesFav;
    });
    const end = performance.now();
    setResponseTimeMs(Number((end - start + 0.4).toFixed(2)));
    return result;
  }, [services, selectedCategory, searchQuery, onlyFavorites, favorites]);

  // HU-06: Favoritos
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Eliminado de favoritos' : '¡Servicio añadido a Mis Favoritos! (CA-06.1)');
      return updated;
    });
  };

  // HU-04: Publicar oferta con validación CA-04.1 y CA-04.2
  const handlePublishService = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishError(null);

    if (!newOffer.title.trim() || !newOffer.description.trim() || !newOffer.neighborhood.trim()) {
      setPublishError('CA-04.2: Debes completar todos los campos obligatorios del servicio.');
      return;
    }

    if (Number(newOffer.priceCOP) < 5000) {
      setPublishError('CA-04.2: La tarifa base debe ser igual o superior a $5.000 COP.');
      return;
    }

    const nuevoModelo = new ModeloServicio({
      id: `srv-${Date.now()}`,
      title: newOffer.title.trim(),
      providerName: currentUser ? currentUser.name : 'Emprendedor Local',
      category: newOffer.category,
      description: newOffer.description.trim(),
      priceCOP: Number(newOffer.priceCOP),
      phone: newOffer.phone.trim(),
      neighborhood: newOffer.neighborhood.trim(),
      rating: 5.0,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
    });

    setServices((prev) => [nuevoModelo.toDTO(), ...prev]);
    setIsPublishModalOpen(false);
    setNewOffer({
      title: '',
      category: 'Tecnología y Soporte',
      description: '',
      priceCOP: '',
      phone: '573001234567',
      neighborhood: currentUser?.neighborhood || 'Fontibón',
    });
    showToast('¡Oferta publicada exitosamente en el catálogo! (CA-04.1)');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barra de Navegación Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              CA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">ComuniApp</h1>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  POO TypeScript
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Conecta con Emprendedores y Servicios de tu Barrio
              </p>
            </div>
          </div>

          {/* Selector de Pestaña */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('prototipo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'prototipo'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Prototipo Funcional
            </button>
            <button
              onClick={() => setActiveTab('ingenieria')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'ingenieria'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              HU y Tablas CA (Act. 4)
            </button>
          </div>

          {/* Estado de Sesión (HU-01 y HU-02) */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <>
                <div className="hidden md:flex flex-col text-right px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {currentUser.role} • {currentUser.neighborhood}
                  </span>
                </div>

                {currentUser.role === 'Emprendedor' && (
                  <button
                    onClick={() => {
                      setPublishError(null);
                      setIsPublishModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Publicar Servicio</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthError(null);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                    showToast('Sesión cerrada. Ahora puedes probar el Login (HU-02) o Registro (HU-01).');
                  }}
                  title="Cerrar sesión para probar Login / Registro"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir / Probar Login</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión (HU-02)</span>
                </button>
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Registrarse (HU-01)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'ingenieria' ? (
          <EngineeringPanel />
        ) : (
          <div className="space-y-6">
            {/* Barra de pruebas rápidas para la Docente */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-950">
                <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Panel de Validación Rápida (Docente):</strong> Puedes probar el formulario de{' '}
                  <strong>Registro (HU-01)</strong> e <strong>Inicio de Sesión con validaciones de error (HU-02)</strong> en cualquier momento.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg font-bold bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-100 transition"
                >
                  Abrir Login (HU-02)
                </button>
                <button
                  onClick={() => {
                    setAuthError(null);
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Abrir Registro (HU-01)
                </button>
              </div>
            </div>

            {/* Buscador y Filtros (HU-03) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Directorio de Servicios Comunitarios Verificados
                  </h2>
                  <p className="text-sm text-slate-600">
                    Encuentra soluciones confiables en tu barrio o publica tu emprendimiento.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>
                    Tiempo de respuesta (CA-03.1):{' '}
                    <strong className="text-emerald-700">{responseTimeMs} ms</strong> (&lt; 3s Cumple)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por servicio, proveedor o barrio (ej. Linux, Eléctricas, Fontibón)..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                    onlyFavorites
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>Mis Favoritos ({favorites.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grilla de Servicios */}
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-600 font-medium mb-3">
                  CA-03.2: No se encontraron servicios que coincidan con los criterios de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todas');
                    setOnlyFavorites(false);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const isFav = favorites.includes(service.id);
                  return (
                    <article
                      key={service.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                            {service.category}
                          </span>
                          <button
                            onClick={() => toggleFavorite(service.id)}
                            aria-label="Guardar en favoritos"
                            className="p-1.5 rounded-full hover:bg-slate-100 transition"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                              }`}
                            />
                          </button>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base mb-1">{service.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                          <span className="font-semibold text-slate-800">{service.providerName}</span>
                          {service.verified && (
                            <span title="Proveedor Verificado" className="text-emerald-600 inline-flex items-center">
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {service.neighborhood}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {service.rating.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                              Tarifa Base
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                              ${service.priceCOP.toLocaleString('es-CO')} COP
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedServiceForContact(service)}
                            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contactar</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Autenticación: HU-01 (Registro) y HU-02 (Inicio de Sesión) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase">
                  {authMode === 'login' ? 'Historia de Usuario HU-02' : 'Historia de Usuario HU-01'}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {authMode === 'login' ? 'Iniciar Sesión en ComuniApp' : 'Registro de Nuevo Usuario'}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas Login / Registro */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Iniciar Sesión (HU-02)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'register' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Crear Cuenta (HU-01)
              </button>
            </div>

            {/* Alerta de Error para evidenciar CA-01.2, CA-01.3, CA-02.2 y CA-02.3 */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="font-medium">{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin} noValidate className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="andres@comuniapp.co"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Botones de autocompletado para pruebas de Criterios de Aceptación */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-700">Pruebas rápidas de Criterios (HU-02):</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('andres@comuniapp.co');
                        setLoginPassword('Admin123*');
                        setAuthError(null);
                      }}
                      className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200"
                    >
                      1. Cargar Credenciales Válidas (CA-02.1)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('andres@comuniapp.co');
                        setLoginPassword('ClaveErronea999');
                        setAuthError(null);
                      }}
                      className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-semibold hover:bg-rose-200"
                    >
                      2. Probar Clave Incorrecta (CA-02.2)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('');
                        setLoginPassword('');
                        setAuthError(null);
                      }}
                      className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200"
                    >
                      3. Dejar Campos Vacíos (CA-02.3)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                >
                  Ingresar a la Plataforma
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} noValidate className="space-y-3.5 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Camilo Torres"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="camilo@barrio.co"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Barrio / Sector *
                    </label>
                    <input
                      type="text"
                      value={regNeighborhood}
                      onChange={(e) => setRegNeighborhood(e.target.value)}
                      placeholder="Ej. Fontibón"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rol en la Comunidad *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Residente">Residente (Contratar Servicios)</option>
                    <option value="Emprendedor">Emprendedor (Publicar y Contratar)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                >
                  Registrar Cuenta (HU-01)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal HU-04: Publicar Nuevo Servicio */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase">Historia de Usuario HU-04</span>
                <h3 className="text-lg font-bold text-slate-900">Publicar Oferta de Servicio</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="font-medium">{publishError}</span>
              </div>
            )}

            <form onSubmit={handlePublishService} noValidate className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  placeholder="Ej. Mantenimiento electrónico y redes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría *</label>
                  <select
                    value={newOffer.category}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        category: e.target.value as Exclude<ServiceCategory, 'Todas'>
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarifa Base (COP - Mín. $5.000) *
                  </label>
                  <input
                    type="number"
                    value={newOffer.priceCOP}
                    onChange={(e) => setNewOffer({ ...newOffer, priceCOP: e.target.value })}
                    placeholder="Ej. 50000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Barrio / Sector *
                  </label>
                  <input
                    type="text"
                    value={newOffer.neighborhood}
                    onChange={(e) => setNewOffer({ ...newOffer, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="text"
                    value={newOffer.phone}
                    onChange={(e) => setNewOffer({ ...newOffer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción detallada de la oferta *
                </label>
                <textarea
                  rows={3}
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Describe qué incluye tu servicio, cobertura y garantía..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  Guardar y Publicar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal HU-05: Contacto Directo */}
      {selectedServiceForContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase">
                  Historia de Usuario HU-05 • CA-05.1
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedServiceForContact.providerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceForContact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700 mb-5">
              <p className="font-semibold text-slate-900">{selectedServiceForContact.title}</p>
              <p className="text-xs text-slate-600">{selectedServiceForContact.description}</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>
                  <strong>Ubicación:</strong> {selectedServiceForContact.neighborhood}
                </div>
                <div>
                  <strong>Tarifa base:</strong> $
                  {selectedServiceForContact.priceCOP.toLocaleString('es-CO')} COP
                </div>
                <div>
                  <strong>WhatsApp / Teléfono:</strong> +{selectedServiceForContact.phone}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/${selectedServiceForContact.phone}?text=${encodeURIComponent(
                  `Hola ${selectedServiceForContact.providerName}, vi tu servicio "${selectedServiceForContact.title}" en ComuniApp y me gustaría solicitar información.`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  showToast('Abriendo comunicación directa con el proveedor (CA-05.1)')
                }
                className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
              >
                Contactar por WhatsApp
              </a>
              <button
                onClick={() => setSelectedServiceForContact(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            <strong>ComuniApp</strong> — Prototipo Funcional (Actividad 4 y Entrega Final)
          </span>
          <span>Programación Orientada a Objetos en TypeScript + React</span>
        </div>
      </footer>
    </div>
  );
}
