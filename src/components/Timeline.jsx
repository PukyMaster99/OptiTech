export function Timeline({ history = [] }) {
  return (
    <ol style={{ display: 'grid', gap: 8, margin: 0, padding: 0 }}>
      {history.map((h, i) => (
        <li key={i} style={{ listStyle: 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, border: '1px solid' }} />
          <strong>{h.toStatus}</strong>
          <span style={{ opacity: 0.6 }}>{new Date(h.at).toLocaleString()}</span>
          {h.note ? <em style={{ opacity: 0.8 }}> — {h.note}</em> : null}
        </li>
      ))}
    </ol>
  );
}
