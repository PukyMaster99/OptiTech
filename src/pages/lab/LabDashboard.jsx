import { useEffect, useState } from 'react';
import { api, getAuth } from '../../lib/api';

const FLOW = ['RECEIVED','IN_PROCESS','READY','DELIVERED'];

export default function LabDashboard() {
  const auth = getAuth(); // { role:'LAB', name:'...' }
  const [items, setItems] = useState([]);

  async function load() {
    const data = await api.orders.listByRole({ role: 'LAB', labName: auth.name });
    setItems(data);
  }
  useEffect(()=>{ load(); }, []);

  function nextStatus(s) {
    const i = FLOW.indexOf(s);
    return i < FLOW.length - 1 ? FLOW[i+1] : null;
  }

  async function advance(o) {
    const to = nextStatus(o.status);
    if (!to) return alert('Ya está en el último estado');
    await api.orders.setStatus(o.id, to, `Cambio a ${to}`);
    load();
  }

  return (
    <main style={{ maxWidth: 900, margin:'24px auto', padding:16 }}>
      <h2>Laboratorio: {auth.name}</h2>
      <table width="100%" border="1" cellPadding="6" style={{ borderCollapse:'collapse' }}>
        <thead>
          <tr><th>ID</th><th>Óptica</th><th>Cliente</th><th>Estado</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {items.map(o=>(
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.optic?.name}</td>
              <td>{o.customer?.name}</td>
              <td>{o.status}</td>
              <td><button onClick={()=>advance(o)}>Avanzar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
