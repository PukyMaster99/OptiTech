import { useEffect, useState } from 'react';
import { api, getAuth } from '../../lib/api';
import { Timeline } from '../../components/Timeline';

export default function CustomerApp() {
  const auth = getAuth(); // { role:'CUSTOMER', name:'...' }
  const [items, setItems] = useState([]);

  async function load() {
    const data = await api.orders.listByRole({ role: 'CUSTOMER', customerName: auth.name });
    setItems(data);
  }
  useEffect(()=>{ load(); }, []);

  return (
    <main style={{ maxWidth: 900, margin:'24px auto', padding:16 }}>
      <h2>Hola, {auth.name}</h2>
      <p>Aquí ves el estado de tus pedidos.</p>
      {items.length === 0 ? <p>No tienes pedidos aún.</p> : null}

      {items.map(o=>(
        <section key={o.id} style={{ border:'1px solid #eee', padding:12, borderRadius:12, marginTop:12 }}>
          <h3>Pedido {o.id}</h3>
          <p><b>Óptica:</b> {o.optic?.name} — <b>Laboratorio:</b> {o.lab?.name}</p>
          <p><b>Estado actual:</b> {o.status}</p>
          <Timeline history={o.history}/>
        </section>
      ))}
    </main>
  );
}
