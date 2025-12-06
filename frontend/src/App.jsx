import { useEffect, useState } from 'react';
import { BACKEND_BASE } from '../config';

export default function App(){
  const [lancamentos, setLancamentos] = useState([]);
  const [agendaDia, setAgendaDia] = useState([]);
  const [agendaSS, setAgendaSS] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(()=> {
    const t = setInterval(()=> setNow(new Date()), 1000);
    return ()=> clearInterval(t);
  },[]);

  async function load(){
    try{
      const [l,a,s] = await Promise.all([
        fetch(`${BACKEND_BASE}/lancamentos`).then(r=>r.json()).catch(()=>[]),
        fetch(`${BACKEND_BASE}/agenda-dia`).then(r=>r.json()).catch(()=>[]),
        fetch(`${BACKEND_BASE}/agenda-servico-social`).then(r=>r.json()).catch(()=>[]),
      ]);
      setLancamentos(l);
      setAgendaDia(a);
      setAgendaSS(s);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(()=> {
    load();
    const id = setInterval(load, 60000); // 60s
    return ()=> clearInterval(id);
  },[]);

  const renderTable = (title, cols, data) => (
    <section className="card">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>{cols.map(c=> <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.slice(0,20).map((row, i) => (
            <tr key={i}>
              {cols.map(c=> {
                const v = row[c] ?? row[c.toLowerCase()] ?? '';
                const cls = (c.toLowerCase()==='status' && v==='Em andamento') ? 'status-em' :
                            (c.toLowerCase()==='status' && v==='Concluído') ? 'status-ok' : '';
                return <td key={c} className={cls}>{v}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <div style={{padding:20,fontFamily:'system-ui, sans-serif', background:'#0b1220', minHeight:'100vh', color:'#eef2ff'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1>Painel Frota Realtime</h1>
          <div>{now.toLocaleDateString()} — {now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
        </div>
        <div>Empresa</div>
      </header>

      <main style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:16}}>
        {renderTable('Movimentação — Diário de Bordo', ['Data','Hora','Veículo','Condutor','Passageiro','Itinerário','Status'], lancamentos)}
        {renderTable('Agenda do Dia', ['Data','Hora','Passageiro','Setor','Motivo','Itinerário','Status'], agendaDia)}
        {renderTable('Agenda Serviço Social', ['Data','Período','Passageiro','Setor','Motivo','Itinerário','Status'], agendaSS)}
      </main>
    </div>
  )
}
