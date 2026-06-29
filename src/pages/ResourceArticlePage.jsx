import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResource, fetchResources } from '../api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ArrowLeft, BookOpen, Sparkles, Clock, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  'Operations': 'bg-amber-100 text-amber-700',
  'Strategy': 'bg-indigo-100 text-indigo-700',
  'Growth': 'bg-emerald-100 text-emerald-700',
  'Technology': 'bg-cyan-100 text-cyan-700',
  'Finance': 'bg-purple-100 text-purple-700',
  'Case Study': 'bg-rose-100 text-rose-700',
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

const RELATED_ARTICLES = {
  '5-workflows-to-10m': ['the-hidden-tax', 'automation-first-agency'],
  'ai-vs-va': ['automation-first-agency', 'roi-of-automation'],
  'automated-crm': ['5-workflows-to-10m', 'the-hidden-tax'],
  'automation-first-agency': ['roi-of-automation', 'ai-vs-va'],
  'case-study-onboarding': ['5-workflows-to-10m', 'automation-first-agency'],
  'roi-of-automation': ['the-hidden-tax', 'automated-crm'],
  'the-hidden-tax': ['roi-of-automation', '5-workflows-to-10m'],
};

export default function ResourceArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allResources, setAllResources] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchResource(slug)
      .then(data => {
        setResource(data);
      })
      .catch(err => setError(err.message || 'Resource not found'))
      .finally(() => setLoading(false));
    
    // Fetch all resources for sidebar/related links
    fetchResources().then(setAllResources).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-4xl mb-4">📄</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-slate-500 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
          <Link to="/resources" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const relatedSlugs = RELATED_ARTICLES[slug] || [];
  const relatedArticles = allResources.filter(r => relatedSlugs.includes(r.slug));

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/resources" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">All Resources</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-lg text-slate-900">AutomateOS</span>
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      {resource.hero && (
        <div className="w-full max-w-4xl mx-auto">
          <img
            src={resource.hero}
            alt={resource.title}
            className="w-full h-56 md:h-72 object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Meta */}
        <div className="flex items-center flex-wrap gap-3 text-sm mb-6">
          {resource.category && (
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              CATEGORY_COLORS[resource.category] || 'bg-slate-100 text-slate-600'
            }`}>
              {resource.category}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-400">
            <BookOpen className="w-3.5 h-3.5" />
            Article
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {READ_TIME[slug] || '4 min read'}
          </span>
        </div>

        {/* Title from markdown, but use manifest title if available */}
        {resource.title && (
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
            {resource.title}
          </h1>
        )}

        {/* Content rendered from markdown */}
        <div className="bg-white rounded-2xl">
          <MarkdownRenderer content={resource.content} />
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to automate your agency?</h3>
          <p className="text-slate-600 mb-6">Book a $299 Automation Audit and get a prioritized roadmap to reclaim your team's time.</p>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Book Your Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedArticles.map(article => (
                <Link
                  key={article.slug}
                  to={`/resources/${article.slug}`}
                  className="group p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all"
                >
                  <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 text-sm">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500">{article.excerpt.slice(0, 100)}...</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between text-sm text-slate-400">
          <span>© 2026 AutomateOS. All rights reserved.</span>
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        </div>
      </footer>
    </div>
  );
}