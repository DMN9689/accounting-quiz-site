import type { RichText, TableCell } from "../types/content";
import { RichTextRenderer } from "./RichTextRenderer";

type SourceTableProps = {
  caption?: RichText;
  columnCount: number;
  rows: TableCell[][];
};

type CellPlacement = {
  cell: TableCell;
  startColumn: number;
  colSpan: number;
  rowSpan: number;
};

function toPlainText(content: RichText): string {
  return content.map((segment) => segment.text).join("");
}

function isColumnHeader(cell: TableCell): boolean {
  return cell.header === true && cell.scope !== "row";
}

function findOpenColumn(occupied: boolean[], colSpan: number): number {
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

  return 0;
}

function placeCells(rows: TableCell[][], columnCount: number): CellPlacement[][] {
  let remainingRowSpans = Array.from({ length: columnCount }, () => 0);

  return rows.map((row) => {
    const occupied = remainingRowSpans.map((remaining) => remaining > 0);
    const placements = row.map((cell) => {
      const colSpan = cell.colSpan ?? 1;
      const rowSpan = cell.rowSpan ?? 1;
      const startColumn = findOpenColumn(occupied, colSpan);

      for (let offset = 0; offset < colSpan; offset += 1) {
        const column = startColumn + offset;
        occupied[column] = true;
        remainingRowSpans[column] = Math.max(remainingRowSpans[column], rowSpan);
      }

      return { cell, startColumn, colSpan, rowSpan };
    });

    remainingRowSpans = remainingRowSpans.map((remaining) => Math.max(0, remaining - 1));
    return placements;
  });
}

export function SourceTable({ caption, columnCount, rows }: SourceTableProps) {
  const placements = placeCells(rows, columnCount);
  const columnLabels = Array.from({ length: columnCount }, () => "");

  placements.forEach((row) => {
    row.forEach(({ cell, startColumn, colSpan }) => {
      if (!isColumnHeader(cell)) {
        return;
      }

      const label = toPlainText(cell.content);
      for (let offset = 0; offset < colSpan; offset += 1) {
        if (!columnLabels[startColumn + offset]) {
          columnLabels[startColumn + offset] = label;
        }
      }
    });
  });

  const mobileRows = placements
    .map((row) => row.filter(({ cell }) => !isColumnHeader(cell)))
    .filter((row) => row.length > 0);

  const captionText = caption ? toPlainText(caption) : undefined;

  return (
    <div className="source-table-wrap">
      <table className="source-table source-table-desktop">
        {caption ? (
          <caption>
            <RichTextRenderer content={caption} />
          </caption>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const CellTag = cell.header ? "th" : "td";
                return (
                  <CellTag
                    key={cellIndex}
                    scope={cell.header ? cell.scope : undefined}
                    rowSpan={cell.rowSpan}
                    colSpan={cell.colSpan}
                  >
                    <RichTextRenderer content={cell.content} />
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="source-table-mobile" role="table" aria-label={captionText}>
        {caption ? (
          <div className="source-table-mobile-caption">
            <RichTextRenderer content={caption} />
          </div>
        ) : null}
        {mobileRows.map((row, rowIndex) => (
          <div className="source-table-mobile-row" role="row" key={rowIndex}>
            {row.map(({ cell, startColumn, colSpan, rowSpan }, cellIndex) => {
              const label = Array.from(
                new Set(columnLabels.slice(startColumn, startColumn + colSpan).filter(Boolean)),
              ).join(" / ");
              const role = cell.header
                ? cell.scope === "row"
                  ? "rowheader"
                  : "columnheader"
                : "cell";

              return (
                <div
                  className={`source-table-mobile-cell${cell.header ? " is-header" : ""}`}
                  role={role}
                  aria-colspan={colSpan > 1 ? colSpan : undefined}
                  aria-rowspan={rowSpan > 1 ? rowSpan : undefined}
                  data-source-column={startColumn + 1}
                  key={cellIndex}
                >
                  {!cell.header && label ? (
                    <span className="source-table-mobile-label">{label}</span>
                  ) : null}
                  <span className="source-table-mobile-value">
                    <RichTextRenderer content={cell.content} />
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
