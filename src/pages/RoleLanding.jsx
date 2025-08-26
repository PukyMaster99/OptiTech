import { Link } from 'react-router-dom';

export default function RoleLanding() {
  const roles = [
    { key: 'OPTIC', title: 'Óptica' },
    { key: 'LAB', title: 'Laboratorio' },
    { key: 'ADMIN', title: 'Administrador' },
    { key: 'CUSTOMER', title: 'Cliente' }
  ];
  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>Optitech</h1>
      <p>Elige cómo ingresar:</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
        {roles.map(r => (
          <Link key={r.key} to={`/login/${r.key}`} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12, textDecoration: 'none' }}>
            <h3>{r.title}</h3>
            <p style={{ opacity: 0.7 }}>Ingresar como {r.title.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
