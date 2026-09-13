const DATA = window.AF_DATA || [];

const META = {
  '4': {title:'IN4 인포 스퀘어', sub:'먹거리 입문 구역', feature:'분수', dir:'5丁目 ←   → 3丁目'},
  '5': {title:'EAT THE NORTH', sub:'라멘 · 카레 · 빵', feature:'성은비', dir:'6丁目 ←   → 4丁目'},
  '6': {title:'SAPPORO FOOD JAM', sub:'삿포로 푸드잼', feature:'야외 스테이지', dir:'7丁目 ←   → 5丁目'},
  '7': {title:'7丁目 BAR', sub:'술 · 안주 · 홋카이도 요리', feature:'분수', dir:'8丁目 ←   → 6丁目'},
  '8': {title:'홋카이도 시장', sub:'도내 시정촌 특산물', feature:'블랙 슬라이드 만트라', dir:'9丁目 ←   → 7丁目'},
  '10': {title:'고기 10丁目', sub:'홋카이도 육류 집중', feature:'가든 라운지', dir:'11丁目 ←   → 9丁目'},
  '11': {title:'CHEF’S & BEER TERRACE', sub:'셰프 · 맥주 테라스', feature:'분수', dir:'12丁目 ←   → 10丁目'}
};
const ORDER = ['4','5','6','7','8','10','11'];
const STORAGE_KEY = 'sapporo-autumnfest-2026-09-14-plan-v2';
const LEGACY_STORAGE_KEY = 'sapporo-autumnfest-2026-09-14-plan-v1';
const state = {venue:'4', mode:'map', selected:'1', q:'', openStores:new Set()};

function loadPlan(){
  try{
    const current = localStorage.getItem(STORAGE_KEY);
    const raw = JSON.parse(current || localStorage.getItem(LEGACY_STORAGE_KEY) || '{}');
    const menus = new Set(Array.isArray(raw.menus) ? raw.menus : []);
    let directStores = Array.isArray(raw.directStores) ? raw.directStores : null;
    if(!directStores){
      // v1 stored menu-driven automatic inclusions in stores too. During migration,
      // keep only store-only choices as direct selections; selected menus still
      // make their store appear through plannedStoreKeys().
      directStores = (Array.isArray(raw.stores) ? raw.stores : []).filter(key=>
        ![...menus].some(menu=>menu.startsWith(key+'|'))
      );
    }
    return {
      stores: new Set(directStores),
      menus
    };
  }catch(_){
    return {stores:new Set(), menus:new Set()};
  }
}
const plan = loadPlan();

function savePlan(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify({version:2,directStores:[...plan.stores], menus:[...plan.menus]}));
  }catch(_){ /* private mode/storage restrictions: keep in-memory state */ }
}
function storeKey(x){ return `${x.venue}|${x.no}`; }
function menuKey(x, index){ return `${storeKey(x)}|${index}`; }
function findStore(key){
  const [venue,no] = String(key).split('|');
  return DATA.find(x=>x.venue===venue && x.no===no);
}
function isStoreDirect(x){ return plan.stores.has(storeKey(x)); }
function isStorePicked(x){ return plannedStoreKeys().has(storeKey(x)); }
function isMenuPicked(x,index){ return plan.menus.has(menuKey(x,index)); }
function plannedStoreKeys(){
  const keys = new Set(plan.stores);
  for(const key of plan.menus){
    const [venue,no] = key.split('|');
    keys.add(`${venue}|${no}`);
  }
  return keys;
}
function toggleStore(x){
  const key = storeKey(x);
  if(isStorePicked(x)){
    plan.stores.delete(key);
    for(const menu of [...plan.menus]) if(menu.startsWith(key+'|')) plan.menus.delete(menu);
  }else{
    plan.stores.add(key);
  }
  savePlan();
}
function toggleMenu(x,index,checked){
  const key = menuKey(x,index);
  if(checked){
    plan.menus.add(key);
  }else{
    plan.menus.delete(key);
  }
  savePlan();
}

function setPos(map, no, left, top){ map[String(no)] = [left, top]; }

