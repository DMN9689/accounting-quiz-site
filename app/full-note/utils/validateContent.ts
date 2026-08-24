import type { AccountingNote, MarkType } from "../types/content";

export type ContentValidationError = {
  code: string;
  path: string;
  message: string;
};

export type ContentValidationResult = {
  valid: boolean;
  errors: ContentValidationError[];
};

export type ContentValidationOptions = {
  knownCorrectionIds?: ReadonlySet<string>;
};

type UnknownRecord = Record<string, unknown>;

type JournalLineValidation = {
  sum: number;
  comparable: boolean;
};

const CHAPTER_ID_PATTERN = /^ch-0[1-9]$/;
const THEORY_ID_PATTERN = /^ch-0[1-9]-t\d{2}$/;
const HTML_TAG_PATTERN = /<\/?[a-z][^>]*>/i;
const allowedMarks: ReadonlySet<string> = new Set<MarkType>([
  "bold",
  "highlight",
  "account",
  "warning",
]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addError(
  errors: ContentValidationError[],
  code: string,
  path: string,
  message: string,
): void {
  errors.push({ code, path, message });
}

function validateSourcePages(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): void {
  if (!Array.isArray(value)) {
    addError(errors, "SOURCE_PAGES_INVALID", path, "sourcePages must be an array.");
    return;
  }

  value.forEach((page, index) => {
    const pagePath = `${path}[${index}]`;

    if (page === 1) {
      addError(
        errors,
        "SOURCE_PAGE_EXCLUDED",
        pagePath,
        `Source page ${page} is excluded from site content.`,
      );
      return;
    }

    if (typeof page !== "number" || !Number.isInteger(page) || page < 2 || page > 37) {
      addError(
        errors,
        "SOURCE_PAGE_OUT_OF_RANGE",
        pagePath,
        "Source pages must be integers from 2 through 37.",
      );
    }
  });
}

function validateRichText(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): void {
  if (!Array.isArray(value)) {
    addError(errors, "RICHTEXT_INVALID", path, "RichText must be an array.");
    return;
  }

  value.forEach((segment, segmentIndex) => {
    const segmentPath = `${path}[${segmentIndex}]`;

    if (!isRecord(segment)) {
      addError(
        errors,
        "RICHTEXT_SEGMENT_INVALID",
        segmentPath,
        "A RichText segment must be an object.",
      );
      return;
    }

    if (typeof segment.text !== "string") {
      addError(
        errors,
        "RICHTEXT_TEXT_INVALID",
        `${segmentPath}.text`,
        "RichTextSegment.text must be a string.",
      );
    } else if (HTML_TAG_PATTERN.test(segment.text)) {
      addError(
        errors,
        "RICHTEXT_HTML_NOT_ALLOWED",
        `${segmentPath}.text`,
        "HTML tags are not allowed in RichTextSegment.text.",
      );
    }

    if (segment.marks === undefined) {
      return;
    }

    if (!Array.isArray(segment.marks)) {
      addError(
        errors,
        "RICHTEXT_MARKS_INVALID",
        `${segmentPath}.marks`,
        "RichTextSegment.marks must be an array.",
      );
      return;
    }

    segment.marks.forEach((mark, markIndex) => {
      if (typeof mark !== "string" || !allowedMarks.has(mark)) {
        addError(
          errors,
          "RICHTEXT_MARK_INVALID",
          `${segmentPath}.marks[${markIndex}]`,
          `Unsupported RichText mark: ${String(mark)}.`,
        );
      }
    });
  });
}

function validateSpan(
  value: unknown,
  defaultValue: number,
  code: string,
  path: string,
  errors: ContentValidationError[],
): number {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    addError(errors, code, path, "Table spans must be positive integers.");
    return defaultValue;
  }

  return value;
}

