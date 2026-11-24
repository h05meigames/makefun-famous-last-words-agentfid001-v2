import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The phone's last words at 1% battery: a survivor's complaint, not a
// farewell speech. The punch is the cause of death — the owner's
// "just one more video" — landing at the very end.
const ENTRY =
  "I survived a toilet drop, a toddler, and three cracked screens — only to die because you said 'just one more video.'";

const MAX_CHARS = 199;

function main() {
  const line = ENTRY.trim();
  if (line.length === 0) {
    throw new Error("entry is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");

  // Read-back verification: what we wrote must be exactly what we print.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== line) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  const hash = createHash("sha256").update(roundTrip, "utf8").digest("hex");
  console.log(line);
  console.log(`chars=${line.length} sha256=${hash}`);
}

main();
