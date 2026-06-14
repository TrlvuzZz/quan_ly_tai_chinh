import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'finance.db')


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            date     TEXT    NOT NULL,
            category TEXT    NOT NULL,
            type     TEXT    NOT NULL,
            amount   REAL    NOT NULL,
            note     TEXT
        )
    ''')
    conn.commit()
    conn.close()


# ---------- CRUD ----------

def get_all():
    conn = get_conn()
    rows = conn.execute(
        'SELECT * FROM transactions ORDER BY date DESC, id DESC'
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_one(tx_id):
    conn = get_conn()
    row = conn.execute('SELECT * FROM transactions WHERE id=?', (tx_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def create(date, category, tx_type, amount, note):
    conn = get_conn()
    cur = conn.execute(
        'INSERT INTO transactions (date, category, type, amount, note) VALUES (?,?,?,?,?)',
        (date, category, tx_type, amount, note or '')
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return get_one(new_id)


def update(tx_id, date, category, tx_type, amount, note):
    conn = get_conn()
    conn.execute(
        'UPDATE transactions SET date=?, category=?, type=?, amount=?, note=? WHERE id=?',
        (date, category, tx_type, amount, note or '', tx_id)
    )
    conn.commit()
    conn.close()
    return get_one(tx_id)


def delete(tx_id):
    conn = get_conn()
    conn.execute('DELETE FROM transactions WHERE id=?', (tx_id,))
    conn.commit()
    conn.close()


def get_stats():
    conn = get_conn()
    rows = conn.execute('SELECT type, SUM(amount) as total, COUNT(*) as cnt FROM transactions GROUP BY type').fetchall()
    conn.close()
    result = {'Thu': {'total': 0, 'count': 0}, 'Chi': {'total': 0, 'count': 0}}
    for r in rows:
        result[r['type']] = {'total': r['total'], 'count': r['cnt']}
    return result
