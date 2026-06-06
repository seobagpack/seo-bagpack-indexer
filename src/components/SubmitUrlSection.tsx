import React, { useState } from 'react';
import { Send, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export function SubmitUrlSection({ onSubmitted }: { onSubmitted: () => void }) {
  const [urlsText, setUrlsText] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{count: number} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = urlsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (urls.length === 0) return;

    setLoading(true);
    setSuccess(null);
    try {
      const res = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess({ count: data.count });
        setUrlsText('');
        if (onSubmitted) {
          onSubmitted();
        }
      }
    } catch (err) {
      console.error("Failed to submit URLs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Batch URL Submission</h2>
        <p className="text-slate-500 text-sm">
          Paste the URLs you want to send to Google Search bot for crawling and indexing. 
          Enter one URL per line.
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-800">Successfully queued!</h4>
            <p className="text-sm text-green-700 mt-1">
              {success.count} URLs have been added to the indexing queue. Go to the dashboard to monitor progress.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-slate-700 mb-2">
            URLs to Index <span className="text-slate-400 font-normal">(Required)</span>
          </label>
          <textarea
            id="urls"
            rows={10}
            className="w-full rounded-lg border-slate-300 border bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono shadow-inner outline-none transition-all placeholder-slate-400"
            placeholder="https://example.com/new-post&#10;https://example.com/updated-page"
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Notification Email <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border-slate-300 border bg-slate-50 pl-4 pr-10 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-indigo-500 shadow-inner placeholder-slate-400"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            We will email you when these links are successfully indexed or if they fail.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || urlsText.trim().length === 0}
            className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Submit to Google Bot
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
 