function findAvailableColumns(occupied: boolean[], colSpan: number): number {
  for (let start = 0; start <= occupied.length - colSpan; start += 1) {
    let available = true;

    for (let offset = 0; offset < colSpan; offset += 1) {
      if (occupied[start + offset]) {
        available = false;
        break;
      }
    }

    if (available) {
      return start;
    }
  }

  return -1;
}

function validateTable(
  block: UnknownRecord,
  path: string,
  errors: ContentValidationError[],
): void {
  if (block.caption !== undefined) {
    validateRichText(block.caption, `${path}.caption`, errors);
  }

  const columnCount = block.columnCount;
  const validColumnCount =
    typeof columnCount === "number" && Number.isInteger(columnCount) && columnCount > 0;

  if (!validColumnCount) {
    addError(
      errors,
      "TABLE_COLUMN_COUNT_INVALID",
      `${path}.columnCount`,
      "Table columnCount must be a positive integer.",
    );
  }

  if (!Array.isArray(block.rows)) {
    addError(errors, "TABLE_ROWS_INVALID", `${path}.rows`, "Table rows must be an array.");
    return;
  }

  let activeRowSpans = validColumnCount
    ? Array.from({ length: columnCount }, () => 0)
    : [];

  block.rows.forEach((row, rowIndex) => {
    const rowPath = `${path}.rows[${rowIndex}]`;

    if (!Array.isArray(row)) {
      addError(errors, "TABLE_ROW_INVALID", rowPath, "Each table row must be an array.");
      return;
    }

    const occupied = activeRowSpans.map((remainingRows) => remainingRows > 0);
    let placementFailed = false;

    row.forEach((cell, cellIndex) => {
      const cellPath = `${rowPath}[${cellIndex}]`;

      if (!isRecord(cell)) {
        addError(errors, "TABLE_CELL_INVALID", cellPath, "A table cell must be an object.");
        placementFailed = true;
        return;
      }

      validateRichText(cell.content, `${cellPath}.content`, errors);

      const rowSpan = validateSpan(
        cell.rowSpan,
        1,
        "TABLE_ROW_SPAN_INVALID",
        `${cellPath}.rowSpan`,
        errors,
      );
      const colSpan = validateSpan(
        cell.colSpan,
        1,
        "TABLE_COLUMN_SPAN_INVALID",
        `${cellPath}.colSpan`,
        errors,
      );

      if (!validColumnCount) {
        return;
      }

      const startColumn = findAvailableColumns(occupied, colSpan);

      if (startColumn < 0) {
        placementFailed = true;
        return;
      }

      for (let offset = 0; offset < colSpan; offset += 1) {
        const column = startColumn + offset;
        occupied[column] = true;
        activeRowSpans[column] = Math.max(activeRowSpans[column], rowSpan);
      }
    });

    if (validColumnCount && (placementFailed || occupied.some((value) => !value))) {
      addError(
        errors,
        "TABLE_COLUMN_COUNT_MISMATCH",
        rowPath,
        "The effective cell coverage for this row does not match columnCount.",
      );
    }

    if (validColumnCount) {
      activeRowSpans = activeRowSpans.map((remainingRows) =>
        Math.max(0, remainingRows - 1),
      );
    }
  });

  if (validColumnCount && activeRowSpans.some((remainingRows) => remainingRows > 0)) {
    addError(
      errors,
      "TABLE_ROW_SPAN_OUT_OF_BOUNDS",
      `${path}.rows`,
      "A rowSpan extends beyond the final table row.",
    );
  }
}

