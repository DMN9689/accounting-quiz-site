import type { AccountingNote } from "../types/content";
import { chapter01 } from "./chapters/ch-01";
import { chapter02 } from "./chapters/ch-02";
import { chapter03 } from "./chapters/ch-03";
import { chapter04 } from "./chapters/ch-04";
import { chapter05 } from "./chapters/ch-05";
import { chapter06 } from "./chapters/ch-06";
import { chapter07 } from "./chapters/ch-07";
import { chapter08 } from "./chapters/ch-08";
import { chapter09 } from "./chapters/ch-09";

export const accountingNote: AccountingNote = {
  source: {
    title: "20260824 재무회계 수업자료",
    versionDate: "2026.08.24",
    pdfFile: "references/source/20260824_재무회계_쌤_p2-37.pdf",
    mdFile: "references/source/20260824_재무회계_쌤_p2-37.md",
    correctionLogFile: "docs/CORRECTION_LOG.md",
  },
  updatedAt: "2026.08.24",
  chapters: [
    chapter01,
    chapter02,
    chapter03,
    chapter04,
    chapter05,
    chapter06,
    chapter07,
    chapter08,
    chapter09,
  ],
};

export { chapter01 } from "./chapters/ch-01";
export { chapter02 } from "./chapters/ch-02";
export { chapter03 } from "./chapters/ch-03";
export { chapter04 } from "./chapters/ch-04";
export { chapter05 } from "./chapters/ch-05";
export { chapter06 } from "./chapters/ch-06";
export { chapter07 } from "./chapters/ch-07";
export { chapter08 } from "./chapters/ch-08";
export { chapter09 } from "./chapters/ch-09";
