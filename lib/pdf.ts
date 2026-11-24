/**
 * Tiny dependency-free PDF writer for the demo's "mock downloads".
 * Produces a valid single-page PDF with a header band and text lines.
 */
function esc(s: string) {
  return s.replace(/[\\()]/g, (m) => "\\" + m).replace(/[^\x20-\x7E]/g, (ch) => (ch === "₦" ? "NGN " : ch === "—" || ch === "–" ? "-" : ch === "·" ? "-" : "?"));
}

export function makePdf(title: string, lines: string[], subtitle = "God's Help Autos · Ojodu Berger, Lagos · 0806 575 4819") {
  const content: string[] = [];
  // header band
  content.push("0.059 0.122 0.239 rg 0 742 612 100 re f");
  content.push("BT /F2 22 Tf 1 1 1 rg 48 790 Td (" + esc("GOD'S HELP AUTOS") + ") Tj ET");
  content.push("BT /F1 10 Tf 0.85 0.85 0.85 rg 48 770 Td (" + esc(subtitle) + ") Tj ET");
  content.push("BT /F2 18 Tf 0.07 0.07 0.07 rg 48 700 Td (" + esc(title) + ") Tj ET");
  content.push("0.83 0.64 0.3 rg 48 688 60 3 re f");
  let y = 660;
  for (const line of lines) {
    const bold = line.startsWith("**");
    const text = bold ? line.slice(2) : line;
    content.push(`BT /${bold ? "F2" : "F1"} 11 Tf 0.15 0.15 0.15 rg 48 ${y} Td (${esc(text)}) Tj ET`);
    y -= bold ? 22 : 18;
  }
  content.push("BT /F1 8 Tf 0.5 0.5 0.5 rg 48 40 Td (" + esc("DEMO DOCUMENT - sample data generated for demonstration purposes only.") + ") Tj ET");
  const stream = content.join("\n");

  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => (pdf += `${String(o).padStart(10, "0")} 00000 n \n`));
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadPdf(filename: string, title: string, lines: string[]) {
  const blob = makePdf(title, lines);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const clean = filename.replace(/[:/\\?*"<>|]+/g, "").replace(/\s+/g, " ").trim();
  a.download = clean.endsWith(".pdf") ? clean : `${clean}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