function validateContentBlock(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): void {
  if (!isRecord(value)) {
    addError(errors, "CONTENT_BLOCK_INVALID", path, "A content block must be an object.");
    return;
  }

  switch (value.type) {
    case "paragraph":
    case "formula":
    case "callout":
      validateRichText(value.content, `${path}.content`, errors);
      return;
    case "list":
      if (!Array.isArray(value.items)) {
        addError(errors, "CONTENT_LIST_INVALID", `${path}.items`, "List items must be an array.");
        return;
      }
      value.items.forEach((item, itemIndex) =>
        validateRichText(item, `${path}.items[${itemIndex}]`, errors),
      );
      return;
    case "table":
      validateTable(value, path, errors);
      return;
    default:
      addError(
        errors,
        "CONTENT_BLOCK_TYPE_INVALID",
        `${path}.type`,
        `Unsupported content block type: ${String(value.type)}.`,
      );
  }
}

function amountsMatch(left: number, right: number): boolean {
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(left), Math.abs(right)) * 4;
  return Math.abs(left - right) <= tolerance;
}

function validateJournalLines(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): JournalLineValidation {
  if (!Array.isArray(value)) {
    addError(errors, "JOURNAL_LINES_INVALID", path, "Journal lines must be an array.");
    return { sum: 0, comparable: false };
  }

  let sum = 0;
  let comparable = true;

  value.forEach((line, lineIndex) => {
    const linePath = `${path}[${lineIndex}]`;

    if (!isRecord(line)) {
      addError(errors, "JOURNAL_LINE_INVALID", linePath, "A journal line must be an object.");
      comparable = false;
      return;
    }

    if (typeof line.account !== "string" || line.account.trim().length === 0) {
      addError(
        errors,
        "JOURNAL_ACCOUNT_EMPTY",
        `${linePath}.account`,
        "Journal account names must not be empty.",
      );
    }

    if (typeof line.amount !== "number" || !Number.isFinite(line.amount)) {
      addError(
        errors,
        "JOURNAL_AMOUNT_INVALID",
        `${linePath}.amount`,
        "Journal amounts must be finite numbers.",
      );
      comparable = false;
      return;
    }

    if (line.amount < 0) {
      addError(
        errors,
        "JOURNAL_AMOUNT_NEGATIVE",
        `${linePath}.amount`,
        "Journal amounts must not be negative.",
      );
    }

    sum += line.amount;
  });

  return { sum, comparable };
}

function validateJournalEntry(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): void {
  if (!isRecord(value)) {
    addError(errors, "JOURNAL_ENTRY_INVALID", path, "A journal entry must be an object.");
    return;
  }

  const debit = validateJournalLines(value.debit, `${path}.debit`, errors);
  const credit = validateJournalLines(value.credit, `${path}.credit`, errors);

  if (debit.comparable && credit.comparable && !amountsMatch(debit.sum, credit.sum)) {
    addError(
      errors,
      "JOURNAL_ENTRY_UNBALANCED",
      path,
      `Debit total ${debit.sum} does not match credit total ${credit.sum}.`,
    );
  }
}

function validateJournalEntries(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
): void {
  if (!Array.isArray(value)) {
    addError(errors, "JOURNAL_ENTRIES_INVALID", path, "Journal entries must be an array.");
    return;
  }

  value.forEach((entry, entryIndex) =>
    validateJournalEntry(entry, `${path}[${entryIndex}]`, errors),
  );
}

