// ── API helpers ──────────────────────────────────────────────────────────────
const API = {
  async getAll() {
    const r = await fetch('/api/transactions');
    return r.json();
  },
  async create(data) {
    const r = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { ok: r.ok, data: await r.json() };
  },
  async update(id, data) {
    const r = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { ok: r.ok, data: await r.json() };
  },
  async delete(id) {
    const r = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    return r.ok;
  },
  async stats() {
    const r = await fetch('/api/stats');
    return r.json();
  }
};
