import React from 'react';

/**
 * Simple Markdown renderer that converts markdown text to React elements.
 * Handles: headings, bold, italic, links, lists, paragraphs, horizontal rules.
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 my-4 text-slate-600 leading-relaxed">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (trimmed === '') {
      flushList();
      continue;
    }

    // Horizontal rule
    if (trimmed.startsWith('---')) {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="my-8 border-slate-200" />);
      continue;
    }

    // Heading
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-semibold text-slate-900 mt-8 mb-3">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl md:text-4xl font-bold text-slate-900 mt-6 mb-6">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // List item
    if (trimmed.match(/^[\d]+\.\s/) || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const itemText = trimmed.replace(/^[\d]+\.\s/, '').replace(/^[*-]\s/, '');
      listItems.push(renderInline(itemText));
      inList = true;
      continue;
    }

    // Bold-paragraph (e.g., "**The Problem:** ...")
    if (trimmed.startsWith('**')) {
      flushList();
      const boldEnd = trimmed.indexOf('**', 2);
      if (boldEnd !== -1) {
        const boldText = trimmed.slice(2, boldEnd);
        const rest = trimmed.slice(boldEnd + 2);
        elements.push(
          <p key={`p-${i}`} className="text-slate-600 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900">{boldText}</strong>
            {rest && <> {renderInline(rest)}</>}
          </p>
        );
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-slate-600 leading-relaxed mb-4">{renderInline(trimmed)}</p>
        );
      }
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-slate-600 leading-relaxed mb-4">{renderInline(trimmed)}</p>
    );
  }

  flushList();

  return <div className="prose prose-slate max-w-none">{elements}</div>;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold
    const boldStart = remaining.indexOf('**');
    if (boldStart !== -1) {
      parts.push(remaining.slice(0, boldStart));
      const boldEnd = remaining.indexOf('**', boldStart + 2);
      if (boldEnd !== -1) {
        parts.push(<strong key={`b-${parts.length}`} className="font-semibold text-slate-900">{remaining.slice(boldStart + 2, boldEnd)}</strong>);
        remaining = remaining.slice(boldEnd + 2);
        continue;
      }
    }

    // Italic
    const italicStart = remaining.indexOf('*');
    if (italicStart !== -1) {
      parts.push(remaining.slice(0, italicStart));
      const italicEnd = remaining.indexOf('*', italicStart + 1);
      if (italicEnd !== -1) {
        parts.push(<em key={`i-${parts.length}`} className="italic">{remaining.slice(italicStart + 1, italicEnd)}</em>);
        remaining = remaining.slice(italicEnd + 1);
        continue;
      }
    }

    // Link [text](url)
    const linkStart = remaining.indexOf('[');
    if (linkStart !== -1) {
      parts.push(remaining.slice(0, linkStart));
      const linkEnd = remaining.indexOf(']', linkStart);
      const parenStart = remaining.indexOf('(', linkEnd);
      const parenEnd = remaining.indexOf(')', parenStart);
      if (linkEnd !== -1 && parenStart !== -1 && parenEnd !== -1) {
        const linkText = remaining.slice(linkStart + 1, linkEnd);
        const linkUrl = remaining.slice(parenStart + 1, parenEnd);
        const isExternal = linkUrl.startsWith('http');
        parts.push(
          <a key={`a-${parts.length}`} href={linkUrl} className="text-indigo-600 hover:text-indigo-500 underline" target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
            {linkText}
          </a>
        );
        remaining = remaining.slice(parenEnd + 1);
        continue;
      }
    }

    // No more formatting found
    parts.push(remaining);
    break;
  }

  return parts.length > 0 ? parts : text;
}