function validateJournalExample(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
  journalExampleIds: Set<string>,
): void {
  if (!isRecord(value)) {
    addError(
      errors,
      "JOURNAL_EXAMPLE_INVALID",
      path,
      "A journal example must be an object.",
    );
    return;
  }

  if (typeof value.id !== "string") {
    addError(
      errors,
      "JOURNAL_EXAMPLE_ID_INVALID",
      `${path}.id`,
      "Journal example IDs must be strings.",
    );
  } else if (journalExampleIds.has(value.id)) {
    addError(
      errors,
      "JOURNAL_EXAMPLE_ID_DUPLICATE",
      `${path}.id`,
      `Duplicate journal example ID: ${value.id}.`,
    );
  } else {
    journalExampleIds.add(value.id);
  }

  validateSourcePages(value.sourcePages, `${path}.sourcePages`, errors);
  validateRichText(value.transaction, `${path}.transaction`, errors);

  if (value.note !== undefined) {
    validateRichText(value.note, `${path}.note`, errors);
  }

  if (value.presentation === "entries") {
    validateJournalEntries(value.entries, `${path}.entries`, errors);
    return;
  }

  if (value.presentation === "variants") {
    if (!Array.isArray(value.variants)) {
      addError(
        errors,
        "JOURNAL_VARIANTS_INVALID",
        `${path}.variants`,
        "Journal variants must be an array.",
      );
      return;
    }

    value.variants.forEach((variant, variantIndex) => {
      const variantPath = `${path}.variants[${variantIndex}]`;

      if (!isRecord(variant)) {
        addError(
          errors,
          "JOURNAL_VARIANT_INVALID",
          variantPath,
          "A journal variant must be an object.",
        );
        return;
      }

      validateJournalEntries(variant.entries, `${variantPath}.entries`, errors);
    });
    return;
  }

  addError(
    errors,
    "JOURNAL_PRESENTATION_INVALID",
    `${path}.presentation`,
    "Journal presentation must be entries or variants.",
  );
}

function validateCorrectionIds(
  value: unknown,
  path: string,
  errors: ContentValidationError[],
  options: ContentValidationOptions,
): void {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    addError(
      errors,
      "CORRECTION_IDS_INVALID",
      path,
      "correctionIds must be an array of strings.",
    );
    return;
  }

  value.forEach((correctionId, index) => {
    const correctionPath = `${path}[${index}]`;

    if (typeof correctionId !== "string") {
      addError(
        errors,
        "CORRECTION_ID_INVALID",
        correctionPath,
        "Each correction ID must be a string.",
      );
      return;
    }

    if (options.knownCorrectionIds && !options.knownCorrectionIds.has(correctionId)) {
      addError(
        errors,
        "CORRECTION_ID_UNKNOWN",
        correctionPath,
        `Unknown correction ID: ${correctionId}.`,
      );
    }
  });
}

