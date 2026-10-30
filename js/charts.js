window.chartSVG = function(kind){
  const grid = 'stroke="#dbe3ec"';
  const axis = 'stroke="#586a82" stroke-opacity="0.5"';
  if (kind === 'bar') {
    const bars = [{x:38,h:54},{x:78,h:88},{x:118,h:66},{x:158,h:108},{x:198,h:80},{x:238,h:118}];
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau grafik batang">';
    [40,80,120,160].forEach(y=>{ s += `<line x1="24" x2="296" y1="${y}" y2="${y}" ${grid}/>`; });
    s += `<line x1="24" x2="296" y1="170" y2="170" ${axis}/>`;
    bars.forEach((b,i)=>{ s += `<rect x="${b.x}" y="${170-b.h}" width="24" height="${b.h}" rx="3" fill="${i===5?'#b07d1a':'#0d3b66'}"/>`; });
    s += '</svg>'; return s;
  }
  if (kind === 'line') {
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau grafik garis">';
    [40,80,120,160].forEach(y=>{ s += `<line x1="24" x2="296" y1="${y}" y2="${y}" ${grid}/>`; });
    s += '<path d="M24 150 L74 128 L124 138 L174 90 L224 100 L296 44 L296 170 L24 170 Z" fill="#0d3b66" fill-opacity="0.1"/>';
    s += '<polyline points="24,150 74,128 124,138 174,90 224,100 296,44" fill="none" stroke="#0d3b66" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    [[74,128],[124,138],[174,90],[224,100]].forEach(([cx,cy])=>{ s += `<circle cx="${cx}" cy="${cy}" r="4" fill="#ffffff" stroke="#0d3b66" stroke-width="2.5"/>`; });
    s += '<circle cx="296" cy="44" r="5" fill="#b07d1a"/>';
    s += '</svg>'; return s;
  }
  if (kind === 'donut') {
    const circumference = 2*Math.PI*52;
    const slices = [{share:0.46,color:'#0d3b66'},{share:0.28,color:'#b07d1a'},{share:0.26,color:'#586a82'}];
    let offset=0;
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau diagram donat">';
    s += '<g transform="translate(160 95)"><g transform="rotate(-90)">';
    slices.forEach(sl=>{
      const length = sl.share*circumference;
      s += `<circle r="52" fill="none" stroke="${sl.color}" stroke-width="26" stroke-dasharray="${length} ${circumference-length}" stroke-dashoffset="${-offset}"/>`;
      offset += length;
    });
    s += '</g></g></svg>'; return s;
  }
  if (kind === 'radar') {
    const ring = r => [0,1,2,3,4].map(i=>{ const a=Math.PI*2*i/5-Math.PI/2; return `${(160+r*Math.cos(a)).toFixed(1)},${(95+r*Math.sin(a)).toFixed(1)}`; }).join(' ');
    const values=[0.9,0.62,0.78,0.5,0.85];
    const data = values.map((v,i)=>{ const a=Math.PI*2*i/5-Math.PI/2; return `${(160+70*v*Math.cos(a)).toFixed(1)},${(95+70*v*Math.sin(a)).toFixed(1)}`; }).join(' ');
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau radar">';
    [70,47,24].forEach(r=>{ s += `<polygon points="${ring(r)}" fill="none" stroke="#dbe3ec"/>`; });
    s += `<polygon points="${data}" stroke-width="2.5" stroke-linejoin="round" fill="#0d3b66" fill-opacity="0.2" stroke="#0d3b66"/>`;
    s += '</svg>'; return s;
  }
  if (kind === 'map') {
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau peta">';
    s += '<path d="M52 64 L110 34 L178 46 L236 38 L284 72 L270 132 L214 160 L150 150 L96 164 L48 124 Z" fill="#0d3b66" fill-opacity="0.1" stroke="#0d3b66" stroke-opacity="0.6" stroke-width="2" stroke-linejoin="round"/>';
    s += '<path d="M110 34 L124 96 L96 164" fill="none" stroke="#dbe3ec" stroke-width="1.5"/>';
    s += '<path d="M178 46 L170 108 L214 160" fill="none" stroke="#dbe3ec" stroke-width="1.5"/>';
    s += '<path d="M124 96 L170 108 L270 132" fill="none" stroke="#dbe3ec" stroke-width="1.5"/>';
    s += '<circle cx="124" cy="96" r="6" fill="#0d3b66"/><circle cx="198" cy="82" r="5" fill="#b07d1a"/><circle cx="236" cy="118" r="4" fill="#0d3b66"/>';
    s += '</svg>'; return s;
  }
  if (kind === 'poster') {
    let s = '<svg viewBox="0 0 320 190" role="img" aria-label="Pratinjau infografik">';
    s += '<rect x="40" y="18" width="240" height="26" rx="4" fill="#0d3b66"/>';
    s += '<rect x="40" y="56" width="110" height="58" rx="4" fill="#b07d1a" fill-opacity="0.25"/>';
    s += '<rect x="166" y="56" width="114" height="58" rx="4" fill="#0d3b66" fill-opacity="0.15"/>';
    s += '<rect x="40" y="126" width="240" height="8" rx="4" fill="#586a82" fill-opacity="0.3"/>';
    s += '<rect x="40" y="144" width="170" height="8" rx="4" fill="#586a82" fill-opacity="0.3"/>';
    s += '<circle cx="95" cy="85" r="16" fill="#b07d1a"/>';
    s += '<rect x="186" y="72" width="74" height="10" rx="3" fill="#0d3b66"/>';
    s += '<rect x="186" y="90" width="48" height="10" rx="3" fill="#0d3b66" fill-opacity="0.6"/>';
    s += '</svg>'; return s;
  }
  return '';
};
window.renderChart = function(kind){ return window.chartSVG(kind); };
