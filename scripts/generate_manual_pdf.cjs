const fs = require("fs");
const path = require("path");

// Very small and naive PDF generator: creates a PDF with fixed layout, one line per 14pt, pages A4
// Not a full PDF implementation, but enough for simple text manuals.

const infile = path.join(__dirname, "../public/USER_MANUAL.md");
const outfile = path.join(__dirname, "../public/USER_MANUAL.pdf");

let text;
try {
  text = fs.readFileSync(infile, "utf8");
} catch (e) {
  console.error("Cannot read USER_MANUAL.md:", e.message);
  process.exit(1);
}

const lines = text.replace("\r\n", "\n").split("\n");

// PDF basics
let objects = [];
let xref = [];
let currentOffset = 0;

function push(obj) {
  const str = obj + "\n";
  objects.push(str);
}

function addObject(content) {
  xref.push(currentOffset);
  const objStr = xref.length + " 0 obj\n" + content + "\nendobj\n";
  currentOffset += Buffer.byteLength(objStr, "utf8");
  return objStr;
}

// We'll build content streams for pages
const pageContents = [];
const pageWidth = 595; // ~A4 pt units (approx)
const pageHeight = 842;
const margin = 50;
const lineHeight = 14;
const usableHeight = pageHeight - margin * 2;
const linesPerPage = Math.floor(usableHeight / lineHeight);

let pageCount = Math.ceil(lines.length / linesPerPage);

let contentObjects = [];
for (let p = 0; p < pageCount; p++) {
  const start = p * linesPerPage;
  const end = Math.min(start + linesPerPage, lines.length);
  const pageLines = lines.slice(start, end);
  // build text stream
  let stream = "BT\n/F1 12 Tf\n";
  let y = pageHeight - margin - 12; // start y
  for (const line of pageLines) {
    const escaped = line.replace(/([\\()])/g, "\\$1");
    stream += `1 0 0 1 ${margin} ${y} Tm\n(${escaped}) Tj\n`;
    y -= lineHeight;
  }
  stream += "ET";
  const streamWrapped = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  contentObjects.push(streamWrapped);
}

// Start writing file
let pdf = "%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n";
currentOffset = Buffer.byteLength(pdf, "utf8");

// Font object (Use Helvetica)
const fontObjIndex = 1;
const fontObj = `${fontObjIndex} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
pdf += fontObj;
currentOffset += Buffer.byteLength(fontObj, "utf8");

let pageObjIndices = [];
let contentObjIndices = [];
for (let i = 0; i < contentObjects.length; i++) {
  const idx = 2 + i; // simple indexing
  const content = `${idx} 0 obj\n${contentObjects[i]}\nendobj\n`;
  pdf += content;
  contentObjIndices.push(idx);
  currentOffset += Buffer.byteLength(content, "utf8");
}

// Page objects
const firstPageObjIndex = 2 + contentObjects.length;
let pageIndices = [];
for (let p = 0; p < pageCount; p++) {
  const pageIdx = firstPageObjIndex + p;
  const contentIdx = contentObjIndices[p];
  const pageObj = `${pageIdx} 0 obj\n<< /Type /Page /Parent ${
    firstPageObjIndex + pageCount
  } 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjIndex} 0 R >> >> /Contents ${contentIdx} 0 R >>\nendobj\n`;
  pdf += pageObj;
  pageIndices.push(pageIdx);
  currentOffset += Buffer.byteLength(pageObj, "utf8");
}

// Pages container
const pagesIdx = firstPageObjIndex + pageCount;
let kids = pageIndices.map((i) => i + " 0 R").join(" ");
const pagesObj = `${pagesIdx} 0 obj\n<< /Type /Pages /Kids [ ${kids} ] /Count ${pageCount} >>\nendobj\n`;
pdf += pagesObj;
currentOffset += Buffer.byteLength(pagesObj, "utf8");

// Catalog
const catalogIdx = pagesIdx + 1;
const catalogObj = `${catalogIdx} 0 obj\n<< /Type /Catalog /Pages ${pagesIdx} 0 R >>\nendobj\n`;
pdf += catalogObj;
currentOffset += Buffer.byteLength(catalogObj, "utf8");

// xref
const xrefOffset = currentOffset;
let xrefTable = "xref\n0 " + (catalogIdx + 1) + "\n0000000000 65535 f \n";
let offset = Buffer.byteLength("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n", "utf8");

// Recompute offsets by reconstructing objects sequentially to be accurate
let cursor = 0;
let parts = [];
parts.push("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n");
parts.push(fontObj);
for (let i = 0; i < contentObjects.length; i++) {
  const idx = 2 + i;
  const content = `${idx} 0 obj\n${contentObjects[i]}\nendobj\n`;
  parts.push(content);
}
for (let p = 0; p < pageCount; p++) {
  const pageIdx = firstPageObjIndex + p;
  const contentIdx = contentObjIndices[p];
  const pageObj = `${pageIdx} 0 obj\n<< /Type /Page /Parent ${pagesIdx} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjIndex} 0 R >> >> /Contents ${contentIdx} 0 R >>\nendobj\n`;
  parts.push(pageObj);
}
parts.push(pagesObj);
parts.push(catalogObj);

let offsets = [];
let running = 0;
for (const part of parts) {
  offsets.push(running);
  running += Buffer.byteLength(part, "utf8");
}

let final = parts.join("");
let xrefStart = running;

let xrefEntries = "xref\n0 " + parts.length + "\n";
// first entry
xrefEntries += "0000000000 65535 f \n";
for (let i = 0; i < parts.length; i++) {
  const off = offsets[i];
  xrefEntries += String(off).padStart(10, "0") + " 00000 n \n";
}

final += xrefEntries;
final += `trailer\n<< /Size ${parts.length} /Root ${catalogIdx} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

try {
  fs.writeFileSync(outfile, final, "binary");
  console.log("Wrote", outfile);
} catch (e) {
  console.error("Failed to write PDF:", e.message);
  process.exit(1);
}
