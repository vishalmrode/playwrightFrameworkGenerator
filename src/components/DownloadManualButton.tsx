import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import USER_MANUAL_MD from '@/lib/userManual';

function convertMarkdownToHtml(md: string) {
  // Minimal markdown -> HTML converter for headings and lists
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '<br/>');
  // Wrap list items in <ul>
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*<\/li>)/gis, '<ul>$1</ul>');
  }
  return `<div style="font-family: Inter, Arial, sans-serif; padding:24px; color:#111">${html}</div>`;
}

export default function DownloadManualButton() {
  const handleDownload = () => {
    const html = convertMarkdownToHtml(USER_MANUAL_MD);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    // Render the manual and include a visible Save-as-PDF button the user can click
    const page = `
      <html>
        <head>
          <title>User Manual</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #111 }
            .toolbar { position: fixed; top: 12px; right: 12px; }
            .btn { background: #111; color: #fff; padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer }
            .content { margin-top: 48px }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button class="btn" id="savePdf">Save as PDF</button>
          </div>
          <div class="content">${html}</div>
          <script>
            document.getElementById('savePdf').addEventListener('click', () => {
              try { window.print(); } catch(e) { alert('Print dialog blocked. Please use your browser menu to Print/Save as PDF.'); }
            });
          </script>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(page);
    w.document.close();
    w.focus();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDownload} title="Download user manual as PDF">
      <Download className="w-4 h-4 mr-2" />
      Manual
    </Button>
  );
}
