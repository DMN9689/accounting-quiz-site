import type { ContentBlock } from "../types/content";
import { RichTextRenderer } from "./RichTextRenderer";
import { SourceTable } from "./SourceTable";

type ContentBlockRendererProps = {
  blocks: ContentBlock[];
};

export function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  return (
    <div className="theory-content">
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`;

        switch (block.type) {
          case "paragraph":
            return (
              <p key={key}>
                <RichTextRenderer content={block.content} />
              </p>
            );
          case "list":
            return (
              <ul key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>
                    <RichTextRenderer content={item} />
                  </li>
                ))}
              </ul>
            );
          case "formula":
            return (
              <div className="formula" key={key}>
                <RichTextRenderer content={block.content} />
              </div>
            );
          case "callout":
            return (
              <div className={`callout callout--${block.tone}`} key={key}>
                <RichTextRenderer content={block.content} />
              </div>
            );
          case "table":
            return (
              <SourceTable
                key={key}
                caption={block.caption}
                columnCount={block.columnCount}
                rows={block.rows}
              />
            );
        }
      })}
    </div>
  );
}

