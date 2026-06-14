// ── State ────────────────────────────────────────────────────────────────────
let transactions = [];
let selectedId   = null;
let currentType  = 'Thu';
let filterType   = 'all';

// ── Formatters ───────────────────────────────────────────────────────────────
function fmt(n)      { return Math.abs(n).toLocaleString('vi-VN') + ' ₫'; }
function fmtShort(n) {
  const a = Math.abs(n);
  if (a >= 1e9) return (a/1e9).toFixed(1) + ' tỷ ₫';
  if (a >= 1e6) return (a/1e6).toFixed(1) + ' tr ₫';
  return a.toLocaleString('vi-VN') + ' ₫';
}
function parseAmt(s) { return parseFloat(s.replace(/[^\d]/g,'')) || 0; }
function formatAmountInput(el) {
  const raw = el.value.replace(/[^\d]/g,'');
  el.value = raw ? parseInt(raw).toLocaleString('vi-VN') : '';
}

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type='success') {
  const wrap = document.getElementById('toastWrap');
  const el   = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Clock ────────────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('topbarDate').textContent =
    now.toLocaleDateString('vi-VN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) +
    '  ' + now.toLocaleTimeString('vi-VN');
  const ts = 'Cập nhật: ' + now.toLocaleTimeString('vi-VN');
  const rt = document.getElementById('rateTime');
  const gt = document.getElementById('goldTime');
  if (rt) rt.textContent = ts;
  if (gt) gt.textContent = ts;
}

// ── Filters ──────────────────────────────────────────────────────────────────
function setFilter(type) {
  filterType = type;
  document.getElementById('fAll').className = 'filter-btn'           + (type==='all' ? ' active':'');
  document.getElementById('fThu').className = 'filter-btn thu'       + (type==='Thu' ? ' active':'');
  document.getElementById('fChi').className = 'filter-btn chi'       + (type==='Chi' ? ' active':'');
  renderList();
}

function setType(type) {
  currentType = type;
  document.getElementById('typeThu').className = 'type-btn thu' + (type==='Thu' ? ' active':'');
  document.getElementById('typeChi').className = 'type-btn chi' + (type==='Chi' ? ' active':'');
}

function getFiltered() {
  const q   = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('filterCat').value;
  const mon = document.getElementById('filterMonth').value;
  return transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (cat && t.category !== cat) return false;
    if (mon && !t.date.startsWith(mon)) return false;
    if (q && !t.category.toLowerCase().includes(q) && !(t.note||'').toLowerCase().includes(q)) return false;
    return true;
  });
}

// ── Render list ──────────────────────────────────────────────────────────────
function renderList() {
  const list     = document.getElementById('txList');
  const filtered = getFiltered();
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">📭 Không có giao dịch nào</div>';
    return;
  }
  list.innerHTML = filtered.map(t => `
    <div class="tx-item ${selectedId===t.id?'selected':''}" onclick="selectTransaction(${t.id})">
      <div class="tx-dot ${t.type==='Thu'?'thu':'chi'}"></div>
      <div class="tx-info">
        <div class="tx-cat">${t.category}</div>
        <div class="tx-date">${t.date}${t.note ? ' · '+t.note.substring(0,18) : ''}</div>
      </div>
      <div class="tx-amount ${t.type==='Thu'?'thu':'chi'}">
        ${t.type==='Thu'?'+':'-'}${fmtShort(t.amount)}
      </div>
    </div>
  `).join('');
}

// ── Render stats ─────────────────────────────────────────────────────────────
function updateStats() {
  const all = transactions;
  const thu = all.filter(t=>t.type==='Thu').reduce((s,t)=>s+t.amount,0);
  const chi = all.filter(t=>t.type==='Chi').reduce((s,t)=>s+t.amount,0);
  const net = thu - chi;

  document.getElementById('statThu').textContent   = fmt(thu);
  document.getElementById('statChi').textContent   = fmt(chi);
  document.getElementById('statNet').textContent   = (net<0?'-':'') + fmt(net);
  document.getElementById('statThuCount').textContent = all.filter(t=>t.type==='Thu').length + ' giao dịch';
  document.getElementById('statChiCount').textContent = all.filter(t=>t.type==='Chi').length + ' giao dịch';
  document.getElementById('statTotal').textContent    = all.length + ' giao dịch';
  document.getElementById('statNet').className = 'stat-value net ' + (net>=0?'positive':'negative');

  // Header
  document.getElementById('hdrThu').textContent = fmtShort(thu);
  document.getElementById('hdrChi').textContent = fmtShort(chi);
  const hdrNet = document.getElementById('hdrNet');
  hdrNet.textContent = (net<0?'-':'') + fmtShort(Math.abs(net));
  hdrNet.style.color = net>=0 ? 'var(--accent-blue)' : 'var(--accent-red)';

  // Export counters
  const months = new Set(all.map(t=>t.date.substring(0,7)));
  document.getElementById('expTotal').textContent  = all.length;
  document.getElementById('expMonths').textContent = months.size;

  // Category breakdown (Chi)
  const catMap = {};
  all.filter(t=>t.type==='Chi').forEach(t => { catMap[t.category]=(catMap[t.category]||0)+t.amount; });
  const cats   = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxVal = cats.length ? cats[0][1] : 1;
  const colors = ['#ef4444','#f59e0b','#8b5cf6','#3b82f6','#10b981','#ec4899'];
  document.getElementById('catBreakdown').innerHTML = cats.length
    ? cats.map(([name,val],i) => `
        <div class="cat-row">
          <div class="cat-label">${name}</div>
          <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round(val/maxVal*100)}%;background:${colors[i%colors.length]}"></div></div>
          <div class="cat-val">${fmtShort(val)}</div>
        </div>`).join('')
    : '<div style="color:var(--text-muted);font-size:11px;text-align:center;padding:10px;">Chưa có dữ liệu chi tiêu</div>';
}

