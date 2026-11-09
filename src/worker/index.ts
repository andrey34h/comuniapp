import { Hono } from 'hono';
import { INITIAL_SERVICES, USER_STORIES, EVALUATION_CRITERIA } from '../data/projectData';
import { ServiceOffer } from '../types';

const app = new Hono();

// Estado en el Edge (o conectado a Cloudflare D1 con env.DB)
let edgeServices: ServiceOffer[] = [...INITIAL_SERVICES];

// HU-02: Endpoint de consulta y filtrado en el Edge (< 50ms)
app.get('/api/services', (c) => {
  const category = c.req.query('category');
  const q = c.req.query('q')?.toLowerCase() || '';

  const filtered = edgeServices.filter((srv) => {
    const matchCat = !category || category === 'Todas' || srv.category === category;
    const matchQuery =
      !q ||
      srv.title.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      srv.neighborhood.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return c.json({
    ok: true,
    runtime: 'Cloudflare-Workers-Edge',
    count: filtered.length,
    data: filtered,
  });
});

// HU-03: Endpoint para publicar una nueva oferta de servicio
app.post('/api/services', async (c) => {
  const body = await c.req.json<Partial<ServiceOffer>>();

  if (!body.title || !body.description || !body.priceCOP || Number(body.priceCOP) <= 0) {
    return c.json({ ok: false, error: 'Datos de la oferta incompletos o inválidos' }, 400);
  }

  const created: ServiceOffer = {
    id: `srv-${Date.now()}`,
    title: body.title.trim(),
    providerName: body.providerName || 'Emprendedor Verificado',
    category: body.category || 'Tecnología y Soporte',
    description: body.description.trim(),
    priceCOP: Number(body.priceCOP),
    phone: body.phone || '573000000000',
    neighborhood: body.neighborhood || 'Fontibón',
    rating: 5.0,
    verified: true,
    createdAt: new Date().toISOString().split('T')[0],
  };

  edgeServices = [created, ...edgeServices];
  return c.json({ ok: true, data: created }, 201);
});

// Endpoint de trazabilidad académica (Actividad 4)
app.get('/api/engineering-metrics', (c) => {
  return c.json({
    userStories: USER_STORIES,
    evaluationCriteria: EVALUATION_CRITERIA,
  });
});

export default app;