function buildPositions(venue){
  const p = {};
  if(venue === '4'){
    [['1',42,21],['2',46,21],['3',53,21],['4',57,21],['5',61,21],['6',69,21],['7',73,21],['8',79,21],['9',50,66],
     ['10',40,78],['11',44,78],['12',47,78],['13',54,78],['14',58,78],['15',69,78],['16',73,78],['17',76,78],['18',80,78],
     ['19',35,38],['20',35,45],['21',35,52],['22',35,59],['23',35,66],['24',35,73],['25',64,37],['26',64,44],['27',64,51],['28',64,58],['29',64,65],['30',64,72]
    ].forEach(x=>setPos(p,...x));
  }
  if(venue === '5'){
    [['R1',42,28],['R2',46,28],['R3',50,28],['R4',55,28],['R5',59,28],['6',66,34],['7',66,43],['8',66,52],['9',66,61],['10',66,70],
     ['11',56,76],['12',51,76],['13',25,76],['14',29,76],['15',34,70],['16',34,61],['17',34,54],['18',34,47],['19',34,40],['20',34,34],['21',34,28],['22',77,28],
     ['C1',42,76],['C2',46,76],['C3',49,76],['B1',70,28],['B2',73,28],['B3',76,28],['B4',79,28]
    ].forEach(x=>setPos(p,...x));
  }
  if(venue === '6'){
    [1,2].forEach((n,i)=>setPos(p,n,27+i*4,76));
    [3,4,5,6,7,8,9,10].forEach((n,i)=>setPos(p,n,[40,43,46,49,52,55,59,62][i],76));
    setPos(p,11,71,76); setPos(p,12,75,76);
    [13,14,15,16,17,18].forEach((n,i)=>setPos(p,n,32,[37,44,51,58,65,72][i]));
    [19,20,21,22,23,24].forEach((n,i)=>setPos(p,n,69,[37,44,51,58,65,72][i]));
  }
  if(venue === '7'){
    [['1',22,29],['2',40,29],['3',43,29],['4',46,29],['5',50,29],['6',53,29],['7',57,29],['8',60,29],['9',63,29],
     ['11',22,76],['12',27,76],['13',40,76],['14',43,76],['15',46,76],['16',50,76],['17',53,76],['18',56,76],['19',60,76],['20',63,76],
     ['BAR',82,52],['P',79,29]
    ].forEach(x=>setPos(p,...x));
  }
  if(venue === '8'){
    [2,3,4,5,6,7,8,9].forEach((n,i)=>setPos(p,n,[42,45,48,51,54,57,60,63][i],34));
    [[10,45],[11,48],[12,51],[13,57],[14,60],[15,63]].forEach(([n,x])=>setPos(p,n,x,42));
    [16,17,18,19,20,21,22].forEach((n,i)=>setPos(p,n,40,[39,46,53,60,67,74,81][i]));
    [23,24,25,26,27,28].forEach((n,i)=>setPos(p,n,[45,48,51,54,57,60][i],68));
    [29,30,31,32,33,34,35,36,37].forEach((n,i)=>setPos(p,n,[41,44,47,50,53,56,59,62,65][i],78));
    [38,39,40,41,42,43,44].forEach((n,i)=>setPos(p,n,66,[38,45,52,59,66,73,80][i]));
    [45,46,47,48].forEach((n,i)=>setPos(p,n,[75,78,81,84][i],30));
    setPos(p,49,81,78); setPos(p,'Z1',51,53); setPos(p,'Z2',84,86); setPos(p,'Z3',58,53);
  }
  if(venue === '10'){
    [1,2,3,4,5,6,7,8,9,10].forEach((n,i)=>setPos(p,n,[29,32,36,39,43,47,51,54,59,62][i],i===4||i===5?27:24));
    [11,12,13,14,15,16,17,18].forEach((n,i)=>setPos(p,n,[34,38,42,45,50,53,57,60][i],76));
    setPos(p,19,30,38); setPos(p,20,30,63); setPos(p,21,30,71);
    [22,23,24,25,26].forEach((n,i)=>setPos(p,n,66,[39,47,55,63,71][i]));
    setPos(p,'W',24,56);
  }
  if(venue === '11'){
    [['1',50,72],['2',36,69],['3',34,59],['4',34,49],['5',36,39],['6',43,29],['7',47,29],['8',51,29],['9',55,29],['10',59,29],['11',70,25],['12',65,34],['CUP',76,72]].forEach(x=>setPos(p,...x));
  }
  return p;
}

const POSITIONS = Object.fromEntries(ORDER.map(v=>[v,buildPositions(v)]));

