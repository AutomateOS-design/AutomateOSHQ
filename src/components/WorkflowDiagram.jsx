import React from 'react';

const WorkflowDiagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 280" fill="none" className={className}>
    <defs>
      <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#14B8A6"/>
      </linearGradient>
      <linearGradient id="darkBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1120"/>
        <stop offset="100%" stopColor="#172032"/>
      </linearGradient>
      <linearGradient id="cardGrad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E293B"/>
        <stop offset="100%" stopColor="#172032"/>
      </linearGradient>
      <marker id="arrowIndigo" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#6366F1"/>
      </marker>
      <marker id="arrowTeal" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#14B8A6"/>
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.388  0 0 0 0 0.4  0 0 0 0 0.945  0 0 0 0.2 0"/>
      </filter>
    </defs>
    <g opacity="0.03">
      <line x1="0" y1="0" x2="900" y2="0" stroke="#6366F1" strokeWidth="0.5"/>
      <line x1="0" y1="70" x2="900" y2="70" stroke="#6366F1" strokeWidth="0.5"/>
      <line x1="0" y1="140" x2="900" y2="140" stroke="#6366F1" strokeWidth="0.5"/>
      <line x1="0" y1="210" x2="900" y2="210" stroke="#6366F1" strokeWidth="0.5"/>
      <line x1="0" y1="280" x2="900" y2="280" stroke="#6366F1" strokeWidth="0.5"/>
    </g>
    <g transform="translate(30, 50)">
      <rect width="160" height="180" rx="16" fill="url(#cardGrad1)" stroke="#1E293B" strokeWidth="1.5"/>
      <circle cx="80" cy="40" r="20" fill="#6366F1" opacity="0.15"/>
      <circle cx="80" cy="40" r="10" fill="#6366F1" opacity="0.3"/>
      <path d="M74 37L80 43L88 35" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="80" y="85" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#F1F5F9" textAnchor="middle">Lead Capture</text>
      <text x="80" y="105" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">Web forms, email,</text>
      <text x="80" y="120" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">and landing pages</text>
      <rect x="50" y="140" width="60" height="20" rx="10" fill="#6366F1" opacity="0.12"/>
      <text x="80" y="154" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="700" fill="#818CF8" textAnchor="middle">INPUT</text>
    </g>
    <g>
      <line x1="190" y1="140" x2="250" y2="140" stroke="#6366F1" strokeWidth="2.5" markerEnd="url(#arrowIndigo)"/>
      <circle cx="220" cy="140" r="2" fill="#6366F1" filter="url(#glow)"/>
    </g>
    <g transform="translate(260, 50)">
      <rect width="160" height="180" rx="16" fill="url(#cardGrad1)" stroke="#6366F1" strokeWidth="1.5"/>
      <rect x="-2" y="-2" width="164" height="184" rx="18" fill="none" stroke="#6366F1" strokeWidth="0.5" opacity="0.3" filter="url(#softGlow)"/>
      <circle cx="80" cy="40" r="20" fill="#6366F1" opacity="0.15"/>
      <circle cx="80" cy="40" r="10" fill="url(#flowGrad)"/>
      <path d="M76 36 L80 40 L84 36" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="80" cy="44" r="2" fill="white"/>
      <text x="80" y="85" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#F1F5F9" textAnchor="middle">AI Qualification</text>
      <text x="80" y="105" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">GPT-4 / Claude</text>
      <text x="80" y="120" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">scores & enriches</text>
      <rect x="50" y="140" width="60" height="20" rx="10" fill="#6366F1" opacity="0.12"/>
      <text x="80" y="154" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="700" fill="#818CF8" textAnchor="middle">AI PROCESS</text>
    </g>
    <g>
      <line x1="420" y1="140" x2="480" y2="140" stroke="#14B8A6" strokeWidth="2.5" markerEnd="url(#arrowTeal)"/>
      <circle cx="450" cy="140" r="2" fill="#14B8A6" filter="url(#glow)"/>
    </g>
    <g transform="translate(490, 50)">
      <rect width="160" height="180" rx="16" fill="url(#cardGrad1)" stroke="#1E293B" strokeWidth="1.5"/>
      <circle cx="80" cy="40" r="20" fill="#14B8A6" opacity="0.12"/>
      <circle cx="80" cy="40" r="10" fill="#14B8A6" opacity="0.3"/>
      <path d="M74 37L77 37L77 43L74 43" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M80 34L80 46" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M86 37L83 37L83 43L86 43" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round"/>
      <text x="80" y="85" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#F1F5F9" textAnchor="middle">CRM Sync</text>
      <text x="80" y="105" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">Salesforce, HubSpot</text>
      <text x="80" y="120" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">auto-updated</text>
      <rect x="50" y="140" width="60" height="20" rx="10" fill="#14B8A6" opacity="0.12"/>
      <text x="80" y="154" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="700" fill="#2DD4BF" textAnchor="middle">OUTPUT</text>
    </g>
    <g>
      <line x1="650" y1="140" x2="710" y2="140" stroke="#14B8A6" strokeWidth="2.5" markerEnd="url(#arrowTeal)"/>
      <circle cx="680" cy="140" r="2" fill="#14B8A6" filter="url(#glow)"/>
    </g>
    <g transform="translate(720, 50)">
      <rect width="150" height="180" rx="16" fill="url(#cardGrad1)" stroke="#1E293B" strokeWidth="1.5"/>
      <circle cx="75" cy="40" r="20" fill="#F59E0B" opacity="0.1"/>
      <circle cx="75" cy="40" r="10" fill="#F59E0B" opacity="0.25"/>
      <path d="M75 34V42" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M75 45V46" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="75" y="85" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#F1F5F9" textAnchor="middle">Slack Alert</text>
      <text x="75" y="105" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">Team notified in</text>
      <text x="75" y="120" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#94A3B8" textAnchor="middle">under 60 seconds</text>
      <rect x="45" y="140" width="60" height="20" rx="10" fill="#F59E0B" opacity="0.12"/>
      <text x="75" y="154" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="700" fill="#FBBF24" textAnchor="middle">NOTIFY</text>
    </g>
    <text x="450" y="260" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill="#475569" textAnchor="middle" letterSpacing="0.08em">FULLY AUTOMATED PIPELINE — TYPICAL SETUP: 48 HOURS</text>
  </svg>
);

export default WorkflowDiagram;
