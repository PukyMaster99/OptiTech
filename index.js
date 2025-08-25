import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json());

// "Base de datos" en memoria (se borra al reiniciar)
const orders = []; // {id, customer, optic, lab, lensSpec, status, history, createdAt}
const STATUSES = ['RECEIVED', 'IN_PROCESS', 'READY', 'DELIVERED'];

app.get('/health', (_, res) => res.send('ok'));

// Listar órdenes por rol
// /orders?role=OPTIC&opticName=... | role=LAB&labName=... | role=CUSTOMER&customerName=...
app.get('/orders', (req, res) => {
  const { role, opticName, labName, customerName } = req.query;
  let data = orders;

  if (role === 'OPTIC' && opticName) {
    data = data.filter(o => (o.optic?.name || '').toLowerCase() === String(opticName).toLowerCase());
  }
  if (role === 'LAB' && labName) {
    data = data.filter(o => (o.lab?.name || '').toLowerCase() === String(labName).toLowerCase());
  }
  if (role === 'CUSTOMER' && customerName) {
    data = data.filter(o => (o.customer?.name || '').toLowerCase() === String(customerName).toLowerCase());
  }

  data = data.slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  res.json(data);
});

// Crear orden (la crea la ÓPTICA)
app.post('/orders', (req, res) => {
  const { customer, optic, lab, lensSpec, notes } = req.body;
  if (!customer?.name || !optic?.name || !lab?.name) {
    return res.status(400).json({ error: 'Faltan datos: customer.name, optic.name, lab.name' });
  }
  const now = new Date().toISOString();
  const order = {
    id: nanoid(),
    customer: { name: customer.name },
    optic: { name: optic.name },
    lab: { name: lab.name },
    lensSpec: lensSpec || {},
    notes: notes || '',
    status: 'RECEIVED',
    history: [{ toStatus: 'RECEIVED', note: 'Orden creada por óptica', at: now }],
    createdAt: now
  };
  orders.push(order);
  res.status(201).json(order);
});

// Avanzar estado (LAB)
app.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { toStatus, note } = req.body;

  if (!STATUSES.includes(toStatus)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

  const currentIndex = STATUSES.indexOf(order.status);
  const nextIndex = STATUSES.indexOf(toStatus);
  if (nextIndex < currentIndex) {
    return res.status(400).json({ error: 'No puedes retroceder estado' });
  }

  order.status = toStatus;
  order.history.push({ toStatus, note: note || '', at: new Date().toISOString() });
  res.json({ ok: true, order });
});

const PORT = process.env.PORT || 4000;
// --- DEBUG: crea una orden de ejemplo con solo abrir un link ---
app.get('/debug/create-sample-order', (req, res) => {
  const now = new Date().toISOString();
  const order = {
    id: nanoid(),
    customer: { name: 'Juan Perez' },
    optic: { name: 'Optica Demo' },
    lab: { name: 'Lab Central' },
    lensSpec: { material: 'Poly', index: '1.59' },
    notes: 'Urgente (debug)',
    status: 'RECEIVED',
    history: [{ toStatus: 'RECEIVED', note: 'Orden (debug) creada por óptica', at: now }],
    createdAt: now
  };
  orders.push(order);
  console.log('DEBUG: creada sample order', order.id);
  res.json(order);
});

// --- DEBUG: limpia memoria ---
app.get('/debug/reset', (req, res) => {
  orders.length = 0;
  res.send('OK reset');
});

app.listen(PORT, () => {
  console.log('API corriendo en http://localhost:' + PORT);
});
