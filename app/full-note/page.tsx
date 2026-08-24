'use client';

/* eslint-disable @next/next/no-css-tags -- route-specific source stylesheets are intentionally preserved */

import FinancialAccountingNote from './FinancialAccountingNote';

export default function FullNotePage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/full-note/tokens.css" />
      <link rel="stylesheet" href="/assets/full-note/base.css" />
      <link rel="stylesheet" href="/assets/full-note/content.css" />
      <div className="full-note-page">
        <FinancialAccountingNote />
      </div>
    </>
  );
}
