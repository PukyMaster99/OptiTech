import { useParams, useNavigate } from 'react-router-dom';
import { setAuth } from '../lib/api';
import { useState } from 'react';

export default function Login() {
  const { role } = useParams();
  const nav = useNavigate();
  const [name, setName] = useState('');

  const roleLabel = {
    OPTIC: 'Nombre de la Óptica',
    LAB: 'Nombre del Laboratorio',
    ADMIN: 'Tu nombre (admin)',
    CUSTOMER: 'Tu nombre (cliente)'
  }[role] || 'Nombre';

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return alert('Escribe un nombre');
    setAuth({ role, name });
    if (role === 'OPTIC') nav('/optic');
    else if (role === 'LAB') nav('/lab');
    else if (role === 'CUSTOMER') nav('/app');
    else nav('/admin');
  }

  return (
    <main style={{ maxWidth: 500, margin: '40px auto', padding: 16 }}>
      <h2>Ingresar como {role}</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <label>{roleLabel}
          <input value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <button>Entrar</button>
      </form>
    </main>
  );
}