export function validateContent(
  note: AccountingNote,
  options: ContentValidationOptions = {},
): ContentValidationResult {
  const errors: ContentValidationError[] = [];
  const chapterIds = new Set<string>();
  const chapterOrders = new Map<number, string>();
  const theoryIds = new Set<string>();
  const journalExampleIds = new Set<string>();
  const noteRecord = note as unknown;

  if (!isRecord(noteRecord) || !Array.isArray(noteRecord.chapters)) {
    addError(
      errors,
      "CHAPTERS_INVALID",
      "chapters",
      "AccountingNote.chapters must be an array.",
    );
    return { valid: false, errors };
  }

  noteRecord.chapters.forEach((chapter, chapterIndex) => {
    const chapterPath = `chapters[${chapterIndex}]`;

    if (!isRecord(chapter)) {
      addError(errors, "CHAPTER_INVALID", chapterPath, "A chapter must be an object.");
      return;
    }

    if (typeof chapter.id !== "string" || !CHAPTER_ID_PATTERN.test(chapter.id)) {
      addError(
        errors,
        "CHAPTER_ID_FORMAT",
        `${chapterPath}.id`,
        "Chapter IDs must use ch-01 through ch-09.",
      );
    } else if (chapterIds.has(chapter.id)) {
      addError(
        errors,
        "CHAPTER_ID_DUPLICATE",
        `${chapterPath}.id`,
        `Duplicate chapter ID: ${chapter.id}.`,
      );
    } else {
      chapterIds.add(chapter.id);
    }

    if (typeof chapter.order !== "number") {
      addError(
        errors,
        "CHAPTER_ORDER_INVALID",
        `${chapterPath}.order`,
        "Chapter order must be a number.",
      );
    } else if (chapterOrders.has(chapter.order)) {
      addError(
        errors,
        "CHAPTER_ORDER_DUPLICATE",
        `${chapterPath}.order`,
        `Duplicate chapter order: ${chapter.order}.`,
      );
    } else {
      chapterOrders.set(chapter.order, chapterPath);
    }

    validateSourcePages(chapter.sourcePages, `${chapterPath}.sourcePages`, errors);

    if (!Array.isArray(chapter.theories)) {
      addError(
        errors,
        "THEORIES_INVALID",
        `${chapterPath}.theories`,
        "Chapter theories must be an array.",
      );
      return;
    }

    const theoryOrders = new Map<number, string>();

    chapter.theories.forEach((theory, theoryIndex) => {
      const theoryPath = `${chapterPath}.theories[${theoryIndex}]`;

      if (!isRecord(theory)) {
        addError(errors, "THEORY_INVALID", theoryPath, "A theory must be an object.");
        return;
      }

      if (typeof theory.id !== "string" || !THEORY_ID_PATTERN.test(theory.id)) {
        addError(
          errors,
          "THEORY_ID_FORMAT",
          `${theoryPath}.id`,
          "Theory IDs must use the ch-xx-tNN format.",
        );
      } else if (theoryIds.has(theory.id)) {
        addError(
          errors,
          "THEORY_ID_DUPLICATE",
          `${theoryPath}.id`,
          `Duplicate theory ID: ${theory.id}.`,
        );
      } else {
        theoryIds.add(theory.id);
      }

      if (theory.chapterId !== chapter.id) {
        addError(
          errors,
          "THEORY_CHAPTER_MISMATCH",
          `${theoryPath}.chapterId`,
          `Theory chapterId ${String(theory.chapterId)} does not match parent ${String(chapter.id)}.`,
        );
      }

      if (typeof theory.order !== "number") {
        addError(
          errors,
          "THEORY_ORDER_INVALID",
          `${theoryPath}.order`,
          "Theory order must be a number.",
        );
      } else if (theoryOrders.has(theory.order)) {
        addError(
          errors,
          "THEORY_ORDER_DUPLICATE",
          `${theoryPath}.order`,
          `Duplicate theory order within chapter: ${theory.order}.`,
        );
      } else {
        theoryOrders.set(theory.order, theoryPath);
      }

      validateSourcePages(theory.sourcePages, `${theoryPath}.sourcePages`, errors);
      validateCorrectionIds(
        theory.correctionIds,
        `${theoryPath}.correctionIds`,
        errors,
        options,
      );

      if (!Array.isArray(theory.blocks)) {
        addError(
          errors,
          "CONTENT_BLOCKS_INVALID",
          `${theoryPath}.blocks`,
          "Theory blocks must be an array.",
        );
      } else {
        theory.blocks.forEach((block, blockIndex) =>
          validateContentBlock(block, `${theoryPath}.blocks[${blockIndex}]`, errors),
        );
      }

      if (theory.journal === undefined) {
        return;
      }

      if (!isRecord(theory.journal)) {
        addError(errors, "JOURNAL_INVALID", `${theoryPath}.journal`, "Journal must be an object.");
        return;
      }

      if (!isRecord(theory.journal.representative)) {
        addError(
          errors,
          "JOURNAL_REPRESENTATIVE_REQUIRED",
          `${theoryPath}.journal.representative`,
          "A journal must include a representative example.",
        );
      } else {
        validateJournalExample(
          theory.journal.representative,
          `${theoryPath}.journal.representative`,
          errors,
          journalExampleIds,
        );
      }

      if (!Array.isArray(theory.journal.extras)) {
        addError(
          errors,
          "JOURNAL_EXTRAS_INVALID",
          `${theoryPath}.journal.extras`,
          "Journal extras must be an array.",
        );
      } else {
        theory.journal.extras.forEach((example, exampleIndex) =>
          validateJournalExample(
            example,
            `${theoryPath}.journal.extras[${exampleIndex}]`,
            errors,
            journalExampleIds,
          ),
        );
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
