import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SecurityEvent } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import EmptyState from '../components/ui/EmptyState';
import {
  Database,
  Search,
  Filter,
  Info,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DataExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEvents();
      // Backend may return an array directly or a Page object { content: [...] }
      const raw = res.data;
      if (Array.isArray(raw)) {
        setEvents(raw);
      } else if (raw && Array.isArray((raw as any).content)) {
        setEvents((raw as any).content);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load telemetry security events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesSeverity =
      selectedSeverity === 'ALL' ||
      ev.severity.toUpperCase() === selectedSeverity.toUpperCase();
    const matchesSearch =
      searchTerm === '' ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.eventId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const currentPageEvents = filteredEvents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sample Data Notice Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/80 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Sample Data / Simulation Notice
            </h4>
            <p className="text-xs text-slate-300">
              These are seeded sample security events for demonstration and algorithmic threat vector verification.
            </p>
          </div>
        </div>
        <button
          onClick={fetchEvents}
          className="rounded-lg bg-[#1a2744] px-3 py-1.5 text-xs font-semibold text-cyan-400 border border-[#2a3a5c] hover:border-cyan-500/50 transition-colors"
        >
          Refresh Feed
        </button>
      </div>

      {/* Main Header & Filter Controls */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                Security Telemetry Explorer
              </h1>
              <p className="text-xs text-slate-400">
                Inspect raw network alerts, authentication attempts, and HTTP payloads
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event ID, payload, source..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-72 rounded-lg bg-[#0d1526] pl-9 pr-4 py-2 text-xs text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-[#2a3a5c]/60 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => {
                setSelectedSeverity(sev);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? 'bg-cyan-500 text-navy-900 shadow-md shadow-cyan-500/20'
                  : 'bg-[#0d1526] text-slate-300 hover:text-white border border-[#2a3a5c]'
              }`}
            >
              {sev}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-slate-400">
            Showing {filteredEvents.length} events
          </span>
        </div>
      </div>

      {loading && <LoadingSpinner label="Fetching telemetry logs..." />}

      {error && !loading && (
        <ErrorAlert
          title="Telemetry Ingestion Error"
          message={error}
          onRetry={fetchEvents}
        />
      )}

      {/* Events Table and Detail Drawer */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md transition-all ${
              selectedEvent ? 'lg:col-span-2' : 'lg:col-span-3'
            }`}
          >
            {filteredEvents.length === 0 ? (
              <EmptyState
                title="No Events Found"
                description="No telemetry events matched the selected filter criteria."
                action={{
                  label: 'Clear Filters',
                  onClick: () => {
                    setSelectedSeverity('ALL');
                    setSearchTerm('');
                  },
                }}
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111d36] text-slate-400 border-b border-[#2a3a5c] uppercase tracking-wider font-mono">
                      <tr>
                        <th className="px-5 py-3">Event ID</th>
                        <th className="px-5 py-3">Source Node</th>
                        <th className="px-5 py-3">Severity</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300 font-mono">
                      {currentPageEvents.map((ev) => (
                        <tr
                          key={ev.id || ev.eventId}
                          onClick={() => setSelectedEvent(ev)}
                          className={`cursor-pointer transition-colors ${
                            selectedEvent?.eventId === ev.eventId
                              ? 'bg-[#162244] border-l-4 border-cyan-400'
                              : 'hover:bg-[#162244]/50'
                          }`}
                        >
                          <td className="px-5 py-3.5 text-cyan-300 font-semibold">
                            {ev.eventId}
                          </td>
                          <td className="px-5 py-3.5 text-slate-200">
                            {ev.source}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={ev.severity} size="sm" />
                          </td>
                          <td className="px-5 py-3.5 font-sans font-medium text-slate-300">
                            {ev.type}
                          </td>
                          <td className="px-5 py-3.5 max-w-xs truncate text-slate-400 font-sans">
                            {ev.description}
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-400 font-sans">
                            {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'Recent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a3a5c] bg-[#0d1526]/50">
                  <span className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded bg-[#111d36] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors border border-[#2a3a5c]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="p-1.5 rounded bg-[#111d36] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors border border-[#2a3a5c]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Event Detail Panel */}
          {selectedEvent && (
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-lg space-y-4 lg:col-span-1 h-fit">
              <div className="flex items-center justify-between pb-3 border-b border-[#2a3a5c]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white font-mono">
                    {selectedEvent.eventId}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Severity:</span>
                  <StatusBadge status={selectedEvent.severity} size="md" />
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Source Node:</span>
                  <div className="p-2 rounded bg-[#0d1526] font-mono text-cyan-300 border border-[#2a3a5c]">
                    {selectedEvent.source}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Attack Classification:</span>
                  <div className="p-2 rounded bg-[#0d1526] font-mono text-slate-200 border border-[#2a3a5c]">
                    {selectedEvent.type}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Timestamp:</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedEvent.timestamp || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Event Payload / Trace:</span>
                  <div className="p-3 rounded bg-[#090d19] font-mono text-xs text-slate-300 border border-[#2a3a5c] break-words whitespace-pre-wrap">
                    {selectedEvent.description}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      // Navigate to KMP or Aho-Corasick with this text
                      navigate('/algorithm-lab', {
                        state: { selectedPayload: selectedEvent.description },
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500/20 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/40"
                  >
                    <span>Analyze in Algorithm Lab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