// ── Update filter dropdowns ───────────────────────────────────────────────────
function updateFilterDropdowns() {
  const cats   = [...new Set(transactions.map(t=>t.category))].sort();
  const catEl  = document.getElementById('filterCat');
  const curCat = catEl.value;
  catEl.innerHTML = '<option value="">-- Tất cả danh mục --</option>' +
    cats.map(c=>`<option value="${c}" ${c===curCat?'selected':''}>${c}</option>`).join('');

  const months = [...new Set(transactions.map(t=>t.date.substring(0,7)))].sort().reverse();
  const monEl  = document.getElementById('filterMonth');
  const curMon = monEl.value;
  monEl.innerHTML = '<option value="">-- Tất cả tháng --</option>' +
    months.map(m=>`<option value="${m}" ${m===curMon?'selected':''}>${m}</option>`).join('');
}

// ── Full refresh ─────────────────────────────────────────────────────────────
async function refresh() {
  transactions = await API.getAll();
  updateStats();
  updateFilterDropdowns();
  renderList();
}

// ── CRUD ─────────────────────────────────────────────────────────────────────
async function saveTransaction() {
  const date     = document.getElementById('fDate').value;
  const category = document.getElementById('fCat').value.trim();
  const amount   = parseAmt(document.getElementById('fAmount').value);
  const note     = document.getElementById('fNote').value.trim();

  if (!date)     { showToast('Vui lòng chọn ngày!', 'error');               return; }
  if (!category) { showToast('Vui lòng nhập danh mục!', 'error');           return; }
  if (!amount)   { showToast('Vui lòng nhập số tiền hợp lệ!', 'error');     return; }

  const res = await API.create({ date, category, type: currentType, amount, note });
  if (!res.ok) { showToast(res.data.error || 'Lỗi!', 'error'); return; }
  showToast('✅ Đã thêm giao dịch!');
  clearForm();
  await refresh();
}

async function updateTransaction() {
  if (!selectedId) return;
  const date     = document.getElementById('fDate').value;
  const category = document.getElementById('fCat').value.trim();
  const amount   = parseAmt(document.getElementById('fAmount').value);
  const note     = document.getElementById('fNote').value.trim();

  if (!date || !category || !amount) { showToast('Vui lòng điền đầy đủ!', 'error'); return; }

  const res = await API.update(selectedId, { date, category, type: currentType, amount, note });
  if (!res.ok) { showToast(res.data.error || 'Lỗi!', 'error'); return; }
  showToast('✏️ Đã cập nhật!', 'info');
  clearForm();
  await refresh();
}

async function deleteTransaction() {
  if (!selectedId) return;
  if (!confirm('Xóa giao dịch này?')) return;
  const ok = await API.delete(selectedId);
  if (!ok) { showToast('Xóa thất bại!', 'error'); return; }
  showToast('🗑️ Đã xóa!', 'error');
  clearForm();
  await refresh();
}

function selectTransaction(id) {
  const t = transactions.find(x => x.id === id);
  if (!t) return;
  selectedId = id;
  document.getElementById('fDate').value   = t.date;
  document.getElementById('fCat').value    = t.category;
  document.getElementById('fAmount').value = t.amount.toLocaleString('vi-VN');
  document.getElementById('fNote').value   = t.note || '';
  setType(t.type);
  document.getElementById('btnSave').style.display   = 'none';
  document.getElementById('btnEdit').style.display   = 'inline-flex';
  document.getElementById('btnDelete').style.display = 'inline-flex';
  document.getElementById('formBadge').textContent   = 'Đang Sửa';
  document.getElementById('formBadge').className     = 'form-mode-badge edit';
  renderList();
}

function clearForm() {
  selectedId = null;
  document.getElementById('fDate').value   = new Date().toISOString().split('T')[0];
  document.getElementById('fCat').value    = '';
  document.getElementById('fAmount').value = '';
  document.getElementById('fNote').value   = '';
  setType('Thu');
  document.getElementById('btnSave').style.display   = 'inline-flex';
  document.getElementById('btnEdit').style.display   = 'none';
  document.getElementById('btnDelete').style.display = 'none';
  document.getElementById('formBadge').textContent   = 'Thêm Mới';
  document.getElementById('formBadge').className     = 'form-mode-badge';
  renderList();
}

// ── Export ───────────────────────────────────────────────────────────────────
function exportExcel() {
  if (!transactions.length) { showToast('Không có dữ liệu!', 'error'); return; }
  window.location.href = '/api/export/excel';
  showToast('📊 Đang tạo file Excel...', 'info');
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  updateClock();
  setInterval(updateClock, 1000);
  document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
  await refresh();
});
