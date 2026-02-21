import React, { useEffect, useState } from 'react';
import { noticeAPI } from '../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await noticeAPI.getNotices();
        setNotices(res.data.notices || []);
      } catch (err) {
        console.error('Failed to load notices', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(query.toLowerCase())
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (loading) return <div className="p-6">Loading notices…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notices</h1>
        <p className="text-sm text-slate-600">All notices broadcast to users</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search notices..."
          className="w-full md:w-1/2 p-2 border border-slate-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {current.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">No notices match your search.</div>
        ) : (
          current.map(n => (
            <button key={n._id} onClick={() => setSelected(n)} className="text-left p-4 bg-white rounded shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg">{n.title}</h3>
              <p className="text-xs text-slate-600">{formatDate(n.createdAt)}</p>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {page} / {pageCount}</span>
        <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p+1))} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Next</button>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{selected.title}</h2>
                <p className="text-sm text-slate-500">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500">Close</button>
            </div>
            <div className="mt-4 text-slate-700">{selected.content}</div>
            {selected.attachments && selected.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium">Attachments</h4>
                <ul className="list-disc list-inside text-sm text-slate-700">
                  {selected.attachments.map((att, i) => (
                    <li key={i}><a className="text-indigo-600" href={att.url} target="_blank" rel="noreferrer">{att.originalName || `File ${i+1}`}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
