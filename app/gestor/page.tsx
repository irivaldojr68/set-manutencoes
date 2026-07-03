'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Lancamento {
  id: string
  tipo: 'cobrado' | 'perdido'
  descricao: string
  horas_he65: number
  horas_he100: number
  valor_total: number
  periodo_de: string
  periodo_ate: string
  criado_em: string
}

export default function GestorPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    tipo: 'cobrado',
    descricao: '',
    horas_he65: '',
    horas_he100: '',
    valor_total: '',
    periodo_de: '',
    periodo_ate: '',
  })

  useEffect(() => {
    const u = localStorage.getItem('set_usuario')
    if (!u) { window.location.href = '/'; return }
    const usr = JSON.parse(u)
    if (usr.role === 'lider') { window.location.href = '/lider'; return }
    setUsuario(usr)
    carregarLancamentos()
  }, [])

  async function carregarLancamentos() {
    const { data } = await supabase
      .from('lancamentos')
      .select('*')
      .order('criado_em', { ascending: false })
    setLancamentos(data || [])
    setLoading(false)
  }

  async function salvarLancamento() {
    const { error } = await supabase.from('lancamentos').insert([{
      tipo: form.tipo,
      descricao: form.descricao,
      horas_he65: parseFloat(form.horas_he65) || 0,
      horas_he100: parseFloat(form.horas_he100) || 0,
      valor_total: parseFloat(form.valor_total) || 0,
      periodo_de: form.periodo_de || null,
      periodo_ate: form.periodo_ate || null,
    }])
    if (!error) {
      setModal(false)
      setForm({ tipo: 'cobrado', descricao: '', horas_he65: '', horas_he100: '', valor_total: '', periodo_de: '', periodo_ate: '' })
      carregarLancamentos()
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    await supabase.from('lancamentos').delete().eq('id', id)
    carregarLancamentos()
  }

  function logout() {
    localStorage.removeItem('set_usuario')
    window.location.href = '/'
  }

  const totalCobrado = lancamentos.filter(l => l.tipo === 'cobrado').reduce((s, l) => s + Number(l.valor_total), 0)
  const totalPerdido = lancamentos.filter(l => l.tipo === 'perdido').reduce((s, l) => s + Number(l.valor_total), 0)
  const saldo = totalCobrado - totalPerdido

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const fmtData = (d: string) => d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'

  if (!usuario) return null

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5b1f9e, #7B2FBE)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', color: '#fff', fontSize: '16px'
          }}>S</div>
          <div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '15px', lineHeight: 1 }}>ÁREA DO GESTOR</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>SET MANUTENÇÕES</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => window.location.href = '/lider'} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600'
          }}>Dashboard</button>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Olá, {usuario.nome.split(' ')[0]}</span>
          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer'
          }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Cobrado', valor: fmt(totalCobrado), cor: '#059669', bg: 'linear-gradient(135deg,#065f46,#059669)' },
            { label: 'Total Perdido', valor: fmt(totalPerdido), cor: '#dc2626', bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)' },
            { label: 'Saldo', valor: fmt(saldo), cor: saldo >= 0 ? '#059669' : '#dc2626', bg: saldo >= 0 ? 'linear-gradient(135deg,#065f46,#059669)' : 'linear-gradient(135deg,#7f1d1d,#dc2626)' },
          ].map((k, i) => (
            <div key={i} style={{ background: k.bg, borderRadius: '16px', padding: '24px', color: '#fff' }}>
              <div style={{ fontSize: '12px', opacity: .8, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{k.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800' }}>{k.valor}</div>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>Lançamentos</div>
            <button onClick={() => setModal(true)} style={{
              background: 'linear-gradient(135deg,#5b1f9e,#7B2FBE)', color: '#fff',
              border: 'none', borderRadius: '10px', padding: '10px 20px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer'
            }}>+ Novo Lançamento</button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Carregando...</div>
          ) : lancamentos.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Nenhum lançamento ainda</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Tipo', 'Descrição', 'HE 65%', 'HE 100%', 'Valor Total', 'Período', 'Data'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                  <th style={{ padding: '12px 16px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(l => (
                  <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: l.tipo === 'cobrado' ? '#dcfce7' : '#fee2e2',
                        color: l.tipo === 'cobrado' ? '#166534' : '#991b1b',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
                      }}>
                        {l.tipo === 'cobrado' ? '✓ Cobrado' : '✗ Perdido'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{l.descricao || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{l.horas_he65}h</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px' }}>{l.horas_he100}h</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '700', color: l.tipo === 'cobrado' ? '#059669' : '#dc2626' }}>
                      {fmt(Number(l.valor_total))}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b' }}>
                      {fmtData(l.periodo_de)} → {fmtData(l.periodo_ate)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(l.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => excluir(l.id)} style={{
                        background: '#fee2e2', color: '#dc2626', border: 'none',
                        borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer'
                      }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal novo lançamento */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>Novo Lançamento</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }}>
                  <option value="cobrado">Cobrado</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Valor Total (R$)</label>
                <input type="number" step="0.01" value={form.valor_total} onChange={e => setForm({...form, valor_total: e.target.value})}
                  placeholder="0,00"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Descrição</label>
              <input type="text" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                placeholder="Ex: HE referente ao ciclo 16/05 a 15/06"
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>HE 65% (horas)</label>
                <input type="number" step="0.1" value={form.horas_he65} onChange={e => setForm({...form, horas_he65: e.target.value})}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>HE 100% (horas)</label>
                <input type="number" step="0.1" value={form.horas_he100} onChange={e => setForm({...form, horas_he100: e.target.value})}
                  placeholder="0"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Período de</label>
                <input type="date" value={form.periodo_de} onChange={e => setForm({...form, periodo_de: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Período até</label>
                <input type="date" value={form.periodo_ate} onChange={e => setForm({...form, periodo_ate: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setModal(false)} style={{
                flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
                background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#64748b'
              }}>Cancelar</button>
              <button onClick={salvarLancamento} style={{
                flex: 2, padding: '12px',
                background: 'linear-gradient(135deg,#5b1f9e,#7B2FBE)', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}>Salvar Lançamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
