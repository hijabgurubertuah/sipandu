import { useState, useMemo } from 'react';
import { Search, X, FileText, ExternalLink, Activity, Building2, ChevronRight } from 'lucide-react';
import { DocumentItem, ServiceItem, DigitalSystemItem } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  services: ServiceItem[];
  systems: DigitalSystemItem[];
  onSelectDocument: (doc: DocumentItem) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  documents,
  services,
  systems,
  onSelectDocument
}: SearchModalProps) {
  useBodyScrollLock(isOpen);
  
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'doc' | 'service' | 'system'>('all');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        docs: documents.slice(0, 3),
        services: services.slice(0, 3),
        systems: systems.slice(0, 3)
      };
    }
    const q = query.toLowerCase();

    return {
      docs: documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.categoryLabel.toLowerCase().includes(q) ||
          d.clusterLabel.toLowerCase().includes(q) ||
          d.year.toString().includes(q)
      ),
      services: services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      ),
      systems: systems.filter(
        (sys) =>
          sys.name.toLowerCase().includes(q) ||
          sys.description.toLowerCase().includes(q) ||
          sys.categoryLabel.toLowerCase().includes(q)
      )
    };
  }, [query, documents, services, systems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center sm:items-start justify-center p-3 sm:p-4 pt-4 sm:pt-16 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl overflow-hidden my-auto sm:my-0 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Sticky Search Input Bar */}
        <div className="sticky top-0 z-10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci (contoh: CKG, PKP, Poli KIA, BPJS)..."
            className="w-full bg-transparent border-none outline-hidden text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-1.5 py-1 shrink-0"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
            aria-label="Tutup Pencarian"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400">Filter:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('doc')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              filterType === 'doc'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Dokumen & Data ({filteredResults.docs.length})
          </button>
          <button
            onClick={() => setFilterType('service')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              filterType === 'service'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Pelayanan Poli ({filteredResults.services.length})
          </button>
          <button
            onClick={() => setFilterType('system')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              filterType === 'system'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Sistem Digital ({filteredResults.systems.length})
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Documents Section */}
          {(filterType === 'all' || filterType === 'doc') && filteredResults.docs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dokumen & Gateway Data Dukung</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.docs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {doc.title}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                          {doc.year}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.categoryLabel} • {doc.clusterLabel}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {(filterType === 'all' || filterType === 'service') && filteredResults.services.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Layanan & Poliklinik Puskesmas</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {srv.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {srv.schedule} • {srv.room}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {srv.bpjsCovered ? 'BPJS Tercover' : 'Umum'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems Section */}
          {(filterType === 'all' || filterType === 'system') && filteredResults.systems.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Sistem Digital & Gateway Link</span>
              </div>
              <div className="space-y-1.5">
                {filteredResults.systems.map((sys) => (
                  <a
                    key={sys.id}
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{sys.name}</span>
                        {sys.badge && (
                          <span className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-normal">
                            {sys.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {sys.description}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {filteredResults.docs.length === 0 &&
            filteredResults.services.length === 0 &&
            filteredResults.systems.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                Tidak ditemukan data yang sesuai dengan kata kunci &quot;{query}&quot;.
              </div>
            )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Tips: Ketik nama program atau klaster untuk filter instan</span>
          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">ESC untuk menutup</span>
        </div>

      </div>
    </div>
  );
}
