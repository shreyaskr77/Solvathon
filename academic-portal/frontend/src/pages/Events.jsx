import React, { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await eventAPI.getEvents();
        setEvents(res.data.events || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(query.toLowerCase()) ||
    (ev.description || '').toLowerCase().includes(query.toLowerCase())
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (loading) return <div className="p-6">Loading events…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-sm text-slate-600">Upcoming and past events</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search events..."
          className="w-full md:w-1/2 p-2 border border-slate-300 rounded"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {current.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">No events match your search.</div>
        ) : (
          current.map(ev => (
            <button key={ev._id} onClick={() => setSelected(ev)} className="text-left p-4 bg-white rounded shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg">{ev.title}</h3>
              <p className="text-sm text-slate-600">{formatDate(ev.date)} • {ev.location}</p>
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
                <p className="text-sm text-slate-500">{formatDate(selected.date)} • {selected.location}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500">Close</button>
            </div>
            <div className="mt-4 text-slate-700">{selected.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
