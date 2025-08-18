const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

// Load manual content from src/lib/userManual.ts (exports a JS string)
const manualModule = require("../dist/src/lib/userManual.js");
// When running in Node dev environment, the module may not be built; fall back to reading public/USER_MANUAL.md
let manualText = "";
if (manualModule && typeof manualModule.default === "string") {
  manualText = manualModule.default;
} else {
  try {
    manualText = fs.readFileSync(
      path.join(__dirname, "../public/USER_MANUAL.md"),
      "utf8"
    );
  } catch (e) {
    console.error(
      "Could not load manual text from built module or public/USER_MANUAL.md",
      e.message
    );
    process.exit(1);
  }
}

const outPath = path.join(__dirname, "../public/USER_MANUAL.pdf");
const doc = new PDFDocument({ autoFirstPage: false });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

doc.addPage({ size: "A4", margin: 50 });
doc.font("Helvetica");
doc
  .fontSize(16)
  .text("Playwright Framework Generator - User Manual", { align: "left" });
doc.moveDown();
doc.fontSize(11);

const lines = manualText.split("\n");
for (const line of lines) {
  if (line.trim() === "") {
    doc.moveDown();
    continue;
  }
  doc.text(line);
}

doc.end();

stream.on("finish", () => {
  console.log("Generated", outPath);
});

stream.on("error", (err) => {
  console.error("Stream error", err);
});