function esc(s){
  return String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function money(p){
  p = String(p || '');
  if(!p) return '';
  if(/[¥円]|현장|상이|공식/.test(p)) return esc(p);
  return '¥' + esc(p);
}
function exactPrice(p){
  const raw = String(p || '').trim();
  if(!/^¥?\s*[\d,]+(?:円)?$/.test(raw)) return null;
  const n = Number(raw.replace(/[^\d]/g,''));
  return Number.isFinite(n) ? n : null;
}
function venueData(){ return DATA.filter(x=>x.venue===state.venue); }
function normalizeSearch(value){
  return String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
}
function searchTerms(){
  return state.q.trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
}
function storeSearchText(x){
  return normalizeSearch([x.venue+'丁目',x.no,x.name,x.cat,x.period,x.note].join(' '));
}
function menuSearchText(x,m){
  return normalizeSearch([storeSearchText(x),m.ko,m.ja,m.en,m.zh,m.price].join(' '));
}
function matchesTerms(text, terms=searchTerms()){
  return !terms.length || terms.every(term=>text.includes(term));
}
function matches(x){
  const terms = searchTerms();
  if(!terms.length) return true;
  if(matchesTerms(storeSearchText(x),terms)) return true;
  return (x.menus||[]).some(m=>matchesTerms(menuSearchText(x,m),terms));
}
function matchingMenus(x){
  const terms = searchTerms();
  if(!terms.length) return (x.menus||[]).map((m,i)=>({m,i}));
  const storeOnly = matchesTerms(storeSearchText(x),terms);
  const rows = (x.menus||[]).map((m,i)=>({m,i}));
  return storeOnly ? rows : rows.filter(({m})=>matchesTerms(menuSearchText(x,m),terms));
}
function displayNo(x){
  if(x.venue==='5'){
    if(/^R\d/.test(x.no)) return x.no.slice(1);
    if(/^B\d/.test(x.no)) return String(24 + Number(x.no.slice(1)));
    if(/^C\d/.test(x.no)) return 'C' + x.no.slice(1);
  }
  return x.no;
}
function renderVenueTabs(){
  const nav = document.getElementById('venueTabs');
  nav.classList.toggle('hidden', state.mode==='saved');
  nav.innerHTML = ORDER.map(v=>
    `<button class="${v===state.venue?'active':''}" data-venue="${v}">${v}丁目 <span>${DATA.filter(x=>x.venue===v).length}</span></button>`
  ).join('');
}
function storePickButton(x, compact=false){
  const picked = isStorePicked(x);
  return `<button type="button" class="store-pick ${picked?'picked':''} ${compact?'compact':''}" data-store-check="${esc(storeKey(x))}" aria-pressed="${picked}"><span class="pick-icon">${picked?'✓':'＋'}</span>${compact?'':`<span>${picked?'갈 곳':'갈 곳 체크'}</span>`}</button>`;
}
function menuRows(x, originalPrefix='', searchFilter=false){
  const rows = searchFilter ? matchingMenus(x) : (x.menus||[]).map((m,i)=>({m,i}));
  return rows.map(({m,i})=>{
    const picked = isMenuPicked(x,i);
    return `<tr class="${picked?'picked-menu':''}">
      <td class="menu-check-cell"><label class="menu-check" title="이 메뉴 체크"><input type="checkbox" data-menu-check="${esc(storeKey(x))}" data-menu-index="${i}" ${picked?'checked':''}><span>✓</span></label></td>
      <td><span class="ko">${esc(m.ko)}</span><span class="ja">${originalPrefix}${esc(m.ja)}</span></td>
      <td>${money(m.price)}</td>
    </tr>`;
  }).join('');
}

function detailPanel(x){
  if(!x) return '<div class="detail"><h3>가게를 선택하세요</h3></div>';
  return `<div class="detail">
    <div class="eyebrow">${esc(x.venue)}丁目 · ${esc(x.cat)} · ${esc(x.period)}</div>
    <div class="detail-title"><h3>${esc(x.name)}</h3>${storePickButton(x)}</div>
    <div class="meta2">부스 ${esc(displayNo(x))}${x.note?' · '+esc(x.note):''}</div>
    <table class="menu-table"><tbody>${menuRows(x)}</tbody></table>
  </div>`;
}
function storeRows(visible){
  return visible.map(x=>`<div class="store-row-wrap ${isStorePicked(x)?'picked':''}">
    ${storePickButton(x,true)}
    <button class="store-row ${x.no===state.selected?'active':''}" data-store="${esc(x.no)}"><span class="rno">${esc(displayNo(x))}</span><span class="rname">${esc(x.name)}</span><span class="rprice">${esc(x.price)}</span></button>
  </div>`).join('');
}
function mapView(){
  const all = venueData();
  const visible = all.filter(matches);
  let selected = all.find(x=>x.no===state.selected) || visible[0] || all[0];
  if(selected) state.selected = selected.no;
  const meta = META[state.venue];
  const pos = POSITIONS[state.venue];
  const featureClass = ['4','7','11'].includes(state.venue) ? 'feature round' : 'feature';
  return `<div class="venue-head"><div class="num">${state.venue}</div><h2>${esc(meta.title)}</h2><div class="sub">${esc(meta.sub)}</div></div>
    <div class="map-layout">
      <div class="map-wrap">
        <div class="schematic">
          <div class="roads"></div><div class="axis north">북</div><div class="axis south">남</div><div class="axis west">서</div><div class="axis east">동</div>
          <div class="${featureClass}">${esc(meta.feature)}</div><div class="dir">${esc(meta.dir)}</div>
          ${all.map(x=>{const xy=pos[x.no]||[88,88];return `<button aria-label="${esc(x.name)}" title="${esc(x.name)}" class="marker ${x.no===state.selected?'active':''} ${isStorePicked(x)?'picked':''} ${state.q&&matches(x)?'hasmatch':''} ${state.q&&!matches(x)?'hidden':''}" style="left:${xy[0]}%;top:${xy[1]}%" data-store="${esc(x.no)}">${esc(displayNo(x))}</button>`}).join('')}
        </div>
        <div class="map-note"><span>공식 MAP의 부스 번호 위치를 단순화한 배치도</span><span><b class="plan-dot"></b> 체크한 가게 · 번호를 누르면 상세 메뉴</span></div>
      </div>
      <aside class="side">
        ${detailPanel(selected)}
        <div class="store-index"><div class="index-head"><span>점포 목록</span><span>${visible.length}/${all.length}</span></div>
          <div class="store-rows">${storeRows(visible)}</div>
        </div>
      </aside>
    </div>`;
}
function listView(){
  const searching = !!searchTerms().length;
  const all = (searching ? DATA : venueData()).filter(matches);
  const meta = META[state.venue];
  const title = searching ? `검색 결과 ${all.length}곳` : `${state.venue}丁目 ${esc(meta.title)}`;
  const sub = searching ? `전체 행사장 검색 · “${esc(state.q.trim())}”` : `${esc(meta.sub)} · 한국어 상세 메뉴`;
  return `<div class="venue-head ${searching?'search-head':''}"><div class="num">${searching?'⌕':state.venue}</div><h2>${title}</h2><div class="sub">${sub}</div></div>
    <div class="menu-list">${all.map(x=>{
      const key=storeKey(x);
      const open=searching || state.openStores.has(key);
      const location=searching ? `${x.venue}丁目 #${esc(displayNo(x))}` : esc(displayNo(x));
      return `<div class="list-store ${open?'open':''} ${isStorePicked(x)?'picked':''}">
      <div class="list-summary-row">${storePickButton(x,true)}<button class="list-summary" data-open="${esc(key)}"><span class="ln">${location}</span><span class="lname">${esc(x.name)}</span><span class="cat">${esc(x.cat)} · ${esc(x.period)}</span><span class="lp">${esc(x.price)}</span></button></div>
      <div class="expanded"><table class="menu-table"><tbody>${menuRows(x,'원문 · ',searching)}</tbody></table>
      <div class="list-foot">${searching?'검색어와 일치하는 메뉴만 표시 중입니다.':'가게 왼쪽의 ＋로 갈 곳을 체크하고, 메뉴 행의 체크박스로 먹을 메뉴를 따로 선택할 수 있습니다.'}</div></div></div>`;
    }).join('') || '<div class="empty">검색 결과가 없습니다.</div>'}</div>`;
}

function savedView(){
  const keys = plannedStoreKeys();
  const stores = DATA.filter(x=>keys.has(storeKey(x)) && matches(x));
  const selectedMenus = [];
  for(const x of stores){
    (x.menus||[]).forEach((m,i)=>{ if(isMenuPicked(x,i)) selectedMenus.push({x,m,i}); });
  }
  let exactTotal = 0;
  let variableCount = 0;
  for(const {m} of selectedMenus){
    const p = exactPrice(m.price);
    if(p==null) variableCount++;
    else exactTotal += p;
  }
  const groups = ORDER.map(venue=>({venue,stores:stores.filter(x=>x.venue===venue)})).filter(g=>g.stores.length);
  return `<div class="saved-head">
    <div><div class="saved-kicker">MY AUTUMN FEST</div><h2>체크한 곳</h2><p>가게 ${stores.length}곳 · 선택 메뉴 ${selectedMenus.length}개</p></div>
    <div class="saved-total"><span>선택 메뉴 확정가 합계</span><b>${exactTotal?`¥${exactTotal.toLocaleString('ja-JP')}`:'—'}</b>${variableCount?`<small>범위·현장가 ${variableCount}개 별도</small>`:''}</div>
  </div>
  ${groups.length ? groups.map(g=>`<section class="plan-section"><div class="plan-section-head"><b>${g.venue}丁目</b><span>${g.stores.length}곳</span></div>
    <div class="plan-table"><div class="plan-tr plan-th"><span>위치</span><span>가게 / 메뉴</span><span>가격</span><span></span></div>
    ${g.stores.map(x=>{
      const menus=(x.menus||[]).map((m,i)=>({m,i})).filter(({i})=>isMenuPicked(x,i));
      if(!menus.length) return `<div class="plan-tr store-only"><span>${g.venue}丁目 #${esc(displayNo(x))}</span><span><b>${esc(x.name)}</b><small>메뉴 미선택</small></span><span>—</span><span><button class="plan-map" data-plan-open="${esc(storeKey(x))}">지도</button></span></div>`;
      return menus.map(({m,i},row)=>`<div class="plan-tr"><span>${row===0?`${g.venue}丁目 #${esc(displayNo(x))}`:''}</span><span>${row===0?`<b>${esc(x.name)}</b>`:''}<small class="picked-menu-name">${esc(m.ko)}</small></span><span>${money(m.price)}</span><span>${row===0?`<button class="plan-map" data-plan-open="${esc(storeKey(x))}">지도</button>`:''}</span></div>`).join('');
    }).join('')}</div></section>`).join('') : '<div class="empty saved-empty"><b>아직 체크한 곳이 없습니다.</b><span>지도나 메뉴 리스트에서 가게의 ＋ 또는 메뉴 체크박스를 누르면 여기에 모입니다.</span></div>'}
  <div class="saved-note">체크 내역은 이 브라우저의 로컬 저장소에 저장됩니다. 같은 iPhone·같은 브라우저에서 다시 열면 유지됩니다.</div>`;
}
function render(){
  renderVenueTabs();
  const count = plannedStoreKeys().size;
  const badge = document.getElementById('savedCount');
  if(badge) badge.textContent = count;
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  document.getElementById('app').innerHTML = state.mode==='map' ? mapView() : state.mode==='list' ? listView() : savedView();
}

