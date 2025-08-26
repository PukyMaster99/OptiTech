import { useEffect, useState } from 'react';
import { api, getAuth } from '../../lib/api';

export default function OpticDashboard() {
  const auth = getAuth(); // { role:'OPTIC', name:'...' }
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    labName: '',
    material: 'Poly',
    index: '1.59',
    notes: ''
  });

  async function load() {
    const data = await api.orders.listByRole({ role: 'OPTIC', opticName: auth.name });
    setItems(data);
  }

  useEffect(() => { load(); }, []);

  async function createOrder(e) {
    e.preventDefault();
    if (!form.customerName || !form.labName) return alert('Cliente y Laboratorio son obligatorios');
    await api.orders.create({
      customer: { name: form.customerName },
      optic: { name: auth.name },
      lab: { name: form.labName },
      lensSpec: { material: form.material, index: form.index },
      notes: form.notes
    });
    setForm({ customerName:'', labName:'', material:'Poly', index:'1.59', notes:'' });
    load();
  }

  return (
    <main style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h2>Óptica: {auth.name}</h2>

      <section style={{ border: '1px solid #eee', padding: 12, borderRadius: 12, marginTop: 12 }}>
        <h3>Nueva orden de laboratorio</h3>
        <form onSubmit={createOrder} style={{ display:'grid', gap:8 }}>
          <input placeholder="Nombre del cliente" value={form.customerName} onChange={e=>setForm({...form, customerName:e.target.value})}/>
          <input placeholder="Nombre del laboratorio" value={form.labName} onChange={e=>setForm({...form, labName:e.target.value})}/>
          <div style={{ display:'flex', gap:8 }}>
            <select value={form.material} onChange={e=>setForm({...form, material:e.target.value})}>
              <option>CR39</option>
              <option>Poly</option>
              <option>Hi-Index</option>
            </select>
            <input placeholder="Índice" value={form.index} onChange={e=>setForm({...form, index:e.target.value})}/>
          </div>
          <textarea placeholder="Notas (opcional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          <button>Enviar al laboratorio</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Mis órdenes</h3>
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
          <thead>
            <tr><th>ID</th><th>Cliente</th><th>Laboratorio</th><th>Estado</th><th>Creado</th></tr>
          </thead>
          <tbody>
            {items.map(o=>(
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer?.name}</td>
                <td>{o.lab?.name}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
