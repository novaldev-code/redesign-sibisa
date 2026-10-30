(function(){
  const root = document.querySelector('[data-catalog-view]');
  if (!root) return;
  const view = root.getAttribute('data-catalog-view');
  const D = window.SIBISA_DATA;
  const datasets = D.datasets, visualizations = D.visualizations, infographics = D.infographics;
  const organizations = D.organizations, topics = D.topics;
  const pools = { dataset: datasets, visualisasi: visualizations, infografik: infographics };
  const pool = pools[view];
  const base = view === 'dataset' ? '../data.html' : (view === 'visualisasi' ? '../visualisasi.html' : '../infografik.html');
  // Actually base relative to pages/<view>.html? catalog page is pages/<view>.html, base same page.
  const baseHref = window.location.pathname;

  function orgName(slug){ const o = organizations.find(x=>x.slug===slug); return o?o.name:slug; }
  function orgShort(slug){ const o = organizations.find(x=>x.slug===slug); return o?o.short:slug; }
  function topicLabel(slug){ const t = topics.find(x=>x.slug===slug); return t?t.label:slug; }
  function topicIconName(slug){ const t = topics.find(x=>x.slug===slug); return t?t.icon:'chart'; }
  function normalizeText(v){ return (v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim(); }
  function formatDate(v){ const d=new Date(v+'T00:00:00Z'); if (isNaN(d.getTime())) return v; return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d); }

  const PAGE_SIZE = { dataset:8, visualisasi:6, infografik:6 };

  function parseQuery(){
    const p = new URLSearchParams(window.location.search);
    const sort = p.get('sort')||'terbaru';
    const page = parseInt(p.get('page')||'1',10);
    return {
      q: (p.get('q')||'').slice(0,120),
      topic: p.get('topic')||'',
      org: p.get('org')||'',
      year: p.get('year')||'',
      sort: (sort==='terlama'||sort==='judul')?sort:'terbaru',
      page: (Number.isFinite(page)&&page>0)?page:1
    };
  }

  function timestamp(item){
    const stamp = item.updated ? item.updated : `${item.year}-01-01`;
    return new Date(stamp+'T00:00:00Z').getTime();
  }
  function searchableText(item){
    const formats = item.formats ? item.formats.join(' ') : '';
    return normalizeText([item.title,item.description,orgName(item.org),orgShort(item.org),topicLabel(item.topic),String(item.year),formats].join(' '));
  }
  function filterCatalog(items,q){
    const needle = normalizeText(q.q);
    const matched = items.filter(item=>{
      if (q.topic && item.topic !== q.topic) return false;
      if (q.org && item.org !== q.org) return false;
      if (q.year && String(item.year) !== q.year) return false;
      if (needle && !searchableText(item).includes(needle)) return false;
      return true;
    });
    if (q.sort === 'judul') return matched.sort((a,b)=>a.title.localeCompare(b.title,'id'));
    const dir = q.sort==='terlama' ? 1 : -1;
    return matched.sort((a,b)=> dir*(timestamp(a)-timestamp(b)) || a.title.localeCompare(b.title,'id'));
  }
  function paginate(items,page,size){
    const pages = Math.max(1, Math.ceil(items.length/size));
    const current = Math.min(page,pages);
    const start = (current-1)*size;
    return { items: items.slice(start,start+size), page: current, pages, total: items.length, from: items.length?start+1:0, to: Math.min(start+size, items.length) };
  }
  function buildHref(q, overrides){
    const m = Object.assign({},q,overrides||{});
    const params = new URLSearchParams();
    if (m.q) params.set('q',m.q);
    if (m.topic) params.set('topic',m.topic);
    if (m.org) params.set('org',m.org);
    if (m.year) params.set('year',m.year);
    if (m.sort && m.sort!=='terbaru') params.set('sort',m.sort);
    if (m.page && m.page>1) params.set('page',String(m.page));
    const s = params.toString();
    return s ? (baseHref.split('?')[0]+'?'+s) : baseHref.split('?')[0];
  }

  const q = parseQuery();
  // set form values
  const form = document.getElementById('catalog-form');
  if (form) {
    if (form.q) form.q.value = q.q;
    if (form.topic) form.topic.value = q.topic;
    if (form.org) form.org.value = q.org;
    if (form.year) form.year.value = q.year;
    if (form.sort) form.sort.value = q.sort;
  }

  const result = paginate(filterCatalog(pool.slice(), q), q.page, PAGE_SIZE[view]);
  const resultsEl = document.getElementById('results');
  const statusEl = document.getElementById('result-status');
  const emptyEl = document.getElementById('empty-state');
  const pagEl = document.getElementById('pagination');

  // status
  const noun = view==='dataset'?'dataset':(view==='visualisasi'?'visualisasi':'infografik');
  if (statusEl) {
    if (result.total === 0) statusEl.innerHTML = `Tidak ada ${noun} yang cocok.`;
    else statusEl.innerHTML = `Menampilkan <strong>${result.from}–${result.to}</strong> dari <strong>${result.total}</strong> ${noun}`;
  }
  if (emptyEl) emptyEl.style.display = result.total===0 ? '' : 'none';

  // render items
  if (resultsEl) {
    if (view === 'dataset') {
      resultsEl.innerHTML = result.items.map(item => `
        <li>
          <article class="dataset-row">
            <div class="icon">${window.topicIcon(topicIconName(item.topic))}</div>
            <div class="body">
              <div class="meta-top">
                <span class="topic">${topicLabel(item.topic)}</span>
                <span class="tag ${item.license==='Terbuka'?'success':'gold'}">${item.license}</span>
              </div>
              <h3><a href="data/${item.slug}.html">${item.title}</a></h3>
              <p class="desc">${item.description}</p>
              <dl class="dl">
                <div><dt>Produsen</dt><dd>${orgName(item.org)}</dd></div>
                <div style="display:flex;align-items:center;gap:0.375rem"><dt>Diperbarui</dt><dd>${formatDate(item.updated)}</dd></div>
                <div class="formats">${item.formats.map(f=>`<dd>${f}</dd>`).join('')}</div>
              </dl>
            </div>
            <svg class="arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
          </article>
        </li>
      `).join('');
    } else {
      resultsEl.innerHTML = result.items.map(item => `
        <li class="flex">
          <article class="media-card">
            <div class="chart">${window.chartSVG(item.kind)}</div>
            <div class="body">
              <p class="meta">${topicLabel(item.topic)} <span>· ${item.year}</span></p>
              <h3><a href="${view==='visualisasi'?'visualisasi':'infografik'}/${item.slug}.html">${item.title}</a></h3>
              <p class="desc">${item.description}</p>
              <p class="org">${orgName(item.org)}</p>
            </div>
          </article>
        </li>
      `).join('');
    }
  }

  // pagination
  if (pagEl && result.pages > 1) {
    let html = '';
    const edge = 'page-btn';
    if (result.page > 1) html += `<a class="${edge}" href="${buildHref(q,{page:result.page-1})}" aria-label="Sebelumnya">&lsaquo;</a>`;
    else html += `<span class="${edge} disabled" aria-hidden="true">&lsaquo;</span>`;
    for (let n=1;n<=result.pages;n++){
      html += `<a class="${edge}${n===result.page?' active':''}" href="${buildHref(q,{page:n})}" aria-label="Halaman ${n}">${n}</a>`;
    }
    if (result.page < result.pages) html += `<a class="${edge}" href="${buildHref(q,{page:result.page+1})}" aria-label="Berikutnya">&rsaquo;</a>`;
    else html += `<span class="${edge} disabled" aria-hidden="true">&rsaquo;</span>`;
    pagEl.innerHTML = html;
  } else if (pagEl) { pagEl.innerHTML = ''; }
})();
