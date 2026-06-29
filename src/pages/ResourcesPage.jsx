import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchResources } from '../api';
import { BookOpen, ArrowRight, Clock, Sparkles, ArrowLeft } from 'lucide-react';

const CATEGORY_COLORS = {
  'Operations': 'bg-amber-100 text-amber-700 border-amber-200',
  'Strategy': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Growth': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Technology': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Finance': 'bg-purple-100 text-purple-700 border-purple-200',
  'Case Study': 'bg-rose-100 text-rose-700 border-rose-200',
};

const READ_TIME = {
  '5-workflows-to-10m': '5 min read',
  'ai-vs-va': '4 min read',
  'automated-crm': '4 min read',
  'automation-first-agency': '4 min read',
  'case-study-onboarding': '4 min read',
  'roi-of-automation': '4 min read',
  'the-hidden-tax': '3 min read',
};

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources()
      .then(setResources)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900">AutomateOS</span>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span className="text-indigo-400 font-semibold uppercase tracking-wider text-sm">Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agency Growth Library</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Actionable guides, case studies, and insights to help you scale your agency with automation.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Loading resources...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">Failed to load resources</p>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No resources available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && resources.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.slug}
                to={`/resources/${resource.slug}`}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col"
              >
                {/* Thumbnail */}
                {resource.thumbnail && (
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                {!resource.thumbnail && (
                  <div className="h-20 flex items-center justify-center text-3xl bg-gradient-to-br from-indigo-50 to-slate-50">
                    {resource.slug === '5-workflows-to-10m' ? '🚀' :
                     resource.slug === 'ai-vs-va' ? '🤖' :
                     resource.slug === 'automated-crm' ? '📊' :
                     resource.slug === 'automation-first-agency' ? '🏢' :
                     resource.slug === 'case-study-onboarding' ? '📋' :
                     resource.slug === 'roi-of-automation' ? '💰' :
                     resource.slug === 'the-hidden-tax' ? '⚠️' : '📄'}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  {/* Category Badge */}
                  {resource.category && (
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border mb-3 w-fit ${
                      CATEGORY_COLORS[resource.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {resource.category}
                    </span>
                  )}

                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                    {resource.title}
                  </h2>

                  <p className="text-sm text-slate-500 leading-relaxed flex-grow mb-4 line-clamp-3">
                    {resource.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {READ_TIME[resource.slug] || '4 min read'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between text-sm text-slate-400">
          <span>© 2026 AutomateOS. All rights reserved.</span>
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}