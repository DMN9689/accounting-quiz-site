import { Fragment, type ReactNode } from "react";

import type { MarkType, RichText } from "../types/content";

type RichTextRendererProps = {
  content: RichText;
};

function applyMark(mark: MarkType, content: ReactNode, key: string): ReactNode {
  switch (mark) {
    case "bold":
      return <strong key={key}>{content}</strong>;
    case "highlight":
      return <mark key={key}>{content}</mark>;
    case "account":
      return (
        <span className="account" key={key}>
          {content}
        </span>
      );
    case "warning":
      return (
        <span className="warning" key={key}>
          {content}
        </span>
      );
  }
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return content.map((segment, segmentIndex) => {
    let rendered: ReactNode = segment.text;

    for (const [markIndex, mark] of (segment.marks ?? []).entries()) {
      rendered = applyMark(mark, rendered, `${segmentIndex}-${markIndex}-${mark}`);
    }

    return <Fragment key={segmentIndex}>{rendered}</Fragment>;
  });
}

