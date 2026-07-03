'use client'
export default function HorasExtrasPage() {
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Horas Extras</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>Controle de estouro e apontamentos</p>
      <iframe src="/dashboard.html" style={{ width: '100%', height: 'calc(100vh - 160px)', border: 'none', borderRadius: '16px' }} />
    </div>
  )
}
