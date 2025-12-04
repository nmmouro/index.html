<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Painel Frota</title>
  <style>
    body { font-family: system-ui, sans-serif; background:#111; color:#fff; margin:0; padding:16px;}
    .grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;}
    .card { background: rgba(255,255,255,0.04); padding:12px; border-radius:10px;}
    .status-em { color: #f6e05e; font-weight:700; }
    .status-ok { color: #9ae6b4; font-weight:700; }
  </style>
</head>
<body>
  <header>
    <h1>Painel Frota — Em tempo real</h1>
    <div id="clock"></div>
  </header>

  <main class="grid">
    <section id="lancamentos" class="card"><h2>Lançamentos</h2><div class="loading">carregando...</div></section>
    <section id="agendaDia" class="card"><h2>Agenda do Dia</h2><div class="loading">carregando...</div></section>
    <section id="agendaSS" class="card"><h2>Agenda Serviço Social</h2><div class="loading">carregando...</div></section>
  </main>

  <script>
    const BASE = "https://<seu-projeto>.vercel.app/api"; // substitua
    function fmtTime(d){ return new Date(d).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); }
    async function load(){
      document.getElementById('clock').textContent = new Date().toLocaleString();
      const [l, a, s] = await Promise.all([
        fetch(BASE + '/lancamentos').then(r=>r.json()).catch(()=>[]),
        fetch(BASE + '/agenda-dia').then(r=>r.json()).catch(()=>[]),
        fetch(BASE + '/agenda-servico-social').then(r=>r.json()).catch(()=>[])
      ]);
      renderList('lancamentos', l, ['Data','Hora','Veículo','Condutor','Passageiro','itinerário','Status']);
      renderList('agendaDia', a, ['Data','Hora','Passageiro','Setor','Motivo','Itinerário','Status']);
      renderList('agendaSS', s, ['Data','Período','Passageiro','Setor','Motivo','Itinerário','Status']);
    }

    function renderList(containerId, items, cols){
      const el = document.getElementById(containerId);
      if(!items || items.length===0) { el.innerHTML = '<div>vazio</div>'; return; }
      let html = '<table style="width:100%"><thead><tr>' + cols.map(c=>`<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      items.slice(0,10).forEach(row=>{
        html += '<tr>' + cols.map(c=>{
          const v = row[c] ?? row[c.toLowerCase()] ?? '';
          if(c.toLowerCase().includes('status')){
            const cls = (v==='Em andamento')? 'status-em' : (v==='Concluído'?'status-ok':'');
            return `<td class="${cls}">${v}</td>`;
          }
          return `<td>${v}</td>`;
        }).join('') + '</tr>';
      });
      html += '</tbody></table>';
      el.innerHTML = html;
    }

    // auto refresh a cada 60s
    load();
    setInterval(load, 60*1000);
    setInterval(()=> document.getElementById('clock').textContent = new Date().toLocaleString(), 1000);
  </script>
</body>
</html>
