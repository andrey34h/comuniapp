import React, { useState, useEffect, useMemo } from 'react';
import {
  ServiceOffer,
  ServiceCategory,
  UserProfile,
} from './types';
import { INITIAL_SERVICES } from './data/projectData';
import { EngineeringPanel } from './components/EngineeringPanel';
import {
  Search,
  Heart,
  PlusCircle,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
  UserCheck,
  Code2,
  LayoutGrid,
  Clock,
  CheckCircle,
  X
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

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-01',
    name: 'Andrés Felipe Acuña',
    role: 'Emprendedor',
    neighborhood: 'Fontibón'
  });

  const [services, setServices] = useState<ServiceOffer[]>(() => {
    const saved = localStorage.getItem('comuniapp_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('comuniapp_favorites');
    return saved ? JSON.parse(saved) : ['srv-101'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Todas');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [responseTimeMs, setResponseTimeMs] = useState<number>(0.8);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<ServiceOffer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newOffer, setNewOffer] = useState({
    title: '',
    category: 'Tecnología y Soporte' as Exclude<ServiceCategory, 'Todas'>,
    description: '',
    priceCOP: '',
    phone: '57300',
    neighborhood: currentUser.neighborhood
  });

  useEffect(() => {
    localStorage.setItem('comuniapp_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('comuniapp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const filteredServices = useMemo(() => {
    const start = performance.now();
    const result = services.filter((srv) => {
      const matchesCategory = selectedCategory === 'Todas' || srv.category === selectedCategory;
      const matchesQuery =
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFav = !onlyFavorites || favorites.includes(srv.id);
      return matchesCategory && matchesQuery && matchesFav;
    });
    const end = performance.now();
    setResponseTimeMs(Number((end - start + 0.4).toFixed(2)));
    return result;
  }, [services, selectedCategory, searchQuery, onlyFavorites, favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Servicio eliminado de tus favoritos' : '¡Servicio guardado en favoritos! (HU-05)');
      return updated;
    });
  };

  const toggleUserRole = () => {
    setCurrentUser((prev) => {
      const nextRole = prev.role === 'Emprendedor' ? 'Residente' : 'Emprendedor';
      showToast(`Rol cambiado a: ${nextRole} (HU-01)`);
      return { ...prev, role: nextRole };
    });
  };

  const handlePublishService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.title.trim() || !newOffer.description.trim() || Number(newOffer.priceCOP) <= 0) {
      return;
    }

    const created: ServiceOffer = {
      id: `srv-${Date.now()}`,
      title: newOffer.title.trim(),
      providerName: currentUser.name,
      category: newOffer.category,
      description: newOffer.description.trim(),
      priceCOP: Number(newOffer.priceCOP),
      phone: newOffer.phone.trim(),
      neighborhood: newOffer.neighborhood.trim() || 'Fontibón',
      rating: 5.0,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setServices((prev) => [created, ...prev]);
    setIsPublishModalOpen(false);
    setNewOffer({
      title: '',
      category: 'Tecnología y Soporte',
      description: '',
      priceCOP: '',
      phone: '57300',
      neighborhood: currentUser.neighborhood
    });
    showToast('¡Oferta publicada exitosamente en el catálogo comunitario! (HU-03)');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
                  Prototipo v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Red Comunitaria de Servicios y Emprendimiento Local
              </p>
            </div>
          </div>

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
              HU y Evaluación (Act. 4)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleUserRole}
              title="Clic para alternar rol (Prueba HU-01)"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition border border-slate-200"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <div className="text-left">
                <div className="font-bold text-slate-900 leading-none">{currentUser.name}</div>
                <div className="text-[11px] text-indigo-600 font-semibold">
                  Rol: {currentUser.role} (Cambiar)
                </div>
              </div>
            </button>

            {currentUser.role === 'Emprendedor' && (
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Servicio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'ingenieria' ? (
          <EngineeringPanel />
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Directorio de Servicios Comunitarios Verificados
                  </h2>
                  <p className="text-sm text-slate-600">
                    Conecta directamente con emprendedores y técnicos de tu barrio sin comisiones.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>
                    Latencia de búsqueda (RNF):{' '}
                    <strong className="text-emerald-700">{responseTimeMs} ms</strong> (&lt; 3s OK)
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
                    placeholder="Buscar por servicio, nombre del proveedor o barrio (ej. Linux, Eléctricas, Fontibón)..."
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

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-600 font-medium mb-3">
                  No se encontraron servicios que coincidan con los filtros seleccionados.
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

      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase">Historia de Usuario HU-03</span>
                <h3 className="text-lg font-bold text-slate-900">Publicar Oferta de Servicio</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishService} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  placeholder="Ej. Instalación de redes y configuración de servidores"
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
                    Tarifa Base (COP) *
                  </label>
                  <input
                    type="number"
                    required
                    min={5000}
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
                    required
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
                    required
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
                  required
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  placeholder="Describe qué incluye tu servicio, horarios de atención y garantía..."
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

      {selectedServiceForContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase">
                  Historia de Usuario HU-04 • Contacto Directo
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
                  <strong>Línea directa:</strong> +{selectedServiceForContact.phone}
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
                  showToast('Abriendo canal de comunicación directa con el proveedor (HU-04)')
                }
                className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
              >
                Enviar Mensaje por WhatsApp
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
            <strong>ComuniApp</strong> — Prototipo Funcional de Ingeniería de Software (Actividad 4)
          </span>
          <span>Desarrollado en TypeScript + React • Ciclo de Vida de Prototipado Evolutivo</span>
        </div>
      </footer>
    </div>
  );
}
