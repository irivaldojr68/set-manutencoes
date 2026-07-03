'use client'
import { useEffect, useState } from 'react'

export default function InicioPage() {
  const [dados, setDados] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const APPS_URL = 'https://script.google.com/macros/s/AKfycbzZPRr9FRLqJPbEBQioRSU8GkROXIMKk-I96yBN7kWDr2VQ6fXxxHofuTbbcXRsBPlYVQ/exec'

  useEffect(() => {
    carregarDados()
  }, [])

  function carregarDados() {
    const old = document.getElementById('jsonp-inicio')
    if (old) old.remove()

    window._jsonpInicio = (json: any) => {
      if (json.status === 'ok') {
        processarDados(json.data)
      }
      setLoading(false)
    }

    const script = document.createElement('script')
    script.id = 'jsonp-inicio'
    script.src = `${APPS_URL}?callback=_jsonpInicio`
    document.head.appendChild(script)
  }

  function processarDados(linhas: any[]) {
    const funcs: any = {}
    let totalHE = 0
    let estourou = 0
    let atencao = 0
    const adiantados: any = {}

    linhas.forEach((row: any) => {
      const mat = String(row['Matricula'] || '').trim()
      const nome = String(row['Nome'] || '').trim()
      if (!mat || !nome) return

      if (!funcs[mat]) funcs[mat] = { nome, he65: 0, he100: 0 }

      const toMin = (v: any) => {
        if (!v || v === '0') return 0
        const s = String(v)
        if (s.includes('GMT')) {
          const m = s.match(/(\d{1,2}):(\d{2}):\d{2}\s+GMT/)
          if (m) return parseInt(m[1]) * 60 + parseInt(m[2])
        }
        if (s.includes(':')) {
          const p = s.split(':')
          return parseInt(p[0]) * 60 + (parseInt(p[1]) || 0)
        }
        return 0
      }

      const he65 = toMin(row['Horas HE 65%'])
      const he100 = toMin(row['Horas HE 100%'])
      funcs[mat].he65 += he65
      funcs[mat].he100 += he100

      if (he65 >= 5 && he65 <= 29) {
        if (!adiantados[mat]) adiantados[mat] = { nome, dias: 0 }
        adiantados[mat].dias++
      }
    })

    const lista = Object.values(funcs) as any[]
    lista.forEach((f: any) => {
      f.total = f.he65 + f.he100
      totalHE += f.total
      if (f.total > 40 * 60) estourou++
      else if (f.total > 30 * 60) atencao++
    })

    const ranking = [...lista].sort((a: any, b: any) => b.total - a.total).slice(0, 5)
    const topAdiantados = Object.values(adiantados).sort((a: any, b: any) => b.dias - a.dias).slice(0, 5)

    const fmt = (m: number) => `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`

    setDados({
      total: lista.length,
      estourou,
      atencao,
      totalHE: fmt(totalHE),
      ranking: ranking.map((f: any) => ({ ...f, totalFmt: fmt(f.total) })),
      topAdiantados
    })
  }

  const cards = dados ? [
    { label: 'Funcionários', valor: dados.total, cor: '#7B2FBE', bg: 'linear-gradient(135deg,#5b1f9e,#7B2FBE)', icon: '👥' },
    { label: 'Estouraram Limite', valor: dados.estourou, cor: '#dc2626', bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', icon: '⚠️' },
    { label: 'Em Atenção', valor: dados.atencao, cor: '#d97706', bg: 'linear-gradient(135deg,#78350f,#d97706)', icon: '🔔' },
    { label: 'Total HE Acumuladas', valor: dados.totalHE, cor: '#059669', bg: 'linear-gradient(135deg,#064e3b,#059669)', icon: '⏱' },
  ] : []

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Visão Geral</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Resumo do período atual</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          Carregando dados...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {cards.map((c, i) => (
              <div key={i} style={{ background: c.bg, borderRadius: '16px', padding: '20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{c.icon}</div>
                <div style={{ fontSize: '11px', opacity: .7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{c.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>{c.valor}</div>
                <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              </div>
            ))}
          </div>

          {/* Ranking + Adiantados */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Top 5 HE */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', marginBottom: '16px' }}>🏆 Top 5 Horas Extras</div>
              {dados?.ranking?.map((f: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '13px', color: i < 3 ? '#fff' : '#64748b'
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.nome.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{ height: '4px', background: f.total > 2400 ? '#dc2626' : '#7B2FBE', borderRadius: '2px', width: `${Math.min((f.total / 3600) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: f.total > 2400 ? '#dc2626' : '#7B2FBE', flexShrink: 0 }}>{f.totalFmt}</div>
                </div>
              ))}
            </div>

            {/* Top adiantados */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', marginBottom: '16px' }}>🕐 Top Ponto Adiantado</div>
              {dados?.topAdiantados?.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Nenhuma ocorrência no período</div>
              ) : dados?.topAdiantados?.map((f: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '13px', color: '#d97706'
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.nome.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#d97706', flexShrink: 0 }}>{f.dias}d</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

declare global {
  interface Window { _jsonpInicio: any }
}