document.addEventListener('click',e=>{
  const pick = e.target.closest('[data-store-check]');
  if(pick){
    const x = findStore(pick.dataset.storeCheck);
    if(x){ toggleStore(x); render(); }
    return;
  }
  const planOpen = e.target.closest('[data-plan-open]');
  if(planOpen){
    const x = findStore(planOpen.dataset.planOpen);
    if(x){ state.venue=x.venue; state.selected=x.no; state.mode='map'; state.q=''; document.getElementById('search').value=''; render(); }
    return;
  }
  const venue = e.target.closest('[data-venue]');
  if(venue){ state.venue=venue.dataset.venue; state.selected=(DATA.find(x=>x.venue===state.venue)||{}).no||''; render(); return; }
  const mode = e.target.closest('[data-mode]');
  if(mode){ state.mode=mode.dataset.mode; render(); return; }
  const store = e.target.closest('[data-store]');
  if(store){ state.selected=store.dataset.store; render(); return; }
  const open = e.target.closest('[data-open]');
  if(open){ const key=open.dataset.open; if(state.openStores.has(key)) state.openStores.delete(key); else state.openStores.add(key); render(); }
});

document.addEventListener('change',e=>{
  const input = e.target.closest('[data-menu-check]');
  if(!input) return;
  const x = findStore(input.dataset.menuCheck);
  const index = Number(input.dataset.menuIndex);
  if(x && Number.isInteger(index)){
    toggleMenu(x,index,input.checked);
    render();
  }
});

document.getElementById('search').addEventListener('input',e=>{ state.q=e.target.value; if(state.q.trim() && state.mode!=='saved') state.mode='list'; render(); });
render();
