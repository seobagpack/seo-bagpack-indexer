import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Download, RefreshCw, Globe, CheckCircle2, XCircle, Search, Clock, FileText } from 'lucide-react';
import { IndexingStatus, SubmittedUrl, SummaryStats } from '../types';

export function DashboardSection() {
  const [urls, setUrls] = useState<SubmittedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchUrls = async () => {
    try {
      const res = await fetch('/api/urls');
      const data = await res.json();
      setUrls(data.data || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
    // Poll every 3 seconds for realtime updates
    const interval = setInterval(fetchUrls, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats: SummaryStats = {
    total: urls.length,
    pending: urls.filter(u => u.status === 'pending').length,
    crawled: urls.filter(u => u.status === 'crawled').length,
    indexed: urls.filter(u => u.status === 'indexed').length,
    failed: urls.filter(u => u.status === 'failed').length,
  };

  const filteredUrls = urls.filter(u => 
    u.url.toLowerCase().includes(search.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCsv = () => {
    if (urls.length === 0) return;
    const headers = ['URL', 'Status', 'Submitted At', 'Last Updated', 'Email', 'Error'];
    const csvContent = [
      headers.join(','),
      ...urls.map(u => [
        `"${u.url}"`,
        `"${u.status}"`,
        `"${u.submittedAt}"`,
        `"${u.statusUpdatedAt}"`,
        `"${u.email || ''}"`,
        `"${u.errorMessage || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `seo_bagpack_indexer_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatusBadge = ({ status }: { status: IndexingStatus }) => {
    switch (status) {
      case 'indexed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Indexed</span>;
      case 'crawled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Globe className="w-3 h-3 mr-1" /> Crawled</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3 mr-1" /> Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Total URLs</h3>
            <span className="p-2 bg-slate-50 rounded-lg text-slate-600"><FileText className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Indexed (Google)</h3>
            <span className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-800">{stats.indexed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Crawled</h3>
            <span className="p-2 bg-blue-50 rounded-lg text-blue-600"><Globe className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-800">{stats.crawled}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
           <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Pending / Failed</h3>
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-bold font-mono mt-2 text-slate-800">
            {stats.pending} / <span className="text-red-500">{stats.failed}</span>
          </p>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto text-sm text-slate-500 flex-wrap justify-end">
            <span className="hidden md:inline mr-2 text-xs">
              Last auto-refresh: {format(lastRefreshed, 'HH:mm:ss')}
            </span>
            <button 
              onClick={fetchUrls}
              className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
               onClick={exportCsv}
               className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Current Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Email Notified
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredUrls.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    {urls.length === 0 ? "No URLs submitted yet. Add some to get started!" : "No URLs match your search."}
                  </td>
                </tr>
              ) : (
                filteredUrls.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer truncate max-w-[200px] md:max-w-[300px]">
                          {entry.url}
                        </div>
                      </div>
                      {entry.errorMessage && (
                        <div className="text-xs text-red-500 mt-1">{entry.errorMessage}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={entry.status} />
                      <div className="text-xs text-slate-400 mt-1">
                        Updated {format(parseISO(entry.statusUpdatedAt), 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell">
                      {format(parseISO(entry.submittedAt), 'MM/dd, HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden lg:table-cell">
                      {entry.email ? entry.email : <span className="text-slate-300">None</